export default {
    common: {
        cancel: 'Cancel',
        save: 'Save',
        dismiss: 'Dismiss',
        send: 'Send',
        loading: 'Loading...',
        debugMode: 'Debug Mode Active',
        switchToReal: 'Switch to Real Mode',
        copy: 'Copy',
        copied: 'Copied',
        failedToCopy: 'Failed to copy',
    },
    chat: {
        title: 'Mystic Oracle',
        subtitle: 'The Divine Divination Experience',
        placeholder: 'Seek the wisdom of the oracle...',
        thinking: 'Divining the cosmic energies...',
        welcomeDebug: 'Welcome, seeker. I am the Mystic Oracle. [DEBUG MODE] Try /markdown, /draw, /spread, or /deck to test features.',
        welcome: 'Welcome, seeker. I am the Mystic Oracle. Ask me for a tarot reading and I shall divine the cards for you.',
        clearChat: 'Clear Chat',
        settings: 'Settings',
    },
    apiKeyModal: {
        title: 'Configure Oracle',
        subtitle: 'Select your provider and enter API key',
        debugMessage: "You're using the Mock LLM Service for testing. No API key is required in this mode.",
        chooseProvider: 'Choose Provider',
        apiKey: 'API Key',
        getKey: 'Get Key',
        model: 'Model',
        selectModel: 'Select a model',
        enterKeyToFetch: 'Enter API key to fetch models',
        fetchingModels: 'Fetching models...',
        noModelsFound: 'No models found',
        trustDevice: 'Trust this device',
        trustDeviceSubtitle: 'Save API key in browser storage. Only enable on personal, secure devices.',
        language: 'Language / 語言',
        saveConfig: 'Save Configuration',
        disabledInDebug: 'This feature is disabled in debug mode. Switch to real mode to configure your API settings.',
        fetchError: 'Failed to fetch models. Check your API Key.',
    },
    errorModal: {
        suggestions: 'Suggestions:',
        supportedProviders: 'Supported Providers:',
        testMode: 'Test Mode:',
        testModeMessage: 'This is a simulated error for UI testing. Real service would handle differently.',
        technicalDetails: 'Technical Details',
        errorCode: 'Error Code:',
        timestamp: 'Timestamp:',
        copyError: 'Copy Error Details',
    },
    mock: {
        markdownDemo: `# Markdown Rendering Test

The oracle now speaks in **formatted text**!

## Features Supported

1. **Bold text** and *italic text*
2. \`inline code\` formatting
3. Lists (ordered and unordered)
4. Links and more!

### Code Blocks

\`\`\`javascript
const magic = () => {
  console.log("✨ Mystical code ✨");
}
\`\`\`

### Tarot Wisdom

> The cards reveal that markdown brings clarity to the divine messages.

**Try these commands:**
- \`/draw\` - Draw a single card
- \`/spread\` - Draw a three-card spread
- \`/markdown\` - Show this message again

---

*May your readings be ever illuminating!* 🔮`,
        errors: {
            mystical: 'The cosmic energies are in flux. The oracle cannot divine at this moment.',
            network: 'Network connection lost',
            timeout: 'Request timeout after 30 seconds',
            streaming: 'Streaming connection interrupted',
            rateLimit: 'Rate limit exceeded. Please try again in 60 seconds.',
            generic: 'Mock LLM Error: Something went wrong with the mystical connection'
        },
        responses: [
            'The cards whisper secrets about "{query}"... The mystic energies reveal a path of transformation and enlightenment ahead.',
            'I sense your question about "{query}" carries great weight. The oracle shows a journey of discovery awaits you.',
            'The cosmic forces align in response to your query: "{query}". Look within, for the answer has always resided in your soul.',
            'Ah, you seek wisdom regarding "{query}". The ancient tarot speaks of balance, patience, and hidden truths yet to be unveiled.',
            'Your words "{query}" resonate with the ethereal realm. The spirits suggest caution mixed with courage on your path forward.'
        ]
    }
}
