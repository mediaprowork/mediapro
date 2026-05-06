export type Lang = 'en' | 'id' | 'ar' | 'zh';

export const LOCALES: Lang[] = ['en', 'id', 'ar', 'zh'];
export const DEFAULT_LOCALE: Lang = 'en';

/** Strip locale prefix from a pathname. `/ar/contact` → `/contact`. `/contact` → `/contact`. `/` → `/`. */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(id|ar|zh)(\/.*)?$/);
  if (!m) return pathname;
  return m[2] || '/';
}

/** Detect locale from URL pathname. */
export function getLang(pathname: string): Lang {
  if (pathname.startsWith('/id')) return 'id';
  if (pathname.startsWith('/ar')) return 'ar';
  if (pathname.startsWith('/zh')) return 'zh';
  return 'en';
}

/** Build a localized URL for a given locale + path. */
export function localizedUrl(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean;
  // Avoid double slash for root paths
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

/** Direction for an HTML doc per locale. */
export function dirFor(lang: Lang): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

/** UI translation loader. Returns a `t(key)` function. */
type Dict = Record<string, unknown>;

const cache: Partial<Record<Lang, Dict>> = {};

async function loadDict(lang: Lang): Promise<Dict> {
  if (cache[lang]) return cache[lang]!;
  const mod = await import(`./ui/${lang}.json`);
  cache[lang] = mod.default as Dict;
  return cache[lang]!;
}

export async function useTranslations(lang: Lang) {
  const dict = await loadDict(lang);
  // English fallback so missing keys don't break pages
  const fallback = lang === 'en' ? null : await loadDict('en');

  function resolve(d: Dict | null, key: string): unknown {
    if (!d) return undefined;
    return key.split('.').reduce<unknown>((o, k) => {
      if (o && typeof o === 'object') return (o as Dict)[k];
      return undefined;
    }, d);
  }

  return function t(key: string, defaultValue?: string): string {
    const found = resolve(dict, key);
    if (typeof found === 'string') return found;
    const fb = resolve(fallback, key);
    if (typeof fb === 'string') return fb;
    return defaultValue ?? key;
  };
}
