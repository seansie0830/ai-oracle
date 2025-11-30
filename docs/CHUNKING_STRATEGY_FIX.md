# Vite Chunking Strategy Fix

## Problem

When deploying the dist files to a simple HTTP server, you encountered:
```
Uncaught ReferenceError: Cannot access 'w' before initialization
    at feature-tarot-C1BJvYqE.js:1:5818
```

## Root Cause

**Circular dependency issues** caused by overly aggressive code splitting in `vite.config.js`.

### The Issue Chain:

The original chunking strategy split application code into separate feature chunks:

1. **`feature-stores`** - Pinia stores
2. **`feature-tarot`** - Tarot components AND utilities  
3. **`feature-llm`** - LLM services
4. **`feature-modals`** - Modal components
5. **Main chunk** - ChatBox.vue and other entry code

### Circular Dependencies:

```
RealLLMService.js (feature-llm)
  └─> imports @/utils/tarotUtils (feature-tarot)
       └─> drawRandomCard, drawMultipleCards

componentRegistry.js (feature-tarot)
  └─> imports TarotCard, TarotSpread, TarotDeck (feature-tarot)

ChatBox.vue (main chunk)
  ├─> imports componentRegistry (feature-tarot)
  ├─> imports TarotCard, TarotSpread, TarotDeck (feature-tarot)
  └─> uses LLM services (feature-llm)

RealLLMService.js (feature-llm)
  └─> uses useErrorHandler composable
       └─> imports from stores (feature-stores)
```

This creates **module initialization order issues** - chunks try to access variables from other chunks before they're initialized, resulting in the "Cannot access 'w' before initialization" error (where 'w' is a minified variable name).

## Solution

**Keep tightly coupled application code together** - only split vendor (node_modules) dependencies:

```javascript
// vite.config.js
build: {
  chunkSizeWarningLimit: 600,
  rollupOptions: {
    output: {
      manualChunks(id) {
        // === VENDOR CHUNKS ONLY ===
        if (id.includes('node_modules')) {
          if (id.includes('langchain') || id.includes('@langchain')) {
            return 'vendor-langchain'
          }
          if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
            return 'vendor-vue'
          }
          if (id.includes('vue-i18n')) {
            return 'vendor-i18n'
          }
          if (id.includes('marked')) {
            return 'vendor-markdown'
          }
          return 'vendor-other'
        }
        
        // NO FEATURE CHUNKS - prevents circular dependencies
      }
    }
  }
}
```

## Why This Works

1. **Vendor libraries are safe to split** - they don't have circular dependencies with your app code
2. **App code stays together** - components, services, stores, and utils remain in the same chunk
3. **Proper initialization order** - JavaScript modules initialize in the correct order when bundled together
4. **Browser can load in any order** - vendor chunks are independent and can load in parallel

## Trade-offs

### Before (Feature Chunking):
- ✅ Smaller initial bundle
- ✅ Lazy-load features when needed
- ❌ **Circular dependency issues**
- ❌ Complex chunk dependency graph
- ❌ Harder to debug

### After (Vendor-only Chunking):
- ✅ **No circular dependencies**
- ✅ Simple, predictable loading
- ✅ Easier to debug
- ✅ Vendor code still cached separately
- ⚠️ Slightly larger main bundle (but all your app code is typically needed anyway)

## Best Practices for Manual Chunking

1. **Only split code with clear boundaries** - vendor libraries, completely independent features
2. **Avoid splitting tightly coupled modules** - components that import each other, shared utilities
3. **Test in production builds** - chunk errors only appear in built/minified code
4. **Use dynamic imports for true code splitting** - `const Tarot = () => import('./components/Tarot.vue')` in routes
5. **Keep stores with the code that uses them** - unless you have very large, independent stores

## Verification

After the fix:
- ✅ Build completes successfully
- ✅ Preview server runs on `http://localhost:4174/`
- ✅ No initialization errors in production build
- ✅ Chunks generated: `vendor-vue`, `vendor-langchain`, `vendor-i18n`, `vendor-markdown`, `vendor-other`, and `index`

## Future Improvements

If you still want feature-based code splitting without circular dependencies:

1. **Use dynamic imports in router** for route-level splitting:
   ```javascript
   {
     path: '/tarot',
     component: () => import('@/views/TarotView.vue')
   }
   ```

2. **Create independent feature bundles** - ensure features don't import from each other
   - Tarot feature shouldn't import LLM services
   - LLM services shouldn't import Tarot utils (pass via dependency injection instead)

3. **Use Vite's automatic chunking** - Modern bundlers are good at this; manual chunking often causes more issues than it solves
