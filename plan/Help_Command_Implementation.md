# /help Command Implementation

## Overview
Added a `/help` slash command to MockLLMService that displays comprehensive documentation of all available commands in the user's selected language.

---

## Features

### ✨ **Multi-Language Support**
- **English**: Full command documentation
- **Traditional Chinese (繁體中文)**: Complete command documentation
- Automatically displays in user's selected language via i18n system

### 📚 **Comprehensive Documentation**
The help text includes all available commands organized by category:

1. **🎴 Tarot Card Commands (Full Deck - 78 Cards)**
   - Single card draws
   - Three-card spreads
   - Celtic Cross spreads
   - Reversed card draws

2. **🌟 Major Arcana Only Commands (22 Cards)**
   - Major arcana single draws
   - Major arcana spreads
   - Major arcana Celtic Cross

3. **🃏 Interactive Deck**
   - Single card selection
   - Multiple card selection

4. **✨ Testing & Demos**
   - Markdown rendering demo
   - Help command

5. **⚠️ Error Testing Commands**
   - Various error simulations for testing

---

## Usage

Simply type `/help` in the chat interface:

```
User: /help
```

The system will display:
- All available slash commands
- Command descriptions
- Usage examples
- Helpful tips

---

## Implementation Details

### Files Modified:

#### 1. **`src/i18n/locales/en.js`**
Added `helpText` to the `mock` section with comprehensive English documentation.

#### 2. **`src/i18n/locales/zh-TW.js`**
Added `helpText` to the `mock` section with Traditional Chinese documentation.

#### 3. **`src/services/llm/MockLLMService.js`**
Added `/help` command handler that:
- Retrieves help text from i18n system
- Streams the help text character by character (like other responses)
- Respects user's language preference

#### 4. **Welcome Messages Updated**
Updated debug welcome messages in both languages to mention `/help`:
- English: "Type /help to see all available commands..."
- Chinese: "輸入 /help 查看所有可用指令..."

---

## Code Example

### MockLLMService.js Implementation:
```javascript
if (command === '/help') {
  // Show help text with all available commands
  const helpText = i18n.global.t('mock.helpText');

  // Stream the help response
  let buffer = '';
  for (const char of helpText) {
    buffer += char;
    yield {
      type: 'text',
      chunk: char,
      fullText: buffer
    };
    await this.delay(this.charDelay);
  }

  yield {
    type: 'done',
    fullText: buffer
  };
  return;
}
```

### i18n Locale Structure:
```javascript
mock: {
  helpText: `# 📖 Available Commands

## 🎴 Tarot Card Commands (Full Deck - 78 Cards)
- \`/draw\` or \`/card\` - Draw a single random card
- \`/spread\` - Draw a three-card spread
...

**Tip:** All commands start with \`/\``,
  // ... other mock properties
}
```

---

## English Help Text

```markdown
# 📖 Available Commands

## 🎴 Tarot Card Commands (Full Deck - 78 Cards)
- `/draw` or `/card` - Draw a single random card from the full deck
- `/draw-reversed` or `/card-reversed` - Draw a single card, forced reversed
- `/spread` or `/spread-three` - Draw a three-card spread (past/present/future)
- `/celtic-cross` or `/spread-celtic` - Draw a Celtic Cross spread (10 cards)

## 🌟 Major Arcana Only Commands (22 Cards)
- `/draw-major` or `/card-major` - Draw a single major arcana card
- `/spread-major` or `/spread-three-major` - Three-card spread (major only)
- `/celtic-major` - Celtic Cross spread (major arcana only)

## 🃏 Interactive Deck
- `/deck` - Show interactive deck (select your own card)
- `/deck-multiple` - Show interactive deck for multiple cards

## ✨ Testing & Demos
- `/markdown` or `/md` - Show markdown rendering demo
- `/help` - Show this help message

## ⚠️ Error Testing Commands
- `/error` or `/error-mystical` - Simulate mystical error
- `/error-network` - Simulate network error
- `/error-timeout` - Simulate timeout error
- `/error-stream` - Simulate streaming error
- `/error-rate` - Simulate rate limit error

---

**Tip:** All commands start with `/`. Type any natural question to get a mock reading!
```

---

## Traditional Chinese Help Text

```markdown
# 📖 可用指令

## 🎴 塔羅牌指令（完整牌組 - 78 張牌）
- `/draw` 或 `/card` - 從完整牌組中抽取單張隨機牌
- `/draw-reversed` 或 `/card-reversed` - 抽取單張牌，強制逆位
- `/spread` 或 `/spread-three` - 抽取三張牌牌陣（過去/現在/未來）
- `/celtic-cross` 或 `/spread-celtic` - 抽取凱爾特十字牌陣（10 張牌）

## 🌟 僅大阿爾克那指令（22 張牌）
- `/draw-major` 或 `/card-major` - 抽取單張大阿爾克那牌
- `/spread-major` 或 `/spread-three-major` - 三張牌牌陣（僅大阿爾克那）
- `/celtic-major` - 凱爾特十字牌陣（僅大阿爾克那）

## 🃏 互動式牌組
- `/deck` - 顯示互動式牌組（自行選擇牌）
- `/deck-multiple` - 顯示互動式牌組以選擇多張牌

## ✨ 測試與展示
- `/markdown` 或 `/md` - 顯示 Markdown 渲染展示
- `/help` - 顯示此說明訊息

## ⚠️ 錯誤測試指令
- `/error` 或 `/error-mystical` - 模擬神秘錯誤
- `/error-network` - 模擬網路錯誤
- `/error-timeout` - 模擬逾時錯誤
- `/error-stream` - 模擬串流錯誤
- `/error-rate` - 模擬速率限制錯誤

---

**提示：** 所有指令都以 `/` 開頭。輸入任何自然問題以獲得模擬解讀！
```

---

## Benefits

### For Users:
✅ **Discoverability**: Easy to find all available commands
✅ **Self-Service**: No need to remember all commands
✅ **Multi-Language**: Help text in their preferred language
✅ **Always Updated**: Single source of truth for command documentation

### For Developers:
✅ **Centralized**: All command documentation in i18n files
✅ **Maintainable**: Update help text in one place
✅ **Consistent**: Same streaming behavior as other text responses
✅ **Testable**: Easy to verify command documentation accuracy

### For Testing:
✅ **Quick Reference**: Instant access to all test commands
✅ **Error Commands**: Easy to find error simulation commands
✅ **Feature Demo**: Shows off all available features

---

## Testing

### Test in English:
1. Ensure language is set to English
2. Type `/help` in chat
3. Verify English help text appears

### Test in Traditional Chinese:
1. Switch language to 繁體中文 (zh-TW)
2. Type `/help` in chat
3. Verify Chinese help text appears

### Test Welcome Message:
1. Start app in debug mode
2. Check welcome message mentions `/help`
3. Verify in both languages

---

## Future Enhancements (Optional)

Potential additions:
1. **Search within help**: Allow `/help <term>` to search specific commands
2. **Category filtering**: `/help tarot`, `/help errors`, etc.
3. **Interactive help**: Clickable command examples that execute
4. **Help in real mode**: Add help command for RealLLMService too
5. **Quick tips**: Random tips shown alongside help

---

## Quick Command Reference

| Command | Description | Language Support |
|---------|-------------|------------------|
| `/help` | Show all available commands | ✅ EN / 繁中 |
| Displays | 5 categories of commands | Multi-language |
| Format | Markdown formatted | Yes |
| Streaming | Character-by-character | Yes |

---

## Status
✅ **Feature Complete!** Users can now type `/help` to see all available commands in their preferred language!
