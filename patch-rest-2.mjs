import fs from 'fs';

let content, path;

// src/app/auth/verify-email/page.tsx
path = 'src/app/auth/verify-email/page.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    />Check your email<\/h2>/g,
    '>{t("auth.check_email")}</h2\>'
  );
  fs.writeFileSync(path, content);
}

// src/app/provider/[id]/page.tsx
path = 'src/app/provider/[id]/page.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    />Location<\/h2>/g,
    '>{t("provider_profile.location")}</h2\>'
  );
  content = content.replace(
    />Client Reviews<\/h2>/g,
    '>{t("provider_profile.client_reviews")}</h2\>'
  );
  content = content.replace(
    />No reviews yet for this provider\.<\/p>/g,
    '>{t("provider_profile.no_reviews")}</p\>'
  );
  content = content.replace(
    />Contact Provider<\/h3>/g,
    '>{t("provider_profile.contact")}</h3\>'
  );
  content = content.replace(
    />Call directly to discuss your needs and request immediate assistance\.<\/p>/g,
    '>{t("provider_profile.contact_desc")}</p\>'
  );
  content = content.replace(
    />Accepts Cash, Card, Mobile Pay<\/span>/g,
    '>{t("provider_profile.payment_methods")}</span\>'
  );
  fs.writeFileSync(path, content);
}

// src/app/provider/client/[phone]/page.tsx
path = 'src/app/provider/client/[phone]/page.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    />Provider Feedback<\/h2>/g,
    '>{t("client_feedback.title")}</h2\>'
  );
  content = content.replace(
    />No reviews for this client yet\.<\/p>/g,
    '>{t("client_feedback.no_reviews")}</p\>'
  );
  content = content.replace(
    />Be the first to leave feedback!<\/p>/g,
    '>{t("client_feedback.be_first")}</p\>'
  );
  fs.writeFileSync(path, content);
}

// src/components/SearchMap.tsx
path = 'src/components/SearchMap.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    />Your Location<\/div>/g,
    '>{t("map.your_location")}</div\>'
  );
  fs.writeFileSync(path, content);
}

// src/app/provider/edit/page.tsx
path = 'src/app/provider/edit/page.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    />PNG, JPG up to 5MB<\/p>/g,
    '>{t("provider_edit.image_hint")}</p\>'
  );
  fs.writeFileSync(path, content);
}

// src/components/UserDropdown.tsx
path = 'src/components/UserDropdown.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(
    />My Profile<\/span>/g,
    '>{t("dropdown.my_profile")}</span\>'
  );
  content = content.replace(
    />Log out<\/span>/g,
    '>{t("dropdown.log_out")}</span\>'
  );
  fs.writeFileSync(path, content);
}

console.log("Rest 2 updated");
