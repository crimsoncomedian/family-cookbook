/** Small hand-drawn style flags and mountain line art for the family card. */

export function UsFlag({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 30 20" role="img" aria-label="United States flag">
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * (20 / 13)} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="13" height="10.8" fill="#14305a" />
    </svg>
  )
}

export function ChileFlag({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.66} viewBox="0 0 30 20" role="img" aria-label="Chilean flag">
      <rect width="30" height="20" fill="#fff" />
      <rect y="10" width="30" height="10" fill="#d52b1e" />
      <rect width="10" height="10" fill="#0039a6" />
      <polygon
        points="5,1.8 5.9,4.2 8.4,4.3 6.4,5.8 7.1,8.2 5,6.8 2.9,8.2 3.6,5.8 1.6,4.3 4.1,4.2"
        fill="#fff"
      />
    </svg>
  )
}

export function Mountains() {
  return (
    <svg viewBox="0 0 200 50" width="170" height="42" fill="none" stroke="#14305a" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M4 46 L40 14 L52 26 L66 8 L92 40 L110 22 L138 46" />
      <path d="M96 46 L128 18 L142 30 L160 10 L196 46" />
      <path d="M66 8 L61 17 L66 14 L70 19" />
      <path d="M160 10 L155 19 L160 16 L165 21" />
    </svg>
  )
}
