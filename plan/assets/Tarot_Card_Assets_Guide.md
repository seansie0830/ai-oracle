# Tarot Card Assets Import Guide

## Overview
This guide explains how to replace the procedurally-generated placeholder tarot cards with actual card images.

## Directory Structure

### Required Asset Location
```
src/
└── assets/
    └── tarot-deck/
        ├── major-arcana/
        │   ├── 00-the-fool.jpg
        │   ├── 01-the-magician.jpg
        │   ├── 02-the-high-priestess.jpg
        │   └── ... (22 cards total)
        ├── minor-arcana/
        │   ├── wands/
        │   │   ├── ace-of-wands.jpg
        │   │   ├── two-of-wands.jpg
        │   │   └── ... (14 cards)
        │   ├── cups/
        │   ├── swords/
        │   └── pentacles/
        └── card-back.jpg
```

## File Naming Convention

### Major Arcana (22 cards)
Use kebab-case with optional number prefix:
- `00-the-fool.jpg` or `the-fool.jpg`
- `01-the-magician.jpg` or `the-magician.jpg`
- `02-the-high-priestess.jpg` or `the-high-priestess.jpg`
- `03-the-empress.jpg`
- `04-the-emperor.jpg`
- `05-the-hierophant.jpg`
- `06-the-lovers.jpg`
- `07-the-chariot.jpg`
- `08-strength.jpg`
- `09-the-hermit.jpg`
- `10-wheel-of-fortune.jpg`
- `11-justice.jpg`
- `12-the-hanged-man.jpg`
- `13-death.jpg`
- `14-temperance.jpg`
- `15-the-devil.jpg`
- `16-the-tower.jpg`
- `17-the-star.jpg`
- `18-the-moon.jpg`
- `19-the-sun.jpg`
- `20-judgement.jpg`
- `21-the-world.jpg`

### Minor Arcana (56 cards)
Format: `{rank}-of-{suit}.jpg`

**Ranks**: ace, two, three, four, five, six, seven, eight, nine, ten, page, knight, queen, king

**Suits**: wands, cups, swords, pentacles

Examples:
- `ace-of-wands.jpg`
- `two-of-cups.jpg`
- `knight-of-swords.jpg`
- `queen-of-pentacles.jpg`

## Image Specifications

### Recommended Dimensions
- **Width**: 400-600px
- **Height**: 700-1050px
- **Aspect Ratio**: 2:3.5 (standard tarot card ratio)

### File Format
- **Primary**: JPG/JPEG (smaller file size, good for photos)
- **Alternative**: PNG (if transparency needed)
- **WebP**: Recommended for production (best compression)

### File Size
- **Target**: 50-150 KB per card
- **Maximum**: 300 KB per card
- **Total deck**: ~5-10 MB for all 78 cards

### Quality Guidelines
- **Resolution**: 72-150 DPI (web optimized)
- **Color Space**: sRGB
- **Compression**: 80-90% quality for JPG

## Implementation Steps

### Step 1: Create Assets Directory
```bash
mkdir -p src/assets/tarot-deck/major-arcana
mkdir -p src/assets/tarot-deck/minor-arcana/wands
mkdir -p src/assets/tarot-deck/minor-arcana/cups
mkdir -p src/assets/tarot-deck/minor-arcana/swords
mkdir -p src/assets/tarot-deck/minor-arcana/pentacles
```

### Step 2: Add Card Images
Place your card images in the appropriate directories following the naming convention.

### Step 3: Update `tarotUtils.js`

