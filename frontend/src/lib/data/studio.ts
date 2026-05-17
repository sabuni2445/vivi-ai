import { Video, Zap, BookOpen, Video as VideoIcon, ImageIcon, User, Globe, Mic, Layout, Library, TrendingUp, Settings } from 'lucide-react';
import React from 'react';

export interface VideoBadge {
  type: 'text' | 'icon' | 'google';
  text?: string;
  color: string;
}

export interface VideoItem {
  id: number;
  title: string;
  desc: string;
  thumb: string;
  aspect: string;
  category: string;
  badge: VideoBadge;
}

export const sampleVideos: VideoItem[] = [
  { id: 1, title: 'Gateau Bakery 1', desc: 'Cinematic Bakery', thumb: '/videos/firefly_1.mp4', aspect: 'aspect-[4/5]', category: 'food', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 2, title: 'Gateau Bakery 2', desc: 'Soft Gold lighting', thumb: '/videos/firefly_2.mp4', aspect: 'aspect-[4/3]', category: 'food', badge: { type: 'icon', color: 'bg-white text-black' } },
  { id: 3, title: 'Birthday Celebration', desc: 'Emotional Happy', thumb: '/videos/firefly_3.mp4', aspect: 'aspect-[16/9]', category: 'restaurants', badge: { type: 'google', color: 'bg-white' } },
  { id: 4, title: 'Street Food', desc: 'Sizzling Grill', thumb: '/videos/firefly_4.mp4', aspect: 'aspect-[1/2]', category: 'food', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 5, title: 'Restaurant Burgers', desc: 'Juicy Meals', thumb: '/videos/firefly_5.mp4', aspect: 'aspect-[1/1]', category: 'restaurants', badge: { type: 'icon', color: 'bg-white text-black' } },
  { id: 6, title: 'White Studio', desc: 'Elegant Outfit', thumb: '/videos/firefly_6.mp4', aspect: 'aspect-[4/5]', category: 'fashion', badge: { type: 'google', color: 'bg-white' } },
  { id: 7, title: 'Juicy Burger', desc: 'Melted Cheese', thumb: '/videos/firefly_7.mp4', aspect: 'aspect-[4/3]', category: 'food', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 8, title: 'Cozy Morning', desc: 'Fresh Croissants', thumb: '/videos/firefly_8.mp4', aspect: 'aspect-[16/9]', category: 'food', badge: { type: 'icon', color: 'bg-white text-black' } },
  { id: 9, title: 'Animated Bear 1', desc: 'Sweets Box', thumb: '/videos/firefly_9.mp4', aspect: 'aspect-[1/2]', category: 'fashion', badge: { type: 'google', color: 'bg-white' } },
  { id: 10, title: 'Animated Bear 2', desc: 'Reacting Happily', thumb: '/videos/firefly_10.mp4', aspect: 'aspect-[1/1]', category: 'fashion', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 11, title: 'Elegant Interior', desc: 'Plated Dish', thumb: '/videos/firefly_11.mp4', aspect: 'aspect-[4/5]', category: 'restaurants', badge: { type: 'icon', color: 'bg-white text-black' } },
  { id: 12, title: 'Fashion Shoot', desc: 'Confident Walk', thumb: '/videos/firefly_12.mp4', aspect: 'aspect-[4/3]', category: 'fashion', badge: { type: 'google', color: 'bg-white' } },
  { id: 13, title: 'Luxury Apartment', desc: 'Sunlight Windows', thumb: '/videos/firefly_13.mp4', aspect: 'aspect-[16/9]', category: 'realEstate', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 14, title: 'Rustic Bakery', desc: 'Kneading Dough', thumb: '/videos/firefly_14.mp4', aspect: 'aspect-[1/2]', category: 'food', badge: { type: 'icon', color: 'bg-white text-black' } },
  { id: 15, title: 'Morning Commercial', desc: '4K Sequence', thumb: '/videos/firefly_15.mp4', aspect: 'aspect-[1/1]', category: 'food', badge: { type: 'google', color: 'bg-white' } },
  { id: 16, title: 'Bakery Seq 1', desc: 'Ultra Cinematic', thumb: '/videos/firefly_16.mp4', aspect: 'aspect-[4/5]', category: 'food', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 17, title: 'Bakery Seq 2', desc: 'Luxury Sequence', thumb: '/videos/firefly_17.mp4', aspect: 'aspect-[4/3]', category: 'food', badge: { type: 'icon', color: 'bg-white text-black' } },
  { id: 18, title: 'Realistic Closeup', desc: 'Exquisite Details', thumb: '/videos/firefly_18.mp4', aspect: 'aspect-[16/9]', category: 'food', badge: { type: 'google', color: 'bg-white' } },
  { id: 19, title: 'Vibrant Dessert', desc: 'Macarons Display', thumb: '/videos/firefly_19.mp4', aspect: 'aspect-[1/2]', category: 'food', badge: { type: 'text', text: 'Fi', color: 'bg-[#FF1A1A] text-white' } },
  { id: 20, title: 'Bonus Commercial', desc: 'Creative Shot', thumb: '/videos/firefly_20.mp4', aspect: 'aspect-[1/1]', category: 'food', badge: { type: 'icon', color: 'bg-white text-black' } }
];

export const suiteTools = [
  { id: 'text-video', title: 'Text to Video', desc: 'Generate videos from text prompts', icon: '/videos/firefly_1.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'frame-video', title: 'Frame to Video', desc: 'Generate videos from images', icon: '/videos/firefly_2.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'motion-sync', title: 'Motion Sync', desc: 'Motion sync videos from image and motion...', icon: '/videos/firefly_3.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'lip-sync', title: 'Lip-Sync', desc: 'Lip-sync videos from audio and image', icon: '/videos/firefly_4.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'edit-video', title: 'Edit Video', desc: 'Modify or retake videos (Kling 01, LTX...)', icon: '/videos/firefly_5.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'create-image', title: 'Create Image', desc: 'Generate images from text prompts', icon: '/videos/firefly_6.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'edit-image', title: 'Edit Image', desc: 'Edit images with AI models', icon: '/videos/firefly_7.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'image-upscale', title: 'Image Upscale', desc: 'Upscale and enhance image quality', icon: '/videos/firefly_8.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'camera-angle', title: 'Camera Angle Contr...', desc: 'Control the camera angle of the image', icon: '/videos/firefly_9.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
  { id: 'create-voice', title: 'Create voice-over', desc: 'Generate natural sounding voiceovers fro...', icon: '/videos/firefly_10.mp4', bg: 'bg-[#111111]', titleColor: 'text-green-400' },
];
