import { defineMiddleware } from 'astro:middleware';
import { detectLocale } from '~/i18n/geo';
import { LOCALES, type Lang } from '~/i18n/index';

const COOKIE = 'preferred-lang';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, redirect, cookies } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip Astro internals, API, and asset files
  if (path.startsWith('/_') || path.startsWith('/api') || path.includes('.')) {
    return next();
  }

  // User cookie preference always wins
  const stored = cookies.get(COOKIE)?.value;
  const validStored = stored && (LOCALES as readonly string[]).includes(stored)
    ? (stored as Lang)
    : null;

  // CF-IPCountry header from Cloudflare Workers (free, no API key)
  const country = request.headers.get('CF-IPCountry');
  const detected: Lang = validStored ?? detectLocale(country);

  // Determine locale from current URL path
  const currentLocale: Lang =
    path.startsWith('/id') ? 'id' :
    path.startsWith('/ar') ? 'ar' :
    path.startsWith('/zh') ? 'zh' : 'en';

  // Only redirect if user has NOT made a manual choice yet
  // (No cookie set means this is auto-detect's first run)
  if (!validStored && detected !== currentLocale) {
    const cleanPath = path.replace(/^\/(id|ar|zh)/, '') || '/';
    const target = detected === 'en' ? cleanPath : `/${detected}${cleanPath === '/' ? '' : cleanPath}`;
    return redirect(target, 302);
  }

  return next();
});
