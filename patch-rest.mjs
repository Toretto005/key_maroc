import fs from 'fs';

let content, path;

// src/app/provider/client/[phone]/page.tsx
path = 'src/app/provider/client/[phone]/page.tsx';
content = fs.readFileSync(path, 'utf8');
content = content.replace(
  />Back to Orders<\/span>/g,
  '>{t("client_detail.back")}</span\>'
);
content = content.replace(
  />Rating<\/div>/g,
  '>{t("client_detail.rating")}</div\>'
);
content = content.replace(
  />Reviews<\/div>/g,
  '>{t("client_detail.reviews")}</div\>'
);
fs.writeFileSync(path, content);
console.log("client updated");

// src/components/ServicesSection.tsx
path = 'src/components/ServicesSection.tsx';
content = fs.readFileSync(path, 'utf8');
content = content.replace(
  />Services Offered<\/h2>/g,
  '>{t("services.offered")}</h2\>'
);
content = content.replace(
  />No services listed yet\.<\/p>/g,
  '>{t("services.no_services")}</p\>'
);
content = content.replace(
  /Description<\/span>/g,
  '{t("services.description")}</span\>'
);
content = content.replace(
  /Price<\/span>/g,
  '{t("services.price")}</span\>'
);
content = content.replace(
  /Duration<\/span>/g,
  '{t("services.duration")}</span\>'
);
fs.writeFileSync(path, content);
console.log("services section updated");

// src/components/NotificationBell.tsx
path = 'src/components/NotificationBell.tsx';
content = fs.readFileSync(path, 'utf8');
content = content.replace(
  />Notifications<\/h3>/g,
  '>{t("notifications.title")}</h3\>'
);
content = content.replace(
  />You're all caught up!<\/span>/g,
  '>{t("notifications.caught_up")}</span\>'
);
fs.writeFileSync(path, content);
console.log("notifications bell updated");
