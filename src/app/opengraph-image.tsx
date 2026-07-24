import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'polotno — Бесконечный холст для рисования и заметок';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px 60px',
          position: 'relative',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Header Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(to right, #ffffff, #93c5fd)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            polotno
          </div>
          <span
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #d97706)',
              color: 'white',
              fontSize: 20,
              fontWeight: 800,
              padding: '6px 16px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
            }}
          >
            PRO & FREE
          </span>
        </div>

        {/* Main Subtitle */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
            color: '#e2e8f0',
            marginBottom: '40px',
          }}
        >
          Бесконечный холст для рисования, эскизов и заметок
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['🎨 Эскизный стиль', '🟢 Меловая доска', '🚀 Без регистрации', '⚡ Совместная работа'].map(
            (tag, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#f8fafc',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
