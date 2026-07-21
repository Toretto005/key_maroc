import fs from 'fs';

const enPath = 'src/lib/i18n/en.json';
const arPath = 'src/lib/i18n/ar.json';
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newKeys = {
  // Placeholders
  "placeholder.email": "moulsarout@example.com",
  "placeholder.name": "Moul Sarout",
  "placeholder.john_doe": "John Doe",
  "placeholder.john_email": "john@example.com",
  "placeholder.search_orders": "Search orders...",
  "placeholder.review_exp": "How was the experience?",
  "placeholder.business_name": "e.g. Express Locksmith Casablanca",
  "placeholder.address": "Street, Neighborhood, City",
  "placeholder.phone": "e.g. +212 6 12 34 56 78",
  "placeholder.contact_email": "e.g. contact@domain.com",
  "placeholder.about": "Describe your experience, specializations, and availability...",
  "placeholder.certs": "e.g. ALOA Certified\nRegistered NY Locksmith",
  "placeholder.hours": "e.g. Mon-Fri: 8am-8pm\nSat-Sun: Emergency Only",
  "placeholder.service_name": "e.g. Standard Key Duplication",
  "placeholder.service_desc": "Describe what this service includes...",
  "placeholder.service_price": "e.g. 50 MAD or Starting at 100 MAD",
  "placeholder.service_duration": "e.g. 15 mins, 1 hour",
  "placeholder.help_desc": "Describe what you need help with...",
  "placeholder.service_name_alt": "e.g. Emergency Lockout",
  "placeholder.brief_desc": "Brief description of the service...",
  "placeholder.duration_alt": "e.g. 30 min",
  "placeholder.name_ali": "e.g. Ali",
  "placeholder.phone_alt": "e.g. 06...",
  "placeholder.any_details": "Any details the maker should know...",
  
  // Alts
  "alt.profile": "Profile",
  "alt.cover": "Cover",
  "alt.avatar_preview": "Avatar Preview",
  "alt.banner_preview": "Banner Preview",
  "alt.preview": "Preview"
};

const newKeysAr = {
  "placeholder.email": "moulsarout@example.com",
  "placeholder.name": "مول الساروت",
  "placeholder.john_doe": "فلان الفلاني",
  "placeholder.john_email": "john@example.com",
  "placeholder.search_orders": "ابحث عن الطلبات...",
  "placeholder.review_exp": "كيف كانت تجربتك؟",
  "placeholder.business_name": "مثال: صانع أقفال الدار البيضاء",
  "placeholder.address": "الشارع، الحي، المدينة",
  "placeholder.phone": "مثال: +212 6 12 34 56 78",
  "placeholder.contact_email": "مثال: contact@domain.com",
  "placeholder.about": "صف خبرتك، تخصصاتك، وأوقات توفرك...",
  "placeholder.certs": "مثال: معتمد من ALOA\nصانع أقفال مسجل",
  "placeholder.hours": "مثال: الإثنين-الجمعة: 8ص-8م\nالسبت-الأحد: طوارئ فقط",
  "placeholder.service_name": "مثال: نسخ مفتاح قياسي",
  "placeholder.service_desc": "صف ما تتضمنه هذه الخدمة...",
  "placeholder.service_price": "مثال: 50 درهم أو ابتداءً من 100 درهم",
  "placeholder.service_duration": "مثال: 15 دقيقة، 1 ساعة",
  "placeholder.help_desc": "صف ما تحتاج المساعدة فيه...",
  "placeholder.service_name_alt": "مثال: فتح قفل طارئ",
  "placeholder.brief_desc": "وصف موجز للخدمة...",
  "placeholder.duration_alt": "مثال: 30 دقيقة",
  "placeholder.name_ali": "مثال: علي",
  "placeholder.phone_alt": "مثال: 06...",
  "placeholder.any_details": "أي تفاصيل يجب أن يعرفها صانع المفاتيح...",
  
  // Alts
  "alt.profile": "الملف الشخصي",
  "alt.cover": "الغلاف",
  "alt.avatar_preview": "معاينة الصورة الشخصية",
  "alt.banner_preview": "معاينة الغلاف",
  "alt.preview": "معاينة"
};

Object.assign(enData, newKeys);
Object.assign(arData, newKeysAr);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));


// Now patch files
function replaceInFile(filePath, replacements) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
      // Create a global regex based on string or regex
      content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content);
  }
}

// 1. auth/login
replaceInFile('src/app/auth/login/page.tsx', [
  [/placeholder="moulsarout@example\.com"/g, 'placeholder={t("placeholder.email")}']
]);

// 2. auth/signup
replaceInFile('src/app/auth/signup/page.tsx', [
  [/placeholder="Moul Sarout"/g, 'placeholder={t("placeholder.name")}'],
  [/placeholder="moulsarout@example\.com"/g, 'placeholder={t("placeholder.email")}']
]);

// 3. client/profile (alt)
replaceInFile('src/app/client/profile/page.tsx', [
  [/alt="Profile"/g, 'alt={t("alt.profile")}']
]);

// 4. client/settings
replaceInFile('src/app/client/settings/page.tsx', [
  [/placeholder="John Doe"/g, 'placeholder={t("placeholder.john_doe")}'],
  [/placeholder="john@example\.com"/g, 'placeholder={t("placeholder.john_email")}'],
  [/alt="Profile"/g, 'alt={t("alt.profile")}']
]);

// 5. dashboard/orders
replaceInFile('src/app/dashboard/orders/page.tsx', [
  [/placeholder="Search orders\.\.\."/g, 'placeholder={t("placeholder.search_orders")}']
]);

// 6. dashboard/profile
replaceInFile('src/app/dashboard/profile/page.tsx', [
  [/alt="Cover"/g, 'alt={t("alt.cover")}'],
  [/alt="Profile"/g, 'alt={t("alt.profile")}']
]);

// 7. provider/client/[phone]/page.tsx
replaceInFile('src/app/provider/client/[phone]/page.tsx', [
  [/>Rating<\/label>/g, '>{t("client_detail.rating")}</label>'],
  [/placeholder="How was the experience\?"/g, 'placeholder={t("placeholder.review_exp")}']
]);

// 8. provider/edit/page.tsx
replaceInFile('src/app/provider/edit/page.tsx', [
  [/alt="Avatar Preview"/g, 'alt={t("alt.avatar_preview")}'],
  [/alt="Banner Preview"/g, 'alt={t("alt.banner_preview")}'],
  [/placeholder="e\.g\. Express Locksmith Casablanca"/g, 'placeholder={t("placeholder.business_name")}'],
  [/placeholder="Street, Neighborhood, City"/g, 'placeholder={t("placeholder.address")}'],
  [/placeholder="e\.g\. \+212 6 12 34 56 78"/g, 'placeholder={t("placeholder.phone")}'],
  [/placeholder="e\.g\. contact@domain\.com"/g, 'placeholder={t("placeholder.contact_email")}'],
  [/placeholder="Describe your experience, specializations, and availability\.\.\."/g, 'placeholder={t("placeholder.about")}'],
  [/placeholder="e\.g\. ALOA Certified&#10;Registered NY Locksmith"/g, 'placeholder={t("placeholder.certs")}'],
  [/placeholder="e\.g\. Mon-Fri: 8am-8pm&#10;Sat-Sun: Emergency Only"/g, 'placeholder={t("placeholder.hours")}']
]);

// 9. provider/new/page.tsx
replaceInFile('src/app/provider/new/page.tsx', [
  [/placeholder="e\.g\. Express Locksmith Casablanca"/g, 'placeholder={t("placeholder.business_name")}'],
  [/placeholder="Street, Neighborhood, City"/g, 'placeholder={t("placeholder.address")}'],
  [/placeholder="e\.g\. \+212 6 12 34 56 78"/g, 'placeholder={t("placeholder.phone")}'],
  [/placeholder="Describe your experience, specializations, and availability\.\.\."/g, 'placeholder={t("placeholder.about")}']
]);

// 10. provider/services/page.tsx
replaceInFile('src/app/provider/services/page.tsx', [
  [/placeholder="e\.g\. Standard Key Duplication"/g, 'placeholder={t("placeholder.service_name")}'],
  [/alt="Preview"/g, 'alt={t("alt.preview")}'],
  [/placeholder="Describe what this service includes\.\.\."/g, 'placeholder={t("placeholder.service_desc")}'],
  [/placeholder="e\.g\. 50 MAD or Starting at 100 MAD"/g, 'placeholder={t("placeholder.service_price")}'],
  [/placeholder="e\.g\. 15 mins, 1 hour"/g, 'placeholder={t("placeholder.service_duration")}']
]);

// 11. components/RequestQuoteModal.tsx
replaceInFile('src/components/RequestQuoteModal.tsx', [
  [/placeholder="John Doe"/g, 'placeholder={t("placeholder.john_doe")}'],
  [/placeholder="Describe what you need help with\.\.\."/g, 'placeholder={t("placeholder.help_desc")}']
]);

// 12. components/ServicesSection.tsx
replaceInFile('src/components/ServicesSection.tsx', [
  [/placeholder="e\.g\. Emergency Lockout"/g, 'placeholder={t("placeholder.service_name_alt")}'],
  [/placeholder="Brief description of the service\.\.\."/g, 'placeholder={t("placeholder.brief_desc")}'],
  [/placeholder="e\.g\. 30 min"/g, 'placeholder={t("placeholder.duration_alt")}'],
  [/placeholder="e\.g\. Ali"/g, 'placeholder={t("placeholder.name_ali")}'],
  [/placeholder="e\.g\. 06\.\.\."/g, 'placeholder={t("placeholder.phone_alt")}'],
  [/placeholder="Any details the maker should know\.\.\."/g, 'placeholder={t("placeholder.any_details")}']
]);

// 13. components/UserDropdown.tsx
replaceInFile('src/components/UserDropdown.tsx', [
  [/alt="Profile"/g, 'alt={t("alt.profile")}']
]);

console.log("Placeholders and alts patched!");
