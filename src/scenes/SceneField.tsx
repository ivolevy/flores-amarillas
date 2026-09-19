import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flower, Stem } from '../components/SVGElements';

interface Props {
  scene: number;
  onNextScene: () => void;
}

export function SceneField({ scene, onNextScene }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Create an array of random flower data on mount
  const [flowersData] = useState(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const isSelected = i < 10; // 10 flowers will form the bouquet
      const x = 10 + Math.random() * 80; // 10% to 90% vw
      const height = 30 + Math.random() * 50; // 30% to 80% vh
      const curve = (Math.random() - 0.5) * 40;
      
      return {
        id: i,
        x,
        y: 100 - height, // Top position of the flower
        curve,
        scale: 0.5 + Math.random() * 0.8,
        isSelected,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 1.5,
      };
    });
  });

  const windTween = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (scene === 2) {
        // Scene 2: Grow stems and flowers
        const tl = gsap.timeline({
          onComplete: () => {
            // Trigger next scene (wind) automatically after a few seconds
            setTimeout(onNextScene, 2000);
          }
        });

        // Setup initial state
        gsap.set('.flower-group', { scale: 0, opacity: 0 });
        gsap.set('.stem-path', { strokeDasharray: 1000, strokeDashoffset: 1000 });
        
        flowersData.forEach((f, i) => {
          tl.to(`.stem-${i}`, {
            strokeDashoffset: 0,
            duration: f.duration,
            ease: 'power1.inOut'
          }, f.delay);
          
          tl.to(`.flower-${i}`, {
            scale: f.scale,
            opacity: 1,
            duration: 1.5,
            ease: 'back.out(1.7)'
          }, f.delay + f.duration - 0.5);
        });
      }
      
      if (scene === 3) {
        // Scene 3: Wind
        // Animate stems and flowers swaying
        windTween.current = gsap.to('.field-element', {
          rotate: '10deg',
          transformOrigin: 'bottom center',
          duration: 3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: {
            amount: 2,
            from: "random"
          }
        });

        setTimeout(onNextScene, 6000); // Wait 6 seconds of wind, then bouquet
      }

      if (scene === 4) {
        // Scene 4: Bouquet
        // The selected flowers lift up and group together
        const tl = gsap.timeline({
          onComplete: () => setTimeout(onNextScene, 1500)
        });

        // Fade out unselected flowers
        tl.to('.unselected-flower', {
          opacity: 0,
          duration: 2,
          ease: 'power2.inOut'
        }, 0);

        // Move selected flowers to center bottom
        flowersData.filter(f => f.isSelected).forEach((f) => {
          // Calculate target position for bouquet
          const targetX = 50 + (Math.random() - 0.5) * 10;
          const targetY = 70 + (Math.random() - 0.5) * 10;
          
          // We transition the SVG grouping
          tl.to(`.flower-${f.id}`, {
            x: targetX - f.x,
            y: targetY - f.y,
            rotation: (Math.random() - 0.5) * 30,
            duration: 3,
            ease: 'power2.inOut'
          }, 0);

          tl.to(`.stem-${f.id}`, {
            opacity: 0, // Simplified: fade out individual stems
            duration: 2
          }, 0);
        });

        // Show a grouped stem SVG for the bouquet
        tl.fromTo('.bouquet-stems', {
          opacity: 0,
          y: 50
        }, {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: 'power2.out'
        }, 1.5);
      }
      
      if (scene >= 7) {
         // Field fades out for photos
         gsap.to(containerRef.current, { opacity: 0, duration: 1.5 });
      }

    }, containerRef);
    return () => ctx.revert();
  }, [scene, onNextScene, flowersData]);

  return (
    <div ref={containerRef} className="abs-fill" style={{ pointerEvents: 'none' }}>
      <svg ref={svgRef} viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Dynamic Field */}
        <g className="field-group">
          {flowersData.map((f) => (
            <g key={f.id} className={`field-element ${f.isSelected ? 'selected-flower' : 'unselected-flower'}`}>
              <Stem 
                className={`stem-${f.id}`}
                d={`M${f.x},100 Q${f.x + f.curve},${f.y + 20} ${f.x},${f.y}`} 
              />
              <g 
                className={`flower-group flower-${f.id}`} 
                transform={`translate(${f.x}, ${f.y})`}
              >
                <Flower />
              </g>
            </g>
          ))}
        </g>

        {/* Bouquet Base (Stems wrapped) - Hidden initially */}
        <g className="bouquet-stems opacity-0" transform="translate(50, 75)">
           {/* Abstract wrapped stems */}
           <path d="M-10,0 L10,0 L5,40 L-5,40 Z" fill="#6b8e5c" opacity="0.8" />
           <path d="M-12,-5 Q0,5 12,-5 L15,10 Q0,20 -15,10 Z" fill="#e5d5b5" opacity="0.6" /> {/* Paper wrap */}
        </g>
      </svg>
    </div>
  );
}
