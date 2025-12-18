import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  originalX: number;
  originalY: number;
  shape: 'circle' | 'square' | 'triangle';
  angle: number;
  spinSpeed: number;
}

export const ScatteredLinkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };

    // Colors optimized for Dark Theme (Glowing/Neon feel)
    const colors = [
      'rgba(33, 219, 164, 0.6)',  // Primary Brand (Brighter)
      'rgba(33, 219, 164, 0.3)',  // Light Brand
      'rgba(45, 212, 191, 0.4)',  // Teal
      'rgba(56, 189, 248, 0.3)',  // Light Blue
      'rgba(148, 163, 184, 0.2)', // Slate (Lighter)
      'rgba(255, 255, 255, 0.1)', // White hints
    ];

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // Responsive count

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.4, // Slower, smoother movement
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 4 + 1, // Slightly smaller for elegance
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.3 ? 'square' : 'triangle',
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.01
        });
      }
    };

    const drawParticle = (p: Particle) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      
      // Add Glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      if (p.shape === 'circle') {
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      } else if (p.shape === 'square') {
        ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'triangle') {
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, p.size);
        ctx.lineTo(-p.size, p.size);
        ctx.closePath();
      }
      ctx.fill();
      ctx.restore();
    };

    const drawConnection = (p1: Particle, p2: Particle) => {
      if (!ctx) return;
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        // Lighter, more subtle lines for dark mode
        ctx.strokeStyle = `rgba(33, 219, 164, ${0.1 * (1 - distance / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    };

    const drawMouseConnection = (p: Particle) => {
        if (!ctx) return;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Connect if close to mouse
        if (distance < 300) {
            ctx.beginPath();
            // Stronger glow near mouse
            ctx.strokeStyle = `rgba(33, 219, 164, ${0.3 * (1 - distance / 300)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Natural floating movement
        p.originalX += p.vx;
        p.originalY += p.vy;

        // Bounce off edges (original position)
        if (p.originalX < 0 || p.originalX > canvas.width) p.vx *= -1;
        if (p.originalY < 0 || p.originalY > canvas.height) p.vy *= -1;

        // Mouse interaction (Attraction/Gathering Effect)
        const dx = mouse.x - p.originalX;
        const dy = mouse.y - p.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction radius and strength
        const maxDistance = 400; // Increased range
        let force = 0;
        
        if (distance < maxDistance) {
            // Smooth easing
            force = (maxDistance - distance) / maxDistance; 
            force = force * force; // Quadratic easing for smoother feel
        }

        // Apply force to position (Elastic gathering)
        const elasticity = 0.05; // Slightly smoother
        const targetX = p.originalX + (force * dx * 0.5); // 0.5 strength (don't pull all the way)
        const targetY = p.originalY + (force * dy * 0.5);

        p.x += (targetX - p.x) * elasticity;
        p.y += (targetY - p.y) * elasticity;
        
        // Rotation
        p.angle += p.spinSpeed;

        // Draw connections between particles
        for (let j = i + 1; j < particles.length; j++) {
            drawConnection(p, particles[j]);
        }
        
        // Draw connections to mouse
        drawMouseConnection(p);

        drawParticle(p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            mouse.x = touch.clientX - rect.left;
            mouse.y = touch.clientY - rect.top;
        }
    };

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    window.addEventListener('resize', resizeCanvas);
    // Listen on window for smoother mouse tracking across the whole page
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseLeave);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseLeave);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Dark gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/0 via-[#0B1120]/20 to-[#0B1120]/80 pointer-events-none"></div>
    </div>
  );
};