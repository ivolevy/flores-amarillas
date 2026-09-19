import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  onAnimationComplete: () => void;
}

export function SimpleBouquet({ onAnimationComplete }: Props) {
  const containerRef = useRef<SVGSVGElement>(null);

  const branches = [
    { path: "M100,200 Q90,150 100,100", length: 110, fx: 100, fy: 100 }, // Center
    { path: "M100,180 Q60,130 40,80", length: 130, fx: 40, fy: 80 },    // Left 1
    { path: "M100,175 Q140,120 160,75", length: 130, fx: 160, fy: 75 },  // Right 1
    { path: "M100,150 Q70,90 60,40", length: 120, fx: 60, fy: 40 },     // Left 2
    { path: "M100,145 Q130,80 140,35", length: 120, fx: 140, fy: 35 },   // Right 2
    { path: "M100,120 Q95,70 90,20", length: 110, fx: 90, fy: 20 },     // Center-left high
    { path: "M100,130 Q110,70 120,25", length: 110, fx: 120, fy: 25 },  // Center-right high
    { path: "M100,165 Q40,160 20,120", length: 100, fx: 20, fy: 120 },  // Far left low
    { path: "M100,160 Q160,150 180,110", length: 100, fx: 180, fy: 110 } // Far right low
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onAnimationComplete
      });

      // Initial state
      gsap.set('.stem', { strokeDasharray: 200, strokeDashoffset: 200 });
      gsap.set('.flower-group', { scale: 0, opacity: 0 });

      // Animate stems growing up
      tl.to('.stem', {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'power2.inOut',
        stagger: 0.2
      });

      // Animate flowers blooming
      tl.to('.flower-group', {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'back.out(1.5)',
        stagger: 0.15
      }, "-=1.5");

      // Continuous gentle wind effect on flowers
      gsap.to('.flower-group', {
        rotate: '8deg',
        transformOrigin: 'center center',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { amount: 1.5, from: "random" }
      });

    }, containerRef);
    return () => ctx.revert();
  }, [onAnimationComplete]);

  return (
    <svg 
      ref={containerRef} 
      viewBox="0 0 200 200" 
      style={{ 
        width: '100%', 
        maxWidth: '400px', 
        height: 'auto', 
        overflow: 'visible',
        filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.05))' 
      }}
    >
      {/* Stems */}
      <g>
        {branches.map((b, i) => (
          <path 
            key={`stem-${i}`}
            className="stem"
            d={b.path}
            fill="none"
            stroke="#6b8e5c"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Flowers */}
      <g>
        {branches.map((b, i) => (
          <g 
            key={`flower-${i}`}
            className="flower-group"
            transform={`translate(${b.fx}, ${b.fy})`}
          >
            {/* Flower petals */}
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(0)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(45)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(90)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(135)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(180)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(225)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(270)" />
            <path d="M0,0 C-15,-20 15,-20 0,0" fill="#f5d045" transform="rotate(315)" />
            {/* Center */}
            <circle cx="0" cy="0" r="5" fill="#e0b82b" />
          </g>
        ))}
      </g>
    </svg>
  );
}
