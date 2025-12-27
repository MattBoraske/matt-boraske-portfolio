import type { MediaItem } from '../../types/content';

/**
 * Fetch currently reading books from Goodreads RSS feed
 * RSS endpoint: https://www.goodreads.com/review/list_rss/{userId}?shelf=currently-reading
 */
export async function fetchGoodreadsBooks(): Promise<MediaItem[]> {
  const userId = import.meta.env.PUBLIC_GOODREADS_USER_ID;

  if (!userId) {
    console.warn('[Goodreads] No user ID configured');
    return [];
  }

  try {
    const url = `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`;
    console.log(`[Goodreads] Fetching from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[Goodreads] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const xmlText = await response.text();

    // Parse XML manually (Astro build environment)
    const items: MediaItem[] = [];
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemXml = match[1];

      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const title = titleMatch ? titleMatch[1] : 'Unknown Title';

      // Extract author from title (format: "Title by Author")
      const authorMatch = title.match(/\s+by\s+(.+)$/);
      const bookTitle = authorMatch ? title.replace(/\s+by\s+.+$/, '') : title;
      const author = authorMatch ? authorMatch[1] : undefined;

      // Extract book URL
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const bookUrl = linkMatch ? linkMatch[1] : undefined;

      // Extract cover image from description
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      const description = descMatch ? descMatch[1] : '';
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      const coverUrl = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title: bookTitle,
        author,
        coverUrl,
        type: 'book',
        status: 'current'
      });
    }

    console.log(`[Goodreads] Fetched ${items.length} books`);
    return items;

  } catch (error) {
    console.error('[Goodreads] Fetch error:', error);
    return [];
  }
}
