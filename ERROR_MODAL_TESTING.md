# Error Modal Testing Guide

## Overview
The Error Modal system has been successfully integrated into the Mystic Oracle application. This guide demonstrates how to test all the error handling scenarios.

## 🧪 Testing Commands

Access the chat interface at `http://localhost:5173/?mock` to test with MockLLMService.

### Available Error Test Commands

| Command | Error Type | Behavior |
|---------|-----------|----------|
| `/error` or `/error-mystical` | Mystical Error | Shows error with crimson glow, retry button |
| `/error-network` | Network Error | Simulates connection failure, retryable |
| `/error-timeout` | Timeout Error | Simulates request timeout, retryable |
| `/error-stream` | Streaming Error | Shows partial text then error mid-stream |
| `/error-rate` | Rate Limit | Shows amber warning with rate limit message |

### Regular Commands
| Command | Behavior |
|---------|----------|
| `/draw` | Displays Tarot card component |
| Any text | Normal response with streaming |

## 🎨 Error Modal Features

### Visual Design
- **Severity-based styling**:
  - ❌ **Error** (Crimson): Red glow, urgent feel
  - ⚠️ **Warning** (Amber): Amber glow, cautionary
  - 🔮 **Info** (Amethyst): Purple glow, informative

- **Animations**:
  - Backdrop fade-in with blur
  - Modal bounce entrance
  - Pulsing error icon
  - Smooth transitions

### Functionality
- ✅ **Retry**: Re-sends the last user message
- ✅ **Configure**: Opens API Key modal
- ✅ **Dismiss**: Closes the error modal
- ✅ **Copy Error**: Copies error details to clipboard
- ✅ **Technical Details**: Collapsible section with error metadata
- ✅ **ESC to Close**: Keyboard accessibility
- ✅ **Backdrop Click**: Click outside to dismiss

## 🔗 Integration Points

### 1. Pinia Store (`errorHandler.js`)
```javascript
import { useErrorStore } from '@/stores/errorHandler'

const errorStore = useErrorStore()

// Show an error
errorStore.showError('NETWORK_ERROR', 'Custom message', {
  metadata: { key: 'value' }
})

// Dismiss error
errorStore.dismissError()
```

### 2. Error Handler Composable (`useErrorHandler.js`)
```javascript
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleLLMError, retryWithBackoff } = useErrorHandler()

// Handle LLM errors automatically
try {
  await llmService.sendMessage(text)
} catch (error) {
  handleLLMError(error) // Automatically categorizes and shows error
}

// Use retry with backoff
const result = await retryWithBackoff(async () => {
  return await someAsyncOperation()
}, 3) // Max 3 retries
```

### 3. ChatBox Integration
- Errors from LLM service automatically trigger error modal
- Retry button re-sends the last message
- Configure button opens API Key modal
- No more inline error messages in chat

## 🧩 Component Architecture

```
ChatBox.vue
├── ErrorModal.vue (reads from Pinia)
└── APIKeyModal.vue

Pinia Stores
├── errorHandler.js (error state)
└── llmConfig.js (API key state)

Composables
└── useErrorHandler.js (error handling logic)

Services
├── MockLLMService.js (with error test commands)
└── RealLLMService.js (real API integration)
```

## 📋 Testing Checklist

- [ ] Test `/error` command - shows mystical error modal
- [ ] Test `/error-network` - shows network error
- [ ] Test `/error-timeout` - shows timeout error
- [ ] Test `/error-stream` - partial text + error
- [ ] Test `/error-rate` - rate limit warning
- [ ] Click "Retry" button - re-sends last message
- [ ] Click "Dismiss" button - closes modal
- [ ] Click backdrop - closes modal
- [ ] Press ESC key - closes modal
- [ ] Click "Copy Error Details" - copies to clipboard
- [ ] Expand "Technical Details" - shows metadata
- [ ] Test error modal styling matches theme
- [ ] Test animations (fade, bounce, pulse)
- [ ] Test keyboard navigation (Tab, Enter, ESC)

## 🎯 Next Steps

### Future Enhancements
1. **Auto-retry logic**: Implement automatic retry with exponential backoff
2. **Error history**: View past errors in a dedicated panel
3. **Error analytics**: Track error frequency and patterns
4. **Toast notifications**: Non-intrusive errors as toasts
5. **Error prevention**: Validation before sending requests
6. **Cooldown timers**: Visual countdown for rate limits

### Integration with Real LLM
When integrating with real LLM services:
1. Update `RealLLMService.js` to throw appropriate error types
2. Map API error codes to ERROR_TYPES
3. Test with actual API failures
4. Fine-tune error messages for production

## 🐛 Known Issues
- None currently! 🎉

## 📝 Notes
- Error state is managed globally via Pinia
- Error modal appears on top of all other content (z-index: 50)
- Error history is limited to last 10 errors
- Errors are logged to console for debugging
