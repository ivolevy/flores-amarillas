import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../data/config';

interface Props {
  scene: number;
  onNextScene: () => void;
}

export function SceneMessages({ scene, onNextScene }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      if (scene === 5) {
        const tl = gsap.timeline({
          onComplete: () => setTimeout(onNextScene, 3000)
        });

        tl.to('.msg-1', { opacity: 1, y: -20, duration: 2, ease: 'power2.out' }, 1)
          .to('.msg-1', { opacity: 0, duration: 1.5, delay: 3 })
          .to('.msg-2', { opacity: 1, y: -20, duration: 2, ease: 'power2.out' }, "+=1")
          .to('.msg-2', { opacity: 0, duration: 1.5, delay: 3 });
      }

      if (scene === 6) {
        const tl = gsap.timeline({
          onComplete: () => setTimeout(onNextScene, 2000)
        });

        // "si estuviera con vos hoy..."
        tl.to('.msg-imagine', { opacity: 1, y: -20, duration: 2, ease: 'power2.out' }, 1)
          .to('.msg-imagine', { opacity: 0, duration: 1.5, delay: 2 });

        // Phrases sequence
        CONFIG.texts.imagine_phrases.forEach((_, i) => {
          tl.to(`.phrase-${i}`, { opacity: 1, y: -10, duration: 2, ease: 'power2.out' }, "+=0.5")
            .to(`.phrase-${i}`, { opacity: 0, duration: 1.5, delay: 2 });
        });
      }

    }, containerRef);
    return () => ctx.revert();
  }, [scene, onNextScene]);

  return (
    <div ref={containerRef} className="abs-fill flex-center flex-col pointer-events-none" style={{ zIndex: 10 }}>
      <div ref={messagesRef} className="relative w-full h-full flex-center text-center">
        
        {scene === 5 && (
          <>
            <h2 className="msg-1 text-main font-serif opacity-0 absolute" style={{ transform: 'translateY(20px)' }}>
              {CONFIG.texts.bouquet1}
            </h2>
            <h2 className="msg-2 text-main font-serif opacity-0 absolute" style={{ transform: 'translateY(20px)' }}>
              {CONFIG.texts.bouquet2}
            </h2>
          </>
        )}

        {scene === 6 && (
          <>
            <h2 className="msg-imagine text-main font-serif opacity-0 absolute" style={{ transform: 'translateY(20px)' }}>
              {CONFIG.texts.imagine_start}
            </h2>
            {CONFIG.texts.imagine_phrases.map((phrase, i) => (
              <h2 key={i} className={`phrase-${i} text-main font-serif opacity-0 absolute`} style={{ transform: 'translateY(20px)' }}>
                {phrase}
              </h2>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
