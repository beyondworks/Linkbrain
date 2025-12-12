import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useClips, ClipData } from '../../hooks/useClips';
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
   BookOpen
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

// --- Translation Dictionary ---
const TRANSLATIONS = {
   en: {
      home: "Home",
      readLater: "Read Later",
      favorites: "Favorites",
      archive: "Archive",
      smartFolders: "Categories",
      collections: "Collections",
      settings: "Settings",
      aiInsights: "AI Insights [Beta]",
      discovery: "Discovery",
      features: "Features",
      howItWorks: "How it Works",
      pricing: "Pricing",
      addLink: "Add Link",
      filterSort: "Filter & Sort",
      searchPlaceholder: "Search links, summaries, or insights...",
      goodMorning: "Good Morning",
      goodAfternoon: "Good Afternoon",
      goodEvening: "Good Evening",
      linksFound: "links found.",
      aiSummary: "Here's your AI summary.",
      recentlyAdded: "Recently Added",
      oldestFirst: "Oldest First",
      highestScore: "Highest AI Score",
      resetFilters: "Reset Filters",
      delete: "Delete",
      selected: "Selected",
      myAccount: "My Account",
      general: "General",
      integrations: "Integrations",
      notifications: "Notifications",
      dataStorage: "Data & Storage",
      appearance: "Appearance",
      preferences: "Preferences",
      thumbnails: "Show Thumbnails",
      darkMode: "Dark Mode",
      language: "Language",
      korean: "Korean",
      english: "English",
      noCollections: "No collections yet.",
      noLinks: "No links found matching your criteria.",
      deleteConfirmTitle: "Delete {count} Item{s}?",
      deleteConfirmDesc: "This action cannot be undone. These items will be permanently removed from your brain.",
      cancel: "Cancel",
      save: "Save",
      editCategory: "Edit Category",
      newCategory: "New Category",
      editCollection: "Edit Collection",
      newCollection: "New Collection",
      name: "Name",
      colorStyle: "Color Style",
      proPlan: "Pro Plan",
      signOut: "Sign Out",
      changeAvatar: "Change Avatar",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      manageBilling: "Manage Billing",
      cancelPlan: "Cancel Plan",
      openLinksNewTab: "Open links in new tab",
      autoSummarize: "Auto-summarize new links",
      compactMode: "Compact Mode",
      connect: "Connect",
      connected: "Connected",
      weeklyDigest: "Weekly Digest",
      productUpdates: "Product Updates",
      securityAlerts: "Security Alerts",
      exportData: "Export Data",
      importData: "Import Data",
      deleteAccount: "Delete Account",
      dangerZone: "Danger Zone",
      category: "Category",
      aiTakeaways: "AI Key Takeaways",
      myNotes: "My Notes",
      autoSaved: "Auto-saved",
      tags: "Tags",
      visitOriginal: "Visit Original",
      summarize: "Summarize",
      weeklyInsights: "Weekly Insights",
      topKeywords: "Top Keywords",
      mainSources: "Main Sources",
      qualityAnalysis: "Quality Analysis",
      newInterests: "New Interests",
      readingPatterns: "Reading Patterns",
      contentGaps: "Content Gaps",
      topicConnections: "Topic Connections",
      insightsSummary: "This week you saved {count} links, focused on AI & Design topics, and showed strong interest in emerging technologies.",
      avgReadTime: "Avg. Read Time",
      totalLinks: "Total Links",
      thisWeek: "This Week",
      trend: "Trend"
   },
   ko: {
      home: "홈",
      readLater: "나중에 읽기",
      favorites: "즐겨찾기",
      archive: "보관함",
      smartFolders: "카테고리",
      collections: "컬렉션",
      settings: "설정",
      aiInsights: "AI 인사이트 [Beta]",
      discovery: "탐색",
      features: "주요 기능",
      howItWorks: "동작 원리",
      pricing: "요금제",
      addLink: "링크 추가",
      filterSort: "필터 및 정렬",
      searchPlaceholder: "링크, 요약, 인사이트 검색...",
      goodMorning: "좋은 아침입니다",
      goodAfternoon: "좋은 오후입니다",
      goodEvening: "좋은 저녁입니다",
      linksFound: "개의 링크가 있습니다.",
      aiSummary: "AI 요약입니다.",
      recentlyAdded: "최신순",
      oldestFirst: "오래된순",
      highestScore: "AI 점수순",
      resetFilters: "필터 초기화",
      delete: "삭제",
      selected: "선택됨",
      myAccount: "내 계정",
      general: "일반",
      integrations: "연동",
      notifications: "알림",
      dataStorage: "데이터 및 저장소",
      appearance: "화면 설정",
      preferences: "환경 설정",
      thumbnails: "썸네일 보기",
      darkMode: "다크 모드",
      language: "언어",
      korean: "한국어",
      english: "영어",
      noCollections: "컬렉션이 없습니다.",
      noLinks: "조건에 맞는 링크가 없습니다.",
      deleteConfirmTitle: "{count}개의 항목을 삭제하시겠습니까?",
      deleteConfirmDesc: "이 작업은 되돌릴 수 없습니다. 항목이 영구적으로 삭제됩니다.",
      cancel: "취소",
      save: "저장",
      editCategory: "카테고리 수정",
      newCategory: "새 카테고리",
      editCollection: "컬렉션 수정",
      newCollection: "새 컬렉션",
      name: "이름",
      colorStyle: "색상 스타일",
      proPlan: "프로 플랜",
      signOut: "로그아웃",
      changeAvatar: "프로필 변경",
      firstName: "이름",
      lastName: "성",
      email: "이메일 주소",
      manageBilling: "결제 관리",
      cancelPlan: "구독 취소",
      openLinksNewTab: "새 탭에서 링크 열기",
      autoSummarize: "새 링크 자동 요약",
      compactMode: "컴팩트 모드",
      connect: "연동하기",
      connected: "연동됨",
      weeklyDigest: "주간 요약",
      productUpdates: "제품 업데이트",
      securityAlerts: "보안 알림",
      exportData: "데이터 내보내기",
      importData: "데이터 가져오기",
      deleteAccount: "계정 삭제",
      dangerZone: "위험 구역",
      category: "카테고리",
      aiTakeaways: "AI 핵심 요약",
      myNotes: "내 메모",
      autoSaved: "자동 저장됨",
      tags: "태그",
      visitOriginal: "원본 보기",
      summarize: "요약하기",
      weeklyInsights: "주간 인사이트",
      topKeywords: "주요 키워드",
      mainSources: "주요 출처",
      qualityAnalysis: "품질 분석",
      newInterests: "새로운 관심사",
      readingPatterns: "독서 패턴",
      contentGaps: "콘텐츠 갭",
      topicConnections: "주제 연결",
      insightsSummary: "이번 주 {count}개의 링크를 저장했으며, AI & 디자인 주제에 집중했고, 신기술에 대한 관심이 높습니다.",
      avgReadTime: "평균 독서 시간",
      totalLinks: "전체 링크",
      thisWeek: "이번 주",
      trend: "트렌드"
   }
};

// --- Types ---
type LinkItem = {
   id: string;  // Changed from number to string for Firebase compatibility
   title: string;
   url: string;
   image: string;
   images?: string[];  // Multiple images for carousel
   summary: string;
   tags: string[];
   date: string;
   timestamp: number;
   readTime: string;
   aiScore: number;
   categoryId: string;
   collectionIds: string[];
   isFavorite: boolean;
   isReadLater: boolean;
   isArchived: boolean;
   notes?: string;
   keyTakeaways?: string[];
   content?: string;  // Full article content (markdown or plain text)
   platform?: 'youtube' | 'instagram' | 'threads' | 'web';  // Platform type
   author?: string;  // Author name
   authorHandle?: string;  // Author handle (@username)
   authorAvatar?: string;  // Author profile image
};

type Category = {
   id: string;
   name: string;
   color: string;
};

type Collection = {
   id: string;
   name: string;
   color: string;
};

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
      loading: dataLoading,
      error: dataError,
      user,
      analyzeUrl,
      updateClip,
      deleteClip,
      createCollection,
      updateCollection,
      deleteCollection: deleteCollectionApi,
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

      return {
         id: clip.id || `temp-${Date.now()}`,  // Use string ID directly
         title: clip.title || 'Untitled',
         url: clip.url || '',
         image: clip.image || clip.images?.[0] || '',
         summary: clip.summary || '',
         tags: clip.keywords || [],
         date: clip.createdAt ? new Date(clip.createdAt).toLocaleDateString() : 'Unknown',
         timestamp: clip.createdAt ? new Date(clip.createdAt).getTime() : Date.now(),
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
   const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
   const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);

   // Sync Firebase clips to local state
   useEffect(() => {
      if (firebaseClips && firebaseClips.length > 0) {
         setLinks(firebaseClips.map(clipToLinkItem));
      }
   }, [firebaseClips]);

   // Sync Firebase collections to local state
   useEffect(() => {
      if (firebaseCollections && firebaseCollections.length > 0) {
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
   const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLinks(prev => prev.map(l => {
         if (l.id === id) {
            toast(l.isFavorite ? "Removed from favorites" : "Added to favorites");
            return { ...l, isFavorite: !l.isFavorite };
         }
         return l;
      }));
   };

   const handleToggleReadLater = (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLinks(prev => prev.map(l => {
         if (l.id === id) {
            toast(l.isReadLater ? "Removed from read later" : "Added to read later");
            return { ...l, isReadLater: !l.isReadLater };
         }
         return l;
      }));
   };

   const handleArchive = (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setLinks(prev => prev.map(l => {
         if (l.id === id) {
            toast(l.isArchived ? "Unarchived" : "Archived");
            return { ...l, isArchived: !l.isArchived };
         }
         return l;
      }));
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
         onConfirm: () => {
            setLinks(prev => prev.filter(l => !selectedItemIds.has(l.id)));
            setSelectedItemIds(new Set());
            setIsSelectionMode(false);
            setDeleteConfirmation({ isOpen: false, count: 0, onConfirm: () => { } });
            toast.success("Items deleted");
         }
      });
   };

   const handleDeleteSingleRequest = (id: string) => {
      setDeleteConfirmation({
         isOpen: true,
         count: 1,
         onConfirm: () => {
            setLinks(prev => prev.filter(l => l.id !== id));
            if (selectedLinkId === id) setSelectedLinkId(null);
            setDeleteConfirmation({ isOpen: false, count: 0, onConfirm: () => { } });
            toast.success("Item deleted");
         }
      });
   }

   const handleSaveCategory = (cat: Category) => {
      if (categories.some(c => c.id === cat.id && editingCategory?.id !== cat.id)) {
         alert("A category with this ID already exists."); return;
      }
      if (editingCategory) {
         setCategories(prev => prev.map(c => c.id === editingCategory.id ? cat : c));
      } else {
         setCategories([...categories, cat]);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
   };

   const handleSaveCollection = (col: Collection) => {
      if (collections.some(c => c.id === col.id && editingCollection?.id !== col.id)) {
         alert("A collection with this ID already exists."); return;
      }
      if (editingCollection) {
         setCollections(prev => prev.map(c => c.id === editingCollection.id ? col : c));
      } else {
         setCollections([...collections, col]);
      }
      setIsCollectionModalOpen(false);
      setEditingCollection(null);
   };

   const handleUpdateLinkCategory = (linkId: string, catId: string) => {
      setLinks(prev => prev.map(l => l.id === linkId ? { ...l, categoryId: catId } : l));
   };

   const handleToggleLinkCollection = (linkId: string, colId: string) => {
      setLinks(prev => prev.map(l => {
         if (l.id !== linkId) return l;
         const newCols = l.collectionIds.includes(colId)
            ? l.collectionIds.filter(id => id !== colId)
            : [...l.collectionIds, colId];
         return { ...l, collectionIds: newCols };
      }));
   };

   const isAllSelected = filteredLinks.length > 0 && filteredLinks.every(l => selectedItemIds.has(l.id));

   const toggleFilter = (setFn: any, current: string[], val: string) => {
      if (current.includes(val)) setFn(current.filter(c => c !== val));
      else setFn([...current, val]);
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
                  onLogout={onLogout}
                  t={t}
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
                     <button
                        onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                        className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500 hover:text-[#21DBA4]' : 'hover:bg-slate-100 text-slate-400 hover:text-[#21DBA4]'}`}
                     >
                        <Plus size={14} />
                     </button>
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
                                                ? `${cat.color} text-slate-300 hover:ring-2 hover:ring-[#21DBA4]/50`
                                                : `${cat.color} text-slate-600 hover:ring-2 hover:ring-[#21DBA4]/50`
                                             }`}
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
                                       <button
                                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                                          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-1 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-all"
                                       >
                                          <Edit2 size={10} />
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
                                       className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-600 bg-white/50 rounded-md transition-all"
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
                     <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="User" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className={`text-sm font-bold truncate group-hover:text-[#21DBA4] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Alex Designer</div>
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
                        <div>
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

                        {/* Sort & Advanced Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
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
                                          { id: 'date-asc', label: t('oldestFirst') },
                                          { id: 'score', label: t('highestScore') }
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
// Sub-components
// ----------------------------------------------------------------------

const NavItem = ({ icon, label, count, active, onClick, iconClassName, className, theme }: any) => (
   <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${className} ${active ? 'bg-[#E0FBF4] text-[#21DBA4]' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-200' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'}`}
   >
      <div className={`${active ? 'text-[#21DBA4]' : iconClassName || 'text-slate-400'}`}>{icon}</div>
      <span className="text-sm font-bold flex-1 truncate text-[14px]">
         {label.replace('[Beta]', '')}
         {label.includes('[Beta]') && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-[9px] font-extrabold tracking-wide">
               BETA
            </span>
         )}
      </span>
      {count !== undefined && (
         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-[#21DBA4]/20 text-[#21DBA4]' : theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
            {count}
         </span>
      )}
   </div>
);

const LinkCard = ({ data, onClick, onToggleFavorite, onToggleReadLater, selected, selectionMode, onToggleSelect, categories, theme, showThumbnails, t }: any) => {
   const source = getSourceInfo(data.url);
   const categoryId = data.categoryId;
   const categoryName = categories?.find((c: any) => c.id === categoryId)?.name || categoryId;

   return (
      <motion.div
         layout
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.9 }}
         onClick={onClick}
         className={`rounded-2xl border transition-all duration-300 group overflow-hidden flex flex-col h-auto cursor-pointer relative
         ${selected ? 'border-[#21DBA4] ring-2 ring-[#21DBA4]/20 shadow-lg' : theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-slate-200/50'}
      `}
      >
         <div
            className={`absolute top-3 left-3 z-30 transition-opacity duration-200 ${selectionMode || selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
         >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-sm ${selected ? 'bg-[#21DBA4] text-white' : 'bg-white/90 text-slate-300 hover:text-slate-500 hover:bg-white'}`}>
               {selected ? <CheckSquare size={16} /> : <Square size={16} />}
            </div>
         </div>

         {showThumbnails && (
            <div className={`relative h-48 overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
               <img src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

               <div className={`absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 transition-all ${selectionMode || selected ? 'translate-x-8' : 'group-hover:translate-x-8'}`}>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold backdrop-blur-md shadow-sm ${source.color}`}>
                     {source.icon} {source.name}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
                     <Hash size={10} className="opacity-70" /> {categoryName}
                  </div>
               </div>

               <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock size={10} /> {data.readTime}
               </div>

               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex gap-2 w-full">
                     <button className="flex-1 bg-white/20 backdrop-blur hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                        {t('summarize')}
                     </button>
                     <button onClick={(e) => { e.stopPropagation(); window.open(`https://${data.url}`, '_blank') }} className="w-8 h-8 bg-white text-slate-900 rounded-lg flex items-center justify-center hover:bg-[#21DBA4] hover:text-white transition-colors">
                        <ExternalLink size={14} />
                     </button>
                  </div>
               </div>
            </div>
         )}

         <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
               <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} p-1 rounded-md`}>
                  <GlobeIcon url={data.url} />
               </div>
               <span className="text-[10px] font-medium text-slate-400 truncate max-w-[100px]">{data.url}</span>
               <span className="text-[10px] text-slate-300 ml-auto">{data.date}</span>
            </div>

            <h3 className={`font-bold text-[15px] leading-snug mb-3 h-[42px] group-hover:text-[#21DBA4] transition-colors line-clamp-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
               {data.title}
            </h3>

            <div className={`rounded-xl p-3 mb-4 border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 group-hover:border-[#21DBA4]/20' : 'bg-[#F8FAFC] border-slate-100 group-hover:border-[#21DBA4]/20'}`}>
               <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={12} className="text-[#21DBA4]" />
                  <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>AI Summary</span>
               </div>
               <p className={`text-[11px] leading-relaxed line-clamp-3 h-[54px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                  {data.summary}
               </p>
            </div>

            {!showThumbnails && (
               <div className="flex flex-wrap gap-1.5 mb-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold ${source.color}`}>
                     {source.icon} {source.name}
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${theme === 'dark' ? 'text-slate-400 border-slate-700 bg-slate-800' : 'text-slate-500 border-slate-200 bg-slate-50'}`}>
                     <Hash size={10} className="opacity-70" /> {categoryName}
                  </div>
               </div>
            )}

            <div className={`mt-auto pt-2 flex items-center justify-between border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
               <div className="flex gap-1.5 items-center overflow-hidden">
                  {data.tags.slice(0, 3).map((tag: string) => (
                     <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors cursor-pointer whitespace-nowrap ${theme === 'dark' ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}>
                        #{tag}
                     </span>
                  ))}
                  {data.tags.length > 3 && (
                     <span className={`text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap ${theme === 'dark' ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-100'}`}>
                        +{data.tags.length - 3}
                     </span>
                  )}
               </div>
               <button onClick={onToggleFavorite} className={`transition-colors ${data.isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                  <Star size={16} fill={data.isFavorite ? "currentColor" : "none"} />
               </button>
            </div>
         </div>
      </motion.div>
   );
};

const LinkRow = ({ data, onClick, onToggleFavorite, categories, selected, selectionMode, onToggleSelect, theme, showThumbnails }: any) => {
   const source = getSourceInfo(data.url);
   const categoryName = categories?.find((c: any) => c.id === data.categoryId)?.name || data.categoryId;

   return (
      <motion.div
         layout
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         onClick={onClick}
         className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer group relative
            ${selected ? 'border-[#21DBA4] ring-2 ring-[#21DBA4]/20' : theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:shadow-md hover:bg-slate-800' : 'bg-white border-slate-100 hover:shadow-md'}
         `}
      >
         {(selectionMode || selected) && (
            <div
               className="shrink-0"
               onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
            >
               <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${selected ? 'bg-[#21DBA4] text-white' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>
                  {selected ? <CheckSquare size={14} /> : <Square size={14} />}
               </div>
            </div>
         )}

         {showThumbnails && (
            <div className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
               <img src={data.image} className="w-full h-full object-cover" />
            </div>
         )}

         <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm truncate group-hover:text-[#21DBA4] transition-colors ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{data.title}</h3>
            <p className="text-xs text-slate-400 truncate mt-1">{data.summary}</p>
            <div className="flex items-center gap-2 mt-2">
               <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${source.color}`}>{source.name}</span>
               <span className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'dark' ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'}`}>{categoryName}</span>
               <span className="text-[10px] text-slate-300">{data.date}</span>
            </div>
         </div>
         <button onClick={onToggleFavorite} className={`p-2 ${data.isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
            <Star size={16} fill={data.isFavorite ? "currentColor" : "none"} />
         </button>
      </motion.div>
   )
}

const getSourceInfo = (url: string) => {
   const lowerUrl = url.toLowerCase();
   if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')) return { name: 'YouTube', icon: <Youtube size={10} />, color: 'bg-red-500' };
   if (lowerUrl.includes('instagram')) return { name: 'Instagram', icon: <Instagram size={10} />, color: 'bg-pink-500' };
   if (lowerUrl.includes('threads')) return { name: 'Threads', icon: <AtSign size={10} />, color: 'bg-black' };
   if (lowerUrl.includes('medium') || lowerUrl.includes('blog')) return { name: 'Blog', icon: <FileText size={10} />, color: 'bg-orange-500' };
   return { name: 'Web', icon: <Globe size={10} />, color: 'bg-blue-500' };
};

const GlobeIcon = ({ url }: { url: string }) => {
   return <div className="w-3 h-3 bg-slate-200 rounded-full" />;
};

const LinkDetailPanel = ({ link, categories, collections, onClose, onToggleFavorite, onToggleReadLater, onArchive, onDelete, onUpdateCategory, onToggleCollection, theme, t }: any) => {
   const source = getSourceInfo(link.url);
   return (
      <div className="fixed inset-0 z-[60] flex justify-end">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
         />
         <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`w-full max-w-2xl h-full shadow-2xl relative flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}`}
         >
            {/* Header Toolbar */}
            <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
               <div className="flex items-center gap-3">
                  <button onClick={onClose} className={`p-2 -ml-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                     <X size={20} />
                  </button>
                  <div className={`h-4 w-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-white text-xs font-bold ${source.color}`}>
                     {source.icon} {source.name}
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={onToggleReadLater} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${link.isReadLater ? 'text-[#21DBA4]' : 'text-slate-400'}`} title="Read Later">
                     <Clock size={18} fill={link.isReadLater ? "currentColor" : "none"} />
                  </button>
                  <button onClick={onToggleFavorite} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${link.isFavorite ? 'text-yellow-400' : 'text-slate-400'}`} title="Favorite">
                     <Star size={18} fill={link.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button onClick={onDelete} className={`p-2 rounded-full hover:text-red-500 transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-red-50 text-slate-400'}`} title="Delete">
                     <Trash2 size={18} />
                  </button>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <button className={`p-2 rounded-full text-slate-400 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                           <MoreHorizontal size={18} />
                        </button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => {
                           navigator.clipboard.writeText(link.url);
                           toast.success("Link copied to clipboard");
                        }}>
                           <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                           toast.success("Shared successfully");
                        }}>
                           <Share2 className="mr-2 h-4 w-4" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>

            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
               {/* Platform-Specific Cover/Media */}
               {(() => {
                  const platform = source.name.toLowerCase();
                  const getYoutubeId = (url: string) => {
                     const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^#\&\?]*)/);
                     return match && match[1].length === 11 ? match[1] : null;
                  };

                  // YouTube: Embed player
                  if (platform === 'youtube') {
                     const videoId = getYoutubeId(link.url);
                     return (
                        <div className="aspect-video bg-black relative">
                           {videoId ? (
                              <iframe
                                 width="100%"
                                 height="100%"
                                 src={`https://www.youtube.com/embed/${videoId}`}
                                 title={link.title}
                                 frameBorder="0"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                              />
                           ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Youtube size={48} className="text-white opacity-50" />
                              </div>
                           )}
                        </div>
                     );
                  }

                  // Threads/Instagram: Image Carousel
                  if (platform === 'threads' || platform === 'instagram') {
                     const images = link.images && link.images.length > 0 ? link.images : (link.image ? [link.image] : []);
                     const [currentIdx, setCurrentIdx] = React.useState(0);

                     if (images.length === 0) {
                        return (
                           <div className={`h-32 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                              <Instagram size={48} className="text-slate-400" />
                           </div>
                        );
                     }

                     return (
                        <div className="relative">
                           <div className="h-80 relative overflow-hidden">
                              <img
                                 src={images[currentIdx]}
                                 alt={`${link.title} - Image ${currentIdx + 1}`}
                                 className="w-full h-full object-cover"
                                 onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    e.currentTarget.src = '/placeholder.png';
                                 }}
                              />
                              {/* Visit Original Button */}
                              <a
                                 href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white hover:scale-105 transition-all"
                              >
                                 <ExternalLink size={14} /> {t('visitOriginal')}
                              </a>
                           </div>
                           {/* Carousel Controls */}
                           {images.length > 1 && (
                              <div className={`flex items-center justify-between px-4 py-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                 <button
                                    onClick={() => setCurrentIdx(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-200'}`}
                                 >
                                    <ChevronLeft size={16} />
                                 </button>
                                 <div className="flex gap-1.5">
                                    {images.map((_: string, idx: number) => (
                                       <button
                                          key={idx}
                                          onClick={() => setCurrentIdx(idx)}
                                          className={`h-1.5 rounded-full transition-all ${idx === currentIdx
                                             ? 'w-6 bg-[#21DBA4]'
                                             : `w-1.5 ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`
                                             }`}
                                       />
                                    ))}
                                 </div>
                                 <button
                                    onClick={() => setCurrentIdx(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-200'}`}
                                 >
                                    <ChevronRight size={16} />
                                 </button>
                              </div>
                           )}
                        </div>
                     );
                  }

                  // Default: Single image
                  return (
                     <div className="h-64 relative group">
                        <img src={link.image} alt={link.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        <a
                           href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white hover:scale-105 transition-all"
                        >
                           <ExternalLink size={14} /> {t('visitOriginal')}
                        </a>
                     </div>
                  );
               })()}

               <div className="p-8 max-w-xl mx-auto">
                  <div className="mb-6">
                     <h1 className={`text-3xl font-black leading-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{link.title}</h1>
                     <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Globe size={14} /> {link.url}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {link.readTime} read</span>
                     </div>
                  </div>

                  {/* Category & Collection Editor */}
                  <div className={`mb-8 p-6 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                     <div className="grid grid-cols-[100px_1fr] gap-y-6 items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('category')}</label>
                        <div>
                           <div className="relative inline-block w-full max-w-[200px]">
                              <select
                                 value={link.categoryId}
                                 onChange={(e) => onUpdateCategory(link.id, e.target.value)}
                                 className={`appearance-none w-full text-sm font-bold px-4 py-2.5 rounded-xl border outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                              >
                                 {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                           </div>
                        </div>

                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('collections')}</label>
                        <div>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <button className={`w-full max-w-[200px] text-left text-sm font-bold px-4 py-2.5 rounded-xl border outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all cursor-pointer flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                    <span className="truncate block">
                                       {link.collectionIds.length > 0
                                          ? collections.filter((c: any) => link.collectionIds.includes(c.id)).map((c: any) => c.name).join(', ')
                                          : <span className="text-slate-400 font-normal">{t('noCollections')}</span>}
                                    </span>
                                    <ChevronDown className="text-slate-400 ml-2 shrink-0" size={14} />
                                 </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-[200px]" align="start">
                                 {collections.map((col: any) => (
                                    <DropdownMenuCheckboxItem
                                       key={col.id}
                                       checked={link.collectionIds.includes(col.id)}
                                       onCheckedChange={() => onToggleCollection(link.id, col.id)}
                                       onSelect={(e) => e.preventDefault()}
                                    >
                                       {col.name}
                                    </DropdownMenuCheckboxItem>
                                 ))}
                                 {collections.length === 0 && <div className="p-2 text-xs text-slate-500 italic text-center">No collections</div>}
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     </div>
                  </div>

                  <div className={`rounded-2xl p-6 border shadow-sm mb-8 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Brain size={100} className="text-[#21DBA4]" />
                     </div>
                     <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-[#E0FBF4] rounded-lg text-[#21DBA4]">
                           <Sparkles size={18} />
                        </div>
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('aiTakeaways')}</h3>
                     </div>
                     <div className="space-y-3 relative z-10">
                        {link.keyTakeaways ? (
                           <ul className="space-y-2">
                              {link.keyTakeaways.map((point: string, idx: number) => (
                                 <li key={idx} className={`flex gap-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <span className="text-[#21DBA4] font-bold text-lg leading-none">•</span>
                                    {point}
                                 </li>
                              ))}
                           </ul>
                        ) : (
                           <p className="text-slate-600 text-sm leading-relaxed">{link.summary}</p>
                        )}
                     </div>
                  </div>

                  {/* Full Article Content - Platform-Specific Rendering */}
                  {(() => {
                     const platform = source.name.toLowerCase();

                     // YouTube: No content section (only summary in AI section above)
                     if (platform === 'youtube') {
                        return null;
                     }

                     // Threads: Split content into body and comments
                     if (platform === 'threads' && link.content) {
                        const COMMENTS_MARKER = '[[[COMMENTS_SECTION]]]';
                        const COMMENT_SEPARATOR = '[[[COMMENT_SPLIT]]]';

                        let mainText = link.content;
                        let comments: string[] = [];

                        // Try marker-based parsing
                        if (link.content.includes(COMMENTS_MARKER)) {
                           const [main, commentsPart] = link.content.split(COMMENTS_MARKER);
                           mainText = main?.trim() || '';
                           comments = commentsPart
                              ? commentsPart.split(COMMENT_SEPARATOR).map(c => c.trim()).filter(c => c.length > 0)
                              : [];
                        } else {
                           // Fallback: try Comments(N) pattern
                           const legacyMatch = link.content.match(/Comments?\s*\(\d+\)/i);
                           if (legacyMatch) {
                              const splitIndex = link.content.indexOf(legacyMatch[0]);
                              mainText = link.content.slice(0, splitIndex).trim();
                              const commentsRaw = link.content.slice(splitIndex + legacyMatch[0].length).trim();
                              comments = commentsRaw.split(/\n\n+/).map(c => c.trim()).filter(c => c.length > 3);
                           }
                        }

                        return (
                           <div className="mb-8">
                              {/* Main Content Header */}
                              <div className="flex items-center gap-2 mb-4">
                                 <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <BookOpen size={18} className="text-slate-500" />
                                 </div>
                                 <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                    Content
                                 </h3>
                              </div>
                              <div className={`h-px mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />

                              {/* Main Content */}
                              <div
                                 className={`p-6 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                                 style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
                              >
                                 <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {mainText}
                                 </p>
                              </div>

                              {/* Comments Section */}
                              {comments.length > 0 && (
                                 <div className="mt-8">
                                    <div className="flex items-center gap-2 mb-4">
                                       <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                          <AtSign size={18} className="text-slate-500" />
                                       </div>
                                       <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                          Comments ({comments.length})
                                       </h3>
                                    </div>
                                    <div className={`h-px mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />

                                    <div className={`rounded-2xl border divide-y ${theme === 'dark' ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-slate-100 divide-slate-100'}`}>
                                       {comments.map((comment, idx) => (
                                          <div key={idx} className="p-4">
                                             <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {comment}
                                             </p>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>
                        );
                     }

                     // Default: Show content as-is (Instagram, Web, Blog)
                     if (link.content) {
                        return (
                           <div className="mb-8">
                              <div className="flex items-center gap-2 mb-4">
                                 <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <BookOpen size={18} className="text-slate-500" />
                                 </div>
                                 <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                    본문 내용
                                 </h3>
                              </div>
                              <div
                                 className={`p-6 rounded-2xl border shadow-sm prose prose-sm max-w-none ${theme === 'dark' ? 'bg-slate-900 border-slate-800 prose-invert' : 'bg-white border-slate-100'}`}
                                 style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
                              >
                                 {link.content.split('\n').map((line: string, idx: number) => (
                                    <p key={idx} className={`mb-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                       {line || <br />}
                                    </p>
                                 ))}
                              </div>
                           </div>
                        );
                     }

                     return null;
                  })()}

                  {/* My Notes - NOW AFTER CONTENT */}
                  <div className="mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                           <FileText size={18} className="text-slate-400" /> {t('myNotes')}
                        </h3>
                        <span className="text-xs text-slate-400">{t('autoSaved')}</span>
                     </div>
                     <textarea
                        className={`w-full min-h-[150px] p-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 focus:border-[#21DBA4] transition-all resize-y placeholder:text-slate-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                        placeholder="Add your thoughts, ideas, or connect this with other concepts..."
                        defaultValue={link.notes}
                     />
                  </div>

                  <div>
                     <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">{t('tags')}</h3>
                     <div className="flex flex-wrap gap-2">
                        {link.tags.map((tag: string) => (
                           <span key={tag} className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-[#21DBA4]' : 'bg-white border-slate-200 text-slate-600 hover:border-[#21DBA4] hover:text-[#21DBA4]'}`}>
                              #{tag}
                           </span>
                        ))}
                        <button className={`px-3 py-1.5 border border-dashed rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:text-slate-300' : 'border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400'}`}>
                           <Plus size={12} /> {t('addLink')}
                        </button>
                     </div>
                  </div>
               </div>

               <div className="h-32 md:h-20"></div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t flex items-center gap-2 z-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
               <div className="w-8 h-8 rounded-full bg-[#21DBA4] flex items-center justify-center text-white shrink-0">
                  <Brain size={16} />
               </div>
               <input
                  type="text"
                  placeholder="Ask AI about this content..."
                  className={`flex-1 rounded-full h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all ${theme === 'dark' ? 'bg-slate-800 text-white focus:bg-slate-700' : 'bg-slate-100 focus:bg-white'}`}
               />
               <button className="p-2 text-slate-400 hover:text-[#21DBA4]">
                  <ArrowUpCircle size={24} />
               </button>
            </div>
         </motion.div>
      </div>
   );
};

const SettingsModal = ({ onClose, settings, setSettings, onLogout, t }: any) => {
   const [activeTab, setActiveTab] = useState('general');
   const { theme, language, showThumbnails, notifications } = settings;
   const { setTheme, setLanguage, setShowThumbnails, setNotifications } = setSettings;

   // Mobile View State: 'menu' | 'content'
   const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
         <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full md:max-w-5xl h-full md:h-[80vh] md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
            onClick={e => e.stopPropagation()}
         >
            {/* Sidebar */}
            <div className={`w-full md:w-64 border-r flex flex-col ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} ${mobileView === 'menu' ? 'flex h-full' : 'hidden md:flex'}`}>
               <div className="p-6 flex items-center justify-between">
                  <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                     <Settings className="text-[#21DBA4]" size={20} /> {t('settings')}
                  </h2>
                  <button onClick={onClose} className="md:hidden p-2 -mr-2 text-slate-400">
                     <X size={24} />
                  </button>
               </div>
               <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                  {[
                     { id: 'account', label: t('myAccount'), icon: User },
                     { id: 'general', label: t('general'), icon: Smartphone },
                     { id: 'integrations', label: t('integrations'), icon: Zap },
                     { id: 'notifications', label: t('notifications'), icon: Bell },
                     { id: 'data', label: t('dataStorage'), icon: Shield },
                  ].map((item) => (
                     <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setMobileView('content'); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-[#21DBA4] text-white shadow-sm' : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                     >
                        <item.icon size={18} />
                        {item.label}
                        <ChevronRight size={16} className="ml-auto opacity-50 md:hidden" />
                     </button>
                  ))}
               </nav>
               <div className={`p-4 border-t mt-auto ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:bg-opacity-10 transition-colors">
                     <LogOut size={18} /> {t('signOut')}
                  </button>
               </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 flex flex-col h-full ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} ${mobileView === 'content' ? 'flex' : 'hidden md:flex'}`}>
               <div className={`h-16 border-b flex items-center justify-between px-4 md:px-8 shrink-0 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
                  <div className="flex items-center gap-3">
                     <button onClick={() => setMobileView('menu')} className="md:hidden p-1 -ml-2 text-slate-400 hover:text-slate-600">
                        <ChevronLeft size={24} />
                     </button>
                     <h3 className={`font-bold text-lg capitalize ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t(activeTab === 'data' ? 'dataStorage' : activeTab === 'account' ? 'myAccount' : activeTab)}</h3>
                  </div>
                  <button onClick={onClose} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-400'}`}>
                     <X size={20} />
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 md:p-8">
                  {activeTab === 'general' && (
                     <div className="max-w-xl space-y-6 md:space-y-8">
                        <div className="space-y-3 md:space-y-4">
                           <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('appearance')}</h4>
                           <div className="grid grid-cols-2 gap-3 md:gap-4">
                              <button onClick={() => setTheme('light')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${theme === 'light' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                 <Sun size={20} className={theme === 'light' ? 'text-[#21DBA4]' : 'text-slate-400'} />
                                 <span className="text-xs md:text-sm font-bold text-slate-600">Light</span>
                              </button>
                              <button onClick={() => setTheme('dark')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${theme === 'dark' ? 'border-[#21DBA4] bg-slate-800' : 'border-slate-200 opacity-60'}`}>
                                 <Moon size={20} className={theme === 'dark' ? 'text-[#21DBA4]' : 'text-slate-400'} />
                                 <span className="text-xs md:text-sm font-bold text-slate-600">Dark</span>
                              </button>
                           </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                           <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('language')}</h4>
                           <div className="grid grid-cols-2 gap-3 md:gap-4">
                              <button onClick={() => setLanguage('en')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${language === 'en' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                 <span className="text-xl md:text-2xl">🇺🇸</span>
                                 <span className="text-xs md:text-sm font-bold text-slate-600">{t('english')}</span>
                              </button>
                              <button onClick={() => setLanguage('ko')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${language === 'ko' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                 <span className="text-xl md:text-2xl">🇰🇷</span>
                                 <span className="text-xs md:text-sm font-bold text-slate-600">{t('korean')}</span>
                              </button>
                           </div>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                           <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('preferences')}</h4>
                           <div className="space-y-2 md:space-y-3">
                              <div onClick={() => setShowThumbnails(!showThumbnails)} className={`flex items-center justify-between p-3 md:p-4 rounded-xl border cursor-pointer ${showThumbnails ? 'border-[#21DBA4]/30 bg-[#E0FBF4]/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
                                 <div className="flex items-center gap-3">
                                    <ImageIcon size={18} className="text-slate-400" />
                                    <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('thumbnails')}</h5>
                                 </div>
                                 <div className={`w-9 h-5 md:w-11 md:h-6 rounded-full relative transition-colors ${showThumbnails ? 'bg-[#21DBA4]' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-sm transition-transform ${showThumbnails ? 'translate-x-4 md:translate-x-5' : ''}`} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
                  {activeTab === 'account' && <AccountSettings theme={theme} t={t} isMobile={true} />}
                  {activeTab === 'integrations' && <IntegrationsSettings theme={theme} t={t} isMobile={true} />}
                  {activeTab === 'notifications' && <NotificationsSettings theme={theme} t={t} isMobile={true} notifications={notifications} setNotifications={setNotifications} />}
                  {activeTab === 'data' && <DataSettings theme={theme} t={t} isMobile={true} />}
               </div>
            </div>
         </motion.div>
      </div>
   );
};

const AccountSettings = ({ theme, t, isMobile }: any) => (
   <div className="max-w-xl space-y-6 md:space-y-8">
      <div className="flex items-center gap-4 md:gap-6">
         <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-100 relative group cursor-pointer overflow-hidden border-4 border-white shadow-lg shrink-0">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
            <div onClick={() => toast.info("Avatar change disabled")} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Edit2 className="text-white" size={24} />
            </div>
         </div>
         <div className="flex-1 min-w-0">
            <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Alex Designer</h4>
            <p className="text-slate-400 text-sm truncate">alex.design@linkbrain.app</p>
            <button onClick={() => toast.info("Avatar change disabled")} className="mt-2 md:mt-3 text-xs font-bold text-[#21DBA4] border border-[#21DBA4]/30 px-3 py-1.5 rounded-full hover:bg-[#21DBA4] hover:text-white transition-all">
               {t('changeAvatar')}
            </button>
         </div>
      </div>

      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">{t('firstName')}</label>
               <input type="text" defaultValue="Alex" className={`w-full p-2.5 md:p-3 rounded-xl border outline-none transition-all font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-[#21DBA4]'}`} />
            </div>
            <div className="space-y-1.5 md:space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">{t('lastName')}</label>
               <input type="text" defaultValue="Designer" className={`w-full p-2.5 md:p-3 rounded-xl border outline-none transition-all font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-[#21DBA4]'}`} />
            </div>
         </div>
         <div className="space-y-1.5 md:space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">{t('email')}</label>
            <input type="email" defaultValue="alex.design@linkbrain.app" className={`w-full p-2.5 md:p-3 rounded-xl border outline-none transition-all font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-[#21DBA4]'}`} />
         </div>
      </div>

      <div className="p-4 md:p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 md:mb-4">
               <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">PRO PLAN</span>
               <CreditCard className="text-white/50" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1">LinkBrain Pro</h3>
            <p className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6">Renews on Oct 24, 2025</p>
            <div className="flex gap-2 md:gap-3">
               <button onClick={() => toast.info("Redirecting to billing portal...")} className="bg-white text-slate-900 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-100 whitespace-nowrap">{t('manageBilling')}</button>
               <button onClick={() => toast.info("Please contact support to cancel")} className="text-white/70 hover:text-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold whitespace-nowrap">{t('cancelPlan')}</button>
            </div>
         </div>
         <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Brain size={150} className="md:w-[200px] md:h-[200px]" />
         </div>
      </div>
   </div>
);

const IntegrationsSettings = ({ theme, t, isMobile }: any) => (
   <div className="max-w-xl space-y-4 md:space-y-6">
      <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-700 mb-4 md:mb-6">
         <Zap size={20} className="shrink-0 mt-0.5" />
         <div className="text-xs md:text-sm">
            <p className="font-bold mb-0.5">Supercharge your Brain</p>
            <p className="opacity-80 leading-relaxed">Connect your favorite tools to automatically import content and sync your knowledge base.</p>
         </div>
      </div>

      <div className="space-y-3 md:space-y-4">
         <IntegrationCard name="Notion" icon="N" description="Sync your saved links to a Notion database" connected t={t} theme={theme} />
         <IntegrationCard name="YouTube" icon="Y" description="Import liked videos and playlists automatically" t={t} theme={theme} />
         <IntegrationCard name="Readwise" icon="R" description="Sync highlights from articles and books" t={t} theme={theme} />
         <IntegrationCard name="Slack" icon="S" description="Save links directly from Slack conversations" t={t} theme={theme} />
      </div>
   </div>
);

const NotificationsSettings = ({ theme, t, isMobile, notifications, setNotifications }: any) => (
   <div className="max-w-xl space-y-6 md:space-y-8">
      <div className="space-y-3 md:space-y-4">
         <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('notifications')}</h4>
         <div className="space-y-2 md:space-y-3">
            <ToggleOption
               label={t('weeklyDigest')}
               description="A summary of your top saved content every Monday"
               checked={notifications?.weeklyDigest}
               onToggle={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
               theme={theme}
            />
            <ToggleOption
               label={t('productUpdates')}
               description="News about new features and improvements"
               checked={notifications?.productUpdates}
               onToggle={() => setNotifications({ ...notifications, productUpdates: !notifications.productUpdates })}
               theme={theme}
            />
            <ToggleOption label={t('securityAlerts')} description="Important alerts about your account security" checked disabled theme={theme} />
         </div>
      </div>
   </div>
);

const DataSettings = ({ theme, t, isMobile }: any) => (
   <div className="max-w-xl space-y-6 md:space-y-8">
      <div className="space-y-3 md:space-y-4">
         <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">Export & Import</h4>
         <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button onClick={() => toast.success("Export started...")} className={`p-4 md:p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 md:gap-3 group ${theme === 'dark' ? 'border-slate-700 hover:border-[#21DBA4] hover:bg-[#21DBA4]/10' : 'border-slate-200 hover:border-[#21DBA4] hover:bg-[#E0FBF4]/10'}`}>
               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 text-slate-400 group-hover:bg-[#21DBA4] group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-[#21DBA4] group-hover:text-white'}`}>
                  <Download size={20} className="md:w-6 md:h-6" />
               </div>
               <div>
                  <h5 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('exportData')}</h5>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">JSON / CSV</p>
               </div>
            </button>
            <button onClick={() => toast.info("Import feature coming soon")} className={`p-4 md:p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 md:gap-3 group ${theme === 'dark' ? 'border-slate-700 hover:border-[#21DBA4] hover:bg-[#21DBA4]/10' : 'border-slate-200 hover:border-[#21DBA4] hover:bg-[#E0FBF4]/10'}`}>
               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 text-slate-400 group-hover:bg-[#21DBA4] group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-[#21DBA4] group-hover:text-white'}`}>
                  <Upload size={20} className="md:w-6 md:h-6" />
               </div>
               <div>
                  <h5 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('importData')}</h5>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Bookmarks</p>
               </div>
            </button>
         </div>
      </div>

      <div className={`pt-6 md:pt-8 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
         <h4 className="text-xs md:text-sm font-bold text-red-500 uppercase tracking-wider mb-3 md:mb-4">{t('dangerZone')}</h4>
         <button onClick={() => toast.error("Account deletion is disabled in demo")} className="w-full p-3 md:p-4 border border-red-200 bg-red-50 rounded-xl text-red-600 font-bold flex items-center justify-between hover:bg-red-100 transition-colors text-sm md:text-base">
            <span>{t('deleteAccount')}</span>
            <ChevronRight size={16} />
         </button>
      </div>
   </div>
);

const ToggleOption = ({ label, description, checked, disabled, onToggle, theme }: any) => (
   <div onClick={() => !disabled && (onToggle ? onToggle() : toast.success("Setting updated"))} className={`flex items-center justify-between p-3 md:p-4 rounded-xl border cursor-pointer ${checked ? 'border-[#21DBA4]/30 bg-[#E0FBF4]/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex-1 mr-4">
         <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{label}</h5>
         {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className={`w-9 h-5 md:w-11 md:h-6 rounded-full relative transition-colors flex-shrink-0 ${checked ? 'bg-[#21DBA4]' : 'bg-slate-200'}`}>
         <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4 md:translate-x-5' : ''}`} />
      </div>
   </div>
);

const IntegrationCard = ({ name, icon, description, connected, t, theme }: any) => (
   <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-100 hover:shadow-md'}`}>
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0">
         {icon}
      </div>
      <div className="flex-1 min-w-0">
         <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{name}</h5>
         <p className="text-xs text-slate-400 truncate md:whitespace-normal">{description}</p>
      </div>
      <button onClick={() => toast.success(connected ? "Disconnected" : "Connected!")} className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${connected ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
         {connected ? t('connected') : t('connect')}
      </button>
   </div>
);

const ManagementModal = ({ title, initialData, type, onClose, onSave, theme, t }: any) => {
   const [name, setName] = useState(initialData?.name || '');
   const [id, setId] = useState(initialData?.id || '');
   const [color, setColor] = useState(initialData?.color || (type === 'category' ? 'bg-slate-100 text-slate-600' : 'bg-slate-500'));

   const colors = type === 'category'
      ? ['bg-pink-100 text-pink-600', 'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-orange-100 text-orange-600', 'bg-purple-100 text-purple-600']
      : ['bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500', 'bg-slate-800'];

   return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
         <div className={`rounded-2xl w-full max-w-sm p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500">{t('name')}</label>
                  <input type="text" value={name} onChange={e => { setName(e.target.value); if (!initialData) setId(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className={`w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-[#21DBA4]/20 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} autoFocus />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500">ID (Unique)</label>
                  <input type="text" value={id} onChange={e => setId(e.target.value)} disabled={!!initialData} className={`w-full border rounded-lg p-2 text-sm mt-1 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200'}`} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500">{t('colorStyle')}</label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                     {colors.map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border ${c} ${color === c ? 'ring-2 ring-black ring-offset-2' : ''}`} />
                     ))}
                  </div>
               </div>
               <button onClick={() => onSave({ id, name, color })} disabled={!name || !id} className="w-full bg-[#21DBA4] text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-[#21DBA4]/20 hover:bg-[#1bc290] disabled:opacity-50 disabled:cursor-not-allowed">{t('save')}</button>
            </div>
         </div>
      </div>
   )
}

const AddLinkModal = ({ onClose, onAdd, theme, t }: any) => {
   const [url, setUrl] = useState('');
   const [isAnalyzing, setIsAnalyzing] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url) return;
      setIsAnalyzing(true);
      await new Promise(r => setTimeout(r, 1500));
      onAdd(url);
   };

   return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="p-8">
               <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('addLink')}</h2>
                  <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}><X size={18} /></button>
               </div>
               {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-6">
                     <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-[#E0FBF4] border-t-[#21DBA4] animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center"><Brain size={24} className="text-[#21DBA4]" /></div>
                     </div>
                     <div className="text-center space-y-2"><h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Analyzing Content...</h3><p className="text-slate-500 text-sm">Generating summary and extracting tags</p></div>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <label className={`text-sm font-bold ml-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>URL</label>
                        <div className="relative">
                           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400"><ExternalLink size={18} /></div>
                           <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste any link here..." className={`w-full h-14 rounded-2xl pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} autoFocus />
                        </div>
                     </div>
                     <button type="submit" disabled={!url} className="w-full h-14 bg-[#21DBA4] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#21DBA4]/30 hover:bg-[#1bc290] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"><Plus size={20} /> {t('addLink')}</button>
                  </form>
               )}
            </div>
         </motion.div>
      </div>
   );
};

const DeleteConfirmationModal = ({ count, onCancel, onConfirm, theme, t }: any) => {
   return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
         <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl w-full max-w-sm p-6 shadow-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
            onClick={e => e.stopPropagation()}
         >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto">
               <AlertTriangle size={24} />
            </div>
            <h3 className={`font-bold text-lg text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('deleteConfirmTitle').replace('{count}', count)}</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
               {t('deleteConfirmDesc')}
            </p>
            <div className="flex gap-3">
               <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl font-bold transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>{t('cancel')}</button>
               <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">{t('delete')}</button>
            </div>
         </motion.div>
      </div>
   )
}

const ArrowUpCircle = ({ size, className }: any) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 12l-4-4-4 4" />
      <path d="M12 8v8" />
   </svg>
)
