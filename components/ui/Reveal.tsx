import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  threshold?: number;
}

export const Reveal: React.FC<RevealProps> = ({ children, width = "fit-content", delay = 0, threshold = 0.2 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold } 
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return (
    <div ref={ref} style={{ width, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100px)",
          opacity: isVisible ? 1 : 0,
          // Using a custom cubic-bezier for a "luxury" slow-start fast-middle slow-end feel
          transition: `all 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
        }}
      >
        {children}
      </div>
    </div>
  );
};