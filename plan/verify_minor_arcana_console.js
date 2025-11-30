// Quick verification script - paste into browser console to see actual card data
import { MINOR_ARCANA, FULL_DECK, drawRandomCardFromFullDeck, drawMultipleCardsFromFullDeck } from '@/utils/tarotUtils.js';

console.log("=== MINOR ARCANA VERIFICATION ===\n");

// Show first 5 minor arcana cards
console.log("First 5 Minor Arcana Cards:");
console.log(MINOR_ARCANA.slice(0, 5));
// Expected output:
// [
//   { suit: 'Cups', rank: 'Ace', name: 'Ace of Cups' },
//   { suit: 'Cups', rank: '2', name: '2 of Cups' },
//   { suit: 'Cups', rank: '3', name: '3 of Cups' },
//   { suit: 'Cups', rank: '4', name: '4 of Cups' },
//   { suit: 'Cups', rank: '5', name: '5 of Cups' }
// ]

console.log("\nSample from each suit:");
console.log("Cups:", MINOR_ARCANA.find(c => c.suit === 'Cups'));
console.log("Pentacles:", MINOR_ARCANA.find(c => c.suit === 'Pentacles'));
console.log("Wands:", MINOR_ARCANA.find(c => c.suit === 'Wands'));
console.log("Swords:", MINOR_ARCANA.find(c => c.suit === 'Swords'));

console.log("\nFull Deck Stats:");
console.log("Total cards:", FULL_DECK.length);
console.log("Major arcana:", FULL_DECK.filter(c => c.arcana === 'major').length);
console.log("Minor arcana:", FULL_DECK.filter(c => c.arcana === 'minor').length);

console.log("\nTest Draw Functions:");
console.log("Single card:", drawRandomCardFromFullDeck());
console.log("Three cards:", drawMultipleCardsFromFullDeck(3));

console.log("\n=== VERIFICATION COMPLETE ===");
