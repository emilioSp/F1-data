import { ImageResponse } from 'next/og';
import { APEX_PATH } from '@/app/components/Logo';

export const size = { width: 32, height: 32 };

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#f4f2ed',
        borderRadius: 7,
      }}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: rasterized server-side into a PNG favicon, never inserted into the page DOM */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d={APEX_PATH}
          stroke="#b6160f"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    { ...size },
  );
}
