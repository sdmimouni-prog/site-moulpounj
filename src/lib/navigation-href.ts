/** Preserve homepage anchors; resolve shared navigation from inner pages. */
export function navigationHref(
  href: string | undefined,
  pathname: string,
  category?: string,
) {
  if (category === 'matelas') return '/matelas';
  if (href === '#conseils') return '/conseils';
  if (href === '#magasins') return '/nos-magasins';
  if (category === 'salon') return '/salon-marocain#banquettes';
  if (!href || pathname === '/') return href;
  return href.startsWith('#') ? `/${href}` : href;
}
