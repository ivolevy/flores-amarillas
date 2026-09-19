import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

export function HeartOfFlowers() {
  const containerRef = useRef<SVGSVGElement>(null);
  
  const NUM_FLOWERS = 40;

  const heartPoints = useMemo(() => {
    return Array.from({ length: NUM_FLOWERS }).map((_, i) => {
      // t from 0 to 2PI
      const t = (i / NUM_FLOWERS) * Math.PI * 2;
      
      // Standard parametric equation for a heart
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      // Scale by 12 to fit around the text (which is ~250px wide)
      return { x: x * 12, y: y * 12 };
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Animate flowers popping in from the bottom tip of the heart
    // Since t=PI is the bottom tip, and it's exactly in the middle of the array (index 20),
    // staggering from "center" will make the flowers grow symmetrically up from the bottom!
    gsap.fromTo('.heart-flower', 
      { scale: 0, opacity: 0, rotation: -45 },
      { 
        scale: 1, 
        opacity: 1, 
        rotation: 0,
        duration: 0.8, 
        stagger: {
          each: 0.08,
          from: "center"
        }, 
        ease: 'back.out(2)',
        delay: 0.5
      }
    );
  }, []);

  return (
    <div className="abs-element w-full h-full flex items-center justify-center pointer-events-none z-0">
      {/* We use overflow-visible so the flowers can exceed the viewBox safely if needed */}
      <svg ref={containerRef} width="400" height="400" viewBox="-200 -200 400 400" className="overflow-visible">
        {heartPoints.map((pt, i) => (
          <g 
            key={i} 
            transform={`translate(${pt.x}, ${pt.y})`} 
            className="heart-flower" 
            style={{ transformOrigin: '0px 0px' }}
          >
            {/* Simple Yellow Flower */}
            {[...Array(8)].map((_, j) => (
              <ellipse 
                key={j} 
                cx="0" cy="-7" 
                rx="3" ry="9" 
                fill="#fbc02d" 
                transform={`rotate(${j * 45})`} 
              />
            ))}
            {/* Inner orange glow */}
            {[...Array(8)].map((_, j) => (
              <ellipse 
                key={`inner-${j}`} 
                cx="0" cy="-4" 
                rx="2" ry="5" 
                fill="#f57f17" 
                transform={`rotate(${j * 45 + 22.5})`} 
              />
            ))}
            {/* Dark brown center */}
            <circle cx="0" cy="0" r="4.5" fill="#4e342e" />
          </g>
        ))}
      </svg>
    </div>
  );
}
