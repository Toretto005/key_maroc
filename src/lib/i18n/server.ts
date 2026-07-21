import { cookies } from "next/headers";
import { dictionaries, Locale } from "./dictionaries";

export async function getDictionary() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "en") as Locale;
  const dict = dictionaries[locale];
  const t = (key: string): string => dict[key] || key;
  return { locale, t };
}
