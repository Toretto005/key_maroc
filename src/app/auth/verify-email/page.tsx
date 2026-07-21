import { KeyRound, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function VerifyEmailPage() {
  const { t } = await getDictionary();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="hidden md:block fixed top-4 end-4 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
          <KeyRound className="w-8 h-8 text-white" />
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t("auth.check_email")}</h2>
          <p className="text-slate-400 mb-6">
            {t("auth.verify_email_desc")}
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            {t("auth.back_to_sign_in")}
          </Link>
        </div>
      </div>
    </div>
  );
}
