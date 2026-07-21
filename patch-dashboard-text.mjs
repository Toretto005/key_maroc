import fs from 'fs';

const enPath = 'src/lib/i18n/en.json';
const arPath = 'src/lib/i18n/ar.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newKeys = {
  "dashboard.provider": "Provider",
  "provider.date_time": "Date & Time",
  "dashboard.showing": "Showing",
  "dashboard.results": "results",
  "provider.mad": "MAD",
  "dashboard.recent": "recent"
};

const newKeysAr = {
  "dashboard.provider": "صانع الأقفال",
  "provider.date_time": "التاريخ والوقت",
  "dashboard.showing": "عرض",
  "dashboard.results": "نتائج",
  "provider.mad": "درهم",
  "dashboard.recent": "حديثة"
};

Object.assign(enData, newKeys);
Object.assign(arData, newKeysAr);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

function replaceInFile(filePath, replacements) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
      content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content);
  }
}

// provider/edit/page.tsx
replaceInFile('src/app/provider/edit/page.tsx', [
  [/Provider <span/g, '{t("dashboard.provider")} <span']
]);

// provider/services/page.tsx
replaceInFile('src/app/provider/services/page.tsx', [
  [/Provider <span/g, '{t("dashboard.provider")} <span']
]);

// dashboard/clients/page.tsx
replaceInFile('src/app/dashboard/clients/page.tsx', [
  [/Provider <span/g, '{t("dashboard.provider")} <span']
]);

// dashboard/orders/page.tsx
replaceInFile('src/app/dashboard/orders/page.tsx', [
  [/>Date &amp; Time<\/th>/g, '>{t("provider.date_time")}</th>'],
  [/>Date & Time<\/th>/g, '>{t("provider.date_time")}</th>'],
  [/Showing <span/g, '{t("dashboard.showing")} <span'],
  [/<\/span> results/g, '</span> {t("dashboard.results")}']
]);

// dashboard/page.tsx
replaceInFile('src/app/dashboard/page.tsx', [
  [/>MAD 0<\/strong>/g, '>{t("provider.mad")} 0</strong>'],
  [/>5 recent<\/span>/g, '>5 {t("dashboard.recent")}</span>']
]);

console.log("Dashboard texts patched!");
