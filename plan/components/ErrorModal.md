# Error Modal Component Plan

## Objective
Create a Vue 3 error modal component `ErrorModal.vue` that gracefully displays errors, API failures, and system messages to users. The modal should maintain **Mystic Oracle** theme coherence, provide actionable error information, and integrate with existing error handling patterns.

---

## 1. Component Architecture

### Location
`src/components/ErrorModal.vue`

### Structure
The error modal overlays the screen with a semi-transparent backdrop and centers a glass panel containing:

1. **Header**:
   - Dynamic icon based on error severity:
     - ⚠️ Warning (amber glow)
     - ❌ Error (crimson glow)
     - 🔮 Info (amethyst glow)
   - Title: Dynamic based on error type
   - Severity badge (optional)

2. **Error Content**:
   - **Primary Message**: User-friendly error description
   - **Technical Details** (collapsible): Stack trace, error codes, timestamps
   - **Suggested Actions**: Actionable steps to resolve the issue

3. **Error-Specific Sections**:
   - **API Key Errors**: Link to re-configure API key
   - **Network Errors**: Retry button with countdown
   - **Validation Errors**: Highlight specific fields needing attention
   - **Rate Limit Errors**: Show cooldown timer and retry after timestamp

4. **Action Buttons**:
   - **Primary Action**: Context-dependent (Retry, Configure, Dismiss)
   - **Secondary Action**: View Details, Copy Error, Report Issue
   - **Close**: Dismiss modal (X button)

5. **Optional Elements**:
   - Progress indicator for retry attempts
   - Error history view (show recent errors)
   - "Don't show this again" checkbox for certain warnings

---

## 2. Error Types & Categorization

### Error Categories

```javascript
const ERROR_TYPES = {
  // API & Network Errors
  API_KEY_INVALID: {
    severity: 'error',
    icon: '🔑',
    title: 'Invalid API Key',
    defaultMessage: 'Your API key appears to be invalid or expired.',
    actions: ['reconfigure', 'dismiss'],
    primaryAction: 'reconfigure'
  },
  API_KEY_MISSING: {
    severity: 'warning',
    icon: '🔮',
    title: 'API Key Required',
    defaultMessage: 'Please configure your LLM provider to continue.',
    actions: ['configure', 'dismiss'],
    primaryAction: 'configure'
  },
  NETWORK_ERROR: {
    severity: 'error',
    icon: '🌐',
    title: 'Connection Failed',
    defaultMessage: 'Unable to reach the server. Please check your internet connection.',
    actions: ['retry', 'dismiss'],
    primaryAction: 'retry',
    retryable: true
  },
  RATE_LIMIT: {
    severity: 'warning',
    icon: '⏱️',
    title: 'Rate Limit Exceeded',
    defaultMessage: 'You\'ve exceeded the API rate limit. Please wait before trying again.',
    actions: ['wait', 'dismiss'],
    showCooldown: true
  },
  
  // LLM Service Errors
  LLM_TIMEOUT: {
    severity: 'error',
    icon: '⏰',
    title: 'Request Timeout',
    defaultMessage: 'The request took too long to complete. Please try again.',
    actions: ['retry', 'dismiss'],
    primaryAction: 'retry',
    retryable: true
  },
  LLM_STREAMING_ERROR: {
    severity: 'error',
    icon: '📡',
    title: 'Streaming Interrupted',
    defaultMessage: 'Connection lost while streaming the response.',
    actions: ['retry', 'dismiss'],
    primaryAction: 'retry',
    retryable: true
  },
  LLM_INVALID_RESPONSE: {
    severity: 'error',
    icon: '❌',
    title: 'Invalid Response',
    defaultMessage: 'The LLM returned an unexpected response format.',
    actions: ['retry', 'report', 'dismiss'],
    primaryAction: 'retry'
  },
  
  // Validation & User Input Errors
  VALIDATION_ERROR: {
    severity: 'warning',
    icon: '⚠️',
    title: 'Validation Failed',
    defaultMessage: 'Please check your input and try again.',
    actions: ['dismiss'],
    primaryAction: 'dismiss'
  },
  
  // System & Component Errors
  COMPONENT_LOAD_ERROR: {
    severity: 'error',
    icon: '🔧',
    title: 'Component Failed to Load',
    defaultMessage: 'A required component failed to load. Please refresh the page.',
    actions: ['refresh', 'dismiss'],
    primaryAction: 'refresh'
  },
  TAROT_DRAW_ERROR: {
    severity: 'error',
    icon: '🃏',
    title: 'Tarot Draw Failed',
    defaultMessage: 'Unable to draw tarot cards. Please try again.',
    actions: ['retry', 'dismiss'],
    primaryAction: 'retry',
    retryable: true
  },
  
  // Generic Errors
  UNKNOWN_ERROR: {
    severity: 'error',
    icon: '❓',
    title: 'Unexpected Error',
    defaultMessage: 'An unexpected error occurred. Please try again.',
    actions: ['retry', 'report', 'dismiss'],
    primaryAction: 'retry'
  }
}
```

