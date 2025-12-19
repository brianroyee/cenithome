import React from 'react';
import { Reveal } from './ui/Reveal';
import { Story } from '../types';
import { ArrowUpRight } from 'lucide-react';

const storiesData: Story[] = [
  {
    id: '1',
    title: "The Pivot Point",
    category: "Culture",
    date: "Oct 2023",
    excerpt: "Why we scrapped a 6-month project to realign with our core mission of human empowerment. Sometimes moving forward means stopping completely.",
    content: ""
  },
  {
    id: '2',
    title: "Sleepless in Synthesis",
    category: "Engineering",
    date: "Dec 2023",
    excerpt: "The technical breakthrough that allowed our ecosystem to scale. We redesigned our entire data pipeline to handle real-time streams with zero latency.",
    content: ""
  },
  {
    id: '3',
    title: "Design for the Unseen",
    category: "Design",
    date: "Feb 2024",
    excerpt: "Creating reliable tools for users who need them most. We spent weeks in the field understanding the exact constraints of our end users.",
    content: ""
  }
];

export const Stories: React.FC = () => {
  return (
    <section id="stories" className="relative z-10 py-32 px-6 bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-neutral-900">
              Inside <span className="font-serif italic text-cenit-blue">the Lab</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-neutral-500 max-w-md text-right md:text-left">
              Stories from the trenches of innovation.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-12 pb-24">
          {storiesData.map((story, index) => (
            <div 
              key={story.id} 
              className="sticky"
              style={{ top: `${150 + index * 40}px` }} 
            >
              <Reveal delay={0.1}>
                <div className="group cursor-pointer bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-neutral-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 space-y-6">
                        <div className="flex items-center gap-4">
                           <span className="px-3 py-1 bg-cenit-accent text-cenit-blue text-xs uppercase tracking-widest rounded-full">
                             {story.category}
                           </span>
                           <span className="text-neutral-400 text-sm">{story.date}</span>
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl font-bold text-neutral-900 group-hover:text-cenit-blue transition-colors">
                          {story.title}
                        </h3>
                        
                        <p className="text-neutral-600 text-lg leading-relaxed">
                          {story.excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-neutral-900 font-medium group-hover:gap-4 transition-all pt-4">
                          <span>Read Story</span>
                          <ArrowUpRight size={18} />
                        </div>
                    </div>

                    <div className="order-1 md:order-2 overflow-hidden rounded-2xl aspect-video md:aspect-[4/3] bg-neutral-100 relative">
                       <img 
                        src={`https://picsum.photos/seed/${story.id}story/800/600`} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-cenit-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};