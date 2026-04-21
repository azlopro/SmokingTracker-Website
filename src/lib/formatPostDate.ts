/** Format frontmatter date "YYYY-MM-DD" for display (matches legacy build-blog.js). */
export function formatPostDate(dateStr: string, lang: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (lang === 'en') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}
