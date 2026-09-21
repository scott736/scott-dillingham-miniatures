/** Leonardo PhotoReal journal covers are not photographs of this studio. */
export const BLOG_COVER_CAPTION =
  'Illustration — not a photograph of this workshop.';

export function blogCoverAlt(scene: string | undefined, title: string): string {
  const detail = (scene ?? '').trim();
  const base = detail
    ? detail
    : `${title} — 1/12 scale miniature furniture article by Scott Dillingham`;
  if (base.startsWith(BLOG_COVER_CAPTION)) return base;
  return `${BLOG_COVER_CAPTION} ${base}`;
}
