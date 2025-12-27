import type { MediaItem } from '../../types/content';

interface TraktMovie {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    tmdb?: number;
  };
}

interface TraktShow {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    tmdb?: number;
  };
}

/**
 * Fetch currently watching movies and shows from Trakt watchlist
 * API: https://api.trakt.tv/sync/watchlist/movies and /shows
 */
export async function fetchTraktMedia(): Promise<MediaItem[]> {
  const clientId = import.meta.env.PUBLIC_TRAKT_API_KEY;

  if (!clientId) {
    console.warn('[Trakt] No client ID configured');
    return [];
  }

  const headers = {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': clientId
  };

  const items: MediaItem[] = [];

  try {
    // Fetch movies watchlist
    console.log('[Trakt] Fetching movies watchlist');
    const moviesResponse = await fetch('https://api.trakt.tv/sync/watchlist/movies', { headers });

    if (moviesResponse.ok) {
      const moviesData = await moviesResponse.json();

      for (const item of moviesData.slice(0, 3)) { // Limit to 3 items
        const movie: TraktMovie = item.movie;
        items.push({
          title: `${movie.title} (${movie.year})`,
          coverUrl: movie.ids.tmdb
            ? `https://image.tmdb.org/t/p/w500/movie/${movie.ids.tmdb}.jpg`
            : undefined,
          type: 'movie',
          status: 'current'
        });
      }
      console.log(`[Trakt] Fetched ${moviesData.length} movies`);
    } else {
      console.error(`[Trakt] Movies HTTP ${moviesResponse.status}`);
    }

    // Fetch shows watchlist
    console.log('[Trakt] Fetching shows watchlist');
    const showsResponse = await fetch('https://api.trakt.tv/sync/watchlist/shows', { headers });

    if (showsResponse.ok) {
      const showsData = await showsResponse.json();

      for (const item of showsData.slice(0, 3)) { // Limit to 3 items
        const show: TraktShow = item.show;
        items.push({
          title: `${show.title} (${show.year})`,
          coverUrl: show.ids.tmdb
            ? `https://image.tmdb.org/t/p/w500/tv/${show.ids.tmdb}.jpg`
            : undefined,
          type: 'show',
          status: 'current'
        });
      }
      console.log(`[Trakt] Fetched ${showsData.length} shows`);
    } else {
      console.error(`[Trakt] Shows HTTP ${showsResponse.status}`);
    }

    console.log(`[Trakt] Total items: ${items.length}`);
    return items;

  } catch (error) {
    console.error('[Trakt] Fetch error:', error);
    return [];
  }
}
