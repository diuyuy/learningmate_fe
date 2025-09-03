export const extractYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);

    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null;
    }

    const host = u.hostname.replace(/^www\./, '');
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;

      const m = u.pathname.match(/^\/(embed|shorts)\/([^/?#]+)/);
      if (m) return m[2];
    }

    return null;
  } catch {
    return null;
  }
};
