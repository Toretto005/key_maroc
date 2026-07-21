import fs from 'fs';

const path = 'src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The new text keys in page.tsx
content = content.replace(
  />Three Simple Steps to Safety<\/h2>/g,
  '>{t("home.steps_title")}</h2\>'
);
content = content.replace(
  />From locked out to back inside in minutes\.<\/p>/g,
  '>{t("home.steps_subtitle")}</p\>'
);

// Step 1
content = content.replace(
  />Search & Locate<\/h3>/g,
  '>{t("home.step1_title")}</h3\>'
);
content = content.replace(
  /Enter your location or let your GPS do the work\. We'll instantly scan the area to find the closest available key makers near you\./g,
  '{t("home.step1_desc")}'
);

// Step 2
content = content.replace(
  />Pick a Provider<\/h3>/g,
  '>{t("home.step2_title")}</h3\>'
);
content = content.replace(
  /Browse through profiles of verified local locksmiths\. See their transparent pricing, read customer reviews, and check their exact distance from you\./g,
  '{t("home.step2_desc")}'
);

// Step 3
content = content.replace(
  />Get It Done<\/h3>/g,
  '>{t("home.step3_title")}</h3\>'
);
content = content.replace(
  /Tap to call the key maker directly\. No middlemen, no waiting on hold\. Your local expert will be on their way to help you in minutes\./g,
  '{t("home.step3_desc")}'
);

fs.writeFileSync(path, content);
console.log("page.tsx updated");
