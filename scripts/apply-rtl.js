const fs = require('fs');
const path = require('path');

const directoryToScan = path.join(__dirname, '..', 'src');

const replacements = [
  // Margins
  { regex: /\bml-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'ms-$1' },
  { regex: /\bmr-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'me-$1' },
  { regex: /\b-ml-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: '-ms-$1' },
  { regex: /\b-mr-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: '-me-$1' },
  
  // Padding
  { regex: /\bpl-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'ps-$1' },
  { regex: /\bpr-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'pe-$1' },

  // Positioning
  { regex: /\bleft-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'start-$1' },
  { regex: /\bright-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'end-$1' },
  { regex: /\b-left-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: '-start-$1' },
  { regex: /\b-right-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: '-end-$1' },

  // Text alignment
  { regex: /\btext-left\b/g, replacement: 'text-start' },
  { regex: /\btext-right\b/g, replacement: 'text-end' },

  // Floats
  { regex: /\bfloat-left\b/g, replacement: 'float-start' },
  { regex: /\bfloat-right\b/g, replacement: 'float-end' },

  // Borders
  { regex: /\bborder-l\b/g, replacement: 'border-s' },
  { regex: /\bborder-r\b/g, replacement: 'border-e' },
  { regex: /\bborder-l-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'border-s-$1' },
  { regex: /\bborder-r-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'border-e-$1' },

  // Rounded corners
  { regex: /\brounded-l\b/g, replacement: 'rounded-s' },
  { regex: /\brounded-r\b/g, replacement: 'rounded-e' },
  { regex: /\brounded-l-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'rounded-s-$1' },
  { regex: /\brounded-r-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'rounded-e-$1' },
  { regex: /\brounded-tl-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'rounded-ss-$1' },
  { regex: /\brounded-tr-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'rounded-se-$1' },
  { regex: /\brounded-bl-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'rounded-es-$1' },
  { regex: /\brounded-br-([a-zA-Z0-9\[\]\/-]+)\b/g, replacement: 'rounded-ee-$1' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && /\.(tsx|ts)$/.test(file)) {
      processFile(fullPath);
    }
  }
}

console.log('Starting RTL CSS replacement...');
scanDirectory(directoryToScan);
console.log('Done!');
