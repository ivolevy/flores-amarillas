import { useLayoutEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random positions once so they don't jump on re-renders
  const particles = useMemo(() => Array.from({ length: 40 }).map(() => ({
    width: Math.random() * 8 + 4 + 'px',
    height: Math.random() * 8 + 4 + 'px',
    left: Math.random() * 100 + 'vw',
    top: 100 + Math.random() * 20 + 'vh',
  })), []);

  const hearts = useMemo(() => Array.from({ length: 20 }).map(() => ({
    width: Math.random() * 15 + 10 + 'px',
    height: Math.random() * 15 + 10 + 'px',
    left: Math.random() * 100 + 'vw',
    top: 100 + Math.random() * 20 + 'vh',
  })), []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Particles float upwards slowly
      gsap.to('.particle', {
        y: '-120vh',
        x: 'random(-100, 100)',
        rotation: 'random(-180, 180)',
        duration: 'random(8, 18)',
        ease: 'none',
        repeat: -1,
        stagger: {
          each: 0.2,
          from: "random"
        }
      });
      
      // Hearts pulse smoothly while floating
      gsap.to('.heart', {
        scale: 1.3,
        duration: 'random(0.8, 1.5)',
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: "random"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed-full pointer-none" style={{ zIndex: 0 }}>
      {/* Pollen Particles */}
      {particles.map((p, i) => (
        <div 
          key={`p-${i}`} 
          className="particle abs-element circle bg-yellow opacity-40 blur-sm"
          style={p}
        />
      ))}
      {/* Floating Hearts */}
      {hearts.map((h, i) => (
        <svg 
          key={`h-${i}`} 
          className="particle heart abs-element opacity-40"
          style={{ ...h, fill: '#ff8a80' }}
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ))}
    </div>
  );
}

export function WaveBackground() {
  const waveRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle wave animation
      gsap.to('.wave-svg', {
        x: '-5%',
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      });
    }, waveRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={waveRef} className="fixed-full pointer-none opacity-30" style={{ zIndex: 0, overflow: 'hidden' }}>
      {/* Top Wave */}
      <svg className="wave-svg abs-element top-0" style={{ width: '120%', height: '35vh', left: '-10%' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#ffe57f" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,170.7C672,149,768,107,864,101.3C960,96,1056,128,1152,149.3C1248,171,1344,181,1392,186.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>
      {/* Bottom Wave */}
      <svg className="wave-svg abs-element bottom-0" style={{ width: '120%', height: '35vh', left: '-10%' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#ffd54f" fillOpacity="1" d="M0,224L48,229.3C96,235,192,245,288,218.7C384,192,480,128,576,122.7C672,117,768,171,864,197.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
}
