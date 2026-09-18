const networkPanel = document.querySelector<HTMLElement>('.network-panel');
const networkReduced = matchMedia('(prefers-reduced-motion: reduce)');
if (
  networkPanel &&
  !networkReduced.matches &&
  'IntersectionObserver' in window
) {
  networkPanel.classList.add('network-pending');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      networkPanel.classList.replace('network-pending', 'network-arrived');
      observer.disconnect();
    },
    { threshold: 0.12 },
  );
  observer.observe(networkPanel);
  networkReduced.addEventListener('change', () => {
    if (!networkReduced.matches) return;
    networkPanel.classList.remove('network-pending', 'network-arrived');
    observer.disconnect();
  });
}