---

## 3. Color Integration & Theme Adherence

Following the [Theme.md](../global/Theme.md) color system with severity-based variations:

### Background & Overlay
- **Backdrop**: Semi-transparent black with stronger blur
  - `bg-[rgba(0,0,0,0.9)] backdrop-blur-xl`

### Modal Panel (Severity-Based)

**Error Severity**:
- **Glass Panel**: Crimson-tinted glass
  - `backdrop-blur-xl bg-gradient-to-br from-red-900/20 to-red-700/30`
  - Border: `border border-red-500/40`
  - Shadow: `shadow-[0_0_40px_rgba(220,38,38,0.4)]` (crimson glow)

**Warning Severity**:
- **Glass Panel**: Amber-tinted glass
  - `backdrop-blur-xl bg-gradient-to-br from-amber-900/20 to-amber-700/30`
  - Border: `border border-amber-500/40`
  - Shadow: `shadow-[0_0_40px_rgba(245,158,11,0.4)]` (amber glow)

**Info Severity**:
- **Glass Panel**: Standard mystic glass (amethyst)
  - `backdrop-blur-xl bg-gradient-to-br from-primary-purple/20 to-primary-violet/40`
  - Border: `border border-secondary-champagne/40`
  - Shadow: Divine glow effect

### Typography
- **Title**: Display font (Cinzel), severity-based color
  - Error: `text-red-400`
  - Warning: `text-amber-400`
  - Info: `text-[var(--color-secondary-champagne-gold)]`
  - `font-family: var(--font-family-display)`
  - `text-xl tracking-[0.15em] uppercase`

- **Message Text**: Serif font (Playfair Display), secondary text
  - `font-family: var(--font-family-serif)`
  - `text-[var(--color-text-secondary)]`

- **Technical Details**: Monospace font for stack traces
  - `font-family: 'Fira Code', 'Courier New', monospace`
  - `text-xs text-[var(--color-text-tertiary)]`

### Interactive Elements

- **Primary Action Button** (severity-based):
  - Error: Crimson accent with glow
  - Warning: Amber accent with glow
  - Info: Gold gradient shimmer
  - Hover: Enhanced glow and scale

- **Secondary Buttons**:
  - Ghost button style with tertiary text
  - Hover: Subtle celestial glow

- **Collapsible Sections**:
  - Chevron icon rotation animation
  - Content slides in with fade

---

## 4. State Management Integration

### Error Store Location
`src/stores/errorHandler.js`

