# Tarot Visual Components Plan

## 1. Overview
This document details the specialized Vue 3 components used to visualize Tarot readings. These components are dynamically injected into the `ChatBox` stream.

## 2. Components

### 2.1. `TarotCard.vue`
**Purpose**: Displays a single tarot card with flip animations.

**Props**:
- `cardName` (String)
- `orientation` (String: 'upright' | 'reversed')
- `isRevealed` (Boolean)

**Design (referencing [Global Theme](../global/Theme.md))**:
- **Front**: Image with `border-tarot-gold`.
- **Back**: `bg-tarot-purple` with a mystical pattern.
- **Animation**: CSS 3D transform for flipping.

### 2.2. `TarotSpread.vue`
**Purpose**: Renders multiple cards in a specific geometric arrangement (e.g., Celtic Cross).

**Props**:
- `spreadType` (String)
- `cards` (Array of card objects)

**Layouts**:
- **Three-Card**: Flex row, centered.
- **Celtic Cross**: CSS Grid layout (complex positioning).

### 2.3. `TarotDeck.vue`
**Purpose**: Interactive deck for the user to "draw" cards from.

**Interactivity**:
- Click to draw.
- Hover effects: **Mystic Glow**.

## 3. Asset Management
- **Path**: `src/assets/tarot-deck/`
- **Naming**: `kebab-case.jpg` (e.g., `the-fool.jpg`).
- **Helper**: `getCardImage(name)` utility.

## 4. Communication Protocol
The LLM triggers these components via a specific JSON structure:
```json
{
  "type": "component",
  "componentName": "TarotCard",
  "data": { "cardName": "The Fool", "orientation": "upright" }
}
```
