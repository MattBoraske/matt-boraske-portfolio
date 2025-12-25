export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export interface FetchResult {
  articles: Article[];
  error?: string;
}

export async function fetchMediumArticles(
  username: string,
  limit: number = 4
): Promise<FetchResult> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const feedUrl = `https://medium.com/feed/@${username}`;
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`,
        {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error(`RSS feed error: ${data.message || 'Unknown error'}`);
      }

      const articles = data.items.slice(0, limit).map((item: any) => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        description: item.description
          .replace(/<[^>]*>/g, '')
          .substring(0, 150) + '...',
      }));

      return { articles };

    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, errorMessage);

      if (isLastAttempt) {
        return {
          articles: [],
          error: `Unable to fetch articles from Medium. Please visit my profile directly.`
        };
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  return { articles: [], error: 'Failed to fetch articles after multiple attempts' };
}
