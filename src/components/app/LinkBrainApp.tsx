import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useClips, ClipData } from '../../hooks/useClips';
import { TRANSLATIONS, CATEGORY_COLORS } from './constants';
import { LinkItem, Category, Collection } from './types';
import { DeleteConfirmationModal, AddLinkModal, ManagementModal, CategoryManagerModal } from './Modals';
import { LinkCard, LinkRow, NavItem, getSourceInfo, GlobeIcon } from './Cards';
import { LinkDetailPanel, SettingsModal } from './Panels';
import {
   Search,
   Plus,
   Grid,
   List,
   Menu,
   X,
   Home,
   Clock,
   Star,
   Archive,
   Settings,
   FolderOpen,
   Hash,
   ExternalLink,
   Sparkles,
   Filter,
   Brain,
   Youtube,
   Instagram,
   Globe,
   FileText,
   AtSign,
   Trash2,
   CheckCircle,
   MoreHorizontal,
   Share2,
   CheckSquare,
   Square,
   Edit2,
   Library,
   ChevronDown,
   AlertTriangle,
   ArrowUpDown,
   Check,
   Tag,
   ChevronRight,
   ChevronLeft,
   User,
   Bell,
   Shield,
   Zap,
   LogOut,
   CreditCard,
   Moon,
   Sun,
   Smartphone,
   Download,
   Upload,
   Image as ImageIcon,
   Languages,
   Compass,
   Send,
   Copy,
   BookOpen,
   LayoutGrid
} from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion, AnimatePresence } from 'motion/react';
import { toast } from "sonner@2.0.3";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuSeparator,
   DropdownMenuCheckboxItem
} from "../ui/dropdown-menu";
import { AIInsightsDashboard } from '../AIInsightsDashboard';
import { LinkBrainArticle } from './LinkBrainArticle';
import { Logo } from '../Logo';

// --- Mock Data ---
const INITIAL_CATEGORIES: Category[] = [
   { id: 'design', name: 'Design', color: 'bg-pink-100 text-pink-600' },
   { id: 'dev', name: 'Development', color: 'bg-blue-100 text-blue-600' },
   { id: 'ai', name: 'AI & ML', color: 'bg-emerald-100 text-emerald-600' },
   { id: 'business', name: 'Business', color: 'bg-orange-100 text-orange-600' },
];

const INITIAL_COLLECTIONS: Collection[] = [
   { id: 'reading-list-2025', name: 'Must Read 2025', color: 'bg-teal-500' }
];

const INITIAL_LINKS: LinkItem[] = [
   {
      id: 1,
      title: "The Future of Design Systems in 2025",
      url: "medium.com/design-ux",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
      summary: "AI-driven design tokens and generative UI components are reshaping how we build interfaces. This article explores the shift from static libraries to dynamic, context-aware systems.",
      tags: ["Design", "AI", "Trends"],
      date: "2h ago",
      timestamp: Date.now() - 7200000,
      readTime: "5 min",
      aiScore: 98,
      categoryId: 'design',
      collectionIds: ['reading-list-2025'],
      isFavorite: true,
      isReadLater: false,
      isArchived: false,
      keyTakeaways: [
         "Shift from static Figma libraries to code-generated UI",
         "Context-aware tokens that adapt to user behavior",
         "AI co-pilots managing accessibility automatically"
      ]
   },
   {
      id: 2,
      title: "Building AI Agents with MCP (Model Context Protocol)",
      url: "youtube.com/watch?v=ai_agents",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      summary: "A deep dive into how MCP enables standardized context exchange between LLMs and external tools. Essential reading for building agentic workflows.",
      tags: ["Dev", "LLM", "Protocol"],
      date: "5h ago",
      timestamp: Date.now() - 18000000,
      readTime: "12 min",
      aiScore: 95,
      categoryId: 'ai',
      collectionIds: [],
      isFavorite: false,
      isReadLater: true,
      isArchived: false,
      keyTakeaways: [
         "Standardizing context exchange is crucial for agents",
         "MCP reduces hallucination by grounding data",
         "Server-client architecture for LLM tools"
      ]
   },
   {
      id: 3,
      title: "Minimalist UI Inspiration for 2025",
      url: "instagram.com/p/design_daily",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      summary: "Curated collection of clean, typography-driven interfaces that are trending this month. Great reference for modern SaaS dashboards.",
      tags: ["Inspiration", "UI", "Minimal"],
      date: "1d ago",
      timestamp: Date.now() - 86400000,
      readTime: "1 min",
      aiScore: 88,
      categoryId: 'design',
      collectionIds: [],
      isFavorite: true,
      isReadLater: false,
      isArchived: false
   },
   {
      id: 4,
      title: "Why 'Vibe Coding' is the Future of Software",
      url: "threads.net/@tech_guru",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      summary: "Coding is becoming more about intent and less about syntax. How 'Vibe Coding' is lowering the barrier to entry for software creation.",
      tags: ["Coding", "Opinion", "Future"],
      date: "2d ago",
      timestamp: Date.now() - 172800000,
      readTime: "3 min",
      aiScore: 92,
      categoryId: 'dev',
      collectionIds: [],
      isFavorite: false,
      isReadLater: true,
      isArchived: false
   },
   {
      id: 5,
      title: "Sustainable Architecture Trends",
      url: "archdaily.com",
      image: "https://images.unsplash.com/photo-1518005020951-ecc8e1213afc?q=80&w=800&auto=format&fit=crop",
      summary: "Exploring biophilic design and carbon-neutral construction materials gaining traction in modern urban planning.",
      tags: ["Architecture", "Green"],
      date: "3d ago",
      timestamp: Date.now() - 259200000,
      readTime: "10 min",
      aiScore: 75,
      categoryId: 'business',
      collectionIds: [],
      isFavorite: false,
      isReadLater: false,
      isArchived: false
   },
   {
      id: 6,
      title: "Generative AI for Marketing Strategy",
      url: "hbr.org",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      summary: "How top CMOs are leveraging GenAI to personalize customer journeys at scale without losing brand voice.",
      tags: ["Marketing", "Business", "AI"],
      date: "4d ago",
      timestamp: Date.now() - 345600000,
      readTime: "7 min",
      aiScore: 82,
      categoryId: 'business',
      collectionIds: [],
      isFavorite: false,
      isReadLater: false,
      isArchived: false
   }
];

