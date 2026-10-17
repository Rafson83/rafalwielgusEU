import { getEffectivePublicPosts } from '@/lib/posts-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = 'https://rafalwielgus.eu';
  const posts = await getEffectivePublicPosts({ includeScheduled: false });

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.createdAt).toUTCString();
      const description = post.seoDescription || post.content.slice(0, 280).replace(/[#*`_]/g, '').trim() + '...';
      const cleanCategory = post.category || 'Ogólne';

      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${cleanCategory}]]></category>
      <description><![CDATA[${description}]]></description>
      <author>hello@rafalwielgus.eu (Rafał Wielgus)</author>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rafał Wielgus — Blog &amp; Notatnik</title>
    <link>${baseUrl}/blog</link>
    <description>Autorskie eseje i notatki o psychologii decyzji, technologii, automatyzacji i rzemiośle pracy. Bez lania wody, z konkretem i warsztatową rzetelnością.</description>
    <language>pl-PL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  });
}
