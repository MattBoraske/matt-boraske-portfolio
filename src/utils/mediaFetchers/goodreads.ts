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

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
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

      // Extract title (may or may not be CDATA wrapped)
      let titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      if (!titleMatch) {
        titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      }
      const title = titleMatch ? titleMatch[1] : 'Unknown Title';

      // Extract author (separate field, not in title)
      const authorMatch = itemXml.match(/<author_name>(.*?)<\/author_name>/);
      const author = authorMatch ? authorMatch[1] : undefined;

      // Extract book URL (may or may not be CDATA wrapped)
      let linkMatch = itemXml.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/);
      if (!linkMatch) {
        linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      }
      const bookUrl = linkMatch ? linkMatch[1] : undefined;

      // Extract cover image from book_large_image_url field
      const imgMatch = itemXml.match(/<book_large_image_url><!\[CDATA\[(.*?)\]\]><\/book_large_image_url>/);
      const coverUrl = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title,
        author,
        coverUrl,
        type: 'book',
        status: 'current'
      });

      // Limit to 4 most recent books
      if (items.length >= 4) break;
    }

    console.log(`[Goodreads] Fetched ${items.length} books`);
    return items;

  } catch (error) {
    console.error('[Goodreads] Fetch error:', error);
    return [];
  }
}
