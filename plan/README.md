# Project Documentation & Plan

## Directory Structure

### [Components](./components/)
Documentation for UI components and frontend logic.
- **[ChatBox UI](./components/ChatBox_UI.md)**: Main chat interface and settings.
- **[Tarot Components](./components/Tarot_Components.md)**: Visual components for cards, spreads, and decks.

### [Services](./services/)
Documentation for backend services and business logic.
- **[LLM Agent](./services/LLM_Agent.md)**: LangChain integration, agent persona, and tools.

### [Global](./global/)
Cross-cutting concerns and shared resources.
- **[Theme & Design](./global/Theme.md)**: Color palettes, Tailwind config, and design tokens.
- **[Testing Strategy](./global/Testing_Strategy.md)**: Mocking strategies and test plans.

## Architecture Overview
The application follows a **Service-Component** architecture:
1.  **UI Layer (Vue 3)**: `ChatBox` handles user interaction and renders `TarotComponents` based on data.
2.  **Service Layer**: `LLMService` (Real or Mock) handles the intelligence and state.
3.  **Global Theme**: Shared CSS variables and Tailwind classes ensure consistency.
