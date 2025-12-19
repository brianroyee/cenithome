import React, { useState, useEffect } from "react";
import { Reveal } from "./ui/Reveal";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchJobs, Job } from "../lib/api";

export const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
      setLoading(false);
    };
    loadJobs();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <Link
          to="/"
          className="group flex items-center gap-2 text-neutral-500 hover:text-cenit-blue transition-colors mb-8"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium uppercase tracking-widest">
            Back to Home
          </span>
        </Link>

        <Reveal>
          <h1 className="text-5xl md:text-7xl font-serif italic text-neutral-900 mb-6">
            Join Our Team
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
            We're always looking for talented individuals who share our passion
            for building exceptional digital experiences. Explore our open
            positions below.
          </p>
        </Reveal>
      </div>

      {/* Stats Section */}
      <div className="bg-neutral-900 text-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Reveal>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-cenit-light">
                  12
                </p>
                <p className="text-sm uppercase tracking-widest text-neutral-400 mt-2">
                  Team Members
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-cenit-light">
                  3
                </p>
                <p className="text-sm uppercase tracking-widest text-neutral-400 mt-2">
                  Projects Ongoing
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-cenit-light">
                  100%
                </p>
                <p className="text-sm uppercase tracking-widest text-neutral-400 mt-2">
                  Remote Friendly
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-cenit-light">
                  ∞
                </p>
                <p className="text-sm uppercase tracking-widest text-neutral-400 mt-2">
                  Growth Potential
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <Reveal>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cenit-light mb-8">
            Open Positions
          </h2>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-cenit-blue" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-neutral-100 rounded-lg p-12 text-center">
            <Briefcase size={48} className="mx-auto text-neutral-400 mb-4" />
            <p className="text-xl text-neutral-600 mb-2">
              No open positions at the moment
            </p>
            <p className="text-neutral-500">
              Check back later or send us an open application below!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <Reveal key={job.id} delay={index * 0.1}>
                <div className="group bg-white border border-neutral-200 hover:border-cenit-blue rounded-lg p-6 md:p-8 transition-all hover:shadow-lg cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-cenit-blue transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-neutral-600 mt-2">{job.description}</p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <span className="flex items-center gap-1 text-sm text-neutral-500">
                          <Briefcase size={14} />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-neutral-500">
                          <MapPin size={14} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-neutral-500">
                          <Clock size={14} />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full group-hover:bg-cenit-blue transition-colors">
                        <span className="text-sm font-medium">Apply Now</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="bg-gradient-to-br from-cenit-blue to-cenit-dark rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-3xl md:text-4xl font-serif italic mb-4">
              Don't see the right fit?
            </h3>
            <p className="text-white/80 max-w-lg mx-auto mb-8">
              We're always interested in hearing from talented individuals. Send
              us your resume and let's start a conversation.
            </p>
            <a
              href="mailto:careers@cenitlabs.com"
              className="inline-block px-8 py-4 bg-white text-cenit-blue rounded-full font-bold hover:bg-neutral-100 transition-colors"
            >
              Send Open Application
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
