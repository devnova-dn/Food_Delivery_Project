export default function Logo() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#059669" />
      
      {/* Inner Circle */}
      <circle cx="50" cy="50" r="42" fill="#10B981" />
      
      {/* Letter G */}
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="52"
        fontWeight="bold"
        fill="white"
      >
        G
      </text>
      
      {/* Leaf Accent */}
      <path
        d="M75 20C75 15 70 12 65 15C60 18 58 25 62 30C66 35 75 28 75 20Z"
        fill="#F59E0B"
      />
      
      {/* Small leaf detail */}
      <path
        d="M72 22C72 22 70 25 68 24C66 23 67 20 72 22Z"
        fill="#FBBF24"
      />
      
      {/* Sparkle */}
      <path
        d="M25 25L27 22L29 25L27 28L25 25Z"
        fill="#F59E0B"
      />
      <path
        d="M80 50L81.5 48L83 50L81.5 52L80 50Z"
        fill="#F59E0B"
      />
      <path
        d="M22 70L23 68L25 70L23 72L22 70Z"
        fill="#F59E0B"
      />
    </svg>
  );
}
