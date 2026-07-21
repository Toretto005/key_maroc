import fs from 'fs';

const path = 'src/app/provider/new/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  />Join Sarouti as a Key Maker<\/h1>/g,
  '>{t("onboarding.title")}</h1\>'
);
content = content.replace(
  />Fill in your details and pin your location on the map\.<\/p>/g,
  '>{t("onboarding.subtitle")}</p\>'
);
content = content.replace(
  />Your Business Info<\/h2>/g,
  '>{t("onboarding.business_info")}</h2\>'
);
content = content.replace(
  />Pin Your Location<\/h2>/g,
  '>{t("onboarding.pin_location")}</h2\>'
);

fs.writeFileSync(path, content);
console.log("provider new updated");
