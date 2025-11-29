# API Key Modal Component Plan

## Objective
Create a Vue 3 modal component `APIKeyModal.vue` that allows users to select their LLM provider and securely enter their API key. The modal should maintain color coherence with the **Mystic Oracle** theme and manage state using **Pinia** for cross-component access.

---

## 1. Component Architecture

### Location
`src/components/APIKeyModal.vue`

### Structure
The modal overlays the entire screen with a semi-transparent backdrop and centers a glass panel containing:

1. **Header**: 
   - Title: "Configure Your Oracle" 
   - Subtitle: "Select your LLM provider and enter your API key"
   - Close button (X icon with hover glow)

2. **Provider Selection**:
   - Dropdown or radio buttons for provider selection
   - Supported providers: **Gemini**, **xAI (Grok)**, **Groq**, **OpenRouter**
   - Visual indicator showing current selection

3. **API Key Input**:
   - Secure password input field
   - Toggle visibility button (eye icon)
   - Placeholder text adapts to selected provider (e.g., "Enter your Gemini API key...")

4. **Security Option**:
   - **"Trust this device"** checkbox (disabled by default)
   - Warning text: "⚠️ Only enable on your personal, secure device"
   - Icon indicator showing current persistence state

5. **Action Buttons**:
   - **Save & Close**: Saves the configuration to Pinia store
   - **Cancel**: Closes modal without saving

5. **Optional Help Section**:
   - Small collapsible "How to get your API key" section with provider-specific links

---

## 2. Color Integration & Theme Adherence

The modal strictly follows the [Theme.md](../global/Theme.md) color system:

### Background & Overlay
- **Backdrop**: Semi-transparent pure black with blur
  - `bg-[rgba(0,0,0,0.85)] backdrop-blur-lg`
  
### Modal Panel
- **Glass Panel Effect**: Same luxury glass as ChatBox
  - `glass-panel gilded-border` utility classes
  - Background: `backdrop-blur-xl bg-gradient-to-br from-primary-purple/20 to-primary-violet/40`
  - Border: `border border-secondary-champagne/40`
  - Shadow: Divine glow effect

### Typography
- **Title**: Display font (Cinzel), champagne gold (`--color-secondary-champagne-gold`)
  - `font-family: var(--font-family-display)`
  - `text-2xl tracking-[0.2em] uppercase`
  
- **Labels/Descriptions**: Serif font (Playfair Display), secondary text
  - `font-family: var(--font-family-serif)`
  - `text-[var(--color-text-secondary)]`

### Interactive Elements
- **Provider Cards/Buttons**:
  - Unselected: Glass panel with subtle border
  - Selected: Gilded border + amethyst glow (`shadow-[0_0_30px_rgba(157,78,221,0.4)]`)
  - Hover: Slight lift (`hover-lift` class)

- **Input Field**:
  - Glass panel with champagne border
  - Focus state: Enhanced glow and thicker border
  - `border-2 border-[rgba(244,228,193,0.25)]`
  - `focus:border-[rgba(244,228,193,0.5)]`
  - `focus:shadow-[0_0_30px_rgba(157,78,221,0.4)]`

- **Save Button**:
  - Gold gradient shimmer
  - `bg-gradient-to-r from-secondary-rose via-secondary-champagne to-secondary-bronze`
  - Hover: Enhanced glow and scale

- **Cancel Button**:
  - Subtle ghost button with tertiary text
  - Hover: Slight celestial glow

---

## 3. State Management with Pinia

### Store Location
`src/stores/llmConfig.js`

