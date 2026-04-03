/**
 * HeroBackground — Quiet, product-accurate backdrop for CostShield hero.
 *
 * Design intent: barely-there. Whisper, not shout.
 *  • Faint cost chart with a single spike — tells the product story
 *  • Budget threshold dotted line
 *  • Minimal data nodes on the curve
 *  • Two soft radial glow pools that breathe slowly
 *  • All strokes/fills at very low opacity so hero copy stays king
 */
export function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

      {/* ── Soft ambient glow pools ── */}
      <div
        className="absolute left-[10%] top-[20%] w-[520px] h-[420px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          animation: 'hb-breathe 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[8%] bottom-[15%] w-[380px] h-[320px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)',
          animation: 'hb-breathe 13s ease-in-out infinite 3s',
        }}
      />

      {/* ── SVG illustration ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 680"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cost line gradient — fades in/out horizontally */}
          <linearGradient id="hb-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0" />
            <stop offset="15%"  stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="62%"  stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="68%"  stopColor="#ef4444" stopOpacity="0.45" />
            <stop offset="73%"  stopColor="#ef4444" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          {/* Subtle area fill beneath the curve */}
          <linearGradient id="hb-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#6366f1" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>

          {/* Grid line gradient — fade at edges */}
          <linearGradient id="hb-grid" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0" />
            <stop offset="15%"  stopColor="#6366f1" stopOpacity="0.07" />
            <stop offset="85%"  stopColor="#6366f1" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Faint horizontal grid lines (3 only) ── */}
        {[260, 360, 460].map((y, i) => (
          <line key={i} x1="60" y1={y} x2="1140" y2={y}
            stroke="url(#hb-grid)" strokeWidth="1"
          />
        ))}

        {/* ── Area fill under curve ── */}
        <path
          d="M 100 620 L 100 490 C 240 475 380 458 520 440 C 620 428 650 360 680 270 L 700 170 L 720 270 C 750 340 860 430 1100 460 L 1100 620 Z"
          fill="url(#hb-area)"
          style={{ animation: 'hb-fadein 2s ease-out forwards', opacity: 0 }}
        />

        {/* ── Main cost curve ── */}
        {/* Normal portion — left of spike */}
        <path
          d="M 100 490 C 240 475 380 458 520 440 C 620 428 650 360 680 270"
          stroke="url(#hb-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 800,
            strokeDashoffset: 800,
            animation: 'hb-draw 2s ease-out 0.3s forwards',
          }}
        />
        {/* Spike up */}
        <path
          d="M 680 270 L 700 168 L 720 270"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
          style={{
            strokeDasharray: 250,
            strokeDashoffset: 250,
            animation: 'hb-draw 0.5s ease-out 2.1s forwards',
          }}
        />
        {/* Tail after spike */}
        <path
          d="M 720 270 C 780 360 900 430 1100 460"
          stroke="url(#hb-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 500,
            strokeDashoffset: 500,
            animation: 'hb-draw 0.8s ease-out 2.5s forwards',
          }}
        />

        {/* ── Budget threshold line ── */}
        <line x1="100" y1="350" x2="1100" y2="350"
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="6 5"
          opacity="0.2"
          style={{ animation: 'hb-fadein 1s ease-out 1s forwards', opacity: 0 }}
        />

        {/* ── Data-point nodes on the curve ── */}
        {[
          { cx: 300, cy: 477, delay: '0.9s' },
          { cx: 520, cy: 440, delay: '1.3s' },
          { cx: 700, cy: 168, delay: '2.2s', accent: true },
          { cx: 920, cy: 443, delay: '2.8s' },
        ].map(({ cx, cy, delay, accent }, i) => (
          <g key={i} style={{ animation: `hb-popin 0.4s ease-out ${delay} forwards`, opacity: 0 }}>
            {/* Outer ring */}
            <circle cx={cx} cy={cy} r={accent ? 10 : 8}
              fill="none"
              stroke={accent ? '#ef4444' : '#6366f1'}
              strokeWidth="1"
              opacity={accent ? 0.25 : 0.18}
            />
            {/* Inner dot */}
            <circle cx={cx} cy={cy} r={accent ? 4 : 3}
              fill={accent ? '#ef4444' : '#6366f1'}
              opacity={accent ? 0.55 : 0.45}
            />
          </g>
        ))}

        {/* ── Spike alert pill (very subtle) ── */}
        <g style={{ animation: 'hb-popin 0.4s ease-out 2.4s forwards', opacity: 0 }}>
          <rect x="657" y="138" width="86" height="20" rx="10"
            fill="#ef4444" fillOpacity="0.07"
            stroke="#ef4444" strokeWidth="1" strokeOpacity="0.25"
          />
          <circle cx="671" cy="148" r="2.5" fill="#ef4444" opacity="0.5" />
          <text x="678" y="152"
            fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="600"
            fill="#ef4444" opacity="0.55" letterSpacing="0.08em">
            SPIKE
          </text>
        </g>

        {/* ── Very faint streaming particles (4 lines) ── */}
        {[
          { y: 120, delay: '0s',   dur: '6s' },
          { y: 580, delay: '2s',   dur: '7s' },
          { y: 640, delay: '1s',   dur: '5.5s' },
          { y:  70, delay: '3.5s', dur: '6.5s' },
        ].map(({ y, delay, dur }, i) => (
          <circle key={i} cx="0" cy={y} r="1.5"
            fill="#6366f1" opacity="0.18"
            style={{ animation: `hb-stream ${dur} linear ${delay} infinite` }}
          />
        ))}

      </svg>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes hb-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes hb-fadein {
          to { opacity: 1; }
        }
        @keyframes hb-popin {
          0%   { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes hb-breathe {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.12); opacity: 0.7; }
        }
        @keyframes hb-stream {
          0%   { transform: translateX(0px);    opacity: 0; }
          8%   { opacity: 0.3; }
          88%  { opacity: 0.15; }
          100% { transform: translateX(1200px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
