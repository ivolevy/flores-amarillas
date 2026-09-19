import { useEffect, useRef } from 'react';

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        // Randomize speed for explosion effect
        const speed = Math.random() * 6 + 2; 
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 2.5 + 1;
        this.decay = Math.random() * 0.015 + 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // Gravity
        this.vx *= 0.96; // Air resistance
        this.vy *= 0.96;
        this.alpha -= this.decay; // Fade out
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Add a slight glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    // Yellow, gold, and white colors matching the theme
    const colors = ['#fbc02d', '#f57f17', '#ffea00', '#ffffff', '#ffd54f'];

    const createFirework = () => {
      // Create firework at random position, mostly top half
      const x = (Math.random() * 0.8 + 0.1) * width;
      const y = (Math.random() * 0.4 + 0.1) * height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Burst 60 particles
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let frameId: number;
    let tick = 0;

    const loop = () => {
      // Clear with slight opacity to create trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles, removing dead ones (loop backwards to avoid index shifting)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Randomly launch fireworks (approx every 1.5 seconds)
      if (tick % 90 === 0 || Math.random() < 0.01) { 
        createFirework();
      }
      tick++;
      
      frameId = requestAnimationFrame(loop);
    };

    // Launch initial firework!
    createFirework();
    loop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="abs-element pointer-events-none z-0"
      style={{ top: 0, left: 0 }}
    />
  );
}
