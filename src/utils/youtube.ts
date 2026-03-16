/**
 * Convert bất kỳ dạng YouTube URL nào → embed URL
 *
 * Hỗ trợ:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 */
export function getYoutubeEmbedUrl(url?: string): string | undefined {
    if (!url) return undefined;
  
    try {
      const u = new URL(url);
  
      // youtu.be/VIDEO_ID
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.slice(1).split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : undefined;
      }
  
      // youtube.com/*
      if (u.hostname.includes('youtube.com')) {
  
        // Shorts
        if (u.pathname.startsWith('/shorts/')) {
          const id = u.pathname.split('/shorts/')[1].split('?')[0];
          return id ? `https://www.youtube.com/embed/${id}` : undefined;
        }
  
        // Embed sẵn
        if (u.pathname.startsWith('/embed/')) {
          return url;
        }
  
        // Watch
        const id = u.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : undefined;
      }
  
      return undefined;
  
    } catch {
      return undefined;
    }
  }