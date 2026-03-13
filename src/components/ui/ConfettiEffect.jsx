import { useEffect } from 'react';

export default function ConfettiEffect() {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6366f1', '#818cf8', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4'];
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 10,
    }));

    let frame;
    let startTime = Date.now();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;
      const alpha = Math.max(0, 1 - elapsed / 4000);

      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotV;
      });

      if (elapsed < 4000) {
        frame = requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }

    animate();
    return () => {
      cancelAnimationFrame(frame);
      canvas.remove();
    };
  }, []);

  return null;
}
