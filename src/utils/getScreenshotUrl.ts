/**
 * Generates a ScreenshotOne API URL for a given website URL
 *
 * @param url - The website URL to screenshot
 * @returns Screenshot API URL or null if no access key is configured
 */
export function getScreenshotUrl(url: string): string | null {
  const accessKey = import.meta.env.PUBLIC_SCREENSHOTONE_ACCESS_KEY;

  // Debug logging
  console.log('ScreenshotOne Access Key:', accessKey ? 'Found' : 'Not found');
  console.log('URL to screenshot:', url);

  // If no access key, return null (will fall back to placeholder)
  if (!accessKey || accessKey === 'your-access-key-here') {
    console.log('No valid access key, returning null');
    return null;
  }

  // Ensure URL has protocol
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  // Build ScreenshotOne API URL with optimal parameters
  const params = new URLSearchParams({
    access_key: accessKey,
    url: fullUrl,
    // Viewport settings
    viewport_width: '1920',
    viewport_height: '1080',
    device_scale_factor: '1',
    // Format settings
    format: 'jpg',
    image_quality: '80',
    // Block unwanted elements
    block_ads: 'true',
    block_cookie_banners: 'true',
    block_trackers: 'true',
    // Ensure full page loads
    delay: '3',
    // Cache settings (cache for 30 days)
    cache: 'true',
  });

  const screenshotUrl = `https://api.screenshotone.com/take?${params.toString()}`;
  console.log('Generated screenshot URL:', screenshotUrl);
  return screenshotUrl;
}
