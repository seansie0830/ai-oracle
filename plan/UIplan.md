# Tarot Chatbox Component Plan

## Objective
Create a Vue 3 component `ChatBox.vue` that serves as an interactive chat interface with a distinct "Tarot" aesthetic. The design should feel mystical, premium, and immersive.

## 1. Component Architecture

We will create a new directory `src/components` if it doesn't exist.

### Files
- `src/components/ChatBox.vue`: The main outer component containing the chat logic and layout.
- `src/components/TarotCard.vue` (Optional future expansion): To display drawn cards.

### Structure of `ChatBox.vue`
1.  **Header**: Title "Mystic Oracle" or similar, with a mystical icon.
2.  **Chat Area**: A scrollable container for messages.
    -   **User Message**: Aligned right, styled like a query slip.
    -   **System/Oracle Message**: Aligned left, styled with a magical aura or parchment texture.
    -   **Dynamic Content Slot**: A scoped slot or dynamic component renderer within the message loop. This allows the LLM to trigger the display of specific Vue components (like a `TarotCard` or `ReadingSpread`).

3.  **Input Area**:
    -   Text input field (styled as a magical slate or scroll).
    -   Send button (styled as a rune, crystal, or gold coin).

## 2. Design & Styling (The Tarot Theme)

Since Tailwind CSS is available, we will use it for structural layout (flexbox, padding, margins) but rely on custom CSS for the specific "Tarot" atmosphere.

:root {
  /* Backgrounds */
  --color-background-midnight-blue: #0f172a;
  --color-background-velvet-purple: #2e1065;
  --color-background-void-black: #000000;

  /* Accents */
  --color-accent-antique-gold: #d4af37;
  --color-accent-bronze: #cd7f32;
  --color-accent-ethereal-cyan: #22d3ee; /* For glow effects */

  /* Text */
  --color-text-parchment: #fef3c7;
  --color-text-mist-white: #f8fafc;
}

### Visual Elements
-   **Borders**: Double borders, gold gradients, rounded corners with "magical" glow.
-   **Fonts**: A serif font for headings (e.g., `font-serif`) to evoke tradition and ancient wisdom.
-   **Effects**:
    -   `box-shadow`: Soft, colored glows (purple/gold) around the chatbox.
    -   `backdrop-filter`: Glassmorphism for the message bubbles (blur effect).
    -   **Animations**: Fade-in for messages, subtle pulsing for the "thinking" state.
    **streamify content** : since the LLM generate the sencetne token by token , the chatBox should cope with the streaming content.
    consider implment some interaction or animation to show the streaming content.
### Dynamic Component Strategy
To allow the LLM to "inject" components, we will use Vue's `<component :is="...">` feature.
1.  **Registry**: We will create a map of available components (e.g., `{'TarotCard': TarotCardComponent, 'TarotSpread': TarotSpreadComponent, 'TarotDeck': TarotDeckComponent}`).
2.  **Protocol**: The LLM will send a message with `type: 'component'` and `componentName` (e.g., `'TarotCard'`, `'TarotSpread'`, `'TarotDeck'`).
3.  **Rendering**: The ChatBox will look up the component by name and render it, passing the `data` payload as props. This `data` payload will contain all necessary information for the component to render itself (e.g., card names, images, positions for a spread).
4.  **Component Types**:
    -   `TarotCard.vue`: Displays a single tarot card. Will accept props like `cardName`, `orientation`, `imageUrl` (initially a placeholder please generate).
    -   `TarotSpread.vue`: Renders a specific arrangement of multiple cards. It will accept props such as `spreadType` and an array of `cards` (each card being an object with `cardName`, `positionInSpread`, `orientation`, `imageUrl`).
    -   `TarotDeck.vue`: Represents a collection or selection of cards, potentially allowing for interaction or simply displaying a list of available cards from a specific deck.
    
### RWD strategy

