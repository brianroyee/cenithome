import React from 'react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl: string;
  linkedin?: string;
  group: 'Founders' | 'Development Crew' | 'Community Team';
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}