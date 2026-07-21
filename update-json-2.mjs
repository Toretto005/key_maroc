import fs from 'fs';

const enPath = 'src/lib/i18n/en.json';
const arPath = 'src/lib/i18n/ar.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newKeys = {
  // src/app/auth/verify-email/page.tsx
  "auth.check_email": "Check your email",

  // src/app/provider/[id]/page.tsx
  "provider_profile.location": "Location",
  "provider_profile.client_reviews": "Client Reviews",
  "provider_profile.no_reviews": "No reviews yet for this provider.",
  "provider_profile.contact": "Contact Provider",
  "provider_profile.contact_desc": "Call directly to discuss your needs and request immediate assistance.",
  "provider_profile.payment_methods": "Accepts Cash, Card, Mobile Pay",

  // src/app/provider/client/[phone]/page.tsx
  "client_feedback.title": "Provider Feedback",
  "client_feedback.no_reviews": "No reviews for this client yet.",
  "client_feedback.be_first": "Be the first to leave feedback!",

  // src/components/SearchMap.tsx
  "map.your_location": "Your Location",

  // src/app/provider/edit/page.tsx
  "provider_edit.image_hint": "PNG, JPG up to 5MB",

  // src/components/UserDropdown.tsx
  "dropdown.my_profile": "My Profile",
  "dropdown.log_out": "Log out"
};

const newKeysAr = {
  // src/app/auth/verify-email/page.tsx
  "auth.check_email": "تحقق من بريدك الإلكتروني",

  // src/app/provider/[id]/page.tsx
  "provider_profile.location": "الموقع",
  "provider_profile.client_reviews": "مراجعات العملاء",
  "provider_profile.no_reviews": "لا توجد مراجعات حتى الآن لهذا المزود.",
  "provider_profile.contact": "اتصل بالمزود",
  "provider_profile.contact_desc": "اتصل مباشرة لمناقشة احتياجاتك وطلب مساعدة فورية.",
  "provider_profile.payment_methods": "يقبل النقد والبطاقة والدفع عبر الهاتف",

  // src/app/provider/client/[phone]/page.tsx
  "client_feedback.title": "ملاحظات المزود",
  "client_feedback.no_reviews": "لا توجد مراجعات لهذا العميل حتى الآن.",
  "client_feedback.be_first": "كن أول من يترك ملاحظة!",

  // src/components/SearchMap.tsx
  "map.your_location": "موقعك",

  // src/app/provider/edit/page.tsx
  "provider_edit.image_hint": "PNG، JPG حتى 5 ميغابايت",

  // src/components/UserDropdown.tsx
  "dropdown.my_profile": "ملفي الشخصي",
  "dropdown.log_out": "تسجيل خروج"
};

Object.assign(enData, newKeys);
Object.assign(arData, newKeysAr);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log("JSON dictionaries updated 2!");
