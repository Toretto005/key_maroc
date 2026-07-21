import fs from 'fs';

const enPath = 'src/lib/i18n/en.json';
const arPath = 'src/lib/i18n/ar.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newKeys = {
  // src/app/page.tsx
  "home.steps_title": "Three Simple Steps to Safety",
  "home.steps_subtitle": "From locked out to back inside in minutes.",
  "home.step1_title": "Search",
  "home.step1_desc": "Enter your location and the type of service you need.",
  "home.step2_title": "Pick a Provider",
  "home.step2_desc": "Compare key makers by rating, distance, and reviews.",
  "home.step3_title": "Get It Done",
  "home.step3_desc": "Book instantly and get your problem solved right away.",

  // src/app/dashboard/orders/page.tsx & src/app/dashboard/page.tsx
  "provider.order_id": "Order ID",
  "provider.customer": "Customer",
  "provider.service_type": "Service",
  "provider.order_date": "Date",
  "provider.status": "Status",
  "provider.action": "Action",
  "provider.prev": "Prev",
  "provider.next": "Next",
  "provider.current_orders": "Current Orders",
  "provider.services_managed": "Services Managed",
  "provider.view": "View",
  "provider.base_price": "Base price",

  // src/app/search/page.tsx
  "search.all": "All",
  "search.emergency": "Emergency",
  "search.commercial": "Commercial",
  "search.auto": "Auto",
  "search.residential": "Residential",
  "search.auth_required": "Authentication Required",
  "search.auth_desc": "Please sign in or create an account to book this service.",

  // src/app/provider/new/page.tsx
  "onboarding.title": "Join Sarouti as a Key Maker",
  "onboarding.subtitle": "Fill in your details and pin your location on the map.",
  "onboarding.business_info": "Your Business Info",
  "onboarding.pin_location": "Pin Your Location",

  // src/app/provider/client/[phone]/page.tsx
  "client_detail.back": "Back to Orders",
  "client_detail.rating": "Rating",
  "client_detail.reviews": "Reviews",

  // src/components/ServicesSection.tsx
  "services.offered": "Services Offered",
  "services.no_services": "No services listed yet.",
  "services.description": "Description",
  "services.price": "Price",
  "services.duration": "Duration",

  // src/components/NotificationBell.tsx
  "notifications.title": "Notifications",
  "notifications.caught_up": "You're all caught up!",

  // src/components/LocationPicker.tsx
  // mostly just openstreetmap attribution, not necessary to translate

  // Missing from dashboard
  "dashboard.orders": "Orders",
  "dashboard.no_orders_found": "No orders found"
};

const newKeysAr = {
  // src/app/page.tsx
  "home.steps_title": "ثلاث خطوات بسيطة للأمان",
  "home.steps_subtitle": "من الإغلاق خارجاً إلى العودة للداخل في دقائق.",
  "home.step1_title": "ابحث",
  "home.step1_desc": "أدخل موقعك ونوع الخدمة التي تحتاجها.",
  "home.step2_title": "اختر مقدم خدمة",
  "home.step2_desc": "قارن بين صناع المفاتيح حسب التقييم والمسافة والمراجعات.",
  "home.step3_title": "أنجز العمل",
  "home.step3_desc": "احجز على الفور وحل مشكلتك في الحال.",

  // src/app/dashboard/orders/page.tsx & src/app/dashboard/page.tsx
  "provider.order_id": "رقم الطلب",
  "provider.customer": "الزبون",
  "provider.service_type": "الخدمة",
  "provider.order_date": "التاريخ",
  "provider.status": "الحالة",
  "provider.action": "الإجراء",
  "provider.prev": "السابق",
  "provider.next": "التالي",
  "provider.current_orders": "الطلبات الحالية",
  "provider.services_managed": "الخدمات المدارة",
  "provider.view": "عرض",
  "provider.base_price": "السعر الأساسي",

  // src/app/search/page.tsx
  "search.all": "الكل",
  "search.emergency": "طوارئ",
  "search.commercial": "تجاري",
  "search.auto": "سيارات",
  "search.residential": "منازل",
  "search.auth_required": "مطلوب تسجيل الدخول",
  "search.auth_desc": "يرجى تسجيل الدخول أو إنشاء حساب لحجز هذه الخدمة.",

  // src/app/provider/new/page.tsx
  "onboarding.title": "انضم إلى ساروتي كصانع مفاتيح",
  "onboarding.subtitle": "أدخل بياناتك وحدد موقعك على الخريطة.",
  "onboarding.business_info": "معلومات عملك",
  "onboarding.pin_location": "حدد موقعك",

  // src/app/provider/client/[phone]/page.tsx
  "client_detail.back": "العودة للطلبات",
  "client_detail.rating": "التقييم",
  "client_detail.reviews": "المراجعات",

  // src/components/ServicesSection.tsx
  "services.offered": "الخدمات المقدمة",
  "services.no_services": "لم يتم إدراج أي خدمات بعد.",
  "services.description": "الوصف",
  "services.price": "السعر",
  "services.duration": "المدة",

  // src/components/NotificationBell.tsx
  "notifications.title": "الإشعارات",
  "notifications.caught_up": "ليس لديك أي إشعارات جديدة!",

  "dashboard.orders": "الطلبات",
  "dashboard.no_orders_found": "لم يتم العثور على طلبات"
};

Object.assign(enData, newKeys);
Object.assign(arData, newKeysAr);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));
console.log("JSON dictionaries updated!");
