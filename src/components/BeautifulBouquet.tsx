import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export function BeautifulBouquet() {
  const svgRef = useRef<SVGSVGElement>(null);

  const flowers = [
    { x: 150, y: 70, scale: 1.1, r: -5 },    // Top center
    { x: 90, y: 120, scale: 1.1, r: -15 },   // Top left
    { x: 210, y: 120, scale: 1.1, r: 15 },   // Top right
    { x: 50, y: 190, scale: 1.0, r: -30 },   // Mid far left
    { x: 150, y: 170, scale: 1.4, r: 0 },    // Center (hero)
    { x: 250, y: 190, scale: 1.0, r: 30 },   // Mid far right
    { x: 90, y: 240, scale: 1.1, r: -10 },   // Bottom left
    { x: 210, y: 240, scale: 1.1, r: 10 },   // Bottom right
  ];

  const tiePoint = { x: 150, y: 340 };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial state
      gsap.set('.bouquet-stem', { strokeDasharray: 400, strokeDashoffset: 400 });
      gsap.set('.flower-unit', { scale: 0, opacity: 0, transformOrigin: 'center center' });
      gsap.set('.bouquet-wrapper, .bouquet-leaf', { opacity: 0, scale: 0.8, transformOrigin: 'center 340px' });

      // 1. Draw Stems from bottom
      tl.to('.bouquet-stem-bot', {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        stagger: 0.1
      }, 0);

      tl.to('.bouquet-stem-top', {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.out',
        stagger: 0.1
      }, 1);

      // 2. Show Wrapper and Leaves
      tl.to('.bouquet-leaf', {
        opacity: 0.9,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.2
      }, 1.5);

      tl.to('.bouquet-wrapper', {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'back.out(1.2)'
      }, 2);

      // 3. Bloom Sunflowers
      tl.to('.flower-unit', {
        scale: (i) => flowers[i].scale,
        opacity: 1,
        duration: 1.5,
        ease: 'back.out(1.5)',
        stagger: 0.15
      }, 2.5);

      // 4. Start gentle floating effect
      tl.add(() => {
        gsap.to('.bouquet-group', {
          y: -10,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });

        gsap.to('.flower-unit', {
          rotate: '+=3deg',
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: { amount: 2, from: "random" }
        });
      }, "+=0.5");

    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg 
      ref={svgRef} 
      viewBox="0 0 300 450" 
      style={{ 
        width: '100%', 
        maxWidth: '450px', 
        height: 'auto', 
        overflow: 'visible',
        filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.5))' 
      }}
    >
      <defs>
        <radialGradient id="sunflower-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3e2723" />
          <stop offset="80%" stopColor="#21110a" />
          <stop offset="100%" stopColor="#1a0c06" />
        </radialGradient>

        <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2e7d32" />
          <stop offset="100%" stopColor="#1b5e20" />
        </linearGradient>
      </defs>

      <g className="bouquet-group">
        {/* Background Leaves */}
        <path className="bouquet-leaf" d={`M${tiePoint.x},${tiePoint.y} Q40,220 20,150 Q100,280 ${tiePoint.x},${tiePoint.y}`} fill="#1b5e20" />
        <path className="bouquet-leaf" d={`M${tiePoint.x},${tiePoint.y} Q260,220 280,150 Q200,280 ${tiePoint.x},${tiePoint.y}`} fill="#1b5e20" />
        
        {/* Stems connecting flowers to tie point */}
        {flowers.map((f, i) => (
          <path 
            key={`stem-top-${i}`}
            className="bouquet-stem bouquet-stem-top"
            d={`M${tiePoint.x},${tiePoint.y} Q${(f.x + tiePoint.x)/2 + (Math.random()*20-10)},${(f.y + tiePoint.y)/2} ${f.x},${f.y}`}
            fill="none"
            stroke="url(#stem-grad)"
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}

        {/* Paper Wrapper Back */}
        <g className="bouquet-wrapper">
          <path d="M20,150 L280,150 L190,360 L110,360 Z" fill="#4a148c" />
        </g>

        {/* Stems below tie point (roots/base) */}
        {flowers.map((_, i) => (
          <path 
            key={`stem-bot-${i}`}
            className="bouquet-stem bouquet-stem-bot"
            d={`M${tiePoint.x + (Math.random()*30-15)},430 Q${tiePoint.x + (Math.random()*10-5)},380 ${tiePoint.x},${tiePoint.y}`}
            fill="none"
            stroke="url(#stem-grad)"
            strokeWidth={7}
            strokeLinecap="round"
          />
        ))}

        {/* Paper Wrapper Front Folds */}
        <g className="bouquet-wrapper">
          <path d="M10,180 L150,320 L290,180 L190,370 L110,370 Z" fill="#7b1fa2" opacity="0.95"/>
          <path d="M90,320 L210,320 L180,400 L120,400 Z" fill="#9c27b0" />
          {/* Paper highlights */}
          <path d="M10,180 L150,320 L110,370" fill="none" stroke="#ce93d8" strokeWidth="2" opacity="0.4" />
          <path d="M290,180 L150,320 L190,370" fill="none" stroke="#ce93d8" strokeWidth="2" opacity="0.4" />
        </g>

        {/* Sunflowers */}
        {flowers.map((f, i) => (
          <g 
            key={`flower-${i}`} 
            className="flower-unit"
            transform={`translate(${f.x}, ${f.y}) rotate(${f.r})`}
          >
            {/* Back petals (Orange/Dark Yellow) */}
            {Array.from({ length: 24 }).map((_, p) => (
              <path 
                key={`back-${p}`}
                d="M0,0 Q-12,-30 0,-55 Q12,-30 0,0" 
                fill="#f57f17" 
                transform={`rotate(${p * 15 + 7.5})`} 
              />
            ))}
            {/* Front petals (Bright Yellow) */}
            {Array.from({ length: 24 }).map((_, p) => (
              <path 
                key={`front-${p}`}
                d="M0,0 Q-8,-25 0,-45 Q8,-25 0,0" 
                fill="#fbc02d" 
                transform={`rotate(${p * 15})`} 
              />
            ))}
            {/* Huge Dark Center */}
            <circle r="22" fill="url(#sunflower-center)" />
            {/* Inner Seed Details */}
            {Array.from({ length: 20 }).map((_, p) => (
              <circle 
                key={`dot-${p}`} 
                cx={Math.cos(p * 18 * Math.PI / 180) * 14} 
                cy={Math.sin(p * 18 * Math.PI / 180) * 14} 
                r="1.5" 
                fill="#fbc02d" 
                opacity="0.8" 
              />
            ))}
            {Array.from({ length: 12 }).map((_, p) => (
              <circle 
                key={`dot2-${p}`} 
                cx={Math.cos(p * 30 * Math.PI / 180) * 8} 
                cy={Math.sin(p * 30 * Math.PI / 180) * 8} 
                r="1.2" 
                fill="#f9a825" 
                opacity="0.6" 
              />
            ))}
          </g>
        ))}

      </g>
    </svg>
  );
}