export const LinkBrainApp = ({ onBack, onLogout, language, setLanguage, initialTab = 'home' }: { onBack?: () => void, onLogout?: () => void, language: 'en' | 'ko', setLanguage: (lang: 'en' | 'ko') => void, initialTab?: string }) => {
   // --- Firebase Data Hook ---
   const {
      clips: firebaseClips,
      collections: firebaseCollections,
      categories: firebaseCategories,
      loading: dataLoading,
      error: dataError,
      user,
      analyzeUrl,
      updateClip,
      deleteClip,
      createCollection,
      updateCollection,
      deleteCollection: deleteCollectionApi,
      createCategory,
      updateCategory,
      deleteCategory: deleteCategoryApi,
      getClips
   } = useClips();

   // --- Global State ---
   const [theme, setTheme] = useState<'light' | 'dark'>('light');
   const [showThumbnails, setShowThumbnails] = useState(true);
   // language state is now passed from props

   // Notification Settings State
   const [notifications, setNotifications] = useState({
      weeklyDigest: true,
      productUpdates: false,
      securityAlerts: true
   });

   // Convert ClipData to LinkItem format
   const clipToLinkItem = (clip: ClipData): LinkItem => {
      // Extract key takeaways from summary if available (split by sentences or bullet points)
      let takeaways: string[] = [];
      if (clip.summary) {
         // Try to extract bullet points or sentences as takeaways
         const sentences = clip.summary.split(/[.!?]/).filter(s => s.trim().length > 20);
         takeaways = sentences.slice(0, 3).map(s => s.trim());
      }

      // Enhanced date parsing
      const getTimestamp = (clip: ClipData): number => {
         if (clip.createdAt) {
            // Handle Firestore Timestamp (has seconds/nanoseconds) or Date object or ISO string
            if (typeof clip.createdAt === 'object' && 'seconds' in clip.createdAt) {
               return (clip.createdAt as any).seconds * 1000;
            }
            return new Date(clip.createdAt).getTime();
         }
         return Date.now();
      };

      const timestamp = getTimestamp(clip);

      return {
         id: clip.id || `temp-${Date.now()}`,
         title: clip.title || 'Untitled',
         url: clip.url || '',
         image: clip.image || clip.images?.[0] || '',
         summary: clip.summary || '',
         tags: clip.keywords || [],
         date: new Date(timestamp).toLocaleDateString(),
         timestamp: timestamp,
         readTime: clip.contentMarkdown ? `${Math.ceil(clip.contentMarkdown.length / 1000)} min` : '3 min',
         aiScore: 85,
         categoryId: clip.category || 'general',
         collectionIds: clip.collectionIds || [],
         isFavorite: clip.isFavorite || false,
         isReadLater: false,
         isArchived: clip.isArchived || false,
         notes: '',
         keyTakeaways: takeaways,
         content: clip.contentMarkdown || clip.contentHtml || clip.rawMarkdown || '',
         platform: clip.platform || 'web',
         images: clip.images || (clip.image ? [clip.image] : []),
         author: clip.author || '',
         authorHandle: (clip.authorProfile as any)?.handle || '',
         authorAvatar: (clip.authorProfile as any)?.avatar || ''
      };
   };

   // State - now uses Firebase data
   const [links, setLinks] = useState<LinkItem[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [collections, setCollections] = useState<Collection[]>([]);

   // Sync Firebase clips to local state
   useEffect(() => {
      // Always sync, even when array is empty (for deletion persistence)
      if (firebaseClips) {
         setLinks(firebaseClips.map(clipToLinkItem));
      }
   }, [firebaseClips]);

   // Sync Firebase categories to local state
   useEffect(() => {
      // Always sync, even when array is empty (for deletion persistence)
      if (firebaseCategories) {
         setCategories(firebaseCategories.map(c => ({
            id: c.id || '',
            name: c.name || '',
            color: c.color || 'bg-slate-500' // Default fallback
         })));
      }
   }, [firebaseCategories]);

   // --- Auto-Migration for Legacy/Dynamic Categories ---
   // If we have links but NO categories (e.g. after moving to real DB),
   // scan links and create real category documents for them.
   // This runs once to restore the user's categories as "real" data.
   useEffect(() => {
      const migrateCategories = async () => {
         // Only run if we have loaded links, but have 0 categories loaded (and finished loading)
         if (links.length > 0 && categories.length === 0 && !dataLoading) {
            console.log("Auto-migrating categories from links...");
            const uniqueCategories = new Set<string>();
            links.forEach(l => {
               if (l.categoryId && l.categoryId !== 'uncategorized') {
                  uniqueCategories.add(l.categoryId);
               }
            });

            // Palette to assign consistent colors
            const palette = Object.keys(CATEGORY_COLORS).filter(c => !c.includes('slate'));

            let colorIdx = 0;
            const promises = Array.from(uniqueCategories).map(async (catId) => {
               const color = palette[colorIdx % palette.length];
               colorIdx++;

               // Use the createCategory from useClips which we updated to support UPSERT (setDoc)
               // This ensures we don't accidentally duplicate if it's lagging
               await createCategory({
                  id: catId,
                  name: catId.charAt(0).toUpperCase() + catId.slice(1),
                  color: color
               });
            });

            if (promises.length > 0) {
               await Promise.all(promises);
               toast.success("Categories restored from links!");
            }
         }
      };

      // Removed generic setTimeout to speed up appearance.
      // We rely on dataLoading flag to ensure we don't run too early.
      migrateCategories();

   }, [links.length, categories.length, dataLoading]);

   // Sync Firebase collections to local state
   useEffect(() => {
      // Always sync, even when array is empty (for deletion persistence)
      if (firebaseCollections) {
         setCollections(firebaseCollections.map(c => ({
            id: c.id || '',
            name: c.name || 'Untitled',
            color: c.color || 'bg-gray-500'
         })));
      }
   }, [firebaseCollections]);

   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
   const [activeTab, setActiveTab] = useState(initialTab);
   const [searchQuery, setSearchQuery] = useState('');
   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
   const [mobileViewMode, setMobileViewMode] = useState<'list' | 'grid'>('list');

   // Sidebar Toggles
   const [isSmartFoldersOpen, setIsSmartFoldersOpen] = useState(true);
   const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

   // Selection
   const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

   // Advanced Filter State
   const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score'>('date-desc');
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const filterRef = useRef<HTMLDivElement>(null);
   const [filterCategories, setFilterCategories] = useState<string[]>([]);
   const [filterSources, setFilterSources] = useState<string[]>([]);
   const [filterTags, setFilterTags] = useState<string[]>([]);
   const [showAllTags, setShowAllTags] = useState(false);
   const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

   // Modals
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
   const [showFlyAnimation, setShowFlyAnimation] = useState(false);
   const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
   const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
   const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

   // Delete Confirmation State
   const [deleteConfirmation, setDeleteConfirmation] = useState<{
      isOpen: boolean;
      count: number;
      onConfirm: () => void;
   }>({ isOpen: false, count: 0, onConfirm: () => { } });

   // Selection Mode State
   const [isSelectionMode, setIsSelectionMode] = useState(false);
   const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

   // Shortcuts Effect
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key === "'") {
            e.preventDefault();
            setTheme(prev => prev === 'light' ? 'dark' : 'light');
         }
         if ((e.metaKey || e.ctrlKey) && e.key === "/") {
            e.preventDefault();
            setShowThumbnails(prev => !prev);
         }
         if ((e.metaKey || e.ctrlKey) && e.key === ".") {
            e.preventDefault();
            setLanguage(prev => prev === 'en' ? 'ko' : 'en');
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   // Filter Outside Click
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
            setIsFilterOpen(false);
         }
      };
      if (isFilterOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      } else {
         document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [isFilterOpen]);

   // Helper for Translation
   const t = (key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[language][key];

   // Derived Data
   const { availableSources, availableTags, availableCategories } = useMemo(() => {
      const sources = new Set<string>();
      const tags = new Set<string>();
      const usedCatIds = new Set<string>();

      links.forEach(link => {
         sources.add(getSourceInfo(link.url).name);
         link.tags.forEach(t => tags.add(t));
         usedCatIds.add(link.categoryId);
      });

      return {
         availableSources: Array.from(sources).sort(),
         availableTags: Array.from(tags).sort(),
         availableCategories: categories.filter(c => usedCatIds.has(c.id))
      };
   }, [links, categories]);

   const selectedLink = useMemo(() =>
      selectedLinkId ? links.find(l => l.id === selectedLinkId) || null : null
      , [links, selectedLinkId]);

   const filteredLinks = useMemo(() => {
      let result = links;

      if (activeTab === 'later') {
         result = result.filter(l => l.isReadLater && !l.isArchived);
      } else if (activeTab === 'favorites') {
         result = result.filter(l => l.isFavorite && !l.isArchived);
      } else if (activeTab === 'archive') {
         result = result.filter(l => l.isArchived);
      } else if (activeTab === 'home') {
         result = result.filter(l => !l.isArchived);
      } else {
         if (categories.some(c => c.id === activeTab)) {
            result = result.filter(l => l.categoryId === activeTab && !l.isArchived);
         }
         else if (collections.some(c => c.id === activeTab)) {
            result = result.filter(l => l.collectionIds.includes(activeTab) && !l.isArchived);
         }
      }

      if (searchQuery) {
         const q = searchQuery.toLowerCase();
         result = result.filter(l =>
            l.title.toLowerCase().includes(q) ||
            l.summary.toLowerCase().includes(q) ||
            l.tags.some(t => t.toLowerCase().includes(q))
         );
      }

      if (filterCategories.length > 0) {
         result = result.filter(l => filterCategories.includes(l.categoryId));
      }
      if (filterSources.length > 0) {
         result = result.filter(l => {
            const src = getSourceInfo(l.url).name;
            return filterSources.includes(src);
         });
      }
      if (filterTags.length > 0) {
         result = result.filter(l => l.tags.some((t: string) => filterTags.includes(t)));
      }

      // Date range filter
      if (filterDateRange !== 'all') {
         const now = Date.now();
         const ranges = {
            today: 24 * 60 * 60 * 1000,    // 24 hours
            week: 7 * 24 * 60 * 60 * 1000, // 7 days
            month: 30 * 24 * 60 * 60 * 1000 // 30 days
         };
         const cutoff = now - ranges[filterDateRange];
         result = result.filter(l => l.timestamp >= cutoff);
      }

      result = [...result].sort((a, b) => {
         if (sortBy === 'date-desc') return b.timestamp - a.timestamp;
         if (sortBy === 'date-asc') return a.timestamp - b.timestamp;
         if (sortBy === 'score') return b.aiScore - a.aiScore;
         return 0;
      });

      return result;
   }, [links, activeTab, searchQuery, categories, collections, sortBy, filterCategories, filterSources, filterTags, filterDateRange]);

   // Actions
   const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const currentLink = links.find(l => l.id === id);
      if (!currentLink) return;

      const newValue = !currentLink.isFavorite;

      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isFavorite: newValue } : l));
      toast(newValue ? "Added to favorites" : "Removed from favorites");

      // Sync to Firebase
      try {
         await updateClip(id, { isFavorite: newValue });
      } catch (error) {
         console.error('Failed to update favorite:', error);
         toast.error('Failed to sync');
         setLinks(prev => prev.map(l => l.id === id ? { ...l, isFavorite: !newValue } : l));
      }
   };

   const handleToggleReadLater = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const currentLink = links.find(l => l.id === id);
      if (!currentLink) return;

      const newValue = !currentLink.isReadLater;

      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isReadLater: newValue } : l));
      toast(newValue ? "Added to read later" : "Removed from read later");

      // Sync to Firebase - using 'isReadLater' field (we need to ensure this field exists in ClipData)
      // For now, we'll just update locally as this field may not be in Firebase schema
   };

   const handleArchive = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const currentLink = links.find(l => l.id === id);
      if (!currentLink) return;

      const newValue = !currentLink.isArchived;

      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isArchived: newValue } : l));
      toast(newValue ? "Archived" : "Unarchived");

      // Sync to Firebase
      try {
         await updateClip(id, { isArchived: newValue });
      } catch (error) {
         console.error('Failed to update archive status:', error);
         toast.error('Failed to sync');
         setLinks(prev => prev.map(l => l.id === id ? { ...l, isArchived: !newValue } : l));
      }

      if (selectedLinkId === id) setSelectedLinkId(null);
   };

   const [isAnalyzing, setIsAnalyzing] = useState(false);

   const handleAddLink = async (url: string) => {
      setIsAnalyzing(true);
      setIsAddModalOpen(false);

      // Trigger Animation immediately
      setShowFlyAnimation(true);
      setTimeout(() => setShowFlyAnimation(false), 2500);

      try {
         const result = await analyzeUrl(url);
         // The useClips hook automatically updates the clips state
         toast.success(language === 'ko' ? '링크가 분석되어 추가되었습니다!' : 'Link analyzed and added successfully!');
      } catch (error: any) {
         console.error('Failed to analyze URL:', error);
         toast.error(language === 'ko' ? `분석 실패: ${error.message}` : `Analysis failed: ${error.message}`);
      } finally {
         setIsAnalyzing(false);
      }
   };

   const toggleSelection = (id: string) => {
      const newSet = new Set(selectedItemIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);

      setSelectedItemIds(newSet);

      if (!isSelectionMode && newSet.size > 0) setIsSelectionMode(true);
      if (isSelectionMode && newSet.size === 0) setIsSelectionMode(false);
   };

   const handleSelectAll = () => {
      const allIds = filteredLinks.map(l => l.id);
      const allSelected = allIds.every(id => selectedItemIds.has(id));

      if (allSelected) {
         setSelectedItemIds(new Set());
      } else {
         setSelectedItemIds(new Set(allIds));
      }
   };

   const handleBulkDeleteRequest = () => {
      setDeleteConfirmation({
         isOpen: true,
         count: selectedItemIds.size,
         onConfirm: async () => {
            try {
               // Delete all selected clips from Firebase
               const deletePromises = Array.from(selectedItemIds).map(id => deleteClip(id));
               await Promise.all(deletePromises);

               setLinks(prev => prev.filter(l => !selectedItemIds.has(l.id)));
               setSelectedItemIds(new Set());
               setIsSelectionMode(false);
               setDeleteConfirmation({ isOpen: false, count: 0, onConfirm: () => { } });
               toast.success("Items deleted");
            } catch (error) {
               console.error('Failed to delete clips:', error);
               toast.error('Failed to delete some items');
            }
         }
      });
   };

   const handleDeleteSingleRequest = (id: string) => {
      setDeleteConfirmation({
         isOpen: true,
         count: 1,
         onConfirm: async () => {
            try {
               await deleteClip(id);
               setLinks(prev => prev.filter(l => l.id !== id));
               if (selectedLinkId === id) setSelectedLinkId(null);
               setDeleteConfirmation({ isOpen: false, count: 0, onConfirm: () => { } });
               toast.success("Item deleted");
            } catch (error) {
               console.error('Failed to delete clip:', error);
               toast.error('Failed to delete item');
            }
         }
      });
   }

   const handleSaveCategory = async (cat: { id?: string; name: string; color: string }) => {
      try {
         if (editingCategory && editingCategory.id) {
            // Update existing category in Firebase
            await updateCategory(editingCategory.id, {
               name: cat.name,
               color: cat.color
            });
            toast.success(t('categoryUpdated'));
         } else {
            // Create new category in Firebase - ID will be auto-generated
            await createCategory({
               name: cat.name,
               color: cat.color
            });
            toast.success(t('categoryCreated'));
         }
         // Note: No manual state update - real-time listener will sync
         setIsCategoryModalOpen(false);
         setEditingCategory(null);
      } catch (error) {
         console.error('Failed to save category:', error);
         toast.error('Failed to save category');
      }
   };

   const handleSaveCollection = async (col: { id?: string; name: string; color: string }) => {
      try {
         if (editingCollection && editingCollection.id) {
            // Update existing collection in Firebase
            await updateCollection(editingCollection.id, {
               name: col.name,
               color: col.color
            });
            toast.success(t('collectionUpdated'));
         } else {
            // Create new collection in Firebase - ID will be auto-generated
            await createCollection({
               name: col.name,
               color: col.color
            });
            toast.success(t('collectionCreated'));
         }
         // Note: No manual state update - real-time listener will sync
         setIsCollectionModalOpen(false);
         setEditingCollection(null);
      } catch (error) {
         console.error('Failed to save collection:', error);
         toast.error('Failed to save collection');
      }
   };

   const handleUpdateLinkCategory = async (linkId: string, catId: string) => {
      // Find the current link
      const currentLink = links.find(l => l.id === linkId);
      if (!currentLink) return;

      const oldCatId = currentLink.categoryId;

      // Update local state immediately for responsiveness
      setLinks(prev => prev.map(l => l.id === linkId ? { ...l, categoryId: catId } : l));

      // Sync to Firebase
      try {
         await updateClip(linkId, { category: catId });
      } catch (error) {
         console.error('Failed to update clip category:', error);
         toast.error('Failed to update category');
         // Revert on error
         setLinks(prev => prev.map(l => l.id === linkId ? { ...l, categoryId: oldCatId } : l));
      }
   };

   const handleToggleLinkCollection = async (linkId: string, colId: string) => {
      // Find the current link
      const currentLink = links.find(l => l.id === linkId);
      if (!currentLink) return;

      const currentCollectionIds = currentLink.collectionIds || [];
      const isCurrentlyInCollection = currentCollectionIds.includes(colId);
      const newCols = isCurrentlyInCollection
         ? currentCollectionIds.filter(id => id !== colId)
         : [...currentCollectionIds, colId];

      // Update local state immediately for responsiveness
      setLinks(prev => prev.map(l => l.id === linkId ? { ...l, collectionIds: newCols } : l));

      // Sync to Firebase
      try {
         await updateClip(linkId, { collectionIds: newCols });
      } catch (error) {
         console.error('Failed to update clip collections:', error);
         toast.error('Failed to update collections');
         // Revert on error
         setLinks(prev => prev.map(l => l.id === linkId ? { ...l, collectionIds: currentCollectionIds } : l));
      }
   };

   const handleClearCollections = async (linkId: string) => {
      // Find the current link
      const currentLink = links.find(l => l.id === linkId);
      if (!currentLink) return;

      const currentCollectionIds = currentLink.collectionIds || [];

      // Update local state immediately for responsiveness
      setLinks(prev => prev.map(l => l.id === linkId ? { ...l, collectionIds: [] } : l));

      // Sync to Firebase
      try {
         await updateClip(linkId, { collectionIds: [] });
      } catch (error) {
         console.error('Failed to clear clip collections:', error);
         toast.error('Failed to update collections');
         // Revert on error
         setLinks(prev => prev.map(l => l.id === linkId ? { ...l, collectionIds: currentCollectionIds } : l));
      }
   };

   const isAllSelected = filteredLinks.length > 0 && filteredLinks.every(l => selectedItemIds.has(l.id));

   const toggleFilter = (setFn: any, current: string[], val: string) => {
      if (current.includes(val)) setFn(current.filter(c => c !== val));
      else setFn([...current, val]);
   };

   const handleDeleteCategory = async (catId: string) => {
      setDeleteConfirmation({
         isOpen: true,
         count: 1,
         onConfirm: async () => {
            try {
               // Cascade: Update all clips with this category to 'uncategorized'
               const clipsToUpdate = links.filter(l => l.categoryId === catId);
               const updatePromises = clipsToUpdate.map(clip =>
                  updateClip(clip.id, { category: 'uncategorized' })
               );
               await Promise.all(updatePromises);

               // Update local state
               setLinks(prev => prev.map(l => l.categoryId === catId ? { ...l, categoryId: 'uncategorized' } : l));

               // Now delete the category
               await deleteCategoryApi(catId);
               setCategories(prev => prev.filter(c => c.id !== catId));
               // Also clear from filters if active
               if (activeTab === catId) setActiveTab('home');
               setFilterCategories(prev => prev.filter(id => id !== catId));
               setDeleteConfirmation({ isOpen: false, count: 0, onConfirm: () => { } });
               toast.success(language === 'ko' ? '카테고리가 삭제되었습니다.' : 'Category deleted');
            } catch (error) {
               console.error('Failed to delete category:', error);
               toast.error('Failed to delete category');
            }
         }
      });
   };

   // Theme Classes
   const bgClass = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900';
   const sidebarClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
   const headerClass = theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100';
   const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

   return (
      <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${bgClass}`}>

         {/* Loading Overlay for Data Fetch */}
         {dataLoading && links.length === 0 && (
            <div className="fixed inset-0 z-[200] bg-white/90 dark:bg-slate-950/90 flex flex-col items-center justify-center gap-4">
               <div className="w-10 h-10 border-4 border-[#21DBA4] border-t-transparent rounded-full animate-spin" />
               <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {language === 'ko' ? '데이터를 불러오는 중...' : 'Loading your data...'}
               </p>
            </div>
         )}

         {/* Analyzing Overlay */}
         <AnimatePresence>
            {isAnalyzing && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[150] bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
               >
                  <div className="w-16 h-16 border-4 border-[#21DBA4] border-t-transparent rounded-full animate-spin" />
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                     {language === 'ko' ? '링크 분석 중...' : 'Analyzing link...'}
                  </p>
                  <p className="text-sm text-slate-500">
                     {language === 'ko' ? 'AI가 콘텐츠를 요약하고 있습니다' : 'AI is summarizing the content'}
                  </p>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Detail Overlay */}
         <AnimatePresence>
            {selectedLink && (
               <LinkDetailPanel
                  link={selectedLink}
                  categories={categories}
                  collections={collections}
                  onClose={() => setSelectedLinkId(null)}
                  onToggleFavorite={() => handleToggleFavorite(selectedLink.id)}
                  onToggleReadLater={() => handleToggleReadLater(selectedLink.id)}
                  onArchive={() => handleArchive(selectedLink.id)}
                  onDelete={() => handleDeleteSingleRequest(selectedLink.id)}
                  onUpdateCategory={handleUpdateLinkCategory}
                  onToggleCollection={handleToggleLinkCollection}
                  onClearCollections={handleClearCollections}
                  theme={theme}
                  t={t}
               />
            )}
         </AnimatePresence>

         {/* Paper Plane Animation */}
         <AnimatePresence>
            {showFlyAnimation && (
               <motion.div
                  initial={{ x: "-10vw", y: "110vh", rotate: 0, scale: 0.5, opacity: 0 }}
                  animate={{
                     x: ["-10vw", "45vw", "35vw", "55vw", "120vw"],
                     y: ["110vh", "50vh", "35vh", "65vh", "-20vh"],
                     rotate: [0, -45, -180, -270, 0],
                     scale: [0.5, 1, 1, 1, 0.5],
                     opacity: [0, 1, 1, 1, 0]
                  }}
                  transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.4, 0.5, 0.6, 1] }}
                  className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
               >
                  <Send className="w-32 h-32 text-[#21DBA4] drop-shadow-2xl" strokeWidth={1.5} />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Modals */}
         <AnimatePresence>
            {isAddModalOpen && <AddLinkModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddLink} theme={theme} t={t} />}
            {isCategoryModalOpen && (
               <ManagementModal
                  title={editingCategory ? t('editCategory') : t('newCategory')}
                  initialData={editingCategory}
                  type="category"
                  onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                  onSave={handleSaveCategory}
                  theme={theme}
                  t={t}
               />
            )}
            {isCollectionModalOpen && (
               <ManagementModal
                  title={editingCollection ? t('editCollection') : t('newCollection')}
                  initialData={editingCollection}
                  type="collection"
                  onClose={() => { setIsCollectionModalOpen(false); setEditingCollection(null); }}
                  onSave={handleSaveCollection}
                  onDelete={editingCollection ? async (id: string) => {
                     try {
                        await deleteCollectionApi(id);
                        setCollections(prev => prev.filter(c => c.id !== id));
                        setIsCollectionModalOpen(false);
                        setEditingCollection(null);
                        toast.success(language === 'ko' ? '컬렉션이 삭제되었습니다.' : 'Collection deleted');
                     } catch (error) {
                        console.error('Failed to delete collection:', error);
                        toast.error('Failed to delete collection');
                     }
                  } : undefined}
                  links={links}
                  theme={theme}
                  t={t}
               />
            )}
            {isCategoryManagerOpen && (
               <CategoryManagerModal
                  categories={categories}
                  links={links}
                  onClose={() => setIsCategoryManagerOpen(false)}
                  onEdit={(cat: Category) => {
                     setIsCategoryManagerOpen(false);
                     setEditingCategory(cat);
                     setIsCategoryModalOpen(true);
                  }}
                  onDelete={handleDeleteCategory}
                  theme={theme}
                  t={t}
               />
            )}
            {deleteConfirmation.isOpen && (
               <DeleteConfirmationModal
                  count={deleteConfirmation.count}
                  onCancel={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
                  onConfirm={deleteConfirmation.onConfirm}
                  theme={theme}
                  t={t}
               />
            )}
            {isSettingsOpen && (
               <SettingsModal
                  onClose={() => setIsSettingsOpen(false)}
                  settings={{ theme, language, showThumbnails, notifications }}
                  setSettings={{ setTheme, setLanguage, setShowThumbnails, setNotifications }}
                  onLogout={onLogout || (() => { })}
                  t={t}
                  user={user}
               />
            )}
         </AnimatePresence>

         {/* Floating Selection Bar */}
         <AnimatePresence>
            {isSelectionMode && (
               <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white shadow-2xl flex items-center 
                          px-6 py-3 rounded-[2rem] gap-5
                          md:px-6 md:py-3 md:rounded-full md:gap-6"
               >
                  {/* Count */}
                  <div className="flex flex-col md:flex-row items-center justify-center leading-none md:gap-1.5">
                     <span className="font-black text-lg md:text-sm mb-0.5 md:mb-0">{selectedItemIds.size}</span>
                     <span className="text-[10px] md:text-sm font-bold md:font-medium text-slate-300 md:text-white leading-tight">
                        <span className="md:hidden">
                           {language === 'ko' ? '선택됨' : 'Selected'}
                        </span>
                        <span className="hidden md:inline">{t('selected')}</span>
                     </span>
                  </div>

                  {/* Divider */}
                  <div className="h-8 md:h-4 w-px bg-white/20"></div>

                  {/* Delete Action */}
                  <button onClick={handleBulkDeleteRequest} className="group flex flex-col md:flex-row items-center gap-1 md:gap-2 hover:text-red-400 transition-colors">
                     <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                     <span className="text-[10px] md:text-sm font-bold md:font-medium leading-none">{t('delete')}</span>
                  </button>

                  {/* Close */}
                  <button
                     onClick={() => { setIsSelectionMode(false); setSelectedItemIds(new Set()); }}
                     className="ml-1 p-1.5 md:p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                     <X className="w-4 h-4 md:w-[14px] md:h-[14px]" />
                  </button>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Mobile Sidebar Overlay */}
         <AnimatePresence>
            {sidebarOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
               />
            )}
         </AnimatePresence>

         {/* Sidebar */}
         <aside className={`
        fixed md:relative z-50 h-full w-[280px] border-r flex flex-col transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarClass}
      `}>
            {/* Logo Area */}
            <div className={`h-16 flex items-center px-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
               <div className="w-8 h-8 rounded-lg mr-3 shadow-lg shadow-[#21DBA4]/20 cursor-pointer" onClick={onBack}>
                  <Logo className="w-full h-full" />
               </div>
               <span className="font-bold text-lg tracking-tight text-[#21DBA4] text-[22px]">Linkbrain</span>
               <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-slate-400">
                  <X size={20} />
               </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">

               {/* Main Nav */}
               <div className="space-y-1">
                  <NavItem icon={<Home size={18} />} label={t('home')} active={activeTab === 'home'} onClick={() => setActiveTab('home')} theme={theme} />
                  <NavItem icon={<Compass size={18} />} label={t('discovery')} active={activeTab === 'discovery'} onClick={() => setActiveTab('discovery')} theme={theme} />
                  <NavItem
                     icon={<Clock size={18} />}
                     label={t('readLater')}
                     count={links.filter(l => l.isReadLater && !l.isArchived).length}
                     active={activeTab === 'later'}
                     onClick={() => setActiveTab('later')}
                     theme={theme}
                  />
                  <NavItem
                     icon={<Star size={18} />}
                     label={t('favorites')}
                     count={links.filter(l => l.isFavorite && !l.isArchived).length}
                     active={activeTab === 'favorites'}
                     onClick={() => setActiveTab('favorites')}
                     theme={theme}
                  />
                  <NavItem icon={<Archive size={18} />} label={t('archive')} active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} theme={theme} />
                  <NavItem icon={<Sparkles size={18} />} label={t('aiInsights')} active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} theme={theme} iconClassName="text-[#21DBA4]" />
               </div>

               {/* Categories */}
               <div>
                  <div className="px-3 mb-2 flex justify-between items-center group">
                     <button
                        onClick={() => setIsSmartFoldersOpen(!isSmartFoldersOpen)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSmartFoldersOpen ? '' : '-rotate-90'}`} />
                        {t('smartFolders')}
                     </button>
                     <div className="flex items-center gap-1">
                        <button
                           onClick={() => setIsCategoryManagerOpen(true)}
                           className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500 hover:text-[#21DBA4]' : 'hover:bg-slate-100 text-slate-400 hover:text-[#21DBA4]'}`}
                           title="Manage Categories"
                        >
                           <Settings size={14} />
                        </button>
                        <button
                           onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                           className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500 hover:text-[#21DBA4]' : 'hover:bg-slate-100 text-slate-400 hover:text-[#21DBA4]'}`}
                        >
                           <Plus size={14} />
                        </button>
                     </div>
                  </div>

                  <AnimatePresence initial={false}>
                     {isSmartFoldersOpen && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                        >
                           <div className="flex flex-wrap gap-2 px-3 py-2">
                              {categories.map((cat: Category) => {
                                 const isActive = filterCategories.includes(cat.id);
                                 const count = links.filter((l: LinkItem) => l.categoryId === cat.id && !l.isArchived).length;
                                 return (
                                    <div key={cat.id} className="group relative">
                                       <button
                                          onClick={() => toggleFilter(setFilterCategories, filterCategories, cat.id)}
                                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isActive
                                             ? 'bg-[#21DBA4] text-white shadow-sm'
                                             : theme === 'dark'
                                                ? `text-slate-300 hover:ring-2 hover:ring-[#21DBA4]/50`
                                                : `text-slate-600 hover:ring-2 hover:ring-[#21DBA4]/50`
                                             }`}
                                          style={!isActive ? { backgroundColor: CATEGORY_COLORS[cat.color] || '#f1f5f9' } : {}}
                                       >
                                          <span>{cat.name}</span>
                                          {count > 0 && (
                                             <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive
                                                ? 'bg-white/20'
                                                : theme === 'dark' ? 'bg-slate-700' : 'bg-white/50'
                                                }`}>
                                                {count}
                                             </span>
                                          )}
                                       </button>
                                    </div>
                                 );
                              })}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               {/* Collections */}
               <div>
                  <div className="px-3 mb-2 flex justify-between items-center group">
                     <button
                        onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isCollectionsOpen ? '' : '-rotate-90'}`} />
                        {t('collections')}
                     </button>
                     <button
                        onClick={() => { setEditingCollection(null); setIsCollectionModalOpen(true); }}
                        className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500 hover:text-[#21DBA4]' : 'hover:bg-slate-100 text-slate-400 hover:text-[#21DBA4]'}`}
                     >
                        <Plus size={14} />
                     </button>
                  </div>

                  <AnimatePresence initial={false}>
                     {isCollectionsOpen && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                        >
                           <div className="space-y-1">
                              {collections.map(col => (
                                 <div key={col.id} className="group relative flex items-center">
                                    <NavItem
                                       icon={<Library size={16} />}
                                       label={col.name}
                                       active={activeTab === col.id}
                                       onClick={() => setActiveTab(col.id)}
                                       iconClassName={col.color.replace('bg-', 'text-')}
                                       count={links.filter(l => l.collectionIds.includes(col.id) && !l.isArchived).length || undefined}
                                       className="flex-1"
                                       theme={theme}
                                    />
                                    <button
                                       onClick={() => { setEditingCollection(col); setIsCollectionModalOpen(true); }}
                                       className="absolute right-2 md:opacity-0 md:group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-600 bg-white/50 rounded-md transition-all"
                                    >
                                       <Edit2 size={12} />
                                    </button>
                                 </div>
                              ))}
                              {collections.length === 0 && (
                                 <div className={`px-3 text-xs italic py-2 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>{t('noCollections')}</div>
                              )}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>

            {/* User Footer */}
            <div
               onClick={() => setIsSettingsOpen(true)}
               className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900 hover:bg-slate-800' : 'border-slate-50 bg-slate-50/50 hover:bg-slate-100'} cursor-pointer transition-colors group`}
            >
               <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-slate-200 border-2 shadow-sm overflow-hidden group-hover:border-[#21DBA4]/50 transition-colors ${theme === 'dark' ? 'border-slate-700' : 'border-white'}`}>
                     {user?.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                     ) : (
                        <div className={`w-full h-full flex items-center justify-center text-sm font-bold ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-500'}`}>
                           {(user?.displayName || 'U').charAt(0).toUpperCase()}
                        </div>
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className={`text-sm font-bold truncate group-hover:text-[#21DBA4] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{user?.displayName || 'User'}</div>
                     <div className="text-[10px] text-slate-400">{t('proPlan')}</div>
                  </div>
                  <button className="text-slate-400 group-hover:text-slate-600 transition-colors">
                     <Settings size={18} />
                  </button>
               </div>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
            {/* Top Header */}
            <header className={`h-[72px] border-b backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30 shrink-0 ${headerClass}`}>
               <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full">
                  <div className="flex items-center gap-3 md:hidden">
                     <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
                        <Menu size={20} />
                     </button>
                     <span className={`font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {activeTab === 'insights' ? t('aiInsights') : activeTab === 'discovery' ? t('discovery') : categories.find(c => c.id === activeTab)?.name || collections.find(c => c.id === activeTab)?.name || activeTab}
                     </span>
                  </div>

                  {/* Search Bar - Desktop */}
                  <div className="hidden md:flex relative group flex-1 max-w-md mr-auto">
                     <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#21DBA4] transition-colors pl-4">
                        <Search size={18} />
                     </div>
                     <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className={`w-full h-11 rounded-2xl pl-11 pr-4 text-sm font-medium focus:outline-none transition-all placeholder:text-slate-400 ${theme === 'dark' ? 'bg-slate-800 text-white focus:bg-slate-700' : 'bg-slate-100/50 hover:bg-slate-100 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-[#21DBA4]/20 text-slate-900'}`}
                     />
                     {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-12 flex items-center text-slate-400 hover:text-slate-600">
                           <X size={14} />
                        </button>
                     )}
                     <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <div className={`flex items-center gap-1 px-1.5 py-1 rounded-md ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-white/50 border border-slate-200/50'}`}>
                           <span className="text-[10px] text-slate-400 font-bold">⌘</span>
                           <span className="text-[10px] text-slate-400 font-bold">K</span>
                        </div>
                     </div>
                  </div>

                  {/* Mobile Search Toggle Overlay */}
                  {mobileSearchOpen && (
                     <div className="absolute top-[72px] left-0 right-0 p-4 bg-white border-b border-slate-100 z-20 animate-fade-in-down md:hidden shadow-lg">
                        <div className="relative">
                           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input
                              autoFocus
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={t('searchPlaceholder')}
                              className={`w-full h-10 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all placeholder:text-slate-400 bg-slate-100 text-slate-900 focus:bg-white`}
                           />
                           <button onClick={() => setMobileSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <X size={18} />
                           </button>
                        </div>
                     </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:gap-4 ml-auto pl-4">
                     {/* Select All Action (Visible when selection mode is active) */}
                     {isSelectionMode && (
                        <button
                           onClick={handleSelectAll}
                           className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${isAllSelected ? 'bg-slate-900 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                           {isAllSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                           <span className="hidden sm:inline">{t('selected')}</span>
                        </button>
                     )}

                     <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
                        <Search size={20} />
                     </button>

                     <div className={`h-6 w-px hidden md:block ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                     <div className={`flex items-center gap-1 rounded-lg p-0.5 hidden md:flex ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <button
                           onClick={() => setViewMode('grid')}
                           className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? (theme === 'dark' ? 'bg-slate-700 text-[#21DBA4]' : 'bg-white text-[#21DBA4] shadow-sm') : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           <Grid size={16} />
                        </button>
                        <button
                           onClick={() => setViewMode('list')}
                           className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? (theme === 'dark' ? 'bg-slate-700 text-[#21DBA4]' : 'bg-white text-[#21DBA4] shadow-sm') : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           <List size={16} />
                        </button>
                     </div>

                     <button
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className={`p-2 rounded-full transition-all ${isSelectionMode ? 'bg-[#E0FBF4] text-[#21DBA4]' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Select Items"
                     >
                        <CheckSquare size={18} />
                     </button>

                     <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#21DBA4] hover:bg-[#1bc290] text-white h-9 px-4 rounded-full text-sm font-bold shadow-lg shadow-[#21DBA4]/20 flex items-center gap-1.5 transition-all transform active:scale-95 text-[14px]"
                     >
                        <Plus size={18} />
                        <span className="hidden md:inline text-[14px]">{t('addLink')}</span>
                     </button>
                  </div>
               </div>
            </header>

            {/* Scrollable Area */}
            <div className={`flex-1 overflow-y-auto ${['discovery', 'features', 'how-it-works', 'pricing'].includes(activeTab) ? '' : 'p-4 md:p-8'}`}>
               {activeTab === 'discovery' ? (
                  <LinkBrainArticle theme={theme} />
               ) : (
                  <div className="max-w-7xl mx-auto">

                     {/* Header Info */}
                     <div className="flex items-end justify-between mb-8">
                        <div className="flex-1">
                           <h1 className={`text-2xl font-black mb-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {(() => {
                                 // Time-based greeting
                                 const getTimeGreeting = () => {
                                    const hour = new Date().getHours();
                                    if (hour >= 5 && hour < 12) return t('goodMorning');
                                    if (hour >= 12 && hour < 18) return t('goodAfternoon');
                                    return t('goodEvening');
                                 };

                                 // Get user display name
                                 const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

                                 const title = activeTab === 'home' ? `${getTimeGreeting()}, ${userName} 👋` :
                                    activeTab === 'later' ? t('readLater') :
                                       activeTab === 'favorites' ? t('favorites') :
                                          activeTab === 'archive' ? t('archive') :
                                             activeTab === 'insights' ? t('aiInsights') :
                                                categories.find((c: Category) => c.id === activeTab)?.name || collections.find((c: Collection) => c.id === activeTab)?.name || 'Folder';

                                 if (title && title.includes('[Beta]')) {
                                    return (
                                       <>
                                          {title.replace('[Beta]', '')}
                                          <span className="px-1.5 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-[10px] font-extrabold tracking-wide border border-[#21DBA4]/20 align-middle">
                                             BETA
                                          </span>
                                       </>
                                    );
                                 }
                                 return title;
                              })()}
                           </h1>
                           <p className={`text-sm ${textMuted}`}>
                              {activeTab === 'insights' ? '' : `${filteredLinks.length} ${t('linksFound')}`}
                              {activeTab === 'home' && ` ${t('aiSummary')}`}
                           </p>
                        </div>

                        {/* Mobile View Toggle - moved to top level for proper positioning */}
                        {activeTab !== 'insights' && (
                           <button
                              onClick={() => setMobileViewMode(mobileViewMode === 'list' ? 'grid' : 'list')}
                              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ml-3 ${theme === 'dark'
                                 ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-[#21DBA4] hover:border-[#21DBA4]/50'
                                 : 'bg-white border-slate-200 text-slate-500 hover:text-[#21DBA4] hover:border-[#21DBA4]/50 shadow-sm'
                                 }`}
                           >
                              {mobileViewMode === 'list' ? <LayoutGrid size={16} /> : <List size={16} />}
                           </button>
                        )}

                        {/* Sort & Advanced Filter Dropdown */}
                        <div className="relative hidden md:block" ref={filterRef}>
                           <div
                              onClick={() => setIsFilterOpen(!isFilterOpen)}
                              className={`hidden md:flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border shadow-sm cursor-pointer transition-colors ${isFilterOpen || filterCategories.length > 0 || filterSources.length > 0 || filterTags.length > 0
                                 ? 'bg-slate-50 border-[#21DBA4] text-[#21DBA4]'
                                 : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-[#21DBA4]/50' : 'bg-white border-slate-200 text-slate-500 hover:border-[#21DBA4]/50'
                                 }`}
                           >
                              <Filter size={14} />
                              {t('filterSort')}
                              {(filterCategories.length > 0 || filterSources.length > 0 || filterTags.length > 0) && (
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span>
                              )}
                              <ChevronDown size={14} />
                           </div>

                           {isFilterOpen && (
                              <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-xl border py-2 z-20 overflow-hidden max-h-[80vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100'}`}>
                                 <div className="px-4 py-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
                                    <div className="mt-2 space-y-1">
                                       {[
                                          { id: 'date-desc', label: t('recentlyAdded') },
                                          { id: 'date-asc', label: t('oldestFirst') }
                                       ].map((opt) => (
                                          <button
                                             key={opt.id}
                                             onClick={() => setSortBy(opt.id as any)}
                                             className={`w-full text-left flex items-center justify-between text-sm py-1.5 ${sortBy === opt.id ? 'text-[#21DBA4] font-bold' : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                                          >
                                             {opt.label}
                                             {sortBy === opt.id && <Check size={14} />}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className={`h-px my-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

                                 {/* Date Range Filter */}
                                 <div className="px-4 py-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">기간</span>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                       {[
                                          { id: 'all', label: '전체' },
                                          { id: 'today', label: '오늘' },
                                          { id: 'week', label: '이번 주' },
                                          { id: 'month', label: '이번 달' }
                                       ].map((opt) => (
                                          <button
                                             key={opt.id}
                                             onClick={() => setFilterDateRange(opt.id as any)}
                                             className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${filterDateRange === opt.id ? 'bg-[#21DBA4] text-white border-transparent' : theme === 'dark' ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#21DBA4]'}`}
                                          >
                                             {opt.label}
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className={`h-px my-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

                                 {availableCategories.length > 0 && (
                                    <div className="px-4 py-2">
                                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('category')}</span>
                                       <div className="mt-2 space-y-1">
                                          {availableCategories.map(cat => (
                                             <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                                <div
                                                   onClick={() => toggleFilter(setFilterCategories, filterCategories, cat.id)}
                                                   className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filterCategories.includes(cat.id) ? 'bg-[#21DBA4] border-[#21DBA4] text-white' : theme === 'dark' ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-white group-hover:border-[#21DBA4]'}`}
                                                >
                                                   {filterCategories.includes(cat.id) && <Check size={10} strokeWidth={4} />}
                                                </div>
                                                <span className={`text-sm ${filterCategories.includes(cat.id) ? (theme === 'dark' ? 'text-white' : 'text-slate-900') + ' font-medium' : 'text-slate-500'}`}>{cat.name}</span>
                                             </label>
                                          ))}
                                       </div>
                                    </div>
                                 )}

                                 {availableSources.length > 0 && (
                                    <>
                                       <div className={`h-px my-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                                       <div className="px-4 py-2">
                                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source</span>
                                          <div className="mt-2 space-y-1">
                                             {availableSources.map(src => (
                                                <label key={src} className="flex items-center gap-2 cursor-pointer group">
                                                   <div
                                                      onClick={() => toggleFilter(setFilterSources, filterSources, src)}
                                                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filterSources.includes(src) ? 'bg-[#21DBA4] border-[#21DBA4] text-white' : theme === 'dark' ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-white group-hover:border-[#21DBA4]'}`}
                                                   >
                                                      {filterSources.includes(src) && <Check size={10} strokeWidth={4} />}
                                                   </div>
                                                   <span className={`text-sm ${filterSources.includes(src) ? (theme === 'dark' ? 'text-white' : 'text-slate-900') + ' font-medium' : 'text-slate-500'}`}>{src}</span>
                                                </label>
                                             ))}
                                          </div>
                                       </div>
                                    </>
                                 )}

                                 {availableTags.length > 0 && (
                                    <>
                                       <div className={`h-px my-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                                       <div className="px-4 py-2">
                                          <div className="flex items-center justify-between mb-2">
                                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('tags')}</span>
                                             {availableTags.length > 8 && (
                                                <button
                                                   onClick={() => setShowAllTags(!showAllTags)}
                                                   className="text-[10px] font-bold text-[#21DBA4] hover:text-[#1BC491]"
                                                >
                                                   {showAllTags ? '접기' : `더보기 (+${availableTags.length - 8})`}
                                                </button>
                                             )}
                                          </div>
                                          <div className="flex flex-wrap gap-1.5">
                                             {(showAllTags ? availableTags : availableTags.slice(0, 8)).map((tag: string) => (
                                                <button
                                                   key={tag}
                                                   onClick={() => toggleFilter(setFilterTags, filterTags, tag)}
                                                   className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${filterTags.includes(tag) ? 'bg-[#21DBA4] text-white border-transparent' : theme === 'dark' ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#21DBA4]'}`}
                                                >
                                                   #{tag}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    </>
                                 )}

                                 {(filterCategories.length > 0 || filterSources.length > 0 || filterTags.length > 0 || filterDateRange !== 'all') && (
                                    <div className={`p-2 border-t mt-1 ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
                                       <button
                                          onClick={() => { setFilterCategories([]); setFilterSources([]); setFilterTags([]); setFilterDateRange('all'); }}
                                          className="w-full text-center text-xs font-bold text-red-500 hover:text-red-600 py-1"
                                       >
                                          {t('resetFilters')}
                                       </button>
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Grid / List View */}
                     {activeTab === 'insights' ? (
                        <AIInsightsDashboard
                           links={links}
                           categories={categories}
                           theme={theme}
                           t={t}
                        />
                     ) : viewMode === 'grid' ? (
                        <>
                           {/* Mobile 2-Column Grid View */}
                           <div className={`md:hidden ${mobileViewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'hidden'}`}>
                              {filteredLinks.map(link => {
                                 const source = getSourceInfo(link.url);
                                 const truncatedUrl = link.url.replace(/^https?:\/\//, '').split('/')[0];
                                 return (
                                    <div
                                       key={link.id}
                                       onClick={() => isSelectionMode ? toggleSelection(link.id) : setSelectedLinkId(link.id)}
                                       className={`rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                                          } ${selectedItemIds.has(link.id) ? 'ring-2 ring-[#21DBA4]' : 'border border-slate-100 shadow-sm'}`}
                                    >
                                       {/* 16:9 Image */}
                                       <div className="relative aspect-video overflow-hidden">
                                          <img
                                             src={link.image || '/placeholder.jpg'}
                                             alt=""
                                             className="w-full h-full object-cover"
                                          />
                                          {/* Source Badge - Always show */}
                                          <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white ${source.color || 'bg-slate-600'}`}>
                                             {source.icon}{source.name}
                                          </div>
                                          {/* Favorite Star - Always show if favorite */}
                                          {link.isFavorite && (
                                             <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                                                <Star size={12} fill="white" className="text-white" />
                                             </div>
                                          )}
                                       </div>
                                       {/* Content - flex-1 for consistent height */}
                                       <div className="p-3 flex flex-col flex-1">
                                          {/* URL */}
                                          <div className={`flex items-center gap-1 text-[10px] mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                             <span className="text-slate-400">⊙</span>
                                             <span className="truncate">{truncatedUrl}</span>
                                          </div>
                                          {/* Title - fixed height for 2 lines */}
                                          <h3 className={`text-xs font-bold leading-tight line-clamp-2 h-8 mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                             {link.title}
                                          </h3>
                                          {/* AI Summary - pushed to bottom with mt-auto */}
                                          <div className={`mt-auto text-[10px] p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-[#E0FBF4]'}`}>
                                             <div className={`flex items-center gap-1 font-bold mb-1 text-[#21DBA4]`}>
                                                <span>✨</span> AI Summary
                                             </div>
                                             <p className={`line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {link.keyTakeaways && link.keyTakeaways.length > 0 ? link.keyTakeaways[0] : link.summary?.slice(0, 80) || 'No summary available'}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>

                           {/* Desktop Masonry / Mobile List View */}
                           <div className={`${mobileViewMode === 'grid' ? 'hidden md:block' : ''}`}>
                              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1400: 4 }}>
                                 <Masonry gutter="24px">
                                    {filteredLinks.map(link => (
                                       <LinkCard
                                          key={link.id}
                                          data={link}
                                          selected={selectedItemIds.has(link.id)}
                                          selectionMode={isSelectionMode}
                                          onToggleSelect={() => toggleSelection(link.id)}
                                          onClick={() => isSelectionMode ? toggleSelection(link.id) : setSelectedLinkId(link.id)}
                                          onToggleFavorite={(e) => handleToggleFavorite(link.id, e)}
                                          onToggleReadLater={(e) => handleToggleReadLater(link.id, e)}
                                          categories={categories}
                                          theme={theme}
                                          showThumbnails={showThumbnails}
                                          t={t}
                                       />
                                    ))}
                                 </Masonry>
                              </ResponsiveMasonry>
                           </div>
                        </>
                     ) : (
                        <div className="space-y-4">
                           {filteredLinks.map(link => (
                              <LinkRow
                                 key={link.id}
                                 data={link}
                                 selected={selectedItemIds.has(link.id)}
                                 selectionMode={isSelectionMode}
                                 onToggleSelect={() => toggleSelection(link.id)}
                                 onClick={() => isSelectionMode ? toggleSelection(link.id) : setSelectedLinkId(link.id)}
                                 onToggleFavorite={(e) => handleToggleFavorite(link.id, e)}
                                 categories={categories}
                                 theme={theme}
                                 showThumbnails={showThumbnails}
                              />
                           ))}
                        </div>
                     )}

                     {filteredLinks.length === 0 && activeTab !== 'insights' && (
                        <div className="py-20 text-center text-slate-400">
                           <Brain size={48} className="mx-auto mb-4 opacity-20" />
                           <p>{t('noLinks')}</p>
                        </div>
                     )}

                     <div className="h-20"></div>
                  </div>
               )}
            </div>

            {/* Mobile FAB */}
            <button
               onClick={() => setIsAddModalOpen(true)}
               className="md:hidden absolute bottom-6 right-6 w-14 h-14 bg-[#21DBA4] text-white rounded-full shadow-xl flex items-center justify-center z-30 hover:scale-110 transition-transform active:scale-90"
            >
               <Plus size={24} />
            </button>

         </main>
      </div>
   );
};


// ----------------------------------------------------------------------
// Sub-components (NavItem, LinkCard, LinkRow are now imported from ./Cards)
// Panels (LinkDetailPanel, SettingsModal) are now imported from ./Panels
// ----------------------------------------------------------------------