Replace the `getCardImage()` function in [tarotUtils.js](file:///c:/Users/seans/lecture/nccuAI/final/proj/src/utils/tarotUtils.js):

```javascript
/**
 * Get the image path for a tarot card
 * @param {string} cardName - The name of the card (e.g., "The Fool")
 * @returns {string} - Image URL
 */
export function getCardImage(cardName) {
  const fileName = toKebabCase(cardName)
  
  // Try to import the image
  try {
    // For Vite, use dynamic import with glob
    return new URL(`../assets/tarot-deck/major-arcana/${fileName}.jpg`, import.meta.url).href
  } catch (error) {
    console.warn(`Card image not found for: ${cardName}, using fallback`)
    return generatePlaceholderCard(cardName) // Fallback to procedural generation
  }
}

/**
 * Get card back image
 * @returns {string} - Card back image URL
 */
export function getCardBack() {
  try {
    return new URL('../assets/tarot-deck/card-back.jpg', import.meta.url).href
  } catch (error) {
    return generatePlaceholderCardBack() // Fallback
  }
}

/**
 * Fallback: Generate placeholder card (current implementation)
 */
function generatePlaceholderCard(cardName) {
  // Keep existing canvas-based generation code
  const canvas = document.createElement('canvas')
  // ... rest of current implementation
}

/**
 * Fallback: Generate placeholder card back (current implementation)
 */
function generatePlaceholderCardBack() {
  // Keep existing canvas-based generation code
  const canvas = document.createElement('canvas')
  // ... rest of current implementation
}
```

### Step 4: Alternative - Using Vite's Glob Import

For better performance with many images:

```javascript
// At the top of tarotUtils.js
const cardImages = import.meta.glob('../assets/tarot-deck/**/*.{jpg,png,webp}', { 
  eager: true,
  import: 'default'
})

export function getCardImage(cardName) {
  const fileName = toKebabCase(cardName)
  const possiblePaths = [
    `../assets/tarot-deck/major-arcana/${fileName}.jpg`,
    `../assets/tarot-deck/major-arcana/${fileName}.png`,
    `../assets/tarot-deck/major-arcana/${fileName}.webp`,
  ]
  
  for (const path of possiblePaths) {
    if (cardImages[path]) {
      return cardImages[path]
    }
  }
  
  // Fallback to placeholder
  return generatePlaceholderCard(cardName)
}
```

## Card Back Design

### Option 1: Single Card Back
Use one universal card back image: `card-back.jpg`

### Option 2: Multiple Card Backs
Support different card back designs:
```
tarot-deck/
├── card-back-default.jpg
├── card-back-mystical.jpg
└── card-back-celestial.jpg
```

Update component to accept `backStyle` prop.

## Sourcing Card Images

### Free/Open Source Options
1. **Public Domain Tarot Decks**
   - Rider-Waite-Smith (1909) - Public domain
   - Marseille Tarot - Various public domain versions

2. **Creative Commons**
   - Search on Wikimedia Commons
   - Check license requirements (attribution, etc.)

3. **Generate Your Own**
   - Use AI image generation (Midjourney, DALL-E, Stable Diffusion)
   - Commission an artist
   - Create digital art

### Commercial Options
1. Purchase licensed deck artwork
2. Commission custom illustrations
3. Use stock photo services with proper licensing

### Important Legal Notes
- ⚠️ Ensure you have rights to use the images
- ⚠️ Check license requirements (attribution, commercial use)
- ⚠️ Some modern tarot decks are copyrighted

## Optimization Tips

### 1. Image Compression
```bash
# Using ImageMagick
mogrify -quality 85 -resize 600x1050 *.jpg

# Using cwebp for WebP
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

### 2. Lazy Loading
Update `TarotCard.vue` to use lazy loading:
```vue
<img 
  :src="frontImage" 
  :alt="cardName"
  loading="lazy"
  class="card-image"
/>
```

### 3. Responsive Images
Provide multiple sizes:
```javascript
export function getCardImage(cardName, size = 'medium') {
  const fileName = toKebabCase(cardName)
  const sizeMap = {
    small: '300w',
    medium: '600w',
    large: '900w'
  }
  return `/assets/tarot-deck/major-arcana/${fileName}-${sizeMap[size]}.jpg`
}
```

## Testing Checklist

After adding real images:

- [ ] All 22 Major Arcana cards load correctly
- [ ] Card back image loads
- [ ] Images display at correct aspect ratio
- [ ] No broken image links
- [ ] File sizes are optimized
- [ ] Images look good on retina displays
- [ ] Fallback works if image missing
- [ ] Loading performance is acceptable

## Fallback Strategy

The current implementation uses procedural generation as a fallback. This ensures:
1. ✅ App works even without image files
2. ✅ Development can continue without assets
3. ✅ Graceful degradation if images fail to load
4. ✅ Easy testing with placeholder cards

## Migration Path

### Phase 1: Major Arcana Only (Current)
- Add 22 Major Arcana card images
- Keep procedural generation for Minor Arcana
- Update `MAJOR_ARCANA` constant in `tarotUtils.js`

### Phase 2: Full Deck
- Add all 56 Minor Arcana cards
- Update `tarotUtils.js` with full card list
- Add suit-based card selection logic

### Phase 3: Optimization
- Convert to WebP format
- Implement responsive images
- Add image preloading for common cards

## Example: Quick Start with Rider-Waite

1. Download public domain Rider-Waite images
2. Rename files to match convention:
   ```bash
   mv "0 - The Fool.jpg" "00-the-fool.jpg"
   mv "1 - The Magician.jpg" "01-the-magician.jpg"
   # ... etc
   ```
3. Place in `src/assets/tarot-deck/major-arcana/`
4. Update `getCardImage()` function
5. Test with `/draw` command

## Summary

- **Location**: `src/assets/tarot-deck/`
- **Naming**: kebab-case (e.g., `the-fool.jpg`)
- **Format**: JPG/PNG/WebP
- **Size**: 400-600px wide, 2:3.5 ratio
- **Implementation**: Update `getCardImage()` in `tarotUtils.js`
- **Fallback**: Keep procedural generation for missing images

The system is designed to work with or without real images, making it easy to develop first and add assets later!
