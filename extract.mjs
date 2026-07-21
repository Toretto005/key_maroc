import fs from 'fs';
import { resolve } from 'path';

// Extract the content from the file using regex or simple parsing
const content = fs.readFileSync('src/lib/i18n/dictionaries.ts', 'utf-8');

const enMatch = content.match(/export const en: Dictionary = ({[\s\S]*?});\n\nexport const ar: Dictionary =/);
const arMatch = content.match(/export const ar: Dictionary = ({[\s\S]*?});\n\nexport type Locale/);

if (enMatch && arMatch) {
  // Convert JS object to JSON by evaluating it (safe since we know the content)
  const enObj = eval('(' + enMatch[1] + ')');
  const arObj = eval('(' + arMatch[1] + ')');
  
  fs.writeFileSync('src/lib/i18n/en.json', JSON.stringify(enObj, null, 2));
  fs.writeFileSync('src/lib/i18n/ar.json', JSON.stringify(arObj, null, 2));
  console.log("Done");
} else {
  console.log("Regex failed to match");
}
