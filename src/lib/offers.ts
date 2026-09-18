const filters = document.querySelectorAll<HTMLButtonElement>('[data-offer-filter]');
const cards = document.querySelectorAll<HTMLElement>('[data-offer-category]');
const status = document.querySelector<HTMLElement>('.offer-filter-status');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.offerFilter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.offerCategory !== category; });
  const count = [...cards].filter(card => !card.hidden && card.classList.contains('offer-card')).length;
  if (status) status.textContent = `${count} عروض`;
}));
export {};
