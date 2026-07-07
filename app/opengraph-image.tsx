import { ImageResponse } from 'next/og';
import { APEX_PATH } from '@/app/components/Logo';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'gpdata — Formula 1 Season & GP Data Archive';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: '#f4f2ed',
      }}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: rasterized server-side into a PNG OG image, never inserted into the page DOM */}
      <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
        <path
          d={APEX_PATH}
          stroke="#b6160f"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600, color: '#1c1a17' }}>
          gpdata
        </div>
        <div style={{ fontSize: 28, color: '#9a9286' }}>
          Formula 1 Season & GP Data Archive
        </div>
      </div>
    </div>,
    { ...size },
  );
}
