import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const results = [];

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    lines.forEach((line, i) => {
      // Exclude comments
      if (line.trim().startsWith('//')) return;
      
      // We look for text inside JSX tags: > text <
      let hasText = />\s*[a-zA-Z][a-zA-Z0-9_ \.,!\?'-]*\s*</.test(line);
      let hasPlaceholder = /placeholder=["'][a-zA-Z]/.test(line);
      let hasAlt = /alt=["'][a-zA-Z]/.test(line);
      
      // If it contains t(" or t(' we ignore it (unless there is other text, but keeping it simple)
      let hasTranslation = /t\(['"]/.test(line);
      
      // Also ignore simple imports/tags/classNames
      if ((hasText || hasPlaceholder || hasAlt) && !hasTranslation) {
         // clean up line to just see the string
         results.push(`${filePath}:${i+1}: ${line.trim()}`);
      }
    });
  }
});

fs.writeFileSync('missing_translations.txt', results.join('\n'));
console.log(`Found ${results.length} potential missing translations. Look at missing_translations.txt`);
