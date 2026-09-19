import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flower, Stem } from '../components/SVGElements';
import { CONFIG } from '../data/config';

interface Props {
  scene: number;
  onNextScene: () => void;
}

export function SceneFinal({ scene, onNextScene }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [flowersData] = useState(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 20 + Math.random() * 80,
      scale: 0.3 + Math.random() * 0.7,
      delay: Math.random() * 2
    }));
  });
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      if (scene === 8) {
        const tl = gsap.timeline({
          onComplete: () => setTimeout(onNextScene, 1000)
        });

        // Background to cream
        tl.to(containerRef.current, { backgroundColor: '#fdfbf7', duration: 2 });

        // Single flower zooms in
        tl.fromTo('.transition-flower', {
          scale: 0,
          opacity: 0,
          rotation: -45,
          x: 50,
          y: 50
        }, {
          scale: 15, // Scale within viewBox
          opacity: 1,
          rotation: 0,
          duration: 4,
          ease: 'power2.inOut'
        });
      }

      if (scene === 9) {
        const tl = gsap.timeline();

        // Fade out the massive transition flower
        tl.to('.transition-flower', { opacity: 0, duration: 2 });

        // Fade in the final field
        gsap.set('.final-flower-group', { scale: 0, opacity: 0 });
        flowersData.forEach(f => {
          tl.to(`.final-flower-${f.id}`, {
            scale: f.scale,
            opacity: 1,
            duration: 2,
            ease: 'back.out(1.5)'
          }, f.delay);
        });

        // Wind effect for final field
        gsap.to('.final-flower-group', {
          rotate: '5deg',
          transformOrigin: 'bottom center',
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: { amount: 2, from: "random" }
        });

        // Text sequence
        tl.to('.final-text-1', { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, 3)
          .to('.final-text-2', { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, "+=1.5")
          .to('.final-text-3', { opacity: 0.6, y: 0, duration: 2, ease: 'power2.out' }, "+=1")
          .to('.restart-btn', { opacity: 1, duration: 2 }, "+=2");
      }

    }, containerRef);
    return () => ctx.revert();
  }, [scene, onNextScene, flowersData]);

  return (
    <div ref={containerRef} className="abs-fill" style={{ zIndex: 30, backgroundColor: scene === 8 ? '#0a0a0a' : '#fdfbf7' }}>
      
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
        
        {/* The Transition Flower */}
        {scene === 8 && (
          <g className="transition-flower" style={{ transformOrigin: 'center' }}>
            <Flower />
          </g>
        )}

        {/* Final Field */}
        {scene === 9 && flowersData.map((f) => (
          <g 
            key={f.id} 
            className={`final-flower-group final-flower-${f.id}`} 
            transform={`translate(${f.x}, ${f.y})`}
          >
            <Stem d="M0,0 Q5,20 0,40" /> {/* Simplified stems for background */}
            <Flower />
          </g>
        ))}

      </svg>

      {scene === 9 && (
        <div className="abs-fill flex-center flex-col text-center" style={{ color: '#2a2a2a' }}>
          <h1 className="final-text-1 text-main font-serif opacity-0" style={{ transform: 'translateY(20px)' }}>
            {CONFIG.texts.final1}
          </h1>
          <h2 className="final-text-2 text-main font-serif mt-6 opacity-0" style={{ transform: 'translateY(20px)' }}>
            {CONFIG.texts.final2}
          </h2>
          <p className="final-text-3 text-small font-sans mt-8 opacity-0" style={{ transform: 'translateY(20px)' }}>
            {CONFIG.texts.final3}
          </p>
          
          <button 
            className="restart-btn opacity-0 pointer-events-auto"
            onClick={onNextScene}
          >
            {CONFIG.texts.restart}
          </button>
        </div>
      )}
      
    </div>
  );
}
