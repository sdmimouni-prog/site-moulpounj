const closingMotion = matchMedia('(prefers-reduced-motion: reduce)');
const closingTargets = [
  ...document.querySelectorAll<HTMLElement>('.closing-scene,.footer-light'),
];
if (!closingMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.replace('closing-pending', 'closing-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );
  closingTargets.forEach((target) => {
    target.classList.add('closing-pending');
    observer.observe(target);
  });
  closingMotion.addEventListener('change', () => {
    if (!closingMotion.matches) return;
    observer.disconnect();
    closingTargets.forEach((target) =>
      target.classList.remove('closing-pending', 'closing-visible'),
    );
  });
}