### Store Structure
```javascript
import { defineStore } from 'pinia'

export const useLLMConfigStore = defineStore('llmConfig', {
  state: () => ({
    provider: 'gemini', // default provider
    apiKey: '',
    isConfigured: false, // tracks if user has set up provider
    persistKeys: false, // NEW: controls whether to persist API keys
  }),
  
  getters: {
    providerName: (state) => {
      const names = {
        gemini: 'Google Gemini',
        xai: 'xAI (Grok)',
        groq: 'Groq',
        openrouter: 'OpenRouter'
      }
      return names[state.provider] || 'Unknown'
    },
    hasValidConfig: (state) => {
      return state.provider && state.apiKey.length > 0
    },
    isPersistent: (state) => state.persistKeys
  },
  
  actions: {
    setProvider(provider) {
      this.provider = provider
    },
    setApiKey(apiKey) {
      this.apiKey = apiKey
      this.isConfigured = apiKey.length > 0
    },
    updateConfig(provider, apiKey, persist = false) {
      this.provider = provider
      this.apiKey = apiKey
      this.isConfigured = apiKey.length > 0
      this.persistKeys = persist
      
      // If persistence disabled, remove from localStorage
      if (!persist) {
        localStorage.removeItem('llmConfig')
      }
    },
    clearConfig() {
      this.apiKey = ''
      this.isConfigured = false
      localStorage.removeItem('llmConfig')
    },
    togglePersistence(enable) {
      this.persistKeys = enable
      if (!enable) {
        localStorage.removeItem('llmConfig')
      }
    }
  },
  
  // Conditional persistence: only persist if persistKeys is true
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'llmConfig',
        storage: localStorage,
        // Only persist provider and persistKeys setting by default
        // API key only persisted if user opts in
        paths: ['provider', 'persistKeys']
      }
    ]
  }
})

// Note: When persistKeys is enabled, we'll manually handle apiKey persistence
```

### Usage Across Components

**In ChatBox.vue**:
```javascript
import { useLLMConfigStore } from '@/stores/llmConfig'

const llmConfig = useLLMConfigStore()

// Check if configured before sending messages
if (!llmConfig.hasValidConfig) {
  // Show modal or warning
}

// Use config when initializing LLM service
const llmService = new LLMService(llmConfig.provider, llmConfig.apiKey)
```

**In APIKeyModal.vue**:
```javascript
import { useLLMConfigStore } from '@/stores/llmConfig'

const llmConfig = useLLMConfigStore()
const selectedProvider = ref(llmConfig.provider)
const enteredKey = ref(llmConfig.apiKey)

function saveConfig() {
  llmConfig.updateConfig(selectedProvider.value, enteredKey.value)
  emit('close')
}
```

---

## 4. UX & Micro-interactions

### Opening Animation
- Modal fades in with backdrop blur
- Panel scales from 0.9 to 1.0 with ease-out
- `transition-all duration-500 ease-out`

### Provider Selection
- Cards have subtle hover lift
- Selected card has pulsing amethyst glow
- Smooth transition between states

### Input Interactions
- Focus state shows divine glow
- Toggle visibility icon rotates with smooth transition
- Placeholder text has elegant fade

### Save Action
- Button pulses slightly on hover
- Success feedback (optional): Brief celestial glow overlay
- Modal slides out and fades

### Backdrop Click
- Clicking outside modal closes it (with confirmation if unsaved changes)

---

## 5. Accessibility Considerations

- **Keyboard Navigation**: Tab through provider options and inputs
- **Focus Trapping**: Keep focus within modal when open
- **ESC to Close**: Pressing ESC closes the modal
- **ARIA Labels**: Proper labeling for screen readers
- **Contrast**: Ensure all text meets WCAG AA standards against dark backgrounds

---

## 6. Security Best Practices

### API Key Handling - Volatile by Default
> **IMPORTANT**: For security, API keys are stored **in-memory only** by default. Users can opt-in to persistence on trusted devices.

- **Volatile by Default**: API keys stored in reactive state only (cleared on page refresh)
- **Optional Persistence**: "Trust this device" checkbox enables localStorage persistence
- **Never log or expose**: API keys never appear in console or network requests (except to actual LLM provider)
- **Input type password**: Use `type="password"` by default with optional visibility toggle
- **Clear credentials**: Easy way to clear stored API keys
- **Session-only mode**: Default behavior - user re-enters key each session for maximum security

### "Trust This Device" Feature
- Checkbox in modal: "Remember my API key on this device"
- Clear warning: "Only enable on your personal, secure device"
- Visual indicator in modal when persistence is enabled
- Easy toggle to switch between volatile and persistent modes

### Validation
- Basic validation: Check that API key is not empty
- Provider-specific validation (optional): Check format (e.g., Gemini keys start with specific prefix)

---

## 7. Integration Points

