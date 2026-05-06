import type { Lang } from './index';

/** Country code (ISO 3166-1 alpha-2) → locale mapping.
    Countries not listed default to English. */
const COUNTRY_LOCALE: Record<string, Lang> = {
  // Indonesian
  ID: 'id',
  // Arabic-speaking countries
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar',
  BH: 'ar', OM: 'ar', JO: 'ar', LB: 'ar', IQ: 'ar',
  SY: 'ar', YE: 'ar', LY: 'ar', TN: 'ar', DZ: 'ar', MA: 'ar',
  PS: 'ar', SD: 'ar',
  // Chinese-speaking regions
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
};

export function detectLocale(country: string | null | undefined): Lang {
  if (!country) return 'en';
  return COUNTRY_LOCALE[country.toUpperCase()] ?? 'en';
}
