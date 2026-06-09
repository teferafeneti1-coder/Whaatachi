// Whaatachi Logo — two people forming a heart shape
// Matches the brand logo: two figures with round heads forming a heart silhouette
// Use size prop to scale uniformly

export default function WhaatachiLogo({ size = 42, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E8C" />
          <stop offset="60%" stopColor="#C2185B" />
          <stop offset="100%" stopColor="#AD1457" />
        </linearGradient>
        <linearGradient id="logoGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F06292" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>

      {/* Left person head */}
      <circle cx="34" cy="18" r="9" fill="url(#logoGrad)" />

      {/* Right person head */}
      <circle cx="66" cy="18" r="9" fill="url(#logoGradLight)" />

      {/* Left person body + left half of heart */}
      <path
        d="M34 28
           C34 28 18 35 18 52
           C18 62 26 70 36 74
           C40 76 44 78 50 83
           C50 83 48 75 46 68
           C42 58 38 50 36 42
           C35 37 34 33 34 28 Z"
        fill="url(#logoGrad)"
      />

      {/* Right person body + right half of heart */}
      <path
        d="M66 28
           C66 28 82 35 82 52
           C82 62 74 70 64 74
           C60 76 56 78 50 83
           C50 83 52 75 54 68
           C58 58 62 50 64 42
           C65 37 66 33 66 28 Z"
        fill="url(#logoGradLight)"
      />

      {/* White gap between the two figures (the W shape in the middle) */}
      <path
        d="M50 83
           C50 83 44 70 40 58
           C38 52 37 46 36 40
           C37 46 42 52 50 56
           C58 52 63 46 64 40
           C63 46 62 52 60 58
           C56 70 50 83 50 83 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}
