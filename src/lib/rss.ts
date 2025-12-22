export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export async function fetchMediumArticles(username: string, limit: number = 4): Promise<Article[]> {
  try {
    // Medium RSS feed URL
    const feedUrl = `https://medium.com/feed/@${username}`;

    // Use a CORS proxy for client-side fetching, or fetch directly at build time
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Invalid RSS feed response');
    }

    return data.items.slice(0, limit).map((item: any) => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      description: item.description
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .substring(0, 150) + '...',
    }));
  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return [];
  }
}
