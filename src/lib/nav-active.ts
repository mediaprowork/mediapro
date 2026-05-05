const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('.nav-links a, .sidebar-links a')
);

function setActive(pathname: string, hash: string) {
  links.forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    let isActive = false;

    if (href.includes('#')) {
      // Section link e.g. /#about — active only when hash matches
      isActive = hash !== '' && hash === '#' + href.split('#')[1];
    } else {
      // Page link e.g. / or /contact — active only when pathname matches AND no hash
      isActive = pathname === href && hash === '';
    }

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

// Initial state
setActive(window.location.pathname, window.location.hash);

// Update on hash change (clicking nav links on homepage)
window.addEventListener('hashchange', () =>
  setActive(window.location.pathname, window.location.hash)
);

// IntersectionObserver only runs on homepage where sections exist
const sectionIds = ['top', 'about', 'services', 'contact'];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean) as HTMLElement[];

if (sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            const href = link.getAttribute('href') ?? '';
            const isMatch =
              id === 'top'
                ? href === '/'   // Home link active when #top visible
                : href.includes(`#${id}`); // Section link active when its section visible
            if (isMatch) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
          break;
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((el) => io.observe(el));
}

export {};
