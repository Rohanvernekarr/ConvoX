'use client';

export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
      
      {/* Larger Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:70px_120px] opacity-10"></div>
      
      {/* Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.6" 
              numOctaves="4" 
              stitchTiles="stitch"
            />
            <feColorMatrix 
              in="colorNoise" 
              type="saturate" 
              values="0"
            />
          </filter>
          <rect 
            width="100%" 
            height="100%" 
            filter="url(#noiseFilter)" 
            opacity="0.1"
          />
        </svg>
      </div>
    </div>
  );
}
