function BrandWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 right-0 z-0 select-none opacity-[0.13] dark:opacity-[0.17]"
    >
      <svg
        width="600"
        height="600"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="tf-watermark"
            x1="10"
            y1="90"
            x2="90"
            y2="10"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M14 74 L38 50 L52 62 L82 30"
          stroke="url(#tf-watermark)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M66 26 L86 26 L86 46"
          stroke="url(#tf-watermark)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default BrandWatermark;
