import React, { useState, useEffect, useCallback } from "react";

const styles = `
@keyframes slowZoom {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes drift {
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -60px) scale(1.08); }
  50% { transform: translate(-40px, 40px) scale(0.92); }
  75% { transform: translate(60px, 20px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.15); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-25px) rotate(3deg); }
  66% { transform: translateY(20px) rotate(-2deg); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes morphBlob {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
  75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
}
`;

export const AnimatedBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsMoving(true);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (isMoving) {
      const timeout = setTimeout(() => setIsMoving(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isMoving, mousePos]);

  return (
    <>
      <style>{styles}</style>
      <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-100">
        {/* Animated gradient base - more vibrant */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "linear-gradient(-45deg, #c7d2fe, #bfdbfe, #e0f2fe, #a5f3fc, #ddd6fe)",
            backgroundSize: "400% 400%",
            animation: "gradientShift 12s ease infinite",
          }}
        />

        {/* Interactive Grid that follows mouse */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            opacity: isMoving ? 0.6 : 0.3,
            transition: "opacity 0.3s ease-out",
          }}
        />

        {/* Secondary pulsing grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            animation: "gridPulse 4s ease-in-out infinite",
          }}
        />

        {/* Grid dots at intersections */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle 2px at center, rgba(99, 102, 241, 0.2) 0%, transparent 100%)`,
            backgroundSize: "40px 40px",
            maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
            opacity: isMoving ? 0.8 : 0.4,
            transition: "opacity 0.4s ease-out",
          }}
        />

        {/* Primary morphing blob - top left */}
        <div
          className="absolute -top-[10%] -left-[5%] w-[65vw] h-[65vw] bg-gradient-to-br from-blue-300/50 via-indigo-200/40 to-cyan-200/30 blur-[60px]"
          style={{
            animation:
              "drift 20s ease-in-out infinite, morphBlob 15s ease-in-out infinite, pulse 6s ease-in-out infinite",
          }}
        />

        {/* Secondary blob - top right */}
        <div
          className="absolute -top-[0%] -right-[10%] w-[60vw] h-[60vw] bg-gradient-to-bl from-violet-200/45 via-purple-100/35 to-indigo-200/30 blur-[70px]"
          style={{
            animation:
              "drift 25s ease-in-out infinite reverse, morphBlob 18s ease-in-out infinite reverse, pulse 8s ease-in-out infinite",
            animationDelay: "-3s",
          }}
        />

        {/* Tertiary blob - bottom center */}
        <div
          className="absolute -bottom-[15%] left-[5%] w-[75vw] h-[55vw] bg-gradient-to-tr from-sky-200/40 via-blue-100/35 to-teal-100/25 blur-[80px]"
          style={{
            animation:
              "drift 18s ease-in-out infinite, morphBlob 14s ease-in-out infinite, pulse 10s ease-in-out infinite",
            animationDelay: "-6s",
          }}
        />

        {/* Accent blob - center right */}
        <div
          className="absolute top-[35%] -right-[0%] w-[40vw] h-[40vw] bg-gradient-to-l from-indigo-300/35 to-blue-200/25 blur-[50px]"
          style={{
            animation:
              "float 12s ease-in-out infinite, pulse 5s ease-in-out infinite",
            animationDelay: "-2s",
          }}
        />

        {/* Additional accent - left side */}
        <div
          className="absolute top-[50%] -left-[5%] w-[35vw] h-[35vw] bg-gradient-to-r from-cyan-200/35 to-sky-100/25 blur-[50px]"
          style={{
            animation:
              "float 14s ease-in-out infinite reverse, pulse 7s ease-in-out infinite",
            animationDelay: "-4s",
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute top-[15%] left-[25%] w-[25vw] h-[25vw] rounded-full bg-cyan-200/30 blur-[40px]"
          style={{
            animation:
              "float 10s ease-in-out infinite, pulse 5s ease-in-out infinite",
          }}
        />

        <div
          className="absolute top-[55%] left-[55%] w-[20vw] h-[20vw] rounded-full bg-violet-200/30 blur-[35px]"
          style={{
            animation:
              "float 8s ease-in-out infinite reverse, pulse 4s ease-in-out infinite",
            animationDelay: "-1s",
          }}
        />

        <div
          className="absolute top-[70%] left-[20%] w-[18vw] h-[18vw] rounded-full bg-indigo-200/25 blur-[30px]"
          style={{
            animation:
              "float 9s ease-in-out infinite, pulse 6s ease-in-out infinite",
            animationDelay: "-3s",
          }}
        />

        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 6s linear infinite",
          }}
        />

        {/* Slow zoom breathing effect */}
        <div className="absolute inset-0 animate-[slowZoom_20s_ease-in-out_infinite] opacity-50">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/70 to-transparent" />
        </div>

        {/* Rotating subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] opacity-20"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.1), transparent, rgba(14, 165, 233, 0.1), transparent)",
            animation: "rotate 60s linear infinite",
          }}
        />

        {/* Mouse-following glow */}
        <div
          className="absolute pointer-events-none w-[400px] h-[400px] rounded-full"
          style={{
            left: mousePos.x - 200,
            top: mousePos.y - 200,
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            opacity: isMoving ? 1 : 0.5,
            transition:
              "opacity 0.3s ease-out, left 0.1s ease-out, top 0.1s ease-out",
          }}
        />
      </div>
    </>
  );
};
