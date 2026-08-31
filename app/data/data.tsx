import { ReactElement } from 'react';
import { FaDribbble, FaGithub, FaLinkedin, FaRegEnvelope } from 'react-icons/fa';

export interface SocialMediaItem {
  id: number;
  label: string;
  icon: ReactElement;
  url: string;
}

export const featuredRepositories: string[] = [];

export const companies: any[] = [];

export const institutions: any[] = [];

export const socialMedia: SocialMediaItem[] = [];
