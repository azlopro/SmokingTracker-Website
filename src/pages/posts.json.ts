import { getCollection } from 'astro:content';
import { formatPostDate } from '../lib/formatPostDate';

export const prerender = true;

export async function GET() {
  const allPosts = await getCollection('blog');
  const posts = allPosts
    .filter((post) => post.data.lang === 'en')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map((post) => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      image: post.data.image ?? null,
      category: post.data.category,
      date: post.data.date,
      dateFormatted: formatPostDate(post.data.date, post.data.lang),
      author: post.data.author,
      readTime: post.data.readTime,
      lang: post.data.lang,
      featured: post.data.featured ?? false,
    }));

  return new Response(JSON.stringify(posts, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
