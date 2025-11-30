# Deck Type Selection Feature

## Overview
Added the ability to choose between the full 78-card deck or only the 22 major arcana cards for all tarot reading operations.

---

## Feature Summary

### For Users:
- Can now request readings from **full deck** (78 cards) or **major arcana only** (22 cards)
- LLM intelligently chooses the appropriate deck based on context
- Dedicated slash commands for testing major-arcana-only readings

### For Developers:
- All card drawing tools accept a `deckType` parameter
- Backward compatible - defaults to 'full' deck
- Easy to extend for future deck variations

---

## RealLLMService - Tool Parameters

All three card drawing tools now accept a `deckType` parameter:

### Tool Schema:
```javascript
{
  deckType: z.enum(['full', 'major'])
    .optional()
    .default('full')
    .describe("Type of deck to draw from")
}
```

### Parameter Values:
- **`'full'`** (default): Draws from all 78 cards (22 major + 56 minor arcana)
- **`'major'`**: Draws from only 22 major arcana cards

### Tools Updated:
1. **`draw_single_card`** - Single card with deck type option
2. **`draw_three_card_spread`** - Three-card spread with deck type option
3. **`draw_celtic_cross_spread`** - Celtic cross (10 cards) with deck type option

---

## How the LLM Chooses Deck Type

The LLM has been instructed to choose deck types based on these guidelines:

### Use `deckType: 'full'` (Default):
- General tarot readings
- Detailed, comprehensive interpretations
- When user doesn't specify preference
- Questions about daily life, relationships, career

### Use `deckType: 'major'`:
- When user explicitly requests "major arcana only"
- For archetypal readings
- Spiritual journey or soul path questions
- When user asks for "archetypal guidance"
- Deep spiritual or existential questions

### Example User Requests:

| User Request | LLM Should Use |
|-------------|----------------|
| "Draw me a card" | `deckType: 'full'` |
| "Give me a major arcana card only" | `deckType: 'major'` |
| "I want an archetypal reading" | `deckType: 'major'` |
| "Celtic cross spread please" | `deckType: 'full'` |
| "What's my spiritual path? Use only major arcana" | `deckType: 'major'` |
| "Three card spread for my relationship" | `deckType: 'full'` |

---

## MockLLMService - Slash Commands

New slash commands added for testing both deck types:

### Full Deck Commands (78 cards):
```
/draw              → Single random card from full deck
/draw-reversed     → Single reversed card from full deck
/spread            → 3-card spread from full deck
/celtic-cross      → 10-card Celtic cross from full deck
```

### Major Arcana Only Commands (22 cards):
```
/draw-major        → Single major arcana card
/card-major        → (alias for /draw-major)
/spread-major      → 3-card major arcana spread
/spread-three-major → (alias for /spread-major)
/celtic-major      → 10-card Celtic cross with major arcana only
```

---

## Implementation Details

### RealLLMService.js

**Tool Functions:**
```javascript
_getDrawSingleCardTool() {
  return tool(
    async (input) => {
      const deckType = input.deckType || 'full';
      const randomCard = deckType === 'major' 
        ? drawRandomCard()              // 22 cards
        : drawRandomCardFromFullDeck(); // 78 cards
      // ...
    },
    {
      name: "draw_single_card",
      schema: z.object({
        deckType: z.enum(['full', 'major'])
          .optional()
          .default('full')
      })
    }
  );
}
```

### MockLLMService.js

**Major Arcana Commands:**
```javascript
if (command === '/draw-major') {
  const randomCard = drawRandomCard() // Only major arcana
  yield {
    type: 'component',
    componentName: 'TarotCard',
    data: {
      cardName: randomCard.cardName,
      orientation: randomCard.orientation,
      isRevealed: true
    }
  };
}
```

---

## Function Reference

### From `tarotUtils.js`:

#### Full Deck Functions (78 cards):
- `drawRandomCardFromFullDeck()` - Returns 1 card from all 78
- `drawMultipleCardsFromFullDeck(count)` - Returns N cards from all 78

#### Major Arcana Functions (22 cards):
- `drawRandomCard()` - Returns 1 card from 22 major arcana
- `drawMultipleCards(count)` - Returns N cards from 22 major arcana

---

## Testing Guide

### Test with MockLLMService:

