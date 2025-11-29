# Tarot ChatBox UI Component Plan

## Objective
Create a Vue 3 component `ChatBox.vue` that serves as the main interactive interface. It orchestrates the conversation flow, renders messages, and handles dynamic component injection.

## 1. Component Architecture

### Location
`src/components/ChatBox.vue`

### Structure
1.  **Header**: 
    - Title "Mystic Oracle"
    - Settings Trigger (Gear/Crystal Ball icon)
2.  **Chat Area**: 
    - Scrollable container (`overflow-y-auto`)
    - **Message List**: Renders an array of message objects.
    - **Dynamic Rendering**: Uses `<component :is="...">` to render special components (TarotCard, Spread) based on message type.
3.  **Input Area**:
    - Styled text input (Magical slate)
    - Send button (Rune/Crystal)

## 2. Integration with Global Theme
The component should strictly adhere to the [Global Theme](../global/Theme.md).
- **Background**: `bg-tarot-bg` or `bg-gradient-to-b from-tarot-bg to-tarot-black`
- **Message Bubbles**: Use the **Glass Panel** utility.
- **Text**: `text-tarot-text`

## 3. Logic & State
- **`messages`**: Array of objects:
  ```javascript
  { 
    id: String, 
    text: String, 
    sender: 'user' | 'oracle', 
    type: 'text' | 'component', 
    componentName?: String, 
    data?: Object 
  }
  ```
- **`input`**: Reactive string for user input.
- **`isThinking`**: Boolean to show loading state.

## 4. Settings Modal (`SettingsModal.vue`)
A sub-component for configuring the LLM provider.
- **Features**: Provider selector (Gemini, xAI, Groq), API Key input.
- **Style**: Modal overlay with **Glass Panel** effect.

## 5. UX & Micro-interactions

### Streaming LLM Output & Related Micro-interactions
- **Typing Effect**: Implement a "magical writing" effect where text appears fluidly.
  - Use a cursor at the end of the streaming text (e.g., a glowing quill tip or blinking rune).
  - **Smooth Scrolling**: Ensure the view auto-scrolls to the bottom as new tokens arrive, but pauses if the user manually scrolls up.
- **Thinking State**:
  - Before streaming begins, show a "divining..." animation (e.g., shuffling cards, gazing into a crystal ball).
  - **Transition**: Smooth fade-in from thinking state to streaming text.
- **Cursor & Interactive Elements**:
  - **Custom Cursor**: Replace the default pointer with a thematic element (e.g., a small glowing orb or star).
  - **Trail Effect**: Add a "stardust" or "magical trail" particle effect that follows the mouse movement.
    - **Implementation**: Use a lightweight canvas overlay or CSS-based trailing elements.
  - **Interactive Elements**:
    - **Magnetic Buttons**: Buttons slightly pull towards the cursor when hovered.
    - **Glow Intensity**: The cursor's glow intensifies when hovering over interactive elements (cards, inputs, or streamed components).

## 6. Color Policy
> those variable are the abbr. , reference from theme.md

The component's color scheme strictly adheres to the definitions provided in the `../global/Theme.md` file, which utilizes the following CSS variables:
-   **Primary Background**: `var(--c-bg-mb)` (or gradient `from-var(--c-bg-mb) to-var(--c-bg-vb)`)
-   **Text Color**: `var(--c-txt-p)`
-   **Interactive Elements**: Colors for buttons, links, and focus states will draw from `var(--c-acc-ag)` or `var(--c-acc-b)` as defined in the theme.
-   **Glass Panel Effect**: Utilizes a semi-transparent background, potentially based on a background color with reduced opacity.
-   **System Messages/States**: Specific colors for success, error, or warning messages will be derived from the theme's semantic color palette if available, or defined locally to complement the overall aesthetic.
-   **Accents/Highlights**: Used for subtle visual cues, cursors, or interactive glows, referencing `var(--c-acc-ec)` or similar accent colors.

## 7. Service Integration Strategy
- **Service Selection**:
  - Check URL query parameters on initialization.
  - If `?mock` is present (e.g., `http://localhost:5173/?mock`), initialize `MockLLMService`.
  - Otherwise, default to `RealLLMService`.
  - This allows for easy testing without spending API credits.
