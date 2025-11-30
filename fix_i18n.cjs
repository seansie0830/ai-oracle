const fs = require('fs');
const path = require('path');
const filePath = path.resolve('src/i18n/locales/zh-TW.js');
console.log(`Reading ${filePath}`);
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const startIndex = lines.findIndex(line => line.trim().startsWith('queen_of_pentacles: {'));
console.log(`Found queen_of_pentacles at line ${startIndex + 1}`);

if (startIndex === -1) {
    console.error('Could not find queen_of_pentacles');
    process.exit(1);
}

const closingBraceIndex = startIndex + 3;
console.log(`Closing brace at line ${closingBraceIndex + 1}: ${lines[closingBraceIndex]}`);

if (!lines[closingBraceIndex].trim().startsWith('}')) {
    console.error('Unexpected structure');
    process.exit(1);
}

const keptLines = lines.slice(0, closingBraceIndex + 1);

const king = `        king_of_pentacles: {
            meaning: '錢幣國王代表財富，商業，領導力，安全，紀律，富足。',
            keywords: '財富，商業，領導力，安全，紀律，富足'
        }
    }
}`;

const newContent = keptLines.join('\n') + '\n' + king;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('File fixed successfully');