### Store Structure
```javascript
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errorHandler', {
  state: () => ({
    currentError: null,
    errorHistory: [], // Last 10 errors
    isModalOpen: false,
    autoRetryCount: 0,
    maxAutoRetries: 2
  }),
  
  getters: {
    hasActiveError: (state) => state.currentError !== null,
    errorSeverity: (state) => state.currentError?.severity || 'error',
    canRetry: (state) => {
      if (!state.currentError) return false
      const errorConfig = ERROR_TYPES[state.currentError.type]
      return errorConfig?.retryable && state.autoRetryCount < state.maxAutoRetries
    },
    recentErrors: (state) => state.errorHistory.slice(0, 10)
  },
  
  actions: {
    showError(errorType, customMessage = null, metadata = {}) {
      const errorConfig = ERROR_TYPES[errorType] || ERROR_TYPES.UNKNOWN_ERROR
      
      this.currentError = {
        type: errorType,
        severity: errorConfig.severity,
        icon: errorConfig.icon,
        title: errorConfig.title,
        message: customMessage || errorConfig.defaultMessage,
        timestamp: new Date().toISOString(),
        metadata, // Can include stack trace, error codes, etc.
        actions: errorConfig.actions,
        primaryAction: errorConfig.primaryAction,
        retryable: errorConfig.retryable || false,
        showCooldown: errorConfig.showCooldown || false
      }
      
      // Add to history
      this.errorHistory.unshift({...this.currentError})
      if (this.errorHistory.length > 10) {
        this.errorHistory = this.errorHistory.slice(0, 10)
      }
      
      this.isModalOpen = true
    },
    
    dismissError() {
      this.currentError = null
      this.isModalOpen = false
      this.autoRetryCount = 0
    },
    
    incrementRetryCount() {
      this.autoRetryCount++
    },
    
    resetRetryCount() {
      this.autoRetryCount = 0
    },
    
    clearHistory() {
      this.errorHistory = []
    }
  }
})
```

---

## 5. Component Props & Events

### Props
```javascript
{
  // Optional: Can control modal externally or use store
  isOpen: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  },
  // Override default actions
  customActions: {
    type: Array,
    default: null
  }
}
```

### Emits
```javascript
{
  close: null,
  retry: null,
  configure: null, // Trigger API key modal
  report: (error) => true, // Report error to external service
  dismiss: null
}
```

---

## 6. UX & Micro-interactions

### Opening Animation
- Modal fades in with backdrop blur (300ms)
- Panel bounces in with elastic ease (based on severity):
  - Error: Slight shake animation (attention grabbing)
  - Warning: Gentle pulse
  - Info: Smooth scale from 0.95 to 1.0
- Icon glows with pulsing animation

### Error Display
- Icon has continuous subtle pulse based on severity
- Primary message fades in after icon
- Action buttons slide up from bottom

### Collapsible Technical Details
- Chevron rotates 180° on toggle
- Content expands with smooth height transition
- Stack trace has syntax highlighting if possible

### Action Interactions
- **Retry Button**: 
  - Shows spinner during retry
  - Shake animation on retry failure
  - Success checkmark on successful retry
  
- **Copy Error Button**:
  - Brief "Copied!" tooltip on click
  - Clipboard icon animation

### Auto-Dismiss Behavior
- Info messages auto-dismiss after 5 seconds (with countdown indicator)
- User can disable auto-dismiss by hovering over modal

---

## 7. Accessibility Considerations

- **Keyboard Navigation**: 
  - Tab through action buttons
  - Enter to execute primary action
  - ESC to dismiss (if dismissible)
  
- **Focus Management**:
  - Trap focus within modal
  - Restore focus to trigger element on close
  
- **ARIA Attributes**:
  - `role="alertdialog"` for error modals
  - `role="dialog"` for info modals
  - `aria-describedby` pointing to error message
  - `aria-labelledby` pointing to title
  
- **Screen Readers**:
  - Announce error severity and title immediately
  - Provide context for all actions
  
- **Visual Indicators**:
  - Don't rely solely on color for severity
  - Use icons and text alongside colors
  - Ensure sufficient contrast for all text

---

## 8. Integration Points

### Global Error Boundary

Create a composable for consistent error handling:

