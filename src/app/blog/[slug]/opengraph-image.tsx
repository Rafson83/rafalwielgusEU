import { ImageResponse } from 'next/og';
import { getEffectivePostBySlug } from '@/lib/posts-server';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getEffectivePostBySlug(slug, { isPreview: true });

  const title = post?.title || 'Esej i notatnik warsztatowy — Rafał Wielgus';
  const category = (post?.category || 'Blog & Eseje').toUpperCase();
  const description =
    post?.seoDescription ||
    (post?.content
      ? post.content.slice(0, 150).replace(/[#*`_]/g, '').trim() + '...'
      : 'O technologii, psychologii pracy, automatyce przemysłowej i idei Long-Life Learning.');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#f4f0e9',
          border: '18px solid #181817',
          padding: '60px 70px',
          boxSizing: 'border-box',
        }}
      >
        {/* Górna belka: kategoria i domena */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #181817',
            paddingBottom: '22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                backgroundColor: '#e85d3f',
                color: '#ffffff',
                padding: '6px 14px',
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
              }}
            >
              {category}
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: '#514f49',
                fontFamily: 'sans-serif',
              }}
            >
              • Esej & Notatnik
            </span>
          </div>

          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#181817',
              fontFamily: 'sans-serif',
            }}
          >
            rafalwielgus.eu
          </span>
        </div>

        {/* Środek: Tytuł artykułu i zarys */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            margin: '20px 0',
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? 54 : 64,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#181817',
              fontFamily: 'serif',
              maxHeight: '220px',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              color: '#514f49',
              maxWidth: '960px',
              fontFamily: 'sans-serif',
            }}
          >
            {description}
          </div>
        </div>

        {/* Dolna belka: Autor i wezwanie */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #181817',
            paddingTop: '22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#181817',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f4f0e9',
                fontSize: 18,
                fontWeight: 900,
                fontFamily: 'serif',
              }}
            >
              RW
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: '#181817',
                  fontFamily: 'serif',
                }}
              >
                Rafał Wielgus
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#514f49',
                  fontFamily: 'sans-serif',
                }}
              >
                Technik elektronik • Praktyk automatyki przemysłowej & jakości
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#e85d3f',
              fontFamily: 'sans-serif',
            }}
          >
            Czytaj artykuł &rarr;
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
