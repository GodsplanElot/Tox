import "./OfflineState.css";

const SkullMarsGraphic = () => (
  <svg
    className="offline-skull"
    viewBox="0 0 320 260"
    role="img"
    aria-label="Rugged skull drifting through space"
  >
    <defs>
      <linearGradient id="offlineMars" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffb000" />
        <stop offset="0.52" stopColor="#ff4d2d" />
        <stop offset="1" stopColor="#6b1f12" />
      </linearGradient>
      <linearGradient id="offlineBone" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f6f0df" />
        <stop offset="0.52" stopColor="#b8b0a0" />
        <stop offset="1" stopColor="#5d5a57" />
      </linearGradient>
      <filter id="offlineGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <circle cx="250" cy="52" r="30" fill="url(#offlineMars)" opacity="0.92" />
    <path
      d="M231 45c14 9 31 8 48-2M230 58c18 7 36 7 56 0"
      fill="none"
      stroke="#3a0f09"
      strokeWidth="3"
      opacity="0.45"
    />
    <path
      d="M49 191c58 17 131 19 222 2"
      fill="none"
      stroke="#ffb000"
      strokeDasharray="7 12"
      strokeLinecap="round"
      strokeWidth="4"
      opacity="0.55"
    />
    <g filter="url(#offlineGlow)">
      <path
        d="M84 86c1-39 33-67 76-67 45 0 78 28 79 69 1 21-8 38-23 52-8 7-11 15-11 26v27c0 14-11 25-25 25h-45c-14 0-25-11-25-25v-27c0-11-4-19-12-27-11-11-15-29-14-53z"
        fill="url(#offlineBone)"
        stroke="#1d1d22"
        strokeWidth="8"
      />
      <path
        d="M97 77c10-23 33-39 65-39 25 0 47 10 59 29-15-11-36-17-58-17-29 0-51 10-66 27z"
        fill="#ffffff"
        opacity="0.28"
      />
      <path
        d="M111 116c9-19 39-19 49-2 5 9-1 21-12 23l-20 3c-14 2-23-11-17-24zM176 114c10-17 40-16 48 3 6 13-4 26-18 23l-19-4c-11-2-17-13-11-22z"
        fill="#101015"
      />
      <path
        d="M151 152l11-20 13 20c3 5-1 12-7 12h-10c-6 0-10-7-7-12z"
        fill="#111116"
      />
      <path
        d="M126 180h70M132 197h58"
        stroke="#17171d"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M147 174v35M165 173v38M183 174v35"
        stroke="#2a292d"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M78 67l-20-19M235 72l24-16M95 215l-18 21M224 211l18 23"
        stroke="#d7d0c4"
        strokeLinecap="round"
        strokeWidth="9"
      />
      <path
        d="M63 41l-12-11M266 50l14-9M71 241l-10 12M248 239l10 12"
        stroke="#2d2d33"
        strokeLinecap="round"
        strokeWidth="7"
      />
    </g>
  </svg>
);

const OfflineState = () => {
  return (
    <section className="offline-state" aria-live="polite">
      <div className="offline-state__panel">
        <SkullMarsGraphic />
        <span className="offline-state__kicker">Signal lost</span>
        <h1>Your internet connection has gone to Mars.</h1>
        <p>
          ToxicReels is still here. Reconnect your network and punch back in.
        </p>
        <button type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    </section>
  );
};

export default OfflineState;