### Triggering the Modal

**From ChatBox Header**:
- Add a settings icon/button in the header (⚙️ or 🔮)
- Clicking opens the modal

**Auto-trigger on First Use**:
- Check `llmConfig.isConfigured` on mount
- If false, automatically show modal with welcome message

**From Error State**:
- If API call fails due to invalid key, show modal with error message

### Props & Events

**Props**:
- `isOpen` (Boolean): Controls visibility
- `initialProvider` (String, optional): Pre-select a provider

**Emits**:
- `close`: Emitted when modal should close
- `save`: Emitted when configuration is saved (includes provider and key)

---

## 8. Provider-Specific Configuration

### Provider Metadata
```javascript
const PROVIDERS = {
  gemini: {
    label: 'Google Gemini',
    icon: '✨',
    placeholder: 'Enter your Gemini API key (AIza...)',
    helpUrl: 'https://aistudio.google.com/app/apikey',
    keyPattern: /^AIza/
  },
  xai: {
    label: 'xAI (Grok)',
    icon: '🚀',
    placeholder: 'Enter your xAI API key',
    helpUrl: 'https://x.ai/api',
    keyPattern: null
  },
  groq: {
    label: 'Groq',
    icon: '⚡',
    placeholder: 'Enter your Groq API key',
    helpUrl: 'https://console.groq.com/keys',
    keyPattern: null
  },
  openrouter: {
    label: 'OpenRouter',
    icon: '🔀',
    placeholder: 'Enter your OpenRouter API key',
    helpUrl: 'https://openrouter.ai/keys',
    keyPattern: null
  }
}
```

---

## 9. Visual Mockup Structure

```
┌─────────────────────────────────────────────────────┐
│  [Dark backdrop with blur]                          │
│                                                      │
│    ┌───────────────────────────────────────┐        │
│    │  ✦ Configure Your Oracle ✦        [X] │        │
│    │  Select provider and enter API key    │        │
│    ├───────────────────────────────────────┤        │
│    │                                        │        │
│    │  Choose Provider:                     │        │
│    │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │        │
│    │  │ ✨  │ │ 🚀  │ │ ⚡  │ │ 🔀  │     │        │
│    │  │Gemin│ │ xAI │ │Groq │ │Open │     │        │
│    │  └─────┘ └─────┘ └─────┘ └─────┘     │        │
│    │          [selected has glow]          │        │
│    │                                        │        │
│    │  API Key:                             │        │
│    │  ┌──────────────────────────────┐ 👁  │        │
│    │  │ ••••••••••••••••••••••••     │    │        │
│    │  └──────────────────────────────┘    │        │
│    │                                        │        │
│    │  ☐ Trust this device (persist key)   │        │
│    │  ⚠️ Only enable on personal devices   │        │
│    │                                        │        │
│    │  [?] How to get your API key          │        │
│    │                                        │        │
│    │  ┌──────────────┐  ┌──────────────┐  │        │
│    │  │ ✨ Save     │  │   Cancel     │  │        │
│    │  └──────────────┘  └──────────────┘  │        │
│    └───────────────────────────────────────┘        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 10. Implementation Checklist

- [ ] Create Pinia store `src/stores/llmConfig.js`
- [ ] Configure Pinia persist plugin (optional, for localStorage)
- [ ] Create `APIKeyModal.vue` component
- [ ] Implement provider selection UI with theme-coherent styling
- [ ] Implement secure API key input with visibility toggle
- [ ] Connect component to Pinia store
- [ ] Add opening/closing animations and transitions
- [ ] Implement keyboard navigation and accessibility features
- [ ] Add settings trigger button to ChatBox header
- [ ] Test modal with different providers
- [ ] Validate integration with LLM service factory

---

## 11. Future Enhancements

- **Multiple API Keys**: Allow users to save keys for multiple providers
- **Provider Auto-Detection**: Automatically detect provider from API key format
- **Rate Limit Display**: Show estimated usage or rate limits
- **Test Connection**: Add a "Test API Key" button that makes a simple API call to validate
- **Advanced Settings**: Model selection, temperature, max tokens, etc.
- **Secure Storage**: Explore more secure storage options (though client-side has inherent limitations)