**Full Deck:**
```
Chat: /draw
Expected: Any of 78 cards (could be "The Fool" or "5 of Cups")

Chat: /spread
Expected: 3 cards from full deck
```

**Major Arcana Only:**
```
Chat: /draw-major
Expected: Only major arcana ("The Fool", "The Magician", etc.)

Chat: /spread-major
Expected: 3 major arcana cards only
```

### Test with RealLLMService:

**Full Deck (Default):**
```
User: "Draw me a card"
LLM: Calls draw_single_card with deckType='full'
Result: Any of 78 cards
```

**Major Arcana Only:**
```
User: "Give me a major arcana card only"
LLM: Calls draw_single_card with deckType='major'
Result: Only major arcana cards

User: "I want an archetypal three-card reading"
LLM: Calls draw_three_card_spread with deckType='major'
Result: 3 major arcana cards
```

---

## System Prompt Updates

### English Prompt Addition:
```
4. **Deck Type Selection** - All card drawing tools accept a 'deckType' parameter:
   - Use **'full'** (default): Draws from all 78 cards for comprehensive readings
   - Use **'major'**: Draws from only 22 major arcana for archetypal focus
   - Choose 'major' when user asks for "major arcana only", "archetypal reading"
   - Choose 'full' for most readings unless user specifically requests major only
```

### Traditional Chinese Prompt Addition:
```
4. **牌組類型選擇** - 所有抽牌工具都接受 'deckType' 參數：
   - 使用 **'full'**（預設）：從全部78張牌中抽取，適用於全面解讀
   - 使用 **'major'**：僅從22張大阿爾克那中抽取，專注於原型
   - 當使用者要求「僅大阿爾克那」時，選擇 'major'
   - 除非特別要求，否則大多數解讀應選擇 'full'
```

---

## Files Modified

1. **`src/services/llm/RealLLMService.js`**
   - Added `deckType` parameter to all 3 card drawing tools
   - Updated system prompts (English & Chinese)
   - Tool logic now switches between full/major deck functions

2. **`src/services/llm/MockLLMService.js`**
   - Added `/draw-major`, `/card-major` commands
   - Added `/spread-major`, `/spread-three-major` commands
   - Added `/celtic-major` command

---

## Advantages

### For Users:
✅ **Flexibility**: Choose between comprehensive or archetypal readings
✅ **Natural Language**: Just ask for "major arcana only" or "archetypal reading"
✅ **Appropriate Defaults**: Full deck by default for most use cases

### For Readers:
✅ **Traditional Readings**: Major arcana for spiritual/archetypal questions
✅ **Detailed Readings**: Full deck for everyday questions
✅ **Professional Options**: Matches real tarot reading practices

### For Developers:
✅ **Backward Compatible**: Defaults to 'full', existing code works unchanged
✅ **Easy Testing**: Dedicated slash commands for both deck types
✅ **Extensible**: Easy to add more deck types in the future (e.g., 'minor' only, specific suits)

---

## Future Enhancements (Optional)

Potential additions:
1. **`'minor'`** - Draw from 56 minor arcana only
2. **`'cups'`** - Draw from Cups suit only
3. **`'court'`** - Draw from court cards only (Page, Knight, Queen, King)
4. **`'pips'`** - Draw from numbered cards only (Ace-10)
5. User preference setting to always use a specific deck type

---

## Quick Reference Table

| Command/Request | Deck Used | Card Count | Function Called |
|----------------|-----------|------------|-----------------|
| `/draw` | Full | 78 | `drawRandomCardFromFullDeck()` |
| `/draw-major` | Major | 22 | `drawRandomCard()` |
| `/spread` | Full | 78 | `drawMultipleCardsFromFullDeck(3)` |
| `/spread-major` | Major | 22 | `drawMultipleCards(3)` |
| `/celtic-cross` | Full | 78 | `drawMultipleCardsFromFullDeck(10)` |
| `/celtic-major` | Major | 22 | `drawMultipleCards(10)` |
| "Draw a card" | Full (default) | 78 | Via tool with `deckType='full'` |
| "Major arcana only" | Major | 22 | Via tool with `deckType='major'` |

---

## Status
✅ **Feature Complete!** Users can now choose between full deck or major arcana only for all tarot operations.