```javascript
// src/composables/useErrorHandler.js
import { useErrorStore } from '@/stores/errorHandler'
import { useLLMConfigStore } from '@/stores/llmConfig'

export function useErrorHandler() {
  const errorStore = useErrorStore()
  const llmConfig = useLLMConfigStore()
  
  function handleLLMError(error) {
    if (error.code === 'INVALID_API_KEY') {
      errorStore.showError('API_KEY_INVALID', null, {
        provider: llmConfig.provider,
        stack: error.stack
      })
    } else if (error.code === 'RATE_LIMIT') {
      errorStore.showError('RATE_LIMIT', null, {
        retryAfter: error.retryAfter,
        requestsRemaining: error.requestsRemaining
      })
    } else if (error.name === 'NetworkError') {
      errorStore.showError('NETWORK_ERROR', null, {
        url: error.url,
        status: error.status
      })
    } else {
      errorStore.showError('UNKNOWN_ERROR', error.message, {
        stack: error.stack,
        name: error.name
      })
    }
  }
  
  function handleAPIKeyMissing() {
    errorStore.showError('API_KEY_MISSING')
  }
  
  async function retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }
  }
  
  return {
    handleLLMError,
    handleAPIKeyMissing,
    retryWithBackoff,
    showError: errorStore.showError,
    dismissError: errorStore.dismissError
  }
}
```

### Usage in ChatBox.vue

```javascript
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleLLMError, retryWithBackoff } = useErrorHandler()

async function sendMessage() {
  try {
    const response = await retryWithBackoff(async () => {
      return await llmService.sendMessage(message.value)
    })
    // Handle success
  } catch (error) {
    handleLLMError(error)
  }
}
```

### App-Level Integration

In `App.vue`, include the error modal globally:

```vue
<template>
  <div id="app">
    <!-- Main content -->
    <RouterView />
    
    <!-- Global modals -->
    <ErrorModal />
    <APIKeyModal />
  </div>
</template>
```

---

## 9. Action Handlers

### Built-in Action Handlers

```javascript
const ACTION_HANDLERS = {
  retry: async () => {
    // Emit retry event to parent component
    emit('retry')
    // Optionally auto-retry the last failed operation
  },
  
  configure: () => {
    // Close error modal and open API key modal
    errorStore.dismissError()
    // Trigger API key modal
    emit('configure')
  },
  
  reconfigure: () => {
    // Same as configure but with pre-filled data
    errorStore.dismissError()
    emit('configure')
  },
  
  refresh: () => {
    // Reload the page
    window.location.reload()
  },
  
  report: (error) => {
    // Copy error to clipboard or send to logging service
    const errorReport = {
      type: error.type,
      message: error.message,
      timestamp: error.timestamp,
      metadata: error.metadata
    }
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
    // Show toast: "Error copied to clipboard"
  },
  
  dismiss: () => {
    errorStore.dismissError()
  },
  
  wait: (cooldownSeconds) => {
    // Show countdown timer
    // Auto-dismiss when countdown reaches 0
  }
}
```

---

## 10. Visual Mockup Structure

### Error State
```
┌──────────────────────────────────────────────────────┐
│  [Dark backdrop with heavy blur]                     │
│                                                       │
│    ┌────────────────────────────────────────┐        │
│    │  ❌  Invalid API Key             [X]   │        │
│    │  [Crimson glow border]                 │        │
│    ├────────────────────────────────────────┤        │
│    │                                         │        │
│    │  Your API key appears to be invalid    │        │
│    │  or expired.                            │        │
│    │                                         │        │
│    │  Suggested Actions:                    │        │
│    │  • Check your API key configuration    │        │
│    │  • Verify your account status          │        │
│    │  • Try regenerating your API key       │        │
│    │                                         │        │
│    │  ▼ Technical Details                   │        │
│    │  ┌────────────────────────────────┐    │        │
│    │  │ Error Code: API_KEY_401        │    │        │
│    │  │ Provider: Gemini               │    │        │
│    │  │ Timestamp: 2025-11-29 13:44:43 │    │        │
│    │  └────────────────────────────────┘    │        │
│    │                                         │        │
│    │  ┌──────────────┐  ┌────────────┐      │        │
│    │  │ 🔑 Configure │  │  Dismiss   │      │        │
│    │  └──────────────┘  └────────────┘      │        │
│    └────────────────────────────────────────┘        │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Warning State (Rate Limit)
```
┌──────────────────────────────────────────────────────┐
│  [Dark backdrop with heavy blur]                     │
│                                                       │
│    ┌────────────────────────────────────────┐        │
│    │  ⏱️  Rate Limit Exceeded         [X]   │        │
│    │  [Amber glow border]                   │        │
│    ├────────────────────────────────────────┤        │
│    │                                         │        │
│    │  You've exceeded the API rate limit.   │        │
│    │                                         │        │
│    │  Retry available in:  00:45             │        │
│    │  [████████░░░░░░░░░░] 40%               │        │
│    │                                         │        │
│    │  Suggested Actions:                    │        │
│    │  • Wait for the cooldown period        │        │
│    │  • Consider upgrading your plan        │        │
│    │                                         │        │
│    │  ┌──────────────┐                       │        │
│    │  │   Dismiss    │                       │        │
│    │  └──────────────┘                       │        │
│    └────────────────────────────────────────┘        │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 11. Implementation Checklist

