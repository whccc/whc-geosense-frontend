import { useRef, useEffect, useState } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
  delta: number;
  color: string;
  twinkle: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Comet {
  x: number;
  y: number;
  speed: number;
  angle: number;
  tail: Array<{ x: number; y: number; alpha: number }>;
  color: string;
  life: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  angle: number;
  speed: number;
  color: string;
  glow: number;
  rings?: boolean;
}

const SpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isInteractive, setIsInteractive] = useState(false);
  
  const stars: Star[] = [];
  const comets: Comet[] = [];
  const planets: Planet[] = [];
  const numStars = 400;
  const numComets = 3;
  const numPlanets = 5;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const createNebulaGradient = (centerX: number, centerY: number, radius: number, colors: string[]) => {
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      colors.forEach((color, index) => {
        gradient.addColorStop(index / (colors.length - 1), color);
      });
      return gradient;
    };

    const nebula1 = createNebulaGradient(
      canvas.width * 0.3, canvas.height * 0.3, canvas.width * 0.4,
      ["rgba(255, 0, 150, 0.15)", "rgba(100, 149, 237, 0.08)", "rgba(0,0,0,0)"]
    );
    
    const nebula2 = createNebulaGradient(
      canvas.width * 0.7, canvas.height * 0.7, canvas.width * 0.5,
      ["rgba(0, 255, 150, 0.12)", "rgba(138, 43, 226, 0.06)", "rgba(0,0,0,0)"]
    );

    const nebula3 = createNebulaGradient(
      canvas.width * 0.5, canvas.height * 0.2, canvas.width * 0.3,
      ["rgba(255, 200, 0, 0.1)", "rgba(255, 100, 0, 0.05)", "rgba(0,0,0,0)"]
    );

    const starColors = ["#ffffff", "#ffeb99", "#99ccff", "#ff9999", "#99ffcc", "#ffcc99"];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.3,
        speed: Math.random() * 0.5 + 0.1,
        alpha: Math.random(),
        delta: Math.random() * 0.03 + 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinkle: Math.random() * Math.PI * 2,
        trail: []
      });
    }


    for (let i = 0; i < numComets; i++) {
      comets.push({
        x: Math.random() * canvas.width,
        y: -50,
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI / 4 + Math.PI / 8,
        tail: [],
        color: `hsl(${Math.random() * 60 + 180}, 80%, 70%)`, 
        life: 1.0
      });
    }

    const planetColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];
    for (let i = 0; i < numPlanets; i++) {
      planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 15 + 5,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.001,
        color: planetColors[Math.floor(Math.random() * planetColors.length)],
        glow: Math.random() * Math.PI * 2,
        rings: Math.random() > 0.7
      });
    }

    let time = 0;
    let animationFrameId: number;

    const drawStar = (star: Star, mouseInfluence: number = 0) => {
   
      star.twinkle += 0.1;
      const twinkleAlpha = (Math.sin(star.twinkle) + 1) * 0.3 + 0.4;
      
  
      if (star.radius > 1.5) {
        star.trail.push({ x: star.x, y: star.y, alpha: star.alpha });
        if (star.trail.length > 8) star.trail.shift();
        
       
        star.trail.forEach((point, index) => {
          const trailAlpha = (point.alpha * (index / star.trail.length)) * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, star.radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace(')', `, ${trailAlpha})`).replace('rgb', 'rgba');
          ctx.fill();
        });
      }

    
      const finalAlpha = star.alpha * twinkleAlpha * (1 + mouseInfluence * 0.5);
      
 
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
      const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
      glowGradient.addColorStop(0, star.color.replace(')', `, ${finalAlpha * 0.3})`).replace('rgb', 'rgba'));
      glowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color.replace(')', `, ${finalAlpha})`).replace('rgb', 'rgba');
      ctx.fill();

      if (star.radius > 1.2 && finalAlpha > 0.7) {
        ctx.strokeStyle = star.color.replace(')', `, ${finalAlpha * 0.8})`).replace('rgb', 'rgba');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(star.x - star.radius * 2, star.y);
        ctx.lineTo(star.x + star.radius * 2, star.y);
        ctx.moveTo(star.x, star.y - star.radius * 2);
        ctx.lineTo(star.x, star.y + star.radius * 2);
        ctx.stroke();
      }
    };

    const drawComet = (comet: Comet) => {
      comet.x += Math.cos(comet.angle) * comet.speed;
      comet.y += Math.sin(comet.angle) * comet.speed;
      

      comet.tail.push({ x: comet.x, y: comet.y, alpha: comet.life });
      if (comet.tail.length > 30) comet.tail.shift();
      

      comet.tail.forEach((point, index) => {
        const tailAlpha = (point.alpha * (index / comet.tail.length)) * 0.8;
        const tailRadius = (index / comet.tail.length) * 8;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, tailRadius, 0, Math.PI * 2);
        ctx.fillStyle = comet.color.replace(')', `, ${tailAlpha})`).replace('hsl', 'hsla');
        ctx.fill();
      });


      ctx.beginPath();
      ctx.arc(comet.x, comet.y, 4, 0, Math.PI * 2);
      const headGradient = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 8);
      headGradient.addColorStop(0, comet.color);
      headGradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = headGradient;
      ctx.fill();


      if (comet.x > canvas.width + 50 || comet.y > canvas.height + 50) {
        comet.x = Math.random() * canvas.width;
        comet.y = -50;
        comet.tail = [];
        comet.life = 1.0;
      }
    };

    const drawPlanet = (planet: Planet) => {
      planet.angle += planet.speed;
      planet.glow += 0.02;
      
      const floatX = planet.x + Math.sin(planet.angle * 2) * 10;
      const floatY = planet.y + Math.cos(planet.angle * 1.5) * 8;
      
      const glowIntensity = (Math.sin(planet.glow) + 1) * 0.3 + 0.2;
      ctx.beginPath();
      ctx.arc(floatX, floatY, planet.radius * 2.5, 0, Math.PI * 2);
      const planetGlow = ctx.createRadialGradient(floatX, floatY, 0, floatX, floatY, planet.radius * 2.5);
      planetGlow.addColorStop(0, planet.color.replace(')', `, ${glowIntensity})`).replace('rgb', 'rgba'));
      planetGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = planetGlow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(floatX, floatY, planet.radius, 0, Math.PI * 2);
      const planetGradient = ctx.createRadialGradient(
        floatX - planet.radius * 0.3, floatY - planet.radius * 0.3, 0,
        floatX, floatY, planet.radius
      );
      planetGradient.addColorStop(0, planet.color);
      planetGradient.addColorStop(1, planet.color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
      ctx.fillStyle = planetGradient;
      ctx.fill();
      if (planet.rings) {
        ctx.strokeStyle = planet.color.replace(')', ', 0.4)').replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(floatX, floatY, planet.radius * 1.8, planet.radius * 0.3, planet.angle, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const animate = () => {
      time += 0.016; 
      
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = nebula3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      const mouseInfluenceRadius = 100;
      
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height + 10) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }
        
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;
  
        let mouseInfluence = 0;
        if (isInteractive) {
          const dx = mouseRef.current.x - star.x;
          const dy = mouseRef.current.y - star.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseInfluenceRadius) {
            mouseInfluence = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
          }
        }
        
        drawStar(star, mouseInfluence);
      });

      planets.forEach(drawPlanet);


      comets.forEach(drawComet);

      if (Math.random() < 0.002) {
        const newComet: Comet = {
          x: Math.random() * canvas.width,
          y: -50,
          speed: Math.random() * 4 + 3,
          angle: Math.random() * Math.PI / 3 + Math.PI / 6,
          tail: [],
          color: `hsl(${Math.random() * 60 + 180}, 80%, 70%)`,
          life: 1.0
        };
        comets.push(newComet);
        
        if (comets.length > 8) {
          comets.shift();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseEnter = () => setIsInteractive(true);
    const handleMouseLeave = () => setIsInteractive(false);

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default SpaceBackground;
