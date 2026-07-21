import fs from 'fs';

const files = [
  'src/app/auth/login/page.tsx',
  'src/app/auth/signup/page.tsx',
  'src/app/client/profile/page.tsx',
  'src/app/client/settings/page.tsx',
  'src/app/dashboard/orders/page.tsx',
  'src/app/dashboard/profile/page.tsx',
  'src/app/provider/client/[phone]/page.tsx',
  'src/app/provider/edit/page.tsx',
  'src/app/provider/new/page.tsx',
  'src/app/provider/services/page.tsx',
  'src/components/RequestQuoteModal.tsx',
  'src/components/ServicesSection.tsx',
  'src/components/UserDropdown.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Check if `t` is defined
  const hasUseLanguageCall = /const\s+\{\s*t\s*\}\s*=\s*useLanguage\(\)/.test(content);
  
  if (content.includes('t("') || content.includes("t('")) {
    if (!hasUseLanguageCall) {
      console.log(`Missing t in ${file}`);
      
      // Inject import if missing
      if (!content.includes('useLanguage')) {
        // find last import
        const lastImportMatch = [...content.matchAll(/^import .*;$/gm)].pop();
        if (lastImportMatch) {
           const idx = lastImportMatch.index + lastImportMatch[0].length;
           content = content.slice(0, idx) + "\nimport { useLanguage } from '@/lib/i18n/LanguageContext';" + content.slice(idx);
        } else {
           content = "import { useLanguage } from '@/lib/i18n/LanguageContext';\n" + content;
        }
      }
      
      // Inject const { t } = useLanguage() into the default export or main function
      // We look for `export default function XYZ() {` or `export function XYZ() {`
      const funcMatch = /export\s+(?:default\s+)?function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{/.exec(content);
      if (funcMatch) {
         const idx = funcMatch.index + funcMatch[0].length;
         content = content.slice(0, idx) + "\n  const { t } = useLanguage();" + content.slice(idx);
      }
      
      fs.writeFileSync(file, content);
      changed = true;
    }
  }
}
console.log("Fixes applied.");
