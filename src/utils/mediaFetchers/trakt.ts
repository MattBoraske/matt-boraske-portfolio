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
 * Fetch poster image URL from TMDB API
 */
async function fetchTMDBPoster(tmdbId: number, type: 'tv' | 'movie', apiKey: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.poster_path) {
        return `https://image.tmdb.org/t/p/w500${data.poster_path}`;
      }
    }
  } catch (error) {
    console.error(`[TMDB] Error fetching ${type} ${tmdbId}:`, error);
  }

  return undefined;
}

/**
 * Fetch recently watched movies and shows from Trakt history
 * API: https://api.trakt.tv/users/{username}/history/movies and /shows
 */
export async function fetchTraktMedia(): Promise<MediaItem[]> {
  const clientId = import.meta.env.PUBLIC_TRAKT_API_KEY;
  const username = import.meta.env.PUBLIC_TRAKT_USERNAME;
  const tmdbApiKey = import.meta.env.PUBLIC_TMDB_API_KEY;

  if (!clientId) {
    console.warn('[Trakt] No client ID configured');
    return [];
  }

  if (!username) {
    console.warn('[Trakt] No username configured');
    return [];
  }

  if (!tmdbApiKey) {
    console.warn('[Trakt] No TMDB API key configured - images will not be available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': clientId
  };

  const items: MediaItem[] = [];

  try {
    // Fetch watch history for shows (get more to ensure we have 5 unique shows)
    console.log('[Trakt] Fetching shows watch history');
    const showsResponse = await fetch(`https://api.trakt.tv/users/${username}/history/shows?limit=50`, { headers });

    if (showsResponse.ok) {
      const showsData = await showsResponse.json();
      const uniqueShows = new Map<number, MediaItem>();

      for (const item of showsData) {
        const show: TraktShow = item.show;

        // Only add if we haven't seen this show yet
        if (!uniqueShows.has(show.ids.trakt)) {
          // Fetch poster from TMDB if available
          let coverUrl: string | undefined;
          if (show.ids.tmdb && tmdbApiKey) {
            coverUrl = await fetchTMDBPoster(show.ids.tmdb, 'tv', tmdbApiKey);
          }

          uniqueShows.set(show.ids.trakt, {
            title: `${show.title} (${show.year})`,
            coverUrl,
            type: 'show',
            status: 'current'
          });
        }

        // Stop once we have 5 unique shows
        if (uniqueShows.size >= 5) break;
      }

      items.push(...Array.from(uniqueShows.values()));
      console.log(`[Trakt] Fetched ${uniqueShows.size} unique shows`);
    } else {
      console.error(`[Trakt] Shows HTTP ${showsResponse.status}`);
    }

    // Fetch watch history for movies (optional, keeping for future use)
    console.log('[Trakt] Fetching movies watch history');
    const moviesResponse = await fetch(`https://api.trakt.tv/users/${username}/history/movies?limit=50`, { headers });

    if (moviesResponse.ok) {
      const moviesData = await moviesResponse.json();
      const uniqueMovies = new Map<number, MediaItem>();

      for (const item of moviesData) {
        const movie: TraktMovie = item.movie;

        // Only add if we haven't seen this movie yet
        if (!uniqueMovies.has(movie.ids.trakt)) {
          // Fetch poster from TMDB if available
          let coverUrl: string | undefined;
          if (movie.ids.tmdb && tmdbApiKey) {
            coverUrl = await fetchTMDBPoster(movie.ids.tmdb, 'movie', tmdbApiKey);
          }

          uniqueMovies.set(movie.ids.trakt, {
            title: `${movie.title} (${movie.year})`,
            coverUrl,
            type: 'movie',
            status: 'current'
          });
        }

        // Stop once we have 5 unique movies
        if (uniqueMovies.size >= 5) break;
      }

      items.push(...Array.from(uniqueMovies.values()));
      console.log(`[Trakt] Fetched ${uniqueMovies.size} unique movies`);
    } else {
      console.error(`[Trakt] Movies HTTP ${moviesResponse.status}`);
    }

    console.log(`[Trakt] Total items: ${items.length}`);
    return items;

  } catch (error) {
    console.error('[Trakt] Fetch error:', error);
    return [];
  }
}
