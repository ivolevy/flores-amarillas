import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../data/config';

interface Props {
  onNextScene: () => void;
}

export function ScenePhotos({ onNextScene }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setTimeout(onNextScene, 2000)
      });

      // Background fade to black for contrast with photos
      tl.to(containerRef.current, { backgroundColor: '#0a0a0a', duration: 2 });

      CONFIG.photos.forEach((_, index) => {
        // Show text occasionally
        if (index < CONFIG.texts.photo_texts.length) {
          const textElement = `.photo-text-${index}`;
          tl.to(textElement, { opacity: 1, y: 0, duration: 2, ease: 'power2.out' })
            .to(textElement, { opacity: 0, duration: 1.5, delay: 1.5 });
        }

        // Show photo
        const photoElement = `.photo-img-${index}`;
        const wrapperElement = `.photo-wrapper-${index}`;
        
        // Random slight offset for a non-static feel
        const xOffset = (Math.random() - 0.5) * 20;
        const yOffset = (Math.random() - 0.5) * 20;
        gsap.set(wrapperElement, { x: `calc(-50% + ${xOffset}px)`, y: `calc(-50% + ${yOffset}px)` });

        tl.to(wrapperElement, { opacity: 1, duration: 2, ease: 'power2.inOut' }, "-=0.5")
          .to(photoElement, { scale: 1.05, duration: 5, ease: 'sine.inOut' }, "<")
          .to(wrapperElement, { opacity: 0, duration: 2, ease: 'power2.inOut' }, "-=2");
      });

    }, containerRef);
    return () => ctx.revert();
  }, [onNextScene]);

  return (
    <div ref={containerRef} className="abs-fill" style={{ zIndex: 20 }}>
      {CONFIG.photos.map((photo, index) => (
        <div key={index} className={`photo-wrapper photo-wrapper-${index}`}>
          <img 
            src={photo} 
            alt="Nosotros" 
            className={`photo-img photo-img-${index}`} 
          />
        </div>
      ))}

      <div className="abs-fill flex-center text-center pointer-events-none">
        {CONFIG.texts.photo_texts.map((text, index) => (
          <h2 
            key={index} 
            className={`photo-text-${index} text-main font-serif opacity-0 absolute text-white`} 
            style={{ transform: 'translateY(20px)' }}
          >
            {text}
          </h2>
        ))}
      </div>
    </div>
  );
}
