import { getEffectivePublicPosts } from './posts-server';

export const INDEXNOW_KEY = 'c7e2b8f419d84659a850e02c612999da';
export const SITE_HOST = 'rafalwielgus.eu';

export interface IndexNowResponse {
  success: boolean;
  status?: number;
  message: string;
  submittedUrls: string[];
}

export async function submitToIndexNow(customUrls?: string[]): Promise<IndexNowResponse> {
  const baseUrl = `https://${SITE_HOST}`;

  let urlList = customUrls;

  if (!urlList || urlList.length === 0) {
    const publishedPosts = await getEffectivePublicPosts({ includeScheduled: false });
    const postUrls = publishedPosts.map((p) => `${baseUrl}/blog/${p.slug}`);

    urlList = [
      baseUrl,
      `${baseUrl}/blog`,
      `${baseUrl}/o-mnie`,
      `${baseUrl}/produkty`,
      `${baseUrl}/produkty/kod-kariery`,
      `${baseUrl}/rss.xml`,
      `${baseUrl}/sitemap.xml`,
      ...postUrls,
    ];
  }

  // Deduplikacja adresów
  const uniqueUrls = Array.from(new Set(urlList));

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList: uniqueUrls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // 200 = OK, 202 = Accepted (standard response from IndexNow)
    if (res.ok || res.status === 200 || res.status === 202) {
      return {
        success: true,
        status: res.status,
        message: `Pomyślnie zgłoszono ${uniqueUrls.length} adresów URL do wyszukiwarek (Bing, Yandex, Seznam, Naver) przez IndexNow.`,
        submittedUrls: uniqueUrls,
      };
    }

    const errText = await res.text().catch(() => '');
    return {
      success: false,
      status: res.status,
      message: `Serwer IndexNow zwrócił kod ${res.status}: ${errText || 'Brak dodatkowych informacji'}`,
      submittedUrls: uniqueUrls,
    };
  } catch (error) {
    return {
      success: false,
      message: `Nie udało się połączyć z API IndexNow: ${error instanceof Error ? error.message : String(error)}`,
      submittedUrls: uniqueUrls,
    };
  }
}
