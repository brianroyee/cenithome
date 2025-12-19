import React, { useRef, useEffect, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { Link } from "react-router-dom";
import { ArrowRight, Linkedin } from "lucide-react";
import { fetchTeamMembers, TeamMember } from "../lib/api";

export const Team: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamMembers = async () => {
      setLoading(true);
      const members = await fetchTeamMembers();
      setTeamData(members);
      setLoading(false);
    };
    loadTeamMembers();
  }, []);

  return (
    <section
      id="team"
      className="py-24 md:py-32 px-6 bg-white border-t border-neutral-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cenit-light mb-6">
                03 — The Team
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-5xl md:text-7xl font-serif italic text-neutral-900 mb-8 leading-none">
                Builders & <br /> Innovators
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-lg">
                We are a collective of architects, strategists, and engineers
                obsessed with quality. Our strength lies in our diversity of
                thought.
              </p>
            </Reveal>

            {/* Mobile Only Button */}
            <div className="md:hidden mt-8">
              <Reveal delay={0.3}>
                <Link
                  to="/team"
                  className="group flex items-center gap-4 px-8 py-5 bg-neutral-900 text-white rounded-full transition-all hover:bg-cenit-blue hover:shadow-lg active:scale-95"
                >
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Meet the Team
                  </span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </Reveal>
            </div>
          </div>

          <div className="md:col-span-4 hidden md:flex justify-end items-center">
            <Reveal delay={0.4}>
              <div className="text-right">
                <p className="text-6xl font-bold text-neutral-200">
                  {teamData.length}
                </p>
                <p className="text-xs uppercase tracking-widest text-neutral-400">
                  Team Members
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Desktop Scroll Carousel */}
      <div className="hidden md:block w-full pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2))]">
        <Reveal delay={0.3} width="100%">
          {loading ? (
            <div className="flex gap-8 pb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-none w-[300px] animate-pulse">
                  <div className="aspect-[3/4] bg-neutral-200 rounded-lg mb-4" />
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : teamData.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <p>No team members yet. Add them from the admin panel.</p>
            </div>
          ) : (
            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {teamData.map((member) => (
                <div
                  key={member.id}
                  className="flex-none w-[300px] group relative snap-start"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-4 relative bg-neutral-100">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300x400?text=No+Image";
                      }}
                    />
                    {/* Overlay for social */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-white rounded-full hover:bg-cenit-blue hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                    </div>
                    {/* Group Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] uppercase tracking-wider font-bold text-neutral-900">
                        {member.group}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-neutral-900">
                      {member.name}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
              {/* Spacer for end of list */}
              <div className="w-12 flex-none"></div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};
