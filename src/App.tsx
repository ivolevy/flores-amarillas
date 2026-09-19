import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HeartOfFlowers } from './components/HeartOfFlowers';
import { Fireworks } from './components/Fireworks';
import './styles/main.css';

// Removed SLIDES array as per user request to have no texts during the video

export default function App() {
  const [stage, setStage] = useState<'initial_click' | 'welcome_text' | 'welcome' | 'intro' | 'transition' | 'final_video' | 'end_screen'>('initial_click');
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const finalVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play beautiful welcome text sequence once video is loaded and user has interacted
  useEffect(() => {
    if (stage === 'welcome_text' && videoLoaded) {
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
      {(stage === 'initial_click' || stage === 'welcome_text' || stage === 'welcome' || stage === 'intro') && (
        <div className="intro-container fixed-full flex flex-col items-center justify-center overflow-hidden z-10">
          <video 
            ref={introVideoRef}
            src="/video/jardin_pixar.mp4#t=0.001"
            className={`abs-element w-full h-full opacity-80 transition-all duration-1000 ${(stage === 'initial_click' || stage === 'welcome_text' || stage === 'welcome') ? 'blur-md brightness-50' : 'blur-none brightness-100'}`}
            style={{ objectFit: 'cover' }}
            playsInline
            muted // Muted to prevent OS from pausing the background audio
            preload="auto"
            loop
            onLoadedMetadata={() => setVideoLoaded(true)}
          />
          <div className="abs-element w-full h-full bg-black/30 pointer-none" />

          {/* Initial Click Screen (Bypass Autoplay Restrictions) */}
          {stage === 'initial_click' && (
            <div 
              className="fixed-full z-50 flex items-center justify-center bg-black cursor-pointer transition-opacity duration-1000"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.volume = 0;
                  audioRef.current.play().catch(()=>{});
                  gsap.to(audioRef.current, { volume: 0.5, duration: 4, ease: 'power2.inOut' });
                }
                setStage('welcome_text');
              }}
            >
              <div className="text-center animate-pulse-slow p-8">
                <h1 className="text-2xl md:text-3xl font-serif text-[#ffd54f] tracking-wide" style={{ textShadow: '0 4px 15px rgba(255,213,79,0.3)' }}>
                  Tocá la pantalla para empezar...
                </h1>
              </div>
            </div>
          )}

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
                {videoLoaded ? 'TOCÁ PARA ACOMPAÑARME' : 'CARGANDO...'}
              </button>
            </div>
          )}

          {/* Intro Screen UI (Automated Texts) - Rendered always to exist for GSAP */}
          {/* Interactive video without texts */}
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
            // Simple fade out to black
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

          <div className="relative z-10 flex flex-col items-center text-center animate-pulse-slow mt-8">
            <h1 className="text-5xl md:text-7xl font-serif text-[#ffd54f] tracking-wider mb-2" style={{ textShadow: '0 4px 20px rgba(255, 213, 79, 0.4)' }}>
              TE AMO
            </h1>
            <p className="text-2xl md:text-4xl font-serif text-[#fff59d] italic tracking-widest mt-2" style={{ textShadow: '0 2px 10px rgba(255, 245, 157, 0.3)' }}>
              tu gordito
            </p>
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
