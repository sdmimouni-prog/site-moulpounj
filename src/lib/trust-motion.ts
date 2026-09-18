const reduceTrustMotion = matchMedia('(prefers-reduced-motion: reduce)');
const trustEntries = [
  ...document.querySelectorAll<HTMLElement>('.trust-entrance'),
];
if (!reduceTrustMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('awaiting-entry');
        entry.target.classList.add('trust-arrived');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  trustEntries.forEach((entry) => {
    entry.classList.add('awaiting-entry');
    observer.observe(entry);
  });
  reduceTrustMotion.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    trustEntries.forEach((entry) =>
      entry.classList.remove('awaiting-entry', 'trust-arrived'),
    );
  });
}
