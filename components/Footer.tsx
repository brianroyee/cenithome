import React from "react";
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  ArrowUpRight,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer
      id="footer"
      className="relative z-20 bg-white pt-24 pb-12 px-6 border-t border-neutral-200"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <Reveal>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-neutral-900 mb-8">
                Let's build <br />
                <span className="text-cenit-blue font-serif italic">
                  together.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <a
                href="mailto:contact@cenitlabs.org"
                className="inline-flex items-center gap-2 text-xl text-neutral-900 hover:text-cenit-blue transition-colors border-b border-neutral-300 pb-1"
              >
                contact@cenitlabs.org
                <ArrowUpRight size={20} />
              </a>
            </Reveal>
          </div>

          <div className="flex flex-col justify-end">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Reveal delay={0.2}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">
                    Socials
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="#"
                        className="flex items-center gap-3 text-neutral-500 hover:text-cenit-blue transition-colors group cursor-pointer"
                      >
                        <Twitter
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>Twitter / X</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center gap-3 text-neutral-500 hover:text-cenit-blue transition-colors group cursor-pointer"
                      >
                        <Linkedin
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>LinkedIn</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center gap-3 text-neutral-500 hover:text-cenit-blue transition-colors group cursor-pointer"
                      >
                        <Github
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>GitHub</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="flex items-center gap-3 text-neutral-500 hover:text-cenit-blue transition-colors group cursor-pointer"
                      >
                        <Instagram
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>Instagram</span>
                      </a>
                    </li>
                  </ul>
                </Reveal>
              </div>

              <div>
                <Reveal delay={0.3}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">
                    Sitemap
                  </h3>
                  <ul className="space-y-4 text-neutral-500">
                    <li>
                      <a
                        href="#vision"
                        className="hover:text-cenit-blue transition-colors cursor-pointer"
                      >
                        Vision
                      </a>
                    </li>
                    <li>
                      <a
                        href="#mission"
                        className="hover:text-cenit-blue transition-colors cursor-pointer"
                      >
                        Mission
                      </a>
                    </li>
                    <li>
                      <a
                        href="#team"
                        className="hover:text-cenit-blue transition-colors cursor-pointer"
                      >
                        Team
                      </a>
                    </li>
                    <li>
                      <Link
                        to="/careers"
                        className="hover:text-cenit-blue transition-colors cursor-pointer"
                      >
                        Careers
                      </Link>
                    </li>
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200 text-xs text-neutral-400 uppercase tracking-widest">
          <p>
            &copy; {new Date().getFullYear()} Cénit Labs. All rights reserved.
          </p>
          <p>Building What Matters</p>
        </div>
      </div>
    </footer>
  );
};
