import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://rafalwielgus.eu';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot',
          'Applebot-Extended',
          'meta-externalagent',
          'Bytespider',
          'cohere-ai',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
