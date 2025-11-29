# Error Modal - Type-by-Type Design Specifications

## Overview
Each of the 15 error types has a unique visual identity while maintaining the Mystic Oracle theme. This document defines the specific appearance, colors, icons, and layouts for each error type.

---

## Design System

### Color Palette Extensions
Beyond the base severity colors, we introduce error-specific accent colors:

```css
/* API/Authentication Errors - Gold/Amber Spectrum */
--error-api-key-primary: #d97706      /* Deep amber */
--error-api-key-glow: rgba(217, 119, 6, 0.5)

/* Network Errors - Blue/Cyan Spectrum */
--error-network-primary: #0ea5e9       /* Sky blue */
--error-network-glow: rgba(14, 165, 233, 0.5)

/* Timeout Errors - Orange/Warm Spectrum */
--error-timeout-primary: #f97316       /* Bright orange */
--error-timeout-glow: rgba(249, 115, 22, 0.5)

/* Rate Limit - Yellow/Warning Spectrum */
--error-rate-primary: #eab308          /* Yellow */
--error-rate-glow: rgba(234, 179, 8, 0.5)

/* Streaming/LLM Errors - Purple/Violet Spectrum */
--error-llm-primary: #a855f7           /* Vivid purple */
--error-llm-glow: rgba(168, 85, 247, 0.5)

/* Validation Errors - Pink/Rose Spectrum */
--error-validation-primary: #ec4899    /* Pink */
--error-validation-glow: rgba(236, 72, 153, 0.5)

/* System Errors - Red/Crimson Spectrum */
--error-system-primary: #dc2626        /* Strong red */
--error-system-glow: rgba(220, 38, 38, 0.5)

/* Component Errors - Teal/Jade Spectrum */
--error-component-primary: #14b8a6     /* Teal */
--error-component-glow: rgba(20, 184, 166, 0.5)

/* Mock/Mystical Errors - Indigo/Mystic Spectrum */
--error-mystical-primary: #6366f1      /* Indigo */
--error-mystical-glow: rgba(99, 102, 241, 0.5)
```

---

## 1. API_KEY_INVALID 🔑

### Visual Identity
- **Primary Color**: Deep Amber (`#d97706`)
- **Icon**: 🔑 (animated shake on entry)
- **Border Style**: Dashed border (suggesting "broken" key)
- **Background Pattern**: Subtle diagonal stripes
- **Glow Effect**: Pulsing amber glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  🔑  Invalid API Key              [X]      │
│  [Amber dashed border with pulse]          │
├────────────────────────────────────────────┤
│  ⚠️ Your API key appears to be invalid    │
│     or has expired.                        │
│                                            │
│  📋 Quick Fixes:                           │
│  • Verify key format (starts with AIza...) │
│  • Check expiration date                   │
│  • Regenerate from provider console        │
│                                            │
│  🔗 Get Help: [Provider Documentation]     │
├────────────────────────────────────────────┤
│  [🔧 Reconfigure]  [Dismiss]               │
└────────────────────────────────────────────┘
```

### Unique Features
- **Key Format Hint**: Shows expected key pattern for selected provider
- **Provider Link**: Direct link to provider's API key page
- **Auto-configure**: Button opens API key modal pre-filled

---

## 2. API_KEY_MISSING 🔮

### Visual Identity
- **Primary Color**: Mystic Violet (from theme)
- **Icon**: 🔮 (gentle floating animation)
- **Border Style**: Smooth gradient border
- **Background**: Semi-transparent amethyst
- **Glow Effect**: Soft pulsing violet glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  🔮  API Key Required              [X]     │
│  [Violet gradient border - welcoming]      │
├────────────────────────────────────────────┤
│  Welcome, Seeker!                          │
│                                            │
│  To begin your journey with the Mystic    │
│  Oracle, please configure your LLM         │
│  provider and API key.                     │
│                                            │
│  ✨ Supported Providers:                   │
│  • Google Gemini                           │
│  • xAI (Grok)                              │
│  • Groq                                    │
│  • OpenRouter                              │
├────────────────────────────────────────────┤
│  [✨ Get Started]  [Maybe Later]           │
└────────────────────────────────────────────┘
```

### Unique Features
- **Welcome Tone**: Friendly, inviting (not error-like)
- **Provider List**: Shows all available providers
- **Gentle CTA**: "Get Started" instead of harsh error language

---

## 3. NETWORK_ERROR 🌐

### Visual Identity
- **Primary Color**: Sky Blue (`#0ea5e9`)
- **Icon**: 🌐 (disconnected lines animation)
- **Border Style**: Dotted border (suggesting disconnection)
- **Background**: Cool blue gradient
- **Glow Effect**: Flickering blue glow (like signal loss)

### Layout Variations
```
┌────────────────────────────────────────────┐
│  🌐  Connection Failed             [X]     │
│  [Blue dotted border - flickering glow]    │
├────────────────────────────────────────────┤
│  📡 Unable to reach the server             │
│                                            │
│  Connection Status:                        │
│  [●●●○○] Signal Lost                       │
│                                            │
│  🔍 Troubleshooting:                       │
│  • Check internet connection               │
│  • Try disabling VPN/proxy                 │
│  • Check firewall settings                 │
│                                            │
│  Last attempt: 2 seconds ago               │
├────────────────────────────────────────────┤
│  [🔄 Retry (3)]  [Dismiss]                 │
└────────────────────────────────────────────┘
```

### Unique Features
- **Connection Indicator**: Visual signal strength bars
- **Retry Counter**: Shows remaining auto-retry attempts
- **Last Attempt Time**: Timestamp of failed connection
- **Troubleshooting Steps**: Contextual help

---

## 4. RATE_LIMIT ⏱️

