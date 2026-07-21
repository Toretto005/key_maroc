import fs from 'fs';

const filePath = 'src/components/LocationPicker.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('useLanguage')) {
    const importRegex = /(import .*;\n)/;
    const match = content.match(importRegex);
    if (match) {
      const idx = content.indexOf(match[0]) + match[0].length;
      content = content.slice(0, idx) + "import { useLanguage } from '@/lib/i18n/LanguageContext';\n" + content.slice(idx);
    } else {
      content = "import { useLanguage } from '@/lib/i18n/LanguageContext';\n" + content;
    }
  }

  if (!content.includes('const { t } = useLanguage();')) {
    content = content.replace(/(export default function LocationPicker\([^)]*\)\s*\{)/, "$1\n  const { t } = useLanguage();\n");
  }

  fs.writeFileSync(filePath, content);
  console.log("Fixed LocationPicker");
}
