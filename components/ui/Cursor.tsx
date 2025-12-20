import React, { useEffect, useRef, useState } from "react";

export const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    )
      return;

    let requestID: number | undefined;
    let mouse = { x: 0, y: 0 };

    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
        if (!isVisible) setIsVisible(true);
      }
      requestID = undefined;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      if (!requestID) {
        requestID = requestAnimationFrame(updateCursor);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.classList.contains("cursor-pointer");

      setIsHovered(isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      if (requestID) cancelAnimationFrame(requestID);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        willChange: "transform",
        marginLeft: "-2px",
        marginTop: "-2px",
      }}
    >
      <div
        className={`
          transition-transform duration-100 ease-out origin-[2px_2px]
          ${
            isClicked
              ? "scale-75 rotate-[-25deg]"
              : isHovered
              ? "scale-110"
              : "scale-100"
          }
        `}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <path
            d="M2 2L9.5 21.5L12.5 13L21.5 9.5L2 2Z"
            fill="#30557D"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
