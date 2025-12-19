import React, { useEffect, useState } from "react";
import { ArrowLeft, Linkedin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "./ui/Reveal";
import { fetchTeamMembers, TeamMember } from "../lib/api";

export const TeamPage: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount and load data
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      const members = await fetchTeamMembers();
      setTeamData(members);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-neutral-950 min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cenit-blue" />
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 min-h-screen">
      {/* Back Button */}
      <div className="fixed top-24 left-6 z-50 md:hidden">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium uppercase tracking-widest">
            Back
          </span>
        </Link>
      </div>

      {/* Intro Section */}
      <div className="h-[50vh] flex flex-col justify-end px-6 pb-12 relative sticky top-0 bg-neutral-900 z-0">
        <Reveal>
          <p className="text-cenit-blue mb-4 uppercase tracking-[0.2em] text-xs font-bold">
            The Collective
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-2">
            Meet the <br />
            <span className="font-serif italic text-cenit-light">
              Architects.
            </span>
          </h1>
        </Reveal>
      </div>

      {/* Sticky Stacked Cards */}
      <div className="relative z-10">
        {teamData.length === 0 ? (
          <div className="h-screen flex items-center justify-center text-white text-center">
            <div>
              <p className="text-xl text-neutral-400">No team members yet.</p>
              <p className="text-neutral-500 mt-2">
                Add them from the admin panel (Ctrl+Shift+A)
              </p>
            </div>
          </div>
        ) : (
          teamData.map((member, index) => (
            <div
              key={member.id}
              className="sticky top-0 h-screen w-full flex flex-col bg-neutral-900 overflow-hidden"
              style={{
                // Slight offset for stacking effect visual
                top: "0px",
                zIndex: index + 1,
              }}
            >
              <div className="relative w-full h-full">
                {/* Image with zoom effect */}
                <div className="absolute inset-0">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover opacity-60 scale-105"
                    style={{
                      transition: "transform 10s ease-out",
                      transform: "scale(1.1)",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x600?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 pb-24 md:pb-12 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                      0{index + 1}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-cenit-blue font-bold">
                      {member.group}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-white">
                    {member.name}
                  </h2>
                  <p className="text-cenit-light text-xl font-medium">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-neutral-300 text-lg md:text-xl max-w-md font-light leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  {member.linkedin && (
                    <div className="pt-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-white hover:text-cenit-blue transition-colors"
                      >
                        <Linkedin size={20} />
                        <span className="text-sm uppercase tracking-wider">
                          Connect
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Contact for Team Page */}
      <div className="relative z-50 bg-white py-24 px-6">
        <div className="max-w-md mx-auto text-center space-y-8">
          <h3 className="text-3xl font-serif italic text-neutral-900">
            Want to join us?
          </h3>
          <Link
            to="/careers"
            className="inline-block bg-neutral-900 text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-cenit-blue transition-colors"
          >
            Open Positions
          </Link>
          <div className="pt-8">
            <Link
              to="/"
              className="text-neutral-500 hover:text-neutral-900 underline underline-offset-4 text-sm"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
