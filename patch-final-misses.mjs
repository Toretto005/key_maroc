import fs from 'fs';

const enPath = 'src/lib/i18n/en.json';
const arPath = 'src/lib/i18n/ar.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newKeys = {
  "location.use_my_location": "Use My Location",
  "location.locating": "Locating…",
  "location.click_map": "Click on the map to pin your exact location",
  "orders.status.pending": "Pending",
  "orders.status.in_progress": "In Progress",
  "orders.status.completed": "Completed",
  "orders.status.rejected": "Rejected",
  "orders.accept": "Accept",
  "orders.decline": "Decline",
  "orders.view_details": "View Details",
  "orders.tab.all": "ALL",
  "orders.tab.active": "ACTIVE",
  "orders.tab.pending": "PENDING",
  "orders.tab.completed": "COMPLETED"
};

const newKeysAr = {
  "location.use_my_location": "استخدام موقعي",
  "location.locating": "جاري التحديد…",
  "location.click_map": "انقر على الخريطة لتحديد موقعك بدقة",
  "orders.status.pending": "قيد الانتظار",
  "orders.status.in_progress": "قيد التنفيذ",
  "orders.status.completed": "مكتمل",
  "orders.status.rejected": "مرفوض",
  "orders.accept": "قبول",
  "orders.decline": "رفض",
  "orders.view_details": "عرض التفاصيل",
  "orders.tab.all": "الكل",
  "orders.tab.active": "نشط",
  "orders.tab.pending": "قيد الانتظار",
  "orders.tab.completed": "مكتمل"
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

// LocationPicker
replaceInFile('src/components/LocationPicker.tsx', [
  [/"Locating…" : "Use My Location"/g, 't("location.locating") : t("location.use_my_location")'],
  [/Click on the map to pin your exact location/g, '{t("location.click_map")}']
]);

// NotificationBell
replaceInFile('src/components/NotificationBell.tsx', [
  [/>\s*PENDING\s*</g, '>{t("orders.status.pending")}<'],
  [/>\s*New\s*</g, '>{t("dashboard.recent")}<']
]);

// dashboard orders
replaceInFile('src/app/dashboard/orders/page.tsx', [
  [/'Pending' : req\.status === 'ACCEPTED' \? 'In Progress' : req\.status === 'COMPLETED' \? 'Completed' : req\.status/g, 't("orders.status.pending") : req.status === "ACCEPTED" ? t("orders.status.in_progress") : req.status === "COMPLETED" ? t("orders.status.completed") : req.status'],
  [/>Accept<\/button>/g, '>{t("orders.accept")}</button>'],
  [/>Decline<\/button>/g, '>{t("orders.decline")}</button>'],
  [/>View Details<\/Link>/g, '>{t("orders.view_details")}</Link>'],
  [/\{tab\}/g, '{t("orders.tab." + tab.toLowerCase())}']
]);

// dashboard page
replaceInFile('src/app/dashboard/page.tsx', [
  [/'Pending' : req\.status === 'ACCEPTED' \? 'In Progress' : req\.status/g, 't("orders.status.pending") : req.status === "ACCEPTED" ? t("orders.status.in_progress") : req.status'],
  [/>View Details<\/Link>/g, '>{t("orders.view_details")}</Link>']
]);

// provider edit & new
const replaceServices = [
  [/>\s*\{type\}\s*<\/span>/g, '> {t("search." + type.toLowerCase())} </span>']
];
replaceInFile('src/app/provider/edit/page.tsx', replaceServices);
replaceInFile('src/app/provider/new/page.tsx', replaceServices);

console.log("Patched misses!");
