import fs from 'fs';

const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  />Current Orders<\/h4>/g,
  '>{t("provider.current_orders")}</h4\>'
);
content = content.replace(
  />Order ID<\/th>/g,
  '>{t("provider.order_id")}</th\>'
);
content = content.replace(
  />Customer<\/th>/g,
  '>{t("provider.customer")}</th\>'
);
content = content.replace(
  />Type<\/th>/g,
  '>{t("provider.service_type")}</th\>'
);
content = content.replace(
  />Status<\/th>/g,
  '>{t("provider.status")}</th\>'
);
content = content.replace(
  />Date<\/th>/g,
  '>{t("provider.order_date")}</th\>'
);
content = content.replace(
  />Actions<\/th>/g,
  '>{t("provider.action")}</th\>'
);
content = content.replace(
  />View<\/Link>/g,
  '>{t("provider.view")}</Link\>'
);
content = content.replace(
  />Services Managed<\/h4>/g,
  '>{t("provider.services_managed")}</h4\>'
);
content = content.replace(
  />View All<\/Link>/g,
  '>{t("provider.view_all")}</Link\>'
);
content = content.replace(
  />Base price<\/p>/g,
  '>{t("provider.base_price")}</p\>'
);
content = content.replace(
  />You haven't added any services yet\.<\/p>/g,
  '>{t("provider.no_services")}</p\>'
);
content = content.replace(
  />Add your first service<\/Link>/g,
  '>{t("provider.create_first_service")}</Link\>'
);

fs.writeFileSync(path, content);
console.log("dashboard updated");
