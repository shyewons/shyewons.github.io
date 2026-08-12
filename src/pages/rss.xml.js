import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

export async function GET(context) {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return rss({
    title: `${site.name} Dev Notes`,
    description: site.description,
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.publishedAt,
      link: `/notes/${note.id}/`,
    })),
  });
}
