import fs from 'fs';

const enPath = 'src/lib/i18n/en.json';
const arPath = 'src/lib/i18n/ar.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newKeys = {
  "provider_edit.error_image": "Error uploading image! Please try again.",
  "provider_edit.error_banner": "Error uploading banner! Please try again.",
  "provider_edit.error_map": "Please select your location on the map before submitting.",
  "provider_edit.error_update": "Error updating profile. Please try again.",
  "provider_edit.error_unexpected": "An unexpected error occurred.",
  "provider_edit.success_toast": "Profile updated successfully!",
  "client_settings.error_image": "Error uploading image: ",
  "dashboard.loading": "Loading...",
  "dashboard.title_dashboard": "Locksmith Pro - Dashboard",
  "dashboard.title_profile": "Locksmith Pro - Profile",
  "dashboard.title_settings": "Locksmith Pro - Settings",
  "dashboard.title_orders": "Locksmith Pro - Orders",
  "dashboard.title_calendar": "Locksmith Pro - Calendar",
  "dashboard.title_clients": "Locksmith Pro - Clients"
};

const newKeysAr = {
  "provider_edit.error_image": "حدث خطأ أثناء تحميل الصورة! يرجى المحاولة مرة أخرى.",
  "provider_edit.error_banner": "حدث خطأ أثناء تحميل الغلاف! يرجى المحاولة مرة أخرى.",
  "provider_edit.error_map": "يرجى تحديد موقعك على الخريطة قبل الإرسال.",
  "provider_edit.error_update": "حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.",
  "provider_edit.error_unexpected": "حدث خطأ غير متوقع.",
  "provider_edit.success_toast": "تم تحديث الملف الشخصي بنجاح!",
  "client_settings.error_image": "حدث خطأ أثناء تحميل الصورة: ",
  "dashboard.loading": "جاري التحميل...",
  "dashboard.title_dashboard": "محترف الأقفال - لوحة القيادة",
  "dashboard.title_profile": "محترف الأقفال - الملف الشخصي",
  "dashboard.title_settings": "محترف الأقفال - الإعدادات",
  "dashboard.title_orders": "محترف الأقفال - الطلبات",
  "dashboard.title_calendar": "محترف الأقفال - التقويم",
  "dashboard.title_clients": "محترف الأقفال - العملاء"
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
  [/alert\('Error uploading image! Please try again\.'\);/g, 'alert(t("provider_edit.error_image"));'],
  [/alert\('Error uploading banner! Please try again\.'\);/g, 'alert(t("provider_edit.error_banner"));'],
  [/alert\("Please select your location on the map before submitting\."\);/g, 'alert(t("provider_edit.error_map"));'],
  [/alert\("Error updating profile\. Please try again\."\);/g, 'alert(t("provider_edit.error_update"));'],
  [/alert\("An unexpected error occurred\."\);/g, 'alert(t("provider_edit.error_unexpected"));'],
  [/\| Locksmith Pro - Settings/g, '| {t("dashboard.title_settings")}'],
  [/>Profile updated successfully!</g, '>{t("provider_edit.success_toast")}<'],
  [/>Changes to your profile have been saved\.</g, '>{t("settings.success")}<'],
]);

// client/settings/page.tsx
replaceInFile('src/app/client/settings/page.tsx', [
  [/alert\("Error uploading image: " \+ err\.message\);/g, 'alert(t("client_settings.error_image") + err.message);']
]);

// Other dashboards for Loading... and Title
const dashboardPages = [
  { p: 'src/app/dashboard/page.tsx', t: 'dashboard.title_dashboard' },
  { p: 'src/app/dashboard/profile/page.tsx', t: 'dashboard.title_profile' },
  { p: 'src/app/dashboard/orders/page.tsx', t: 'dashboard.title_orders' },
  { p: 'src/app/dashboard/calendar/page.tsx', t: 'dashboard.title_calendar' },
  { p: 'src/app/dashboard/clients/page.tsx', t: 'dashboard.title_clients' },
  { p: 'src/app/provider/client/[phone]/page.tsx', t: 'dashboard.title_clients' }
];

for (const {p, t} of dashboardPages) {
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/'Loading\.\.\.'/g, 't("dashboard.loading")');
    c = c.replace(/\| Locksmith Pro - [a-zA-Z]+/g, `| {t("${t}")}`);
    fs.writeFileSync(p, c);
  }
}

console.log("Settings texts patched!");
