import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  Bookmark,
  Clock,
  ArrowRight,
  Zap,
  TrendingUp,
  Globe,
  MessageSquare,
  Share2,
  Plus,
  Send,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { usePublicClips, PublicClip, PublicComment } from '../../hooks/usePublicClips';
import { useClips } from '../../hooks/useClips';

// Standard categories for normalization
const STANDARD_CATEGORIES: Record<string, string[]> = {
  'Design': ['design', 'ui', 'ux', 'graphic', 'figma', 'sketch', 'interface', 'visual', 'branding', 'logo'],
  'Development': ['development', 'dev', 'coding', 'programming', 'frontend', 'backend', 'web', 'app', 'software', 'code', 'react', 'javascript', 'typescript', 'python'],
  'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'gemini', 'claude', 'chatgpt', 'deep learning'],
  'Crypto': ['crypto', 'blockchain', 'bitcoin', 'ethereum', 'web3', 'nft', 'defi'],
  'Startup': ['startup', 'entrepreneur', 'business', 'founder', 'vc', 'venture', 'funding'],
  'Marketing': ['marketing', 'growth', 'seo', 'ads', 'advertising', 'social media', 'brand'],
  'Productivity': ['productivity', 'efficiency', 'workflow', 'automation', 'tools', 'notion', 'obsidian'],
  'Finance': ['finance', 'investment', 'stock', 'money', 'economics'],
  'Health': ['health', 'fitness', 'wellness', 'medical', 'exercise'],
  'Other': ['other', 'uncategorized', 'misc']
};

// Normalize category name to standard category
const normalizeCategory = (category: string): string => {
  const lowerCategory = category.toLowerCase().trim();

  for (const [standard, keywords] of Object.entries(STANDARD_CATEGORIES)) {
    if (keywords.some(keyword => lowerCategory.includes(keyword) || keyword.includes(lowerCategory))) {
      return standard;
    }
  }

  return 'Other';
};

// Placeholder image for clips without images
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80";

