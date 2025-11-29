# Global Design System & Theme

## 1. Design Philosophy
The "Mystic Oracle" theme embodies **premium luxury** with deep, rich tones, sophisticated gradients, and ethereal effects. The design feels exclusive, mysterious, and enchanting - like a high-end mystical experience.

## 2. Enhanced Color Palette
A sophisticated hierarchy of colors for a premium mystical experience.

### Color Hierarchy

#### **Background Colors** (Foundation)
Pure black and near-black tones for a deep, immersive canvas.

#### **Primary Colors** (Brand Identity)
Deep purples and indigos - the mystical signature of the Oracle.

#### **Secondary Colors** (Luxury Accents)
Rich gold and metallic tones for elegance and premium feel.

#### **Tertiary Colors** (Mystical Glows)
Vibrant accent colors for interactive elements and effects.

### Root Variables (`index.css`)
```css
:root {
  /* ===== BACKGROUNDS (Pure Black Foundation) ===== */
  --color-background-pure-black: #000000;
  --color-background-rich-black: #0a0a0a;
  --color-background-deep-charcoal: #121212;
  --color-background-midnight: #0a0418;

  /* ===== PRIMARY (Deep Purples - Brand Identity) ===== */
  --color-primary-deep-indigo: #1a1338;
  --color-primary-royal-purple: #3d2463;
  --color-primary-dark-violet: #1c1129;
  --color-primary-amethyst: #9d4edd;
  
  /* ===== SECONDARY (Luxurious Metallics) ===== */
  --color-secondary-champagne-gold: #f4e4c1;
  --color-secondary-rose-gold: #e8b298;
  --color-secondary-burnished-bronze: #b87333;
  --color-secondary-platinum: #e5e4e2;

  /* ===== TERTIARY (Mystical Glows & Accents) ===== */
  --color-tertiary-sapphire: #4361ee;
  --color-tertiary-emerald: #06ffa5;
  --color-tertiary-celestial: #c8b6ff;

  /* ===== TEXT (Hierarchy) ===== */
  --color-text-primary: #f4e4c1;        /* Champagne - primary text */
  --color-text-secondary: #faf9f6;      /* Pearl - secondary text */
  --color-text-tertiary: #c0c0c0;       /* Silver - tertiary/muted */
  --color-text-accent: #d4af37;         /* Gold - accents */
}
```

## 3. Tailwind Configuration
Extend the Tailwind theme with the new color hierarchy.

**`tailwind.config.js`:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Backgrounds (Pure Black)
        'bg-pure-black': 'var(--color-background-pure-black)',
        'bg-rich-black': 'var(--color-background-rich-black)',
        'bg-charcoal': 'var(--color-background-deep-charcoal)',
        'bg-midnight': 'var(--color-background-midnight)',
        
        // Primary (Deep Purple - Brand)
        'primary-indigo': 'var(--color-primary-deep-indigo)',
        'primary-purple': 'var(--color-primary-royal-purple)',
        'primary-violet': 'var(--color-primary-dark-violet)',
        'primary-amethyst': 'var(--color-primary-amethyst)',
        
        // Secondary (Gold Tones)
        'secondary-champagne': 'var(--color-secondary-champagne-gold)',
        'secondary-rose': 'var(--color-secondary-rose-gold)',
        'secondary-bronze': 'var(--color-secondary-burnished-bronze)',
        'secondary-platinum': 'var(--color-secondary-platinum)',
        
        // Tertiary (Mystical Glows)
        'tertiary-sapphire': 'var(--color-tertiary-sapphire)',
        'tertiary-emerald': 'var(--color-tertiary-emerald)',
        'tertiary-celestial': 'var(--color-tertiary-celestial)',
        
        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-accent': 'var(--color-text-accent)',
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'], // Luxury serif for titles
        serif: ['"Playfair Display"', 'serif'], // Elegant serif
        sans: ['"Inter"', 'sans-serif'], // Clean modern sans
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, var(--color-background-pure-black) 0%, var(--color-primary-deep-indigo) 50%, var(--color-background-midnight) 100%)',
        'gold-shimmer': 'linear-gradient(120deg, var(--color-secondary-rose-gold), var(--color-secondary-champagne-gold), var(--color-secondary-burnished-bronze))',
      }
    }
  }
}
```

## 4. Premium Visual Elements & Utilities

### Luxury Glass Panel
Sophisticated glassmorphism with rich depth.
- `backdrop-blur-xl bg-gradient-to-br from-primary-purple/20 to-primary-violet/40`
- `border border-secondary-champagne/40`
- `shadow-2xl shadow-primary-amethyst/10`

### Divine Glow
Multi-layered glow for premium feel.
- `shadow-[0_0_30px_rgba(157,78,221,0.4),0_0_60px_rgba(157,78,221,0.2)]`
- Layered shadows for depth and richness

### Gilded Border
Elegant gradient border with shimmer.
- `border-image: linear-gradient(to right, secondary-rose, secondary-champagne, secondary-bronze)`
- `shadow-[0_0_20px_rgba(244,228,193,0.3)]`

### Premium Typography
- **Headings**: Display font (Cinzel), uppercase, wide letter-spacing (`tracking-[0.3em]`)
- **Sub-headings**: Serif font (Playfair Display), elegant and readable
- **Body**: Clean Inter sans-serif, optimized for clarity
- **Accents**: Champagne gold (#f4e4c1) for luxury feel

### Refined Animations
Smooth, elegant transitions:
- `transition-all duration-500 ease-out`
- Subtle hover lifts: `hover:translate-y-[-2px]`
- Gentle glow pulsing for interactive elements
