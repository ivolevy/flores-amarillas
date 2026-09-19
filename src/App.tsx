import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HeartOfFlowers } from './components/HeartOfFlowers';
import { Fireworks } from './components/Fireworks';
import './styles/main.css';

const SLIDES = [
  "", // Delays the first text
  "¿PENSABAS QUE NO IBA A HABER ALGUNA SORPRESITA?",
  "JEJEJEJEJEJEJEJE"
];

export default function App() {
  const [stage, setStage] = useState<'welcome_text' | 'welcome' | 'intro' | 'transition' | 'final_video' | 'end_screen'>('welcome_text');
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const finalVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play beautiful welcome text sequence once video is loaded
  useEffect(() => {
    if (stage === 'welcome_text' && videoLoaded) {
      
      // Attempt immediate background music playback
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {
          // Browser blocked autoplay (standard on mobile). Wait for first interaction anywhere on screen.
          const startMusic = () => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.volume = 0;
              audioRef.current.play().catch(()=>{});
              gsap.to(audioRef.current, { volume: 0.5, duration: 4, ease: 'power2.inOut' });
            }
            document.removeEventListener('touchstart', startMusic);
            document.removeEventListener('click', startMusic);
          };
          document.addEventListener('touchstart', startMusic);
          document.addEventListener('click', startMusic);
        });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setStage('welcome');
        }
      });
      tl.fromTo('.welcome-text-1', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, "+=0.5")
        .fromTo('.welcome-text-2', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, "+=0.8")
        .fromTo('.welcome-text-3', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, "+=1")
        // Pause for reading, then fade all out
        .to('.welcome-text-1, .welcome-text-2, .welcome-text-3', { opacity: 0, duration: 1.5, ease: 'power2.in' }, "+=3");
    }
  }, [stage, videoLoaded]);

  // Handle visibility change to pause music/video if user leaves the tab or minimizes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause everything
        if (audioRef.current) audioRef.current.pause();
        if (introVideoRef.current) introVideoRef.current.pause();
        if (finalVideoRef.current) finalVideoRef.current.pause();
      } else {
        // Resume if they come back to the tab
        if (stage !== 'welcome_text' && stage !== 'welcome' && stage !== 'end_screen') {
          if (audioRef.current) audioRef.current.play().catch(() => {});
        }
        if (stage === 'intro' && introVideoRef.current) {
          introVideoRef.current.play().catch(() => {});
        }
        if (stage === 'final_video' && finalVideoRef.current) {
          finalVideoRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stage]);

  const startJourney = () => {
    if (!videoLoaded) return;
    setStage('intro');
    
    // If audio hasn't started yet (e.g. they didn't touch the screen before clicking the button), start it
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(e => console.error(e));
      gsap.to(audioRef.current, { volume: 0.5, duration: 4, ease: 'power2.inOut' });
    }

    // Video start
    const v = introVideoRef.current;
    if (v) {
      v.loop = false;
      v.currentTime = 0;
      v.play().catch(e => console.error(e));
      
      // Force preload of the final video during this user gesture
      if (finalVideoRef.current) {
        finalVideoRef.current.load();
      }

      const chunk = v.duration / SLIDES.length;
      const tl = gsap.timeline();
      
      // Sequence texts
      SLIDES.forEach((_, i) => {
        // Fade in quicker
        tl.fromTo(`.slide-${i}`, 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 
          i * chunk
        )
        // Fade out later so it stays on screen longer
        .to(`.slide-${i}`, 
          { opacity: 0, y: -15, duration: 1, ease: 'power2.in' }, 
          (i + 1) * chunk - 1
        );
      });

      // Handle video end with smooth transition
      v.onended = () => {
        // Fade out the entire intro container smoothly
        gsap.to('.intro-container', {
          opacity: 0,
          duration: 2,
          ease: 'power2.inOut',
          onComplete: () => {
            setStage('final_video');
            // Play the preloaded final video
            if (finalVideoRef.current) {
              finalVideoRef.current.play().catch(e => console.error("Final video play failed", e));
            }
          }
        });
      };
    }
  };

  return (
    <div className="app-container bg-black">
      
      {/* Stages: Welcome Text, Welcome & Intro all share the Pixar Video background */}
      {(stage === 'welcome_text' || stage === 'welcome' || stage === 'intro') && (
        <div className="intro-container fixed-full flex flex-col items-center justify-center overflow-hidden z-10">
          <video 
            ref={introVideoRef}
            src="/video/jardin_pixar.mp4#t=0.001"
            className={`abs-element w-full h-full opacity-80 transition-all duration-1000 ${(stage === 'welcome_text' || stage === 'welcome') ? 'blur-md brightness-50' : 'blur-none brightness-100'}`}
            style={{ objectFit: 'cover' }}
            playsInline
            muted // Muted to prevent OS from pausing the background audio
            preload="auto"
            loop
            onLoadedMetadata={() => setVideoLoaded(true)}
          />
          
          <div className="abs-element w-full h-full bg-black/30 pointer-none" />

          {/* Initial Welcome Text Sequence */}
          {stage === 'welcome_text' && (
            <div className="fixed-full z-20 flex flex-col items-center justify-center px-8 pointer-events-none gap-6">
              <h2 className="welcome-text-1 opacity-0 text-3xl md:text-4xl font-serif text-white text-center text-shadow-lg leading-relaxed">
                Hoy es 21 y estás un poco lejos para darte flores...
              </h2>
              <h2 className="welcome-text-2 opacity-0 text-2xl md:text-3xl font-serif text-white/80 text-center text-shadow-lg leading-relaxed">
                pero te invito a dar un paseo por el Jardín Japonés.
              </h2>
              <h2 className="welcome-text-3 opacity-0 text-4xl md:text-5xl font-serif text-[#ffd54f] text-center mt-4 text-shadow-lg italic tracking-wider">
                ¿Me acompañás?
              </h2>
            </div>
          )}

          {/* Welcome Screen UI (Button) */}
          {stage === 'welcome' && (
            <div className="fixed-full z-20 flex flex-col items-center justify-center pointer-events-auto">
              <button 
                onClick={startJourney}
                disabled={!videoLoaded}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white font-sans tracking-widest text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {videoLoaded ? 'EMPEZAR RECORRIDO' : 'CARGANDO...'}
              </button>
            </div>
          )}

          {/* Intro Screen UI (Automated Texts) - Rendered always to exist for GSAP */}
          {(stage === 'welcome' || stage === 'intro') && (
            <div className="fixed-full z-10 flex items-center justify-center text-center px-6 pointer-events-none">
              {SLIDES.map((slide, i) => (
                <h1 
                  key={i} 
                  className={`slide-${i} fixed-full flex flex-col items-center justify-center text-center text-3xl md:text-4xl font-serif text-white leading-relaxed opacity-0 text-shadow-lg w-full px-6`}
                >
                  {slide}
                </h1>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Final Video Stage: Delivery Video (Always mounted to allow preloading on Vercel) */}
      <div className={`final-video-container fixed-full bg-black flex items-center justify-center z-20 ${stage === 'final_video' ? 'fade-in-video' : (stage === 'end_screen' ? '' : 'opacity-0 pointer-events-none')}`}>
        <video 
          ref={finalVideoRef}
          src="/video/entrega_flores.mp4"
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
          playsInline
          muted
          preload="auto"
          controls={false}
          onEnded={() => {
            // Fade out video and move to end screen
            gsap.to('.final-video-container', {
              opacity: 0,
              duration: 3,
              ease: 'power2.inOut',
              onComplete: () => setStage('end_screen')
            });
          }}
        />
      </div>

      {/* End Screen Stage: Pure Black Screen with TE AMO */}
      {stage === 'end_screen' && (
        <div className="fixed-full bg-black flex flex-col items-center justify-center fade-in-video z-30 overflow-hidden">
          
          {/* Fireworks Background */}
          <Fireworks />

          {/* Animated Heart of Flowers */}
          <HeartOfFlowers />

          <div className="relative z-10 flex flex-col items-center text-center animate-pulse-slow">
            <h1 className="text-5xl md:text-7xl font-serif text-[#ffd54f] tracking-wider mb-6" style={{ textShadow: '0 4px 20px rgba(255, 213, 79, 0.4)' }}>
              TE AMO
            </h1>
          </div>
        </div>
      )}

      {/* Hidden Audio Player */}
      <audio 
        ref={audioRef}
        src="/cancion/flores_amarillas_hq.mp3"
        loop
      />
      
    </div>
  );
}
