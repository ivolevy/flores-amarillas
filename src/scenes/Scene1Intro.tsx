import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CONFIG } from '../data/config';

interface Props {
  onFirstClick: () => void;
  onEnter: () => void;
}

export function Scene1Intro({ onFirstClick, onEnter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power2.out',
        delay: 1
      })
      .to(hintRef.current, {
        opacity: 0.7,
        y: 0,
        duration: 1.5,
        ease: 'power2.out'
      }, "+=1");

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    onFirstClick(); // Synchronous for audio
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      onComplete: onEnter
    });
  };

  return (
    <div 
      ref={containerRef}
      className="abs-fill flex-center flex-col cursor-pointer"
      onClick={handleClick}
      style={{ zIndex: 50 }}
    >
      <h1 
        ref={textRef} 
        className="text-main font-serif opacity-0 translate-y-4"
        style={{ transform: 'translateY(20px)' }}
      >
        {CONFIG.texts.intro1}
      </h1>
      <p 
        ref={hintRef} 
        className="text-small mt-8 opacity-0"
        style={{ transform: 'translateY(10px)' }}
      >
        {CONFIG.texts.intro2}
      </p>
    </div>
  );
}
