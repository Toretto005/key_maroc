import fs from 'fs';

const path = 'src/app/dashboard/orders/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  />Order ID<\/th>/g,
  '>{t("provider.order_id")}</th\>'
);
content = content.replace(
  />Customer<\/th>/g,
  '>{t("provider.customer")}</th\>'
);
content = content.replace(
  />Service<\/th>/g,
  '>{t("provider.service_type")}</th\>'
);
content = content.replace(
  />Date<\/th>/g,
  '>{t("provider.order_date")}</th\>'
);
content = content.replace(
  />Status<\/th>/g,
  '>{t("provider.status")}</th\>'
);
content = content.replace(
  />Action<\/th>/g,
  '>{t("provider.action")}</th\>'
);
content = content.replace(
  />No orders found<\/h3>/g,
  '>{t("dashboard.no_orders_found")}</h3\>'
);
content = content.replace(
  />Prev<\/button>/g,
  '>{t("provider.prev")}</button\>'
);
content = content.replace(
  />Next<\/button>/g,
  '>{t("provider.next")}</button\>'
);

fs.writeFileSync(path, content);
console.log("orders updated");
