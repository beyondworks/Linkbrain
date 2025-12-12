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

    // Colors similar to the brand color #21DBA4 but with variations
    const colors = [
      'rgba(33, 219, 164, 0.4)',  // Primary Brand
      'rgba(33, 219, 164, 0.2)',  // Light Brand
      'rgba(45, 212, 191, 0.3)',  // Teal
      'rgba(56, 189, 248, 0.2)',  // Light Blue
      'rgba(148, 163, 184, 0.1)', // Slate
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
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.3 ? 'square' : 'triangle',
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.02
        });
      }
    };

    const drawParticle = (p: Particle) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
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
        ctx.strokeStyle = `rgba(33, 219, 164, ${0.15 * (1 - distance / 120)})`;
        ctx.lineWidth = 1;
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
        if (distance < 250) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(33, 219, 164, ${0.4 * (1 - distance / 250)})`;
            ctx.lineWidth = 1.5;
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
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        // Attraction radius and strength
        const maxDistance = 300;
        let force = 0;
        
        if (distance < maxDistance) {
            // The closer the mouse, the stronger the pull towards it
            // However, we stop pulling at a certain minimum distance to keep them scattered slightly
            force = (maxDistance - distance) / maxDistance; 
        }

        // Apply force to position (Elastic gathering)
        const elasticity = 0.08; // How fast they move towards target
        const targetX = p.originalX + (force * dx * 0.8);
        const targetY = p.originalY + (force * dy * 0.8);

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

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    window.addEventListener('resize', resizeCanvas);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Soft overlay to blend nicely with content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/80 pointer-events-none"></div>
    </div>
  );
};
