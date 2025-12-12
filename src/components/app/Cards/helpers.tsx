import React from 'react';
import { Youtube, Instagram, AtSign, FileText, Globe } from 'lucide-react';

export const getSourceInfo = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) return { name: 'YouTube', icon: <Youtube size={10} />, color: 'bg-red-500' };
    if (lowerUrl.includes('instagram')) return { name: 'Instagram', icon: <Instagram size={10} />, color: 'bg-pink-500' };
    if (lowerUrl.includes('threads')) return { name: 'Threads', icon: <AtSign size={10} />, color: 'bg-black' };
    if (lowerUrl.includes('medium') || lowerUrl.includes('blog')) return { name: 'Blog', icon: <FileText size={10} />, color: 'bg-orange-500' };
    return { name: 'Web', icon: <Globe size={10} />, color: 'bg-blue-500' };
};

export const GlobeIcon = ({ url }: { url: string }) => {
    return <div className="w-3 h-3 bg-slate-200 rounded-full" />;
};
