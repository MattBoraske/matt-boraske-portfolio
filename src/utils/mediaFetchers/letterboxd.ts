import type { MediaItem } from '../../types/content';

/**
 * Fetch recent movie activity from Letterboxd RSS feed
 * RSS endpoint: https://letterboxd.com/{username}/rss/
 */
export async function fetchLetterboxdMovies(): Promise<MediaItem[]> {
  const username = import.meta.env.PUBLIC_LETTERBOXD_USERNAME;

  if (!username) {
    console.warn('[Letterboxd] No username configured');
    return [];
  }

  try {
    const url = `https://letterboxd.com/${username}/rss/`;
    console.log(`[Letterboxd] Fetching from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[Letterboxd] HTTP ${response.status}: ${response.statusText}`);
      return [];
    }

    const xmlText = await response.text();

    // Parse XML manually
    const items: MediaItem[] = [];
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);

    // Get current date for filtering recent entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const match of itemMatches) {
      const itemXml = match[1];

      // Extract published date
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      if (pubDateMatch) {
        const pubDate = new Date(pubDateMatch[1]);
        if (pubDate < sevenDaysAgo) continue; // Skip old entries
      }

      // Extract title (format: "Movie Title, Year")
      const titleMatch = itemXml.match(/<letterboxd:filmTitle>(.*?)<\/letterboxd:filmTitle>/);
      const filmTitle = titleMatch ? titleMatch[1] : null;

      const yearMatch = itemXml.match(/<letterboxd:filmYear>(.*?)<\/letterboxd:filmYear>/);
      const year = yearMatch ? yearMatch[1] : '';

      if (!filmTitle) continue;

      // Extract link
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const movieUrl = linkMatch ? linkMatch[1] : undefined;

      // Extract image from description
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      const description = descMatch ? descMatch[1] : '';
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      const coverUrl = imgMatch ? imgMatch[1] : undefined;

      items.push({
        title: year ? `${filmTitle} (${year})` : filmTitle,
        coverUrl,
        type: 'movie',
        status: 'current'
      });

      // Limit to 3 recent movies
      if (items.length >= 3) break;
    }

    console.log(`[Letterboxd] Fetched ${items.length} recent movies`);
    return items;

  } catch (error) {
    console.error('[Letterboxd] Fetch error:', error);
    return [];
  }
}
