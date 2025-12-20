import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMovingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM manipulation for mouse tracking
      container.style.setProperty("--mouse-x", `${e.clientX}px`);
      container.style.setProperty("--mouse-y", `${e.clientY}px`);

      container.classList.add("is-moving");

      if (isMovingRef.current) clearTimeout(isMovingRef.current);
      isMovingRef.current = setTimeout(() => {
        container.classList.remove("is-moving");
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (isMovingRef.current) clearTimeout(isMovingRef.current);
    };
  }, []);

  useGSAP(
    () => {
      // Background Gradient Shift
      gsap.to(".bg-gradient-base", {
        backgroundPosition: "100% 50%",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Blobs Floating
      const blobs = gsap.utils.toArray(".blob") as HTMLElement[];
      blobs.forEach((blob) => {
        gsap.to(blob, {
          x: "random(-50, 50)",
          y: "random(-50, 50)",
          rotation: "random(-20, 20)",
          scale: "random(0.9, 1.1)",
          duration: "random(15, 25)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 5,
        });
      });

      // Pulse Center
      gsap.to(".center-pulse", {
        opacity: 0.8,
        scale: 1.1,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50"
    >
      {/* Dynamic Background Base */}
      <div
        className="bg-gradient-base absolute inset-0 opacity-40 will-change-[background-position]"
        style={{
          background:
            "linear-gradient(-45deg, #e0e7ff, #dbeafe, #f0f9ff, #e0f2fe)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Reduced Blobs - Using fewer, larger elements with simpler animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Left Blob */}
        <div className="blob absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-200/20 blur-[80px] will-change-transform" />

        {/* Bottom Right Blob */}
        <div className="blob absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-200/20 blur-[80px] will-change-transform" />

        {/* Center Accent */}
        <div
          className="center-pulse absolute top-[20%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-cyan-100/30 blur-[60px] will-change-transform"
          style={{ opacity: 0.6 }}
        />
      </div>

      {/* Interactive Grid - Uses CSS variables */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-30 [&.is-moving]:opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 300px at var(--mouse-x, 50%) var(--mouse-y, 50%), black 0%, transparent 100%)",
        }}
      />

      {/* Cursor Glow */}
      <div
        className="absolute w-[400px] h-[400px] pointer-events-none rounded-full transition-opacity duration-300 opacity-0 [&.is-moving]:opacity-100 will-change-[transform,opacity]"
        style={{
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          left: "var(--mouse-x, 50%)",
          top: "var(--mouse-y, 50%)",
        }}
      />
    </div>
  );
};
