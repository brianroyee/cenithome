import React from "react";
import { ArrowDown } from "lucide-react";
import { Reveal } from "./ui/Reveal";

export const Hero: React.FC = () => {
  return (
    <div className="sticky top-0 z-0 h-screen w-full">
      <section className="h-full flex flex-col justify-center items-center px-6 relative pt-20 bg-neutral-50">
        <div className="max-w-5xl w-full">
          <Reveal>
            <p className="text-cenit-blue mb-6 uppercase tracking-[0.2em] text-sm font-bold">
              Product Studio
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-neutral-900 leading-[0.9] mb-8 pb-4">
              Build what <br />
              <span className="font-serif italic text-cenit-light/80">
                matters.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-xl text-lg md:text-xl text-neutral-600 leading-relaxed mb-8">
              We are{" "}
              <span className="text-cenit-blue font-semibold">Cénit Labs</span>.
              We don't just write code; we cultivate ecosystems that push
              boundaries and empower humanity.
            </p>
          </Reveal>
        </div>

        {/* Scroll Indicator - Centered */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400">
          <span className="text-xs uppercase tracking-[0.2em] font-medium md:hidden">
            Scroll to explore
          </span>
          <div className="animate-bounce p-2 rounded-full border border-neutral-300/50">
            <ArrowDown size={20} className="md:w-6 md:h-6" />
          </div>
        </div>
      </section>
    </div>
  );
};
