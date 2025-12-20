import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  threshold?: number; // Kept for API compatibility, though ScrollTrigger handles it differently
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = "fit-content",
  delay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!content || !container) return;

      // Set initial state
      gsap.set(content, { y: 75, opacity: 0 });

      gsap.to(content, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%", // Triggers when top of element is 85% down viewport
          toggleActions: "play none none reverse", // Play on enter, reverse on leave back up
        },
      });
    },
    { scope: containerRef, dependencies: [delay] }
  );

  return (
    <div
      ref={containerRef}
      style={{ width, position: "relative", overflow: "hidden" }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};
