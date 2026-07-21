import fs from 'fs';

const path = 'src/app/search/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  />All<\/span>/g,
  '>{t("search.all")}</span\>'
);
content = content.replace(
  />Emergency<\/span>/g,
  '>{t("search.emergency")}</span\>'
);
content = content.replace(
  />Commercial<\/span>/g,
  '>{t("search.commercial")}</span\>'
);
content = content.replace(
  />Auto<\/span>/g,
  '>{t("search.auto")}</span\>'
);
content = content.replace(
  />Residential<\/span>/g,
  '>{t("search.residential")}</span\>'
);
content = content.replace(
  />Authentication Required<\/h3>/g,
  '>{t("search.auth_required")}</h3\>'
);
content = content.replace(
  />Please sign in or create an account to book this service\.<\/p>/g,
  '>{t("search.auth_desc")}</p\>'
);
content = content.replace(
  />Sign In<\/Link>/g,
  '>{t("nav.login")}</Link\>'
);
content = content.replace(
  />Create Account<\/Link>/g,
  '>{t("nav.signup")}</Link\>'
);
content = content.replace(
  />Cancel<\/button>/g,
  '>{t("common.cancel")}</button\>'
);

fs.writeFileSync(path, content);
console.log("search updated");