### Visual Identity
- **Primary Color**: Warning Yellow (`#eab308`)
- **Icon**: ⏱️ (ticking clock animation)
- **Border Style**: Solid yellow border
- **Background**: Warm amber gradient
- **Glow Effect**: Steady amber glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  ⏱️  Rate Limit Exceeded           [X]     │
│  [Yellow border - warning style]           │
├────────────────────────────────────────────┤
│  ⚠️ You've exceeded the API rate limit    │
│                                            │
│  ⏳ Cooldown Timer:                        │
│  ┌────────────────────────────────────┐   │
│  │ [████████████░░░░░░░░░░] 00:45     │   │
│  │  Retry available in 45 seconds      │   │
│  └────────────────────────────────────┘   │
│                                            │
│  📊 Rate Limit Info:                       │
│  • Requests used: 100/100                  │
│  • Window resets at: 14:30                 │
│  • Consider upgrading for more requests    │
├────────────────────────────────────────────┤
│  [⏸️ Wait]  [Dismiss]                      │
└────────────────────────────────────────────┘
```

### Unique Features
- **Live Countdown**: Real-time countdown timer
- **Progress Bar**: Visual representation of cooldown
- **Rate Limit Stats**: Shows usage metrics
- **Reset Time**: When the rate limit window resets
- **Upgrade Suggestion**: Link to upgrade plan (if applicable)

---

## 5. LLM_TIMEOUT ⏰

### Visual Identity
- **Primary Color**: Bright Orange (`#f97316`)
- **Icon**: ⏰ (ringing alarm animation)
- **Border Style**: Double border (emphasis)
- **Background**: Warm orange gradient
- **Glow Effect**: Pulsing orange glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  ⏰  Request Timeout                [X]    │
│  [Orange double border - urgent]           │
├────────────────────────────────────────────┤
│  ⌛ Request took too long to complete      │
│                                            │
│  Timeout Details:                          │
│  • Request duration: 30.2s                 │
│  • Timeout threshold: 30.0s                │
│                                            │
│  💡 Suggestions:                           │
│  • Your query may be too complex           │
│  • Try breaking it into smaller parts      │
│  • Server might be under heavy load        │
│                                            │
│  Previous attempts: 2 failures             │
├────────────────────────────────────────────┤
│  [🔄 Retry with Longer Timeout]  [Dismiss] │
└────────────────────────────────────────────┘
```

### Unique Features
- **Timeout Stats**: Shows exact duration vs threshold
- **Attempt Counter**: Tracks retry attempts
- **Smart Suggestions**: Context-aware troubleshooting
- **Extended Retry**: Offers retry with longer timeout

---

## 6. LLM_STREAMING_ERROR 📡

### Visual Identity
- **Primary Color**: Vivid Purple (`#a855f7`)
- **Icon**: 📡 (broken signal waves animation)
- **Border Style**: Animated gradient border
- **Background**: Purple gradient with noise texture
- **Glow Effect**: Glitching purple glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  📡  Streaming Interrupted         [X]     │
│  [Purple animated border - glitch effect]  │
├────────────────────────────────────────────┤
│  🔌 Connection lost during streaming       │
│                                            │
│  Partial Response Received:                │
│  ┌────────────────────────────────────┐   │
│  │ The cards reveal...                 │   │
│  │ [Interrupted at 23% completion]     │   │
│  └────────────────────────────────────┘   │
│                                            │
│  Streaming Stats:                          │
│  • Received: 142 tokens                    │
│  • Expected: ~600 tokens                   │
│  • Duration: 4.3s                          │
├────────────────────────────────────────────┤
│  [▶️ Resume]  [🔄 Restart]  [Dismiss]      │
└────────────────────────────────────────────┘
```

### Unique Features
- **Partial Content Preview**: Shows what was received
- **Completion Progress**: Percentage of expected response
- **Token Stats**: Streaming metrics
- **Resume Option**: Try to resume from interruption point
- **Restart Option**: Start fresh request

---

## 7. LLM_INVALID_RESPONSE ❌

### Visual Identity
- **Primary Color**: Crimson Red (`#dc2626`)
- **Icon**: ❌ (X with shake animation)
- **Border Style**: Bold red border
- **Background**: Dark red gradient
- **Glow Effect**: Strong red pulsing glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  ❌  Invalid Response              [X]     │
│  [Strong red border - critical]            │
├────────────────────────────────────────────┤
│  ⚠️ The LLM returned an unexpected format │
│                                            │
│  Error Details:                            │
│  • Expected: Structured JSON response      │
│  • Received: Malformed data                │
│  • Parse error at position 142             │
│                                            │
│  📋 Raw Response Preview:                  │
│  ┌────────────────────────────────────┐   │
│  │ {"incomplete": "response...        │   │
│  │ [Show Full Response]                │   │
│  └────────────────────────────────────┘   │
├────────────────────────────────────────────┤
│  [🔄 Retry]  [📋 Copy Error]  [Dismiss]   │
└────────────────────────────────────────────┘
```

### Unique Features
- **Parse Error Details**: Specific error location
- **Response Preview**: Shows malformed data
- **Copy Error**: Includes full response for debugging
- **Developer-Focused**: More technical details

---

## 8. VALIDATION_ERROR ⚠️

### Visual Identity
- **Primary Color**: Pink (`#ec4899`)
- **Icon**: ⚠️ (bouncing warning triangle)
- **Border Style**: Soft pink border
- **Background**: Rose gradient
- **Glow Effect**: Gentle pink glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  ⚠️  Validation Failed             [X]     │
│  [Pink soft border - friendly warning]     │
├────────────────────────────────────────────┤
│  📝 Please check your input                │
│                                            │
│  Issues Found:                             │
│  ┌────────────────────────────────────┐   │
│  │ ❌ Message too short (min 3 chars)  │   │
│  │ ❌ Contains invalid characters      │   │
│  │ ✅ Within length limit              │   │
│  └────────────────────────────────────┘   │
│                                            │
│  💡 Tips:                                  │
│  • Minimum 3 characters required           │
│  • Avoid special symbols                   │
│  • Maximum 500 characters                  │
├────────────────────────────────────────────┤
│  [✏️ Edit Input]  [Dismiss]                │
└────────────────────────────────────────────┘
```

### Unique Features
- **Validation Checklist**: Shows each validation rule
- **Pass/Fail Icons**: Clear visual feedback
- **Input Tips**: Helpful guidance
- **Edit Option**: Returns focus to input field

---

## 9. COMPONENT_LOAD_ERROR 🔧

### Visual Identity
- **Primary Color**: Teal (`#14b8a6`)
- **Icon**: 🔧 (rotating wrench animation)
- **Border Style**: Tech-style border
- **Background**: Cool teal gradient
- **Glow Effect**: Steady teal glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  🔧  Component Failed to Load      [X]     │
│  [Teal tech border - system error]         │
├────────────────────────────────────────────┤
│  ⚙️ A required component failed to load   │
│                                            │
│  Component: TarotCardComponent             │
│  Module: @/components/TarotCard.vue        │
│  Error: Module not found                   │
│                                            │
│  🔄 Recovery Options:                      │
│  • Refresh the page                        │
│  • Clear browser cache                     │
│  • Check browser console for details      │
│                                            │
│  Build version: 1.0.0-beta                 │
├────────────────────────────────────────────┤
│  [🔄 Refresh Page]  [🗑️ Clear Cache]       │
└────────────────────────────────────────────┘
```

### Unique Features
- **Component Info**: Shows which component failed
- **Module Path**: Technical details for debugging
- **Build Version**: App version info
- **Cache Clear**: Offers cache clearing option
- **Console Hint**: Directs to browser console

---

## 10. TAROT_DRAW_ERROR 🃏

### Visual Identity
- **Primary Color**: Royal Purple (from theme)
- **Icon**: 🃏 (spinning card animation)
- **Border Style**: Ornate gilded border
- **Background**: Mystical purple with card pattern
- **Glow Effect**: Ethereal purple shimmer

### Layout Variations
```
┌────────────────────────────────────────────┐
│  🃏  Tarot Draw Failed             [X]     │
│  [Ornate gilded border - mystical]         │
├────────────────────────────────────────────┤
│  🔮 The cards resist being drawn...        │
│                                            │
│  The cosmic energies are misaligned.       │
│  Please wait a moment and try again.       │
│                                            │
│  🌙 Mystical Status:                       │
│  • Deck shuffled: ✓                        │
│  • Energy aligned: ✗                       │
│  • Moon phase: Waning Crescent             │
│                                            │
│  💫 The oracle suggests patience...        │
├────────────────────────────────────────────┤
│  [🔮 Try Again]  [🌟 Different Spread]     │
└────────────────────────────────────────────┘
```

### Unique Features
- **Mystical Theming**: Maintains Tarot aesthetic
- **Energy Status**: Fun decorative metrics
- **Thematic Language**: "Cosmic energies" not "system error"
- **Alternative Options**: Different tarot spreads

---

## 11. MOCK_MYSTICAL_ERROR 🌙

### Visual Identity
- **Primary Color**: Indigo (`#6366f1`)
- **Icon**: 🌙 (phase-changing moon animation)
- **Border Style**: Celestial pattern border
- **Background**: Deep indigo with stars
- **Glow Effect**: Twinkling star-field glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  🌙  Mystical Connection Disrupted  [X]    │
│  [Indigo celestial border - starfield]     │
├────────────────────────────────────────────┤
│  ✨ The cosmic energies are in flux        │
│                                            │
│  The oracle cannot divine at this moment.  │
│  The veil between worlds wavers...         │
│                                            │
│  🔮 Mock Service Status:                   │
│  • This is a simulated error               │
│  • Real service would handle differently   │
│  • Use for UI testing only                 │
│                                            │
│  💡 Test Commands:                         │
│  /error-network, /error-timeout, etc.      │
├────────────────────────────────────────────┤
│  [🔄 Retry]  [📚 View Commands]  [Dismiss] │
└────────────────────────────────────────────┘
```

### Unique Features
- **Mock Identifier**: Clearly marks as test error
- **Test Commands List**: Shows available error commands
- **Mystical Flavor**: Maintains immersive theming
- **Educational**: Explains mock service purpose

---

## 12. UNKNOWN_ERROR ❓

### Visual Identity
- **Primary Color**: Gray-Purple hybrid
- **Icon**: ❓ (question mark with glow)
- **Border Style**: Gradient shifting border
- **Background**: Neutral gradient
- **Glow Effect**: Multi-color shifting glow

### Layout Variations
```
┌────────────────────────────────────────────┐
│  ❓  Unexpected Error              [X]     │
│  [Gradient shifting border - unknown]      │
├────────────────────────────────────────────┤
│  🤔 An unexpected error occurred           │
│                                            │
│  Error Details:                            │
│  • Type: UnhandledPromiseRejection         │
│  • Message: [See technical details]        │
│  • Time: 2025-11-29 13:56:23               │
│                                            │
│  📋 This error has been logged             │
│  Error ID: #ERR-2025-1129-1356-A3F2        │
│                                            │
│  💡 What you can do:                       │
│  • Try refreshing the page                 │
│  • Clear browser cache                     │
│  • Report with error ID above              │
├────────────────────────────────────────────┤
│  [🔄 Retry]  [📋 Report Issue]  [Dismiss]  │
└────────────────────────────────────────────┘
```

### Unique Features
- **Error ID**: Unique identifier for tracking
- **Timestamp**: Exact error time
- **Auto-logging**: Confirms error was recorded
- **Reporting**: Offers issue reporting option
- **Generic Recovery**: Standard recovery steps

---

## Design Principles Summary

### 1. **Color Psychology**
- Warm colors (orange, yellow) → Timeouts, warnings
- Cool colors (blue, teal) → Network, system issues
- Mystical colors (purple, indigo) → LLM, tarot, mock
- Alert colors (red, pink) → Critical errors, validation

### 2. **Icon Animation**
- **Shake**: Authentication, invalid states
- **Float/Pulse**: Informational, gentle warnings
- **Spin/Rotate**: Loading, processing errors
- **Flicker**: Connection issues
- **Glitch**: Streaming, data errors

### 3. **Border Styles**
- **Dashed**: Broken/invalid states
- **Dotted**: Disconnected states
- **Double**: Urgent warnings
- **Gradient**: Progressive/mystical themes
- **Ornate**: Tarot/mystical errors

### 4. **Information Hierarchy**
1. **Icon + Title** - Immediate recognition
2. **Primary Message** - What happened
3. **Context/Stats** - Detailed info
4. **Actionable Suggestions** - How to fix
5. **Action Buttons** - What to do next

### 5. **Tone Customization**
- **Friendly**: API_KEY_MISSING, VALIDATION_ERROR
- **Technical**: COMPONENT_LOAD_ERROR, LLM_INVALID_RESPONSE
- **Mystical**: TAROT_DRAW_ERROR, MOCK_MYSTICAL_ERROR
- **Urgent**: NETWORK_ERROR, LLM_TIMEOUT
- **Cautionary**: RATE_LIMIT, API_KEY_INVALID

---

## Implementation Notes

### Component Structure
Each error type will have:
```javascript
errorConfig[errorType] = {
  // Existing fields
  severity, icon, title, message, actions,
  
  // New design fields
  primaryColor: '#hex',
  glowColor: 'rgba(...)',
  borderStyle: 'dashed' | 'dotted' | 'solid' | 'double' | 'gradient',
  backgroundPattern: 'stripes' | 'dots' | 'stars' | 'noise' | 'none',
  iconAnimation: 'shake' | 'float' | 'spin' | 'flicker' | 'glitch',
  layout: 'standard' | 'stats' | 'timer' | 'preview',
  customFeatures: [...]
}
```

### Responsive Considerations
- Mobile: Simplified layouts, essential info only
- Desktop: Full feature set with all metrics
- Tablet: Hybrid approach

### Accessibility
- Each color scheme maintains 4.5:1 contrast ratio
- Icons paired with text descriptions
- All animations can be disabled (prefers-reduced-motion)
- Keyboard navigation works with all layouts

---

## Next Steps
1. Update `errorHandler.js` with extended error configs
2. Create error-type-specific Vue components or computed styles
3. Build animation library for icon effects
4. Test each error type appearance
5. Create visual regression tests