- [ ] Create Pinia store `src/stores/errorHandler.js`
- [ ] Define `ERROR_TYPES` constant with all error categories
- [ ] Create `ErrorModal.vue` component
- [ ] Implement severity-based styling (error, warning, info)
- [ ] Build collapsible technical details section
- [ ] Implement action button system with handlers
- [ ] Create `useErrorHandler` composable
- [ ] Add retry logic with exponential backoff
- [ ] Implement cooldown timer for rate limit errors
- [ ] Add keyboard navigation and accessibility features
- [ ] Connect to existing error boundaries in app
- [ ] Test error modal with different error types
- [ ] Integrate with LLM service error handling
- [ ] Add error history view (optional)
- [ ] Implement "Copy Error" functionality
- [ ] Add auto-dismiss for info messages

---

## 12. Error Recovery Strategies

### Automatic Recovery
- **Network Errors**: Auto-retry up to 3 times with exponential backoff
- **Timeout Errors**: Auto-retry with increased timeout
- **Streaming Interruption**: Attempt to resume or restart stream

### User-Initiated Recovery
- **Invalid API Key**: Direct link to API key modal
- **Rate Limit**: Show countdown and enable retry
- **Component Load Failure**: Offer page refresh

### Graceful Degradation
- **LLM Service Unavailable**: Offer mock mode for testing
- **Partial Response**: Display what was received with warning
- **Missing Component**: Hide component gracefully, show placeholder

---

## 13. Future Enhancements

- **Error Analytics**: Track error frequency and patterns
- **Smart Suggestions**: AI-powered error resolution suggestions
- **Multi-Language Support**: Localized error messages
- **Error Reporting**: Integrate with external error tracking (Sentry, LogRocket)
- **Error Prevention**: Proactive validation to prevent common errors
- **Contextual Help**: Link to documentation based on error type
- **Error Notifications**: Toast notifications for non-critical errors
- **Error Grouping**: Consolidate similar errors to avoid spam
- **Recovery Playbooks**: Step-by-step guides for complex error scenarios

---

## 14. Testing Strategy

### Unit Tests
- Test error store actions and getters
- Test error categorization logic
- Test action handlers

### Integration Tests
- Test error propagation from LLM service
- Test modal triggering from different components
- Test retry logic with mocked services

### Manual Testing Scenarios
1. Trigger each error type manually
2. Test keyboard navigation and accessibility
3. Test retry mechanisms
4. Test error persistence across page refresh
5. Test mobile responsiveness
6. Test rapid error triggering (spam prevention)

---

## 15. Security Considerations

- **Sanitize Error Messages**: Never expose sensitive data (full API keys, user data)
- **Redact Stack Traces**: Remove potential security info from client-visible traces
- **Rate Limit Error Logging**: Prevent error log spam attacks
- **Validate Error Types**: Only allow predefined error types
- **XSS Prevention**: Sanitize all user-generated content in error messages
