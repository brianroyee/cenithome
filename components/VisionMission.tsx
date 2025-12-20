import React from "react";
import { Reveal } from "./ui/Reveal";

export const VisionMission: React.FC = () => {
  return (
    <section
      id="vision"
      className="relative z-10 py-24 md:py-32 px-6 bg-white rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-neutral-100 mt-[100vh]"
    >
      <div className="max-w-7xl mx-auto space-y-48">
        {/* Vision */}
        <div className="grid md:grid-cols-12 gap-12 items-start group">
          <div className="md:col-span-3 md:sticky md:top-32 self-start mb-8 md:mb-0">
            <Reveal>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cenit-light">
                01 — Vision
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={0.1}>
              <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-neutral-900 pb-4">
                To be a leading contributor to future-shaping technology by
                building an ecosystem that{" "}
                <span className="text-cenit-blue font-serif italic">
                  pushes boundaries
                </span>
                , delivers essential tools, and empowers humanity.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Mission */}
        <div id="mission" className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-3 md:sticky md:top-32 self-start mb-8 md:mb-0">
            <Reveal>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cenit-light">
                02 — Mission
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <Reveal delay={0.1}>
              <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-neutral-900 pb-4">
                To build products that truly matter by fostering a{" "}
                <span className="text-cenit-blue font-serif italic">
                  modern, collaborative environment
                </span>{" "}
                where innovators transform ideas into purposeful technology.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
