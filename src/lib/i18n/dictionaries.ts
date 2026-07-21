import enDict from './en.json';
import arDict from './ar.json';

export type Dictionary = Record<string, string>;
export type Locale = "en" | "ar";

export const en: Dictionary = enDict;
export const ar: Dictionary = arDict;

export const dictionaries: Record<Locale, Dictionary> = { en, ar };
