export const APEX_PATH = 'M7 24C7 24 9 10 16 8C23 6 25 16 25 16';

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <a
      href="/"
      aria-label="gpdata — home"
      className="grid shrink-0 place-items-center rounded-[8px] border border-card-border bg-card"
      style={{ width: size, height: size }}
    >
      <svg
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        viewBox="0 0 32 32"
        fill="none"
        className="text-red"
      >
        <title>gpdata</title>
        <path
          d={APEX_PATH}
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </a>
  );
}