-   **Mobile-First Approach**: Design and develop for smaller screens first, progressively enhancing the layout and features for larger viewports using Tailwind's utility-first approach.
-   **Breakpoints**: Leverage Tailwind's default breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) or custom ones, applying responsive utility classes (e.g., `md:text-lg`, `lg:flex-row`).
-   **Width Limiting**: Utilize Tailwind's `container` class for a responsive fixed-width container, or `max-w-*` utilities for custom maximum widths on elements.
-   **Fluid Layouts**: Employ Tailwind's `flex` and `grid` utilities for responsive container layouts. Use relative units implicitly through Tailwind's spacing and sizing classes.
-   **Responsive Typography**: Adjust font sizes and line heights using responsive Tailwind classes (e.g., `text-base`, `md:text-lg`, `lg:leading-relaxed`).
-   **Scalable Images & Media**: Ensure all images and embedded media are responsive using Tailwind's `max-w-full` and `h-auto` classes.
-   **Adaptive Components**: Design dynamic components (`TarotCard`, `TarotSpread`) to gracefully adjust their presentation and interaction based on available screen real estate, using responsive utility classes to re-arrange cards or simplify details on smaller screens.
-   **Navigation**: Implement an adaptive navigation system that transforms into a mobile-friendly format (e.g., a hamburger menu) on smaller screens, using responsive visibility classes (e.g., `hidden md:block`).


## 3. Implementation Steps

1.  **Setup**:
    -   Create `src/components/` directory.
    -   Create `src/components/ChatBox.vue`.

2.  **HTML Structure (Vue Template)**:
    -   Container div with Tarot theme background.
    -   Header section.
    -   Message list container (`overflow-y-auto`).
    -   Input form (Input + Button).

3.  **Logic (Vue Script)**:
    -   `ref` for the current input message.
    -   `ref` for the list of messages (Array of objects: `{ id, text, sender, type, data }`).
        -   `type`: 'text' or 'component'.
        -   `data`: Additional data for the component (e.g., `{ cardName: 'The Fool', orientation: 'upright' }`).
    -   Function `sendMessage()` to handle user submission.
    -   (Mock) Function `receiveOracleResponse()` to simulate a tarot reading response.

4.  **Styling (CSS/Tailwind)**:
    -   Add specific classes for `.tarot-card-bg`, `.gold-border`, `.mystic-glow`.

## 4. Integration
-   Import and use `ChatBox` in `App.vue` or a specific route (e.g., `/chat`).

## 5. Model Configuration UI (PopUI)

To enable dynamic switching between LLM providers (Gemini, xAI, Groq, OpenRouter), we need a configuration interface.

### Component: `SettingsModal.vue`
This will be a modal dialog that overlays the main interface.

#### Features
1.  **Trigger**: A "Gear" or "Crystal Ball" icon button in the main header of `ChatBox.vue` or `App.vue`.
2.  **Provider Selector**: A dropdown or tab system to select the active provider:
    -   Google Gemini
    -   xAI (Grok)
    -   Groq
    -   OpenRouter
3.  **Credentials Input**:
    -   **API Key Field**: A password-masked input (`type="password"`) for the user to paste their API key.
    -   **Model Name Field** (Optional): Defaults to the provider's recommended model (e.g., `gemini-1.5-pro`, `grok-beta`), but editable for advanced users.
4.  **Persistence**:
    -   Save settings to `localStorage` (so they persist across reloads) or a Pinia store.
    -   *Note*: Ensure we warn users that keys are stored locally in their browser.

#### Visual Design
-   **Backdrop**: Semi-transparent dark blur (`backdrop-blur-md bg-black/50`).
-   **Modal Window**:
    -   Deep purple/black background with a gold border.
    -   "Arcane Settings" title.
    -   Inputs styled as "inscriptions" (underlined or bordered in faint gold).
    -   "Save Configuration" button with a magical glow effect.

### ErrorModal.vue
This modal dialog will display error messages to the user, such as invalid API keys or connection issues.

#### Features
1.  **Trigger**: Activated programmatically (e.g., when an API call fails, or an invalid setting is detected).
2.  **Display**: Shows a clear, concise error message.
3.  **Action**: A prominent "Dismiss" or "Close" button.
4.  **Logging**: Optionally, a small section to display technical details or a request ID for support.

#### Visual Design
-   **Backdrop**: Semi-transparent dark blur (`backdrop-blur-md bg-black/50`).
-   **Modal Window**:
    -   Deep red/maroon background with a bronze or dark gold border.
    -   "Oracle's Warning" or "Mystic Anomaly" title.
    -   Error message text in `color-text-mist-white` or `color-accent-bronze`.
    -   "Dismiss" button styled with a subtle warning glow.

