import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Rafał Wielgus — Myślę. Buduję. Piszę.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Górna belka */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #181817',
            paddingBottom: '24px',
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
                width: '14px',
                height: '14px',
                backgroundColor: '#e85d3f',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#181817',
                fontFamily: 'sans-serif',
              }}
            >
              RAFAŁ WIELGUS / 2026
            </span>
          </div>

          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#e85d3f',
              fontFamily: 'sans-serif',
            }}
          >
            rafalwielgus.eu
          </span>
        </div>

        {/* Środek: Typografia główna */}
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
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'baseline',
              fontSize: 78,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              color: '#181817',
              fontFamily: 'serif',
            }}
          >
            <span>Myślę.&nbsp;</span>
            <span style={{ color: '#e85d3f' }}>Buduję.&nbsp;</span>
            <span>Piszę.</span>
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: '#514f49',
              maxWidth: '900px',
              fontFamily: 'sans-serif',
            }}
          >
            O ludziach, technologii, automatyce przemysłowej i psychologii decyzji. Bez pozy eksperta. Z ciekawością i warsztatową rzetelnością.
          </div>
        </div>

        {/* Stopka karty */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #181817',
            paddingTop: '24px',
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
                width: '44px',
                height: '44px',
                backgroundColor: '#181817',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f4f0e9',
                fontSize: 20,
                fontWeight: 900,
                fontFamily: 'serif',
              }}
            >
              RW
            </div>
            <span
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: '#181817',
                fontFamily: 'sans-serif',
              }}
            >
              Technik elektronik & praktyk automatyki
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#181817',
              color: '#ffffff',
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif',
            }}
          >
            Wejdź do serwisu &rarr;
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
