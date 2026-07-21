import fs from 'fs';
const files = [
  'src/app/provider/edit/page.tsx',
  'src/app/dashboard/profile/page.tsx',
  'src/app/dashboard/orders/page.tsx',
  'src/app/dashboard/page.tsx'
];

for (const file of files) {
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  console.log('--- ' + file + ' ---');
  lines.forEach((line, i) => {
    // skip imports
    if (line.startsWith('import ')) return;
    if (line.trim().startsWith('//')) return;
    
    // strip out all JSX tags `<...>`
    let stripped = line.replace(/<[^>]+>/g, ' ');
    // strip out curly braces content `{...}`
    // Since curly braces can be nested, a simple regex is just an approximation
    stripped = stripped.replace(/\{[^}]+\}/g, ' ');
    // strip out common syntax
    stripped = stripped.replace(/className="[^"]+"/g, '');
    stripped = stripped.replace(/[a-zA-Z]+=\{\s*\w*\s*\}/g, '');
    stripped = stripped.replace(/^[ \t]*[a-zA-Z]+=/g, '');
    
    // check if it still has alphabet characters
    if (/[a-zA-Z]{3,}/.test(stripped) && !stripped.includes('t("') && !stripped.includes("t('")) {
      // Just print the line if it looks like there's text
      if (line.includes('<') && line.includes('>')) {
        console.log(i + 1 + ':', line.trim());
      }
    }
  });
}