export const LinkBrainArticle = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedClip, setSelectedClip] = useState<PublicClip | null>(null);
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);

  const { publicClips, loading, fetchPublicClips, fetchComments, addComment, incrementSaveCount } = usePublicClips();
  const { createClip, user } = useClips();

  const isDark = theme === 'dark';

  // Extract and normalize categories from public clips
  const dynamicCategories = useMemo(() => {
    if (publicClips.length === 0) return ['All'];

    const normalizedCats = new Set<string>();
    publicClips.forEach(clip => {
      if (clip.category) {
        normalizedCats.add(normalizeCategory(clip.category));
      }
    });

    // Sort alphabetically and prepend "All"
    const sorted = Array.from(normalizedCats).sort();
    return ['All', ...sorted];
  }, [publicClips]);

  // Reset to All if current category doesn't exist anymore
  useEffect(() => {
    if (activeCategory !== 'All' && !dynamicCategories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [dynamicCategories, activeCategory]);

  // Fetch public clips on mount and category change
  useEffect(() => {
    fetchPublicClips(activeCategory);
  }, [activeCategory, fetchPublicClips]);

  // Fetch comments when clip is selected
  useEffect(() => {
    if (selectedClip) {
      fetchComments(selectedClip.id).then(setComments);
    } else {
      setComments([]);
    }
  }, [selectedClip, fetchComments]);

  // Handle import to my clips
  const handleImport = async (clip: PublicClip) => {
    if (!user) {
      toast.error('Please login to import clips');
      return;
    }

    setImporting(clip.id);
    try {
      await createClip({
        url: clip.url,
        title: clip.title,
        summary: clip.summary,
        image: clip.image,
        platform: clip.platform as any,
        category: clip.category,
        keywords: clip.keywords,
        template: '',
        sentiment: 'neutral',
        type: 'article',
        author: '',
        authorProfile: null,
        mediaItems: [],
        engagement: null,
        mentions: [],
        comments: [],
        publishDate: null,
        htmlContent: ''
      });
      await incrementSaveCount(clip.id);
      toast.success('Clip added to your brain');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import clip');
    } finally {
      setImporting(null);
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!commentInput.trim() || !selectedClip) return;

    setCommentLoading(true);
    try {
      const result = await addComment(selectedClip.id, commentInput.trim());
      if (result.success) {
        setCommentInput("");
        // Refresh comments
        const updatedComments = await fetchComments(selectedClip.id);
        setComments(updatedComments);
        toast.success('Comment added');
      } else {
        toast.error(result.reason || 'Comment not allowed');
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Format relative time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Get featured clip (most saved)
  const featuredClip = publicClips.length > 0 ? publicClips[0] : null;
  const gridClips = publicClips.slice(1);

  return (
    <div className={`w-full min-h-full p-4 md:p-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <Zap className="text-[#21DBA4]" size={24} fill="currentColor" />
          <h1 className="text-2xl font-black tracking-tight">Community Picks</h1>
        </div>

        {/* Loading State */}
        {loading && publicClips.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#21DBA4]" size={32} />
          </div>
        )}

        {/* Empty State */}
        {!loading && publicClips.length === 0 && (
          <div className={`text-center py-20 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <Globe size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-bold mb-2">No community clips yet</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Be the first to share your clips with the community
            </p>
          </div>
        )}

        {/* Featured Banner */}
        {featuredClip && (
          <div
            onClick={() => setSelectedClip(featuredClip)}
            className="relative w-full h-[500px] md:h-[400px] rounded-3xl overflow-hidden mb-12 group cursor-pointer shadow-2xl shadow-[#21DBA4]/10"
          >
            <img
              src={featuredClip.image || PLACEHOLDER_IMAGE}
              alt={featuredClip.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#21DBA4] text-white text-xs font-bold rounded-full shadow-lg shadow-[#21DBA4]/20">
                  {featuredClip.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <TrendingUp size={12} /> {featuredClip.saveCount} saves
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight max-w-4xl drop-shadow-sm">
                {featuredClip.title}
              </h2>

              <p className="text-white/80 text-sm md:text-lg mb-8 max-w-2xl leading-relaxed line-clamp-2">
                {featuredClip.summary}
              </p>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-white/80">
                    Shared by <span className="text-white font-bold">Community</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleImport(featuredClip); }}
                    disabled={importing === featuredClip.id}
                    className="px-6 py-3 bg-[#21DBA4] hover:bg-[#1ec997] text-white rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#21DBA4]/20"
                  >
                    {importing === featuredClip.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    Add to My Brain
                  </button>
                  <button className="px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn border border-white/30">
                    View <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters - Only show if there are clips */}
        {publicClips.length > 0 && (
          <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible items-center gap-2 mb-8 sticky top-0 z-20 py-4 -mx-4 px-4 bg-inherit backdrop-blur-sm no-scrollbar">
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === cat
                  ? 'bg-[#21DBA4] text-white shadow-lg shadow-[#21DBA4]/20 scale-105'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 shadow-sm'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {gridClips.map(clip => (
            <motion.div
              key={clip.id}
              layoutId={`clip-${clip.id}`}
              onClick={() => setSelectedClip(clip)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-3xl overflow-hidden group cursor-pointer border transition-all hover:-translate-y-1 hover:shadow-xl relative flex flex-col ${isDark ? 'bg-slate-900 border-slate-800 shadow-slate-900/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-slate-200/50'
                }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img src={clip.image || PLACEHOLDER_IMAGE} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold rounded-md shadow-sm">
                    {clip.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleImport(clip); }}
                    disabled={importing === clip.id}
                    className="bg-[#21DBA4] text-white px-5 py-2 rounded-full font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                  >
                    {importing === clip.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    Add to My Brain
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-[#21DBA4] text-[10px] font-bold">
                  <Zap size={12} fill="currentColor" />
                  <span>{clip.saveCount} saves</span>
                </div>

                <h3 className={`font-bold text-lg leading-tight mb-2 group-hover:text-[#21DBA4] transition-colors ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {clip.title}
                </h3>
                <p className={`text-xs line-clamp-2 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {clip.summary}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#21DBA4] to-[#1ec997] flex items-center justify-center">
                      <Globe size={12} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Community</span>
                      <span className="text-[9px] text-slate-400">{formatTime(clip.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MessageSquare size={12} /> {clip.commentCount}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clip Detail Overlay with Comments */}
        {selectedClip && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setSelectedClip(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-2xl h-full shadow-2xl relative flex flex-col overflow-hidden ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}`}
            >
              {/* Header */}
              <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedClip(null)} className={`p-2 -ml-2 rounded-full ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                  <div className={`h-4 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Community Clip</span>
                </div>
                <button
                  onClick={() => handleImport(selectedClip)}
                  disabled={importing === selectedClip.id}
                  className="flex items-center gap-2 px-4 py-2 bg-[#21DBA4] hover:bg-[#1ec997] text-white rounded-full font-bold text-xs transition-all"
                >
                  {importing === selectedClip.id ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add to My Brain
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-0">
                <div className="relative h-64 md:h-80 w-full">
                  <img src={selectedClip.image || PLACEHOLDER_IMAGE} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="px-3 py-1 bg-[#21DBA4] text-white text-xs font-bold rounded-full shadow-lg mb-3 inline-block">
                      {selectedClip.category}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                      {selectedClip.title}
                    </h1>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span>{selectedClip.saveCount} saves</span>
                      <span>-</span>
                      <span>{selectedClip.commentCount} comments</span>
                      <span>-</span>
                      <span>{formatTime(selectedClip.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 max-w-xl mx-auto">
                  <p className={`text-lg leading-relaxed font-medium mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedClip.summary}
                  </p>

                  {/* Visit Original Link */}
                  <a
                    href={selectedClip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-4 rounded-2xl border mb-8 transition-all hover:border-[#21DBA4] ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <Globe size={18} className="text-[#21DBA4]" />
                    <span className="text-sm font-medium">Visit Original</span>
                    <ArrowRight size={14} className="ml-auto text-slate-400" />
                  </a>

                  {/* Anonymous Comments Section */}
                  <div className={`border-t pt-8 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#21DBA4]" />
                      Comments ({comments.length})
                    </h3>

                    {/* Comment Input */}
                    <div className={`flex items-center gap-3 p-3 rounded-2xl border mb-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder="Add an anonymous comment..."
                        maxLength={500}
                        className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'}`}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={commentLoading || !commentInput.trim()}
                        className={`p-2 rounded-full transition-all ${commentInput.trim() ? 'bg-[#21DBA4] text-white' : isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'}`}
                      >
                        {commentLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length === 0 && (
                        <p className={`text-sm text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          No comments yet. Be the first to share your thoughts.
                        </p>
                      )}
                      {comments.map(comment => (
                        <div key={comment.id} className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-[10px] font-bold">
                              A
                            </div>
                            <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Anonymous</span>
                            <span className="text-[10px] text-slate-400">{formatTime(comment.createdAt)}</span>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="h-32"></div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
