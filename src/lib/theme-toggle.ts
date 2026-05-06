type Theme = 'dark' | 'light';

function getCurrentTheme(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
}

function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // localStorage may be blocked in private mode — ignore
  }
}

const button = document.getElementById('themeToggle');
if (button) {
  button.addEventListener('click', () => {
    const next: Theme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    button.setAttribute('aria-pressed', String(next === 'dark'));
  });

  // Initial aria-pressed state matches current theme
  button.setAttribute('aria-pressed', String(getCurrentTheme() === 'dark'));
}

// Sync across open tabs
window.addEventListener('storage', (e) => {
  if (e.key !== 'theme' || !e.newValue) return;
  const next = e.newValue as Theme;
  document.documentElement.setAttribute('data-theme', next);
  button?.setAttribute('aria-pressed', String(next === 'dark'));
});

export {};
