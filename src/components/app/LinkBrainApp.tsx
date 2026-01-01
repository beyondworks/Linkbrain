import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useClips, ClipData } from '../../hooks/useClips';
import { UserPreferences } from '../../hooks/useUserPreferences';
import { TRANSLATIONS, getCategoryColor } from './constants';
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
   LayoutGrid,
   ChevronUp,
   Inbox
} from 'lucide-react';
// @ts-ignore
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion, AnimatePresence } from 'motion/react';
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableChip } from './SortableChip';

import { toast } from 'sonner';
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
import { LinkBrainLogo } from './LinkBrainLogo';
import { AnalysisIndicator, AnalysisItem, AnalysisStatus, AnalysisLogItem } from './AnalysisIndicator';
import { useSubscription } from '../../hooks/useSubscription';
import { useAdmin } from '../../hooks/useAdmin';
import { useAnnouncements, usePopups } from '../../hooks/useAnnouncements';
import { AnnouncementPopup } from './Modals/AnnouncementPopup';
import { TopBannerPopup } from './Modals/TopBannerPopup';

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
      id: '1',
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
      id: '2',
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
      id: '3',
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
      id: '4',
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
      id: '5',
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
      id: '6',
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

export const LinkBrainApp = ({ onBack, onLogout, onAdmin, language, setLanguage, theme, themePreference, setTheme, preferences, updatePreference, initialTab = 'home' }: { onBack?: () => void, onLogout?: () => void, onAdmin?: () => void, language: 'en' | 'ko', setLanguage: (lang: 'en' | 'ko') => void, theme: 'light' | 'dark', themePreference: 'light' | 'dark' | 'system', setTheme: (t: 'light' | 'dark' | 'system') => void, preferences: UserPreferences, updatePreference: (key: keyof UserPreferences, value: any) => void, initialTab?: string }) => {
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



   // Preferences Destructuring
   const { showThumbnails, notifications } = preferences || { showThumbnails: true, notifications: {} };

   // Helper for SettingsModal
   const handleSetShowThumbnails = (show: boolean) => updatePreference('showThumbnails', show);
   const handleSetNotifications = (notifs: any) => updatePreference('notifications', notifs);



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
         notes: clip.notes || '',
         keyTakeaways: takeaways,
         content: clip.contentMarkdown || clip.contentHtml || clip.rawMarkdown || '',
         platform: clip.platform || 'web',
         images: clip.images || (clip.image ? [clip.image] : []),
         author: clip.author || '',
         authorHandle: (clip.authorProfile as any)?.handle || '',
         authorAvatar: (clip.authorProfile as any)?.avatar || '',
         chatHistory: clip.chatHistory || [],  // ← CRITICAL: Include chatHistory!
         lastViewedAt: clip.lastViewedAt,  // ← Include lastViewedAt for tracking views
      };
   };

   // State - now uses Firebase data
   const [links, setLinks] = useState<LinkItem[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [collections, setCollections] = useState<Collection[]>([]);

   const { isAdmin } = useAdmin();
   const { isReadOnly, remainingDays, status, canCreate, canEdit, tier } = useSubscription();
   const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(true);

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
         console.log('[Categories] Received from Firebase:', firebaseCategories.length, firebaseCategories.map(c => c.name));

         // Deduplicate categories by name (keep first occurrence)
         const seen = new Set<string>();
         const uniqueCategories = firebaseCategories.filter(c => {
            const name = c.name?.toLowerCase() || '';
            if (seen.has(name)) {
               console.warn('[Categories] Duplicate found:', c.name, 'id:', c.id);
               return false;
            }
            seen.add(name);
            return true;
         });

         console.log('[Categories] After dedupe:', uniqueCategories.length, uniqueCategories.map(c => c.name));

         setCategories(uniqueCategories.map(c => ({
            id: c.id || '',
            name: c.name || '',
            color: c.color || 'bg-slate-500' // Default fallback
         })));
      }
   }, [firebaseCategories]);

   // --- Auto-Migration for Legacy/Dynamic Categories ---
   // DISABLED: This was causing categories to be recreated after user deletes them.
   // Users now have full control over their categories.
   // If you need to restore categories, do it manually or re-enable this code.
   /*
   const hasAttemptedMigrationRef = useRef(false);
   
   useEffect(() => {
      // ... migration code disabled ...
   }, [firebaseClips, firebaseCategories, dataLoading]);
   */

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
   const [activeTab, setActiveTab] = useState(() => {
      return localStorage.getItem('activeTab') || initialTab;
   });

   // Sorting Orders
   const [sourceOrder, setSourceOrder] = useState<string[]>(() => {
      try { return JSON.parse(localStorage.getItem('sourceOrder') || '[]'); } catch { return []; }
   });
   const [categoryOrder, setCategoryOrder] = useState<string[]>(() => {
      try { return JSON.parse(localStorage.getItem('categoryOrder') || '[]'); } catch { return []; }
   });
   const [isRearranging, setIsRearranging] = useState(false);
   const [activeId, setActiveId] = useState<string | null>(null);
   // 커스텀 순서가 있으면 custom 모드로 시작 (localStorage에서 persisted sortMode 우선)
   const [sortMode, setSortMode] = useState<'count' | 'name' | 'custom'>(() => {
      const savedSortMode = localStorage.getItem('sortMode') as 'count' | 'name' | 'custom' | null;
      if (savedSortMode && ['count', 'name', 'custom'].includes(savedSortMode)) {
         return savedSortMode;
      }
      const hasCustomOrder = (localStorage.getItem('sourceOrder')?.length ?? 0) > 2 ||
         (localStorage.getItem('categoryOrder')?.length ?? 0) > 2;
      return hasCustomOrder ? 'custom' : 'count';
   });

   // ESC 키로 편집 모드 종료
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isRearranging) {
            setIsRearranging(false);
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isRearranging]);

   // Persist sortMode changes to localStorage
   useEffect(() => {
      localStorage.setItem('sortMode', sortMode);
   }, [sortMode]);

   // DnD Sensors - Activation constraints for drag
   const sensors = useSensors(
      useSensor(MouseSensor, {
         activationConstraint: { distance: 5 }
      }),
      useSensor(TouchSensor, {
         activationConstraint: { delay: 5, tolerance: 5 }
      })
   );

   const handleDragStart = (event: any) => {
      setActiveId(event.active.id);
   };

   const handleDragEnd = (event: any) => {
      const { active, over } = event;
      setActiveId(null);

      if (active.id !== over?.id) {
         // 드래그로 순서 변경 시 자동으로 커스텀 모드로 전환
         setSortMode('custom');

         // Determine if it's source or category
         if (active.id.startsWith('src-')) {
            const oldIndex = sortedSources.indexOf(active.id.replace('src-', ''));
            const newIndex = sortedSources.indexOf(over.id.replace('src-', ''));
            const newOrder = arrayMove(sortedSources, oldIndex, newIndex);
            setSourceOrder(newOrder);
            localStorage.setItem('sourceOrder', JSON.stringify(newOrder));
         } else if (active.id.startsWith('cat-')) {
            const oldCatId = active.id.replace('cat-', '');
            const newCatId = over.id.replace('cat-', '');
            const oldIndex = sortedCategories.findIndex(c => c.id === oldCatId);
            const newIndex = sortedCategories.findIndex(c => c.id === newCatId);

            // Extract just IDs for storage
            const newSortedCats = arrayMove(sortedCategories, oldIndex, newIndex);
            const newOrderIds = newSortedCats.map(c => c.id);

            setCategoryOrder(newOrderIds);
            localStorage.setItem('categoryOrder', JSON.stringify(newOrderIds));
         }
      }
   };




   // Persist activeTab
   useEffect(() => {
      localStorage.setItem('activeTab', activeTab);
   }, [activeTab]);
   const [searchQuery, setSearchQuery] = useState('');
   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
   const [mobileViewMode, setMobileViewMode] = useState<'list' | 'grid'>('grid');

   // Scroll position for scroll-to-top button
   const [showScrollTop, setShowScrollTop] = useState(false);
   const mainContentRef = useRef<HTMLElement>(null);

   // Pull-to-refresh state
   const [isPulling, setIsPulling] = useState(false);
   const [pullDistance, setPullDistance] = useState(0);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const pullStartY = useRef(0);
   const pullDistanceRef = useRef(0);
   const pullIndicatorRef = useRef<HTMLDivElement>(null);
   const pullSpinnerRef = useRef<HTMLDivElement>(null);
   const pullTextRef = useRef<HTMLDivElement>(null);
   const mainContentWrapperRef = useRef<HTMLDivElement>(null);

   // Sidebar Toggles
   const [isSmartFoldersOpen, setIsSmartFoldersOpen] = useState(true);
   const [isSourcesOpen, setIsSourcesOpen] = useState(true);
   const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

   // PWA Install Prompt
   const deferredPromptRef = useRef<any>(null);
   const [canInstall, setCanInstall] = useState(false);

   // Mobile Visual Viewport Fix - handles keyboard appearance/disappearance
   useEffect(() => {
      if (typeof window === 'undefined' || !window.visualViewport) return;

      const handleViewportResize = () => {
         // Force layout recalculation by triggering a minimal style change
         document.documentElement.style.setProperty('--vh', `${window.visualViewport!.height * 0.01}px`);
      };

      window.visualViewport.addEventListener('resize', handleViewportResize);
      handleViewportResize(); // Initial call

      return () => {
         window.visualViewport?.removeEventListener('resize', handleViewportResize);
      };
   }, []);

   // PWA Install Prompt Handler
   useEffect(() => {
      const handleBeforeInstallPrompt = (e: Event) => {
         e.preventDefault();
         deferredPromptRef.current = e;
         setCanInstall(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Check if already installed (standalone mode)
      if (window.matchMedia('(display-mode: standalone)').matches) {
         setCanInstall(false);
      }

      return () => {
         window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
   }, []);

   const handleInstallApp = async () => {
      if (deferredPromptRef.current) {
         deferredPromptRef.current.prompt();
         const { outcome } = await deferredPromptRef.current.userChoice;
         if (outcome === 'accepted') {
            toast.success(language === 'ko' ? '앱이 설치되었습니다!' : 'App installed!');
            setCanInstall(false);
         }
         deferredPromptRef.current = null;
      } else {
         // iOS Safari - show manual instructions
         toast(language === 'ko' ? '공유 버튼 → 홈 화면에 추가를 눌러주세요' : 'Tap Share → Add to Home Screen', {
            duration: 5000
         });
      }
   };

   // Selection
   const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

   // Advanced Filter State
   const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'score' | 'unread'>('date-desc');
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const filterRef = useRef<HTMLDivElement>(null);
   const [filterCategories, setFilterCategories] = useState<string[]>([]);
   const [filterSources, setFilterSources] = useState<string[]>([]);
   const [filterTags, setFilterTags] = useState<string[]>([]);
   const [showAllTags, setShowAllTags] = useState(false);
   const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
   const [filterUnread, setFilterUnread] = useState(false); // Filter for unread clips

   // Modals
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
   const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [settingsInitialTab, setSettingsInitialTab] = useState('general');

   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
   const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
   const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

   // Notification State - Firestore connected
   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
   const notificationRef = useRef<HTMLDivElement>(null);

   // Announcements from Firestore
   const {
      announcements: appNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead
   } = useAnnouncements(language);

   // Popups from Firestore
   const { popups: activePopups, dismissPopup, dismissPopupForever } = usePopups();
   const [closedPopupIds, setClosedPopupIds] = useState<Set<string>>(new Set()); // 그냥 닫기 (세션 동안만)

   // 모달 팝업과 배너 팝업 분리
   const modalPopups = activePopups.filter(p => p.displayType !== 'banner' && !closedPopupIds.has(p.id));
   const bannerPopups = activePopups.filter(p => p.displayType === 'banner' && !closedPopupIds.has(p.id));
   const currentModalPopup = modalPopups[0];
   const currentBannerPopup = bannerPopups[0];

   // 그냥 닫기 (새로고침 시 다시 표시)
   const handlePopupClose = (id: string) => {
      setClosedPopupIds(prev => new Set([...prev, id]));
   };

   // 오늘 하루 안보기
   const handlePopupDismissToday = (id: string) => {
      dismissPopup(id);
      setClosedPopupIds(prev => new Set([...prev, id]));
   };

   // 다시 보지 않기
   const handlePopupDismissForever = (id: string) => {
      dismissPopupForever(id);
      setClosedPopupIds(prev => new Set([...prev, id]));
   };

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
            // Toggle between light and dark only (not system) for quick shortcut
            setTheme(themePreference === 'light' || themePreference === 'system' ? 'dark' : 'light');
         }
         if ((e.metaKey || e.ctrlKey) && e.key === "/") {
            e.preventDefault();
            updatePreference('showThumbnails', !showThumbnails);
         }
         if ((e.metaKey || e.ctrlKey) && e.key === ".") {
            e.preventDefault();
            setLanguage(language === 'en' ? 'ko' : 'en');
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [themePreference, showThumbnails, language, setTheme, setLanguage, updatePreference]);



   // PWA Notch Color (theme-color meta tag)
   useEffect(() => {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      const color = theme === 'dark' ? '#0f172a' : '#ffffff';
      if (metaThemeColor) {
         metaThemeColor.setAttribute('content', color);
      } else {
         const meta = document.createElement('meta');
         meta.name = 'theme-color';
         meta.content = color;
         document.head.appendChild(meta);
      }
   }, [theme]);

   // Scroll-to-Top Button Visibility (mobile only)
   useEffect(() => {
      const container = mainContentRef.current;
      if (!container) return;
      const handleScroll = () => {
         setShowScrollTop(container.scrollTop > 300);
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
   }, []);

   // Pull-to-refresh handler (mobile only) - using refs for smooth animation
   useEffect(() => {
      const container = mainContentRef.current;
      if (!container) return;

      let isPullingLocal = false;

      const handleTouchStart = (e: TouchEvent) => {
         if (container.scrollTop === 0) {
            pullStartY.current = e.touches[0].clientY;
            isPullingLocal = true;
            setIsPulling(true);
         }
      };

      const handleTouchMove = (e: TouchEvent) => {
         if (!isPullingLocal || isRefreshing) return;
         const currentY = e.touches[0].clientY;
         const diff = currentY - pullStartY.current;
         if (diff > 0 && container.scrollTop === 0) {
            e.preventDefault();
            const distance = Math.min(diff * 0.5, 120);
            pullDistanceRef.current = distance;

            // Direct DOM manipulation for smooth animation - native app style
            requestAnimationFrame(() => {
               // Move entire content down
               if (mainContentWrapperRef.current) {
                  mainContentWrapperRef.current.style.transform = `translateY(${distance}px)`;
               }
               // Show spinner in revealed space
               if (pullIndicatorRef.current) {
                  pullIndicatorRef.current.style.opacity = '1';
               }
               if (pullSpinnerRef.current) {
                  const progress = Math.min(distance / 60, 1);
                  pullSpinnerRef.current.style.opacity = `${progress}`;
                  pullSpinnerRef.current.style.transform = `rotate(${distance * 6}deg) scale(${progress})`;
               }
               if (pullTextRef.current) {
                  pullTextRef.current.style.opacity = distance > 60 ? '1' : '0';
               }
            });
         }
      };

      const handleTouchEnd = () => {
         const threshold = 70;
         if (pullDistanceRef.current > threshold && !isRefreshing) {
            setIsRefreshing(true);
            // Keep content down at refresh position
            if (mainContentWrapperRef.current) {
               mainContentWrapperRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
               mainContentWrapperRef.current.style.transform = 'translateY(70px)';
            }
            if (pullSpinnerRef.current) {
               pullSpinnerRef.current.style.animation = 'spin 0.6s linear infinite';
            }
            setTimeout(() => window.location.reload(), 500);
         } else {
            // Animate content back to original position
            if (mainContentWrapperRef.current) {
               mainContentWrapperRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
               mainContentWrapperRef.current.style.transform = 'translateY(0)';
            }
            if (pullSpinnerRef.current) {
               pullSpinnerRef.current.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
               pullSpinnerRef.current.style.opacity = '0';
               pullSpinnerRef.current.style.transform = 'rotate(0deg) scale(0)';
            }
            if (pullIndicatorRef.current) {
               pullIndicatorRef.current.style.opacity = '0';
            }
            setPullDistance(0);
         }
         pullDistanceRef.current = 0;
         isPullingLocal = false;
         setIsPulling(false);

         // Reset transition after animation
         setTimeout(() => {
            if (mainContentWrapperRef.current) {
               mainContentWrapperRef.current.style.transition = 'none';
            }
            if (pullSpinnerRef.current) {
               pullSpinnerRef.current.style.transition = 'none';
            }
         }, 300);
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);

      return () => {
         container.removeEventListener('touchstart', handleTouchStart);
         container.removeEventListener('touchmove', handleTouchMove);
         container.removeEventListener('touchend', handleTouchEnd);
      };
   }, [isRefreshing]);

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
   const t = (key: string) => (TRANSLATIONS[language] as any)[key] || key;

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

   // Create sorted lists for DnD
   const sortedSources = useMemo(() => {
      // 커스텀 정렬이 있으면 커스텀 우선
      if (sortMode === 'custom' && sourceOrder.length > 0) {
         return [...availableSources].sort((a, b) => {
            const idxA = sourceOrder.indexOf(a);
            const idxB = sourceOrder.indexOf(b);
            if (idxA === -1 && idxB === -1) return a.localeCompare(b);
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
         });
      }
      // 이름순 정렬
      if (sortMode === 'name') {
         return [...availableSources].sort((a, b) => a.localeCompare(b));
      }
      // 개수순 정렬 (디폴트)
      return [...availableSources].sort((a, b) => {
         const countA = links.filter((l: LinkItem) => getSourceInfo(l.url).name === a && !l.isArchived).length;
         const countB = links.filter((l: LinkItem) => getSourceInfo(l.url).name === b && !l.isArchived).length;
         return countB - countA; // 내림차순
      });
   }, [availableSources, sourceOrder, links, sortMode]);

   const sortedCategories = useMemo(() => {
      // 커스텀 정렬이 있으면 커스텀 우선
      if (sortMode === 'custom' && categoryOrder.length > 0) {
         return [...categories].sort((a, b) => {
            const idxA = categoryOrder.indexOf(a.id);
            const idxB = categoryOrder.indexOf(b.id);
            if (idxA === -1 && idxB === -1) return 0;
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
         });
      }
      // 이름순 정렬
      if (sortMode === 'name') {
         return [...categories].sort((a, b) => a.name.localeCompare(b.name));
      }
      // 개수순 정렬 (디폴트)
      return [...categories].sort((a, b) => {
         const countA = links.filter((l: LinkItem) => (l.categoryId === a.id || l.categoryId?.toLowerCase() === a.name?.toLowerCase()) && !l.isArchived).length;
         const countB = links.filter((l: LinkItem) => (l.categoryId === b.id || l.categoryId?.toLowerCase() === b.name?.toLowerCase()) && !l.isArchived).length;
         return countB - countA; // 내림차순
      });
   }, [categories, categoryOrder, links, sortMode]);

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
      } else if (activeTab === 'askAI') {
         result = result.filter(l => l.chatHistory && l.chatHistory.length > 0 && !l.isArchived);
      } else if (activeTab === 'home') {
         result = result.filter(l => !l.isArchived);
      } else {
         // Match by ID or by name (since clips may store category name as categoryId)
         const matchedCat = categories.find(c => c.id === activeTab || c.name?.toLowerCase() === activeTab.toLowerCase());
         if (matchedCat) {
            result = result.filter(l => (l.categoryId === matchedCat.id || l.categoryId?.toLowerCase() === matchedCat.name?.toLowerCase()) && !l.isArchived);
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
         // Match by both ID and name for backward compatibility
         const filterCatNames = filterCategories.map(id => categories.find(c => c.id === id)?.name?.toLowerCase()).filter(Boolean);
         result = result.filter(l => filterCategories.includes(l.categoryId) || filterCatNames.includes(l.categoryId?.toLowerCase()));
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

      // Unread filter - show only clips that have never been viewed
      if (filterUnread) {
         const viewedClipIds = new Set(
            firebaseClips.filter(c => c.lastViewedAt).map(c => c.id)
         );
         result = result.filter(l => !viewedClipIds.has(l.id));
      }

      result = [...result].sort((a, b) => {
         if (sortBy === 'date-desc') return b.timestamp - a.timestamp;
         if (sortBy === 'date-asc') return a.timestamp - b.timestamp;
         if (sortBy === 'score') return b.aiScore - a.aiScore;
         if (sortBy === 'unread') {
            // Unread clips first, then by date
            const aViewed = firebaseClips.find(c => c.id === a.id)?.lastViewedAt;
            const bViewed = firebaseClips.find(c => c.id === b.id)?.lastViewedAt;
            if (!aViewed && bViewed) return -1; // a is unread, b is read → a first
            if (aViewed && !bViewed) return 1;  // a is read, b is unread → b first
            return b.timestamp - a.timestamp;   // both same status, sort by date
         }
         return 0;
      });

      return result;
   }, [links, activeTab, searchQuery, categories, collections, sortBy, filterCategories, filterSources, filterTags, filterDateRange, filterUnread, firebaseClips]);

   // Handle selecting/opening a clip - also marks it as viewed
   const handleSelectLink = async (id: string) => {
      setSelectedLinkId(id);

      // Find the corresponding firebase clip to update lastViewedAt
      const clip = firebaseClips.find(c => c.id === id);
      console.log('handleSelectLink called:', { id, clip, hasLastViewedAt: clip?.lastViewedAt });

      if (clip && !clip.lastViewedAt) {
         // Only update if never viewed before (to track first view)
         try {
            console.log('Updating lastViewedAt for clip:', id);
            await updateClip(id, { lastViewedAt: new Date().toISOString() });
            console.log('Successfully updated lastViewedAt');
         } catch (error) {
            console.error('Failed to update lastViewedAt:', error);
         }
      }
   };

   // Actions
   const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 수정하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to edit.');
         return;
      }
      const currentLink = links.find(l => l.id === id);
      if (!currentLink) return;

      const newValue = !currentLink.isFavorite;

      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isFavorite: newValue } : l));
      toast(language === 'ko'
         ? (newValue ? "즐겨찾기에 추가되었습니다" : "즐겨찾기에서 제거되었습니다")
         : (newValue ? "Added to favorites" : "Removed from favorites"));

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
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 수정하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to edit.');
         return;
      }
      const currentLink = links.find(l => l.id === id);
      if (!currentLink) return;

      const newValue = !currentLink.isReadLater;

      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isReadLater: newValue } : l));
      toast(language === 'ko'
         ? (newValue ? "나중에 읽기에 추가되었습니다" : "나중에 읽기에서 제거되었습니다")
         : (newValue ? "Added to read later" : "Removed from read later"));

      // Sync to Firebase - using 'isReadLater' field (we need to ensure this field exists in ClipData)
      // For now, we'll just update locally as this field may not be in Firebase schema
   };

   const handleArchive = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 수정하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to edit.');
         return;
      }
      const currentLink = links.find(l => l.id === id);
      if (!currentLink) return;

      const newValue = !currentLink.isArchived;

      // Optimistic update
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isArchived: newValue } : l));
      toast(language === 'ko'
         ? (newValue ? "보관함으로 이동되었습니다" : "보관함에서 복구되었습니다")
         : (newValue ? "Archived" : "Unarchived"));

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

   // Analysis Queue State - persisted to localStorage
   const [analysisQueue, setAnalysisQueue] = useState<AnalysisItem[]>(() => {
      try {
         const saved = localStorage.getItem('analysis_queue');
         if (saved) {
            const parsed = JSON.parse(saved);
            // Filter out items older than 5 minutes (likely stale)
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            return parsed.filter((item: AnalysisItem) =>
               item.timestamp && item.timestamp > fiveMinutesAgo &&
               (item.status === 'analyzing' || item.status === 'pending')
            );
         }
      } catch (e) {
         console.error('Failed to load analysis queue:', e);
      }
      return [];
   });

   // Persist analysis queue to localStorage
   useEffect(() => {
      if (analysisQueue.length > 0) {
         localStorage.setItem('analysis_queue', JSON.stringify(analysisQueue));
      } else {
         localStorage.removeItem('analysis_queue');
      }
   }, [analysisQueue]);

   const updateAnalysisItem = (id: string, status: AnalysisStatus) => {
      setAnalysisQueue(prev => prev.map(item =>
         item.id === id ? { ...item, status } : item
      ));
   };

   const removeAnalysisItem = (id: string) => {
      setAnalysisQueue(prev => prev.filter(item => item.id !== id));
   };

   // Analysis Log History (most recent first)
   const [analysisLogs, setAnalysisLogs] = useState<AnalysisLogItem[]>([]);

   const addLogEntry = (url: string, status: 'complete' | 'error') => {
      const newLog: AnalysisLogItem = {
         id: `log-${Date.now()}`,
         url,
         status,
         timestamp: Date.now()
      };
      setAnalysisLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep max 10 logs
   };

   const handleAddLink = async (url: string, categoryId?: string, collectionIds?: string[]) => {
      if (!canCreate) {
         toast.error(language === 'ko' ? '체험 기간이 종료되었습니다. 계속하려면 플랜을 업그레이드하세요.' : 'Trial expired. Upgrade to add more links.');
         setIsAddModalOpen(false);
         // Optionally redirect to pricing or show modal
         return;
      }

      setIsAnalyzing(true);
      setIsAddModalOpen(false);

      // Generate unique ID for this analysis
      const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Clear previous items and add new one as analyzing directly with timestamp
      setAnalysisQueue([{ id: analysisId, url, status: 'analyzing' as AnalysisStatus, timestamp: Date.now() }]);


      try {
         const result = await analyzeUrl(url);

         // If user selected category or collections, update the clip
         if ((categoryId || (collectionIds && collectionIds.length > 0)) && result.id) {
            const updates: any = {};
            if (categoryId) updates.category = categoryId;
            if (collectionIds && collectionIds.length > 0) updates.collectionIds = collectionIds;
            await updateClip(result.id, updates);
         }

         // Mark as complete
         setAnalysisQueue([{ id: analysisId, url, status: 'complete' as AnalysisStatus }]);
         addLogEntry(url, 'complete');
         toast.success(language === 'ko' ? '링크가 분석되어 추가되었습니다!' : 'Link analyzed and added successfully!');
         // Reset to idle after 3 seconds
         setTimeout(() => setAnalysisQueue([]), 3000);
      } catch (error: any) {
         console.error('Failed to analyze URL:', error);

         // Special handling for navigation during analysis
         // Server continues processing, clip will appear via Firebase listener
         if (error.message === 'NAVIGATED_AWAY') {
            setAnalysisQueue([{ id: analysisId, url, status: 'complete' as AnalysisStatus }]);
            toast.success(language === 'ko'
               ? '백그라운드에서 분석이 계속됩니다. 잠시 후 링크가 추가됩니다.'
               : 'Analysis continues in background. Link will appear shortly.');
            setTimeout(() => setAnalysisQueue([]), 3000);
         } else {
            // Mark as error
            setAnalysisQueue([{ id: analysisId, url, status: 'error' as AnalysisStatus }]);
            addLogEntry(url, 'error');
            toast.error(language === 'ko' ? `분석 실패: ${error.message}` : `Analysis failed: ${error.message}`);
            // Reset to idle after 3 seconds
            setTimeout(() => setAnalysisQueue([]), 3000);
         }
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
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 삭제하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to delete.');
         return;
      }
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
               toast.success(language === 'ko' ? "항목이 삭제되었습니다" : "Items deleted");
            } catch (error) {
               console.error('Failed to delete clips:', error);
               toast.error(language === 'ko' ? "일부 항목 삭제 실패" : "Failed to delete some items");
            }
         }
      });
   };

   // Handle bulk archive - moves selected clips to archive
   const handleBulkArchive = async () => {
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 수정하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to edit.');
         return;
      }
      try {
         const archivePromises = Array.from(selectedItemIds).map(id =>
            updateClip(id, { isArchived: true })
         );
         await Promise.all(archivePromises);

         // Update local state
         setLinks(prev => prev.map(l =>
            selectedItemIds.has(l.id) ? { ...l, isArchived: true } : l
         ));
         setSelectedItemIds(new Set());
         setIsSelectionMode(false);
         toast.success(language === 'ko'
            ? `${selectedItemIds.size}개 항목이 보관되었습니다`
            : `${selectedItemIds.size} items archived`
         );
      } catch (error) {
         console.error('Failed to archive clips:', error);
         toast.error(language === 'ko' ? '보관 실패' : 'Failed to archive');
      }
   };

   // Handle bulk unarchive - moves selected clips back to home
   const handleBulkUnarchive = async () => {
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 수정하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to edit.');
         return;
      }
      try {
         const unarchivePromises = Array.from(selectedItemIds).map(id =>
            updateClip(id, { isArchived: false })
         );
         await Promise.all(unarchivePromises);

         // Update local state
         setLinks(prev => prev.map(l =>
            selectedItemIds.has(l.id) ? { ...l, isArchived: false } : l
         ));
         setSelectedItemIds(new Set());
         setIsSelectionMode(false);
         toast.success(language === 'ko'
            ? `${selectedItemIds.size}개 항목이 홈으로 이동되었습니다`
            : `${selectedItemIds.size} items moved to home`
         );
      } catch (error) {
         console.error('Failed to unarchive clips:', error);
         toast.error(language === 'ko' ? '이동 실패' : 'Failed to move');
      }
   };

   const handleDeleteSingleRequest = (id: string) => {
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다. 삭제하려면 업그레이드하세요.' : 'Read-only mode. Upgrade to delete.');
         return;
      }
      setDeleteConfirmation({
         isOpen: true,
         count: 1,
         onConfirm: async () => {
            try {
               await deleteClip(id);
               setLinks(prev => prev.filter(l => l.id !== id));
               if (selectedLinkId === id) setSelectedLinkId(null);
               setDeleteConfirmation({ isOpen: false, count: 0, onConfirm: () => { } });
               toast.success(language === 'ko' ? "항목이 삭제되었습니다" : "Item deleted");
            } catch (error) {
               console.error('Failed to delete clip:', error);
               toast.error(language === 'ko' ? "삭제 실패" : "Failed to delete item");
            }
         }
      });
   }

   const handleSaveCategory = async (cat: { id?: string; name: string; color: string }) => {
      try {
         if (editingCategory && editingCategory.id) {
            if (!canEdit) {
               toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
               return;
            }
            // Update existing category in Firebase
            await updateCategory(editingCategory.id, {
               name: cat.name,
               color: cat.color
            });
            toast.success(t('categoryUpdated'));
         } else {
            if (!canCreate) {
               toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
               return;
            }
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
         // Reopen category manager modal after saving
         setIsCategoryManagerOpen(true);
      } catch (error) {
         console.error('Failed to save category:', error);
         toast.error('Failed to save category');
      }
   };

   const handleSaveCollection = async (col: { id?: string; name: string; color: string }) => {
      try {
         if (editingCollection && editingCollection.id) {
            if (!canEdit) {
               toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
               return;
            }
            // Update existing collection in Firebase
            await updateCollection(editingCollection.id, {
               name: col.name,
               color: col.color
            });
            toast.success(t('collectionUpdated'));
         } else {
            if (!canCreate) {
               toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
               return;
            }
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
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
         return;
      }
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
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
         return;
      }
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
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
         return;
      }
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

   const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
      setFn(prev => {
         if (prev.includes(val)) {
            return prev.filter(c => c !== val);
         } else {
            return [...prev, val];
         }
      });
   };

   const handleDeleteCategory = async (catId: string) => {
      if (!canEdit) {
         toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
         return;
      }
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
   const headerClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
   const textMuted = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

   return (
      <div
         className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${bgClass}`}
         style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >



         {/* Rearrange Mode Overlay - 전체 화면 클릭으로 편집 종료 */}
         {isRearranging && (
            <>
               {/* 전체 화면 클릭 영역 */}
               <div
                  className="fixed inset-0 z-[55] cursor-default bg-black/20"
                  onClick={() => setIsRearranging(false)}
               />

               {/* 정렬 버튼 + 닫기 버튼 */}
               <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium shadow-lg pointer-events-auto ${theme === 'dark'
                  ? 'bg-slate-800 border border-slate-600'
                  : 'bg-white border border-slate-200'
                  }`}>
                  <button
                     onClick={(e) => { e.stopPropagation(); setSortMode('count'); }}
                     className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${sortMode === 'count'
                        ? 'bg-[#21DBA4] text-white'
                        : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                  >
                     {language === 'ko' ? '개수순' : 'Count'}
                  </button>
                  <button
                     onClick={(e) => { e.stopPropagation(); setSortMode('name'); }}
                     className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${sortMode === 'name'
                        ? 'bg-[#21DBA4] text-white'
                        : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                  >
                     {language === 'ko' ? '이름순' : 'Name'}
                  </button>
                  <button
                     onClick={(e) => { e.stopPropagation(); setSortMode('custom'); }}
                     className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${sortMode === 'custom'
                        ? 'bg-[#21DBA4] text-white'
                        : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                  >
                     {language === 'ko' ? '커스텀' : 'Custom'}
                  </button>
                  {/* 닫기 버튼 */}
                  <button
                     onClick={(e) => { e.stopPropagation(); setIsRearranging(false); }}
                     className={`ml-1 p-1 rounded-full transition-all ${theme === 'dark'
                        ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                        : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                  >
                     <X size={14} />
                  </button>
               </div>
            </>
         )}

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
            <div className={`h-[72px] flex items-center px-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
               <div className="w-8 h-8 rounded-lg mr-3 shadow-lg shadow-[#21DBA4]/20 cursor-pointer" onClick={onBack}>
                  <Logo className="w-full h-full" />
               </div>
               <span className="font-bold text-lg tracking-tight text-[#21DBA4] text-[22px]">Linkbrain</span>
               <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-slate-400">
                  <X size={20} />
               </button>
            </div>

            {/* Navigation */}
            <div
               className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar"
               onClick={(e) => {
                  // 빈 공간 클릭 시에만 편집 종료 (칩 클릭은 제외)
                  if (isRearranging && e.target === e.currentTarget) {
                     setIsRearranging(false);
                  }
               }}
            >

               {/* Main Nav */}
               <div className="space-y-1">
                  <NavItem icon={<Home size={18} />} label={t('home')} active={activeTab === 'home'} onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('home'); }} theme={theme} />
                  <NavItem icon={<Compass size={18} />} label={t('discovery')} active={activeTab === 'discovery'} onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('discovery'); }} theme={theme} />
                  <NavItem
                     icon={<Clock size={18} />}
                     label={t('readLater')}
                     count={links.filter(l => l.isReadLater && !l.isArchived).length}
                     active={activeTab === 'later'}
                     onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('later'); }}
                     theme={theme}
                  />
                  <NavItem
                     icon={<Star size={18} />}
                     label={t('favorites')}
                     count={links.filter(l => l.isFavorite && !l.isArchived).length}
                     active={activeTab === 'favorites'}
                     onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('favorites'); }}
                     theme={theme}
                  />
                  <NavItem
                     icon={<Archive size={18} />}
                     label={t('archive')}
                     count={links.filter(l => l.isArchived).length}
                     active={activeTab === 'archive'}
                     onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('archive'); }}
                     theme={theme}
                  />
                  <NavItem
                     icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                     label="AskAI"
                     count={links.filter(l => l.chatHistory && l.chatHistory.length > 0 && !l.isArchived).length}
                     active={activeTab === 'askAI'}
                     onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('askAI'); }}
                     theme={theme}
                     iconClassName="text-[#21DBA4]"
                  />
                  <NavItem icon={<Sparkles size={18} />} label={t('aiInsights')} active={activeTab === 'insights'} onClick={() => { if (isRearranging) { setIsRearranging(false); return; } setActiveTab('insights'); }} theme={theme} iconClassName="text-[#21DBA4]" />
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
                           style={{ zIndex: isRearranging ? 50 : 'auto', position: isRearranging ? 'relative' : undefined }}
                        >
                           <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                              <SortableContext items={sortedCategories.map(c => `cat-${c.id}`)} strategy={rectSortingStrategy}>
                                 <div className="flex flex-wrap gap-2 px-3 py-2">
                                    {sortedCategories.map((cat: Category) => {
                                       const isActive = filterCategories.includes(cat.id);
                                       // Match by both ID and name
                                       const count = links.filter((l: LinkItem) => (l.categoryId === cat.id || l.categoryId?.toLowerCase() === cat.name?.toLowerCase()) && !l.isArchived).length;
                                       return (
                                          <SortableChip
                                             key={cat.id}
                                             id={`cat-${cat.id}`}
                                             isEditing={isRearranging}
                                             onLongPress={() => setIsRearranging(true)}
                                             onClick={() => !isRearranging && toggleFilter(setFilterCategories, cat.id)}
                                             className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${isActive
                                                ? 'bg-[#21DBA4] text-white shadow-sm'
                                                : theme === 'dark'
                                                   ? `text-slate-300 hover:ring-2 hover:ring-[#21DBA4]/50`
                                                   : `text-slate-600 hover:ring-2 hover:ring-[#21DBA4]/50`
                                                }`}
                                             style={!isActive ? { backgroundColor: getCategoryColor(cat.color, theme === 'dark') } : {}}
                                          >
                                             <span>{cat.name}</span>
                                             {count > 0 && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive
                                                   ? 'bg-white/20 text-white'
                                                   : theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-white/50 text-slate-600'
                                                   }`}>
                                                   {count}
                                                </span>
                                             )}
                                          </SortableChip>
                                       );
                                    })}
                                 </div>
                              </SortableContext>
                              <DragOverlay>
                                 {activeId && activeId.startsWith('cat-') && (() => {
                                    const catId = activeId.replace('cat-', '');
                                    const cat = categories.find(c => c.id === catId);
                                    if (!cat) return null;
                                    const isActive = filterCategories.includes(catId);
                                    return (
                                       <div
                                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl scale-110 cursor-grabbing ${isActive
                                             ? 'bg-[#21DBA4] text-white'
                                             : theme === 'dark'
                                                ? 'text-slate-800 ring-2 ring-[#21DBA4]'
                                                : 'text-slate-600 ring-2 ring-[#21DBA4]'
                                             }`}
                                          style={!isActive ? { backgroundColor: getCategoryColor(cat.color, theme === 'dark') } : {}}
                                       >
                                          <span>{cat.name}</span>
                                       </div>
                                    );
                                 })()}
                              </DragOverlay>
                           </DndContext>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               {/* Sources */}
               <div>
                  <div className="px-3 mb-2 flex justify-between items-center group">
                     <button
                        onClick={() => setIsSourcesOpen(!isSourcesOpen)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSourcesOpen ? '' : '-rotate-90'}`} />
                        {t('sources')}
                     </button>
                  </div>

                  <AnimatePresence initial={false}>
                     {isSourcesOpen && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                           style={{ zIndex: isRearranging ? 50 : 'auto', position: isRearranging ? 'relative' : undefined }}
                        >
                           <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                              <SortableContext items={sortedSources.map(s => `src-${s}`)} strategy={rectSortingStrategy}>
                                 <div className="flex flex-wrap gap-2 px-3 py-2">
                                    {sortedSources.map((src: string) => {
                                       const isActive = filterSources.includes(src);
                                       const count = links.filter((l: LinkItem) => getSourceInfo(l.url).name === src && !l.isArchived).length;

                                       return (
                                          <SortableChip
                                             key={src}
                                             id={`src-${src}`}
                                             isEditing={isRearranging}
                                             onLongPress={() => setIsRearranging(true)}
                                             onClick={() => !isRearranging && toggleFilter(setFilterSources, src)}
                                             className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${isActive
                                                ? 'bg-[#21DBA4] text-white shadow-sm'
                                                : theme === 'dark'
                                                   ? 'bg-slate-800 text-slate-300 hover:ring-2 hover:ring-[#21DBA4]/50'
                                                   : 'bg-slate-100 text-slate-600 hover:ring-2 hover:ring-[#21DBA4]/50'
                                                }`}
                                          >
                                             <span>{src}</span>
                                             {count > 0 && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive
                                                   ? 'bg-white/20 text-white'
                                                   : theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-white/50 text-slate-500'
                                                   }`}>
                                                   {count}
                                                </span>
                                             )}
                                          </SortableChip>
                                       );
                                    })}
                                 </div>
                              </SortableContext>
                              <DragOverlay>
                                 {activeId && activeId.startsWith('src-') && (() => {
                                    const src = activeId.replace('src-', '');
                                    const isActive = filterSources.includes(src);
                                    return (
                                       <div
                                          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl scale-110 cursor-grabbing ${isActive
                                             ? 'bg-[#21DBA4] text-white'
                                             : theme === 'dark'
                                                ? 'bg-slate-800 text-slate-400 ring-2 ring-[#21DBA4]'
                                                : 'bg-slate-100 text-slate-600 ring-2 ring-[#21DBA4]'
                                             }`}
                                       >
                                          <span>{src}</span>
                                       </div>
                                    );
                                 })()}
                              </DragOverlay>
                           </DndContext>
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
                                       className={`absolute right-2 md:opacity-0 md:group-hover:opacity-100 p-1.5 rounded-md transition-all ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300 bg-slate-800/80' : 'text-slate-400 hover:text-slate-600 bg-white/50'}`}
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
               onClick={() => { setSettingsInitialTab('account'); setIsSettingsOpen(true); }}
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
                     <div className="text-[10px] text-slate-400">
                        {status === 'active' || tier === 'pro'
                           ? 'LinkBrain Pro'
                           : status === 'trial'
                              ? (language === 'ko' ? '무료 체험 중' : 'Free Trial')
                              : (language === 'ko' ? '무료 플랜' : 'Free Plan')}
                     </div>
                  </div>
                  <button className="text-slate-400 group-hover:text-slate-600 transition-colors">
                     <Settings size={18} />
                  </button>
               </div>
            </div>
         </aside>

         {/* Pull-to-Refresh Indicator (mobile only) - Fixed at top, revealed when content is pulled down */}
         <div
            ref={pullIndicatorRef}
            className={`md:hidden fixed top-0 left-0 right-0 z-[50] flex flex-col items-center justify-center pointer-events-none ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}
            style={{ height: '70px', opacity: 0, willChange: 'opacity' }}
         >
            <div
               ref={pullSpinnerRef}
               className={`w-7 h-7 rounded-full border-[3px] border-t-transparent ${theme === 'dark' ? 'border-[#21DBA4]' : 'border-[#21DBA4]'}`}
               style={{ opacity: 0, transform: 'rotate(0deg) scale(0)', willChange: 'transform, opacity' }}
            />
            {/* Bounce arrow indicator - shows when ready to release */}
            <div
               ref={pullTextRef}
               className="mt-1"
               style={{ opacity: 0 }}
            >
               <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-bounce"
               >
                  <path d="M12 5v14M5 12l7-7 7 7" />
               </svg>
            </div>
         </div>

         {/* Main Content Wrapper - translates down for pull-to-refresh */}
         <div
            ref={mainContentWrapperRef}
            className="flex-1 flex flex-col h-full w-full overflow-auto md:overflow-visible"
            style={{ willChange: 'transform' }}
         >
            {/* Main Content */}
            <main
               ref={mainContentRef}
               className="flex-1 flex flex-col h-full overflow-y-auto relative w-full isolate no-scrollbar"
               style={{ WebkitOverflowScrolling: 'touch' }}
               onClick={() => { if (isRearranging) setIsRearranging(false); }}
            >

               {/* Top Header */}
               <header className={`sticky top-0 h-[72px] border-b flex items-center justify-between px-4 md:px-8 z-40 shrink-0 ${headerClass} ${selectedLink ? 'hidden md:flex' : ''}`}>
                  <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full">
                     <div className="flex items-center gap-3 md:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
                           <Menu size={20} />
                        </button>
                        <span className={`font-bold capitalize flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                           {(() => {
                              const label = activeTab === 'insights' ? t('aiInsights') : activeTab === 'discovery' ? t('discovery') : categories.find(c => c.id === activeTab)?.name || collections.find(c => c.id === activeTab)?.name || activeTab;
                              const hasBeta = label.includes('[Beta]');
                              return (
                                 <>
                                    {label.replace('[Beta]', '').trim()}
                                    {hasBeta && <span className="px-1.5 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-[9px] font-extrabold tracking-wide">BETA</span>}
                                 </>
                              );
                           })()}
                        </span>
                     </div>

                     {/* Search Bar - Desktop - Hide on insights/discovery */}
                     {activeTab !== 'insights' && activeTab !== 'discovery' && (
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
                     )}

                     {/* Mobile Search Toggle Overlay */}
                     {mobileSearchOpen && (
                        <div
                           className={`absolute top-[72px] left-0 right-0 py-3 px-4 border-b z-20 animate-fade-in-down md:hidden shadow-lg ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
                        >
                           <div className="relative w-full max-w-md mx-auto">
                              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`} />
                              <input
                                 autoFocus
                                 type="text"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 placeholder={t('searchPlaceholder')}
                                 className={`w-full h-10 rounded-full pl-12 pr-12 text-base md:text-xs focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all ${theme === 'dark' ? 'bg-slate-800 text-white placeholder:text-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:bg-white'}`}
                              />
                              <button onClick={() => setMobileSearchOpen(false)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
                                 <X size={16} />
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
                              className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${isAllSelected
                                 ? theme === 'dark' ? 'bg-[#21DBA4]/20 text-[#21DBA4] border border-[#21DBA4]/30' : 'bg-[#21DBA4] text-white'
                                 : theme === 'dark' ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                           >
                              {isAllSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                              <span className="hidden sm:inline">{isAllSelected ? t('deselectAllItems') : t('selectAll')}</span>
                           </button>
                        )}

                        {activeTab !== 'insights' && activeTab !== 'discovery' && (
                           <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
                              <Search size={20} />
                           </button>
                        )}

                        {/* Analysis Status Indicator - positioned before divider */}
                        <AnalysisIndicator items={analysisQueue} logs={analysisLogs} theme={theme} language={language} />

                        <div className={`h-6 w-px hidden md:block ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                        {activeTab !== 'insights' && activeTab !== 'discovery' && (
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
                        )}

                        <button
                           onClick={() => setIsSelectionMode(!isSelectionMode)}
                           className={`p-2 rounded-full transition-all ${isSelectionMode
                              ? theme === 'dark' ? 'bg-[#21DBA4]/20 text-[#21DBA4]' : 'bg-[#E0FBF4] text-[#21DBA4]'
                              : 'text-slate-400 hover:text-slate-600'}`}
                           title="Select Items"
                        >
                           <CheckSquare size={18} />
                        </button>

                        <button
                           onClick={() => setIsAddModalOpen(true)}
                           className={`bg-[#21DBA4] hover:bg-[#1bc290] h-9 px-4 rounded-full text-sm font-bold flex items-center gap-1.5 transition-all transform active:scale-95 text-[14px] ${theme === 'dark' ? 'text-slate-900' : 'text-white'}`}
                        >
                           <Plus size={18} />
                           <span className="hidden md:inline text-[14px]">{t('addLink')}</span>
                        </button>

                        {/* Desktop Notification Button */}
                        <div className="relative hidden md:block" ref={notificationRef}>
                           <button
                              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                              className={`relative p-2.5 rounded-full transition-all ${isNotificationOpen
                                 ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                 : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                           >
                              <Bell size={20} />
                              {unreadCount > 0 && (
                                 <span
                                    className="absolute min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                                    style={{ top: '2px', left: '2px' }}
                                 >
                                    {unreadCount}
                                 </span>
                              )}
                           </button>

                           {/* Notification Dropdown */}
                           {isNotificationOpen && (
                              <>
                                 <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsNotificationOpen(false)}
                                 />
                                 <div className={`absolute right-0 top-full mt-2 w-96 rounded-xl shadow-xl border z-50 overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    {/* Header */}
                                    <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                       <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                          {language === 'ko' ? '알림' : 'Notifications'}
                                       </span>
                                       {unreadCount > 0 && (
                                          <button
                                             onClick={markAllAsRead}
                                             className="text-xs text-[#21DBA4] hover:text-[#1bc290] font-medium"
                                          >
                                             {language === 'ko' ? '모두 읽음' : 'Mark all read'}
                                          </button>
                                       )}
                                    </div>
                                    {/* Notification List */}
                                    <div className="max-h-80 overflow-y-auto">
                                       {appNotifications.length === 0 ? (
                                          <div className={`py-8 text-center text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                             {language === 'ko' ? '알림이 없습니다' : 'No notifications'}
                                          </div>
                                       ) : (
                                          appNotifications.map(notification => (
                                             <div
                                                key={notification.id}
                                                onClick={() => markAsRead(notification.id)}
                                                className={`px-4 py-3 cursor-pointer transition-colors ${!notification.isRead
                                                   ? theme === 'dark' ? 'bg-slate-700/50' : 'bg-[#21DBA4]/5'
                                                   : ''
                                                   } ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                                             >
                                                <div className="flex items-start gap-3">
                                                   <div className="flex-1 min-w-0">
                                                      <div className={`text-sm font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                         {notification.title}
                                                      </div>
                                                      <div className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                                         {notification.message}
                                                      </div>
                                                      <div className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                                         {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : ''}
                                                      </div>
                                                   </div>
                                                   {!notification.isRead && (
                                                      <span className="w-2 h-2 rounded-full bg-[#21DBA4] shrink-0 mt-1.5" />
                                                   )}
                                                </div>
                                             </div>
                                          ))
                                       )}
                                    </div>
                                 </div>
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </header>


               {/* Admin Banner Popup */}
               {currentBannerPopup && (
                  <TopBannerPopup
                     popup={currentBannerPopup}
                     theme={theme}
                     language={language}
                     onClose={() => handlePopupClose(currentBannerPopup.id)}
                     onDismissToday={() => handlePopupDismissToday(currentBannerPopup.id)}
                  />
               )}

               {/* Scrollable Area */}
               <div
                  className={`flex-1 ${['discovery', 'features', 'how-it-works', 'pricing'].includes(activeTab) ? '' : 'px-4 pb-4 pt-0 md:p-8'}`}
                  style={{ minHeight: 'calc(100vh - 72px)' }}
               >
                  {activeTab === 'discovery' ? (
                     <LinkBrainArticle theme={theme} />
                  ) : (
                     <div className="max-w-7xl mx-auto">

                        {/* Mobile Sticky Header Section */}
                        {activeTab !== 'insights' && !selectedLink && (
                           <div className={`md:hidden -mx-4 px-4 pt-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
                              {/* Title + Count + Mobile Notification - Scrolls with content */}
                              <div className="mb-2 flex items-start justify-between">
                                 <div className="flex-1 min-w-0">
                                    <h1 className={`text-xl font-black mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                       {(() => {
                                          const getTimeGreeting = () => {
                                             const hour = new Date().getHours();
                                             if (hour >= 5 && hour < 12) return t('goodMorning');
                                             if (hour >= 12 && hour < 18) return t('goodAfternoon');
                                             return t('goodEvening');
                                          };
                                          const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
                                          const title = activeTab === 'home' ? `${getTimeGreeting()}, ${userName} 👋` :
                                             activeTab === 'later' ? t('readLater') :
                                                activeTab === 'favorites' ? t('favorites') :
                                                   activeTab === 'archive' ? t('archive') :
                                                      activeTab === 'askAI' ? 'AskAI' :
                                                         categories.find((c: Category) => c.id === activeTab)?.name || collections.find((c: Collection) => c.id === activeTab)?.name || 'Folder';
                                          return title;
                                       })()}
                                    </h1>
                                    <p className={`text-sm ${textMuted}`}>
                                       {`${filteredLinks.length}${t('linksFound')}`}
                                       {activeTab === 'home' && ` ${t('aiSummary')}`}
                                    </p>
                                 </div>
                                 {/* Mobile Notification Button */}
                                 <div className="relative">
                                    <button
                                       onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                       className={`relative p-2 rounded-full transition-all ${isNotificationOpen
                                          ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                          : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                       <Bell size={22} />
                                       {unreadCount > 0 && (
                                          <span
                                             className="absolute w-5 h-5 aspect-square shrink-0 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                             style={{ top: '0px', left: '0px' }}
                                          >
                                             {unreadCount}
                                          </span>
                                       )}
                                    </button>

                                    {/* Mobile Notification Dropdown */}
                                    {isNotificationOpen && (
                                       <>
                                          <div
                                             className="fixed inset-0 z-40"
                                             onClick={() => setIsNotificationOpen(false)}
                                          />
                                          <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-xl border z-50 overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                             {/* Header */}
                                             <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                   {language === 'ko' ? '알림' : 'Notifications'}
                                                </span>
                                                {unreadCount > 0 && (
                                                   <button
                                                      onClick={markAllAsRead}
                                                      className="text-[10px] text-[#21DBA4] hover:text-[#1bc290] font-medium"
                                                   >
                                                      {language === 'ko' ? '모두 읽음' : 'Mark all read'}
                                                   </button>
                                                )}
                                             </div>
                                             {/* Notification List */}
                                             <div className="max-h-60 overflow-y-auto">
                                                {appNotifications.length === 0 ? (
                                                   <div className={`py-6 text-center text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                                      {language === 'ko' ? '알림이 없습니다' : 'No notifications'}
                                                   </div>
                                                ) : (
                                                   appNotifications.map(notification => (
                                                      <div
                                                         key={notification.id}
                                                         onClick={() => markAsRead(notification.id)}
                                                         className={`px-4 py-2.5 cursor-pointer transition-colors ${!notification.isRead
                                                            ? theme === 'dark' ? 'bg-slate-700/50' : 'bg-[#21DBA4]/5'
                                                            : ''
                                                            } ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                                                      >
                                                         <div className="flex items-start gap-2">
                                                            <div className="flex-1 min-w-0">
                                                               <div className={`text-xs font-medium mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                                  {notification.title}
                                                               </div>
                                                               <div className={`text-[10px] line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                                                  {notification.message}
                                                               </div>
                                                            </div>
                                                            {!notification.isRead && (
                                                               <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4] shrink-0 mt-1" />
                                                            )}
                                                         </div>
                                                      </div>
                                                   ))
                                                )}
                                             </div>
                                          </div>
                                       </>
                                    )}
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Mobile Sticky Filter Row */}
                        {activeTab !== 'insights' && !selectedLink && (
                           <div className={`md:hidden sticky top-[72px] z-30 -mx-4 px-4 pt-2 pb-2 ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
                              {/* Filter + Toggle Row */}
                              <div className="flex items-center justify-between relative mb-2" ref={filterRef}>
                                 <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${isFilterOpen || filterCategories.length > 0 || filterSources.length > 0 || filterTags.length > 0
                                       ? 'bg-[#21DBA4]/10 border-[#21DBA4]/30 text-[#21DBA4]'
                                       : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
                                       }`}
                                 >
                                    <Filter size={14} />
                                    {t('filter')}
                                    {(filterCategories.length > 0 || filterSources.length > 0 || filterTags.length > 0) && (
                                       <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span>
                                    )}
                                 </button>
                                 <button
                                    onClick={() => setMobileViewMode(mobileViewMode === 'list' ? 'grid' : 'list')}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${theme === 'dark'
                                       ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-[#21DBA4] hover:border-[#21DBA4]/50'
                                       : 'bg-white border-slate-200 text-slate-500 hover:text-[#21DBA4] hover:border-[#21DBA4]/50 shadow-sm'
                                       }`}
                                 >
                                    {mobileViewMode === 'list' ? <LayoutGrid size={16} /> : <List size={16} />}
                                 </button>

                                 {/* Mobile Filter Dropdown */}
                                 {isFilterOpen && (
                                    <>
                                       <div
                                          className="fixed inset-0 z-20"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             setIsFilterOpen(false);
                                          }}
                                       />
                                       <div
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onClick={(e) => e.stopPropagation()}
                                          className={`absolute left-0 top-full mt-1 w-4/5 rounded-xl shadow-xl border z-30 overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100'}`}
                                       >
                                          {/* Scrollable Content */}
                                          <div
                                             className="max-h-[50vh] overflow-y-auto overscroll-contain"
                                          >
                                             <div className="px-3 py-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
                                                <div className="mt-1 space-y-0.5">
                                                   {[
                                                      { id: 'date-desc', label: t('recentlyAdded') },
                                                      { id: 'date-asc', label: t('oldestFirst') }
                                                   ].map((opt) => (
                                                      <button
                                                         key={opt.id}
                                                         onClick={() => setSortBy(opt.id as any)}
                                                         className={`w-full text-left flex items-center justify-between text-xs py-1 ${sortBy === opt.id ? 'text-[#21DBA4] font-bold' : theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                                                      >
                                                         {opt.label}
                                                         {sortBy === opt.id && <Check size={12} />}
                                                      </button>
                                                   ))}
                                                </div>
                                             </div>

                                             <div className={`h-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>

                                             {/* Date Range Filter */}
                                             <div className="px-3 pt-1.5 pb-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">기간</span>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                   {[
                                                      { id: 'all', label: '전체' },
                                                      { id: 'today', label: '오늘' },
                                                      { id: 'week', label: '이번 주' },
                                                      { id: 'month', label: '이번 달' }
                                                   ].map((opt) => (
                                                      <button
                                                         key={opt.id}
                                                         onClick={() => setFilterDateRange(opt.id as any)}
                                                         className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${filterDateRange === opt.id ? 'bg-[#21DBA4] text-white border-transparent' : theme === 'dark' ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#21DBA4]'}`}
                                                      >
                                                         {opt.label}
                                                      </button>
                                                   ))}
                                                </div>
                                             </div>
                                             {/* Unread Filter - Mobile Only */}
                                             <div className={`h-px ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}></div>
                                             <div className="px-3 pt-1.5 pb-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'ko' ? '필터' : 'Filter'}</span>
                                                <div className="mt-1">
                                                   <label className="flex items-center gap-1.5 cursor-pointer group">
                                                      <div
                                                         onClick={() => setFilterUnread(!filterUnread)}
                                                         className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${filterUnread ? 'bg-[#21DBA4] border-[#21DBA4] text-white' : theme === 'dark' ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-white group-hover:border-[#21DBA4]'}`}
                                                      >
                                                         {filterUnread && <Check size={8} strokeWidth={4} />}
                                                      </div>
                                                      <span className={`text-xs ${filterUnread ? (theme === 'dark' ? 'text-white' : 'text-slate-900') + ' font-medium' : 'text-slate-500'}`}>
                                                         {language === 'ko' ? '미열람만 보기' : 'Unread only'}
                                                      </span>
                                                   </label>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </>
                                 )}
                              </div>
                              {/* Divider */}
                              <div className={`border-b mb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}></div>
                           </div>
                        )}

                        {/* Desktop Header Info (hidden on mobile now) */}
                        <div className="hidden md:flex items-end justify-between mb-8">
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
                                                   activeTab === 'askAI' ? 'AskAI' :
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
                              <div className="flex items-center gap-2">
                                 <p className={`text-sm ${textMuted}`}>
                                    {activeTab === 'insights' ? '' : `${filteredLinks.length} ${t('linksFound')}`}
                                    {activeTab === 'home' && !filterUnread && ` ${t('aiSummary')}`}
                                 </p>
                                 {filterUnread && (
                                    <button
                                       onClick={() => setFilterUnread(false)}
                                       className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                                    >
                                       <Inbox size={12} />
                                       {language === 'ko' ? '미열람 필터' : 'Unread'}
                                       <X size={12} />
                                    </button>
                                 )}
                              </div>
                           </div>

                           {/* Sort & Advanced Filter Dropdown - Hide on insights/discovery */}
                           {activeTab !== 'insights' && activeTab !== 'discovery' && (
                              <div className="relative hidden md:block" ref={filterRef}>
                                 <div
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`hidden md:flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border shadow-sm cursor-pointer transition-colors ${isFilterOpen || filterCategories.length > 0 || filterSources.length > 0 || filterTags.length > 0
                                       ? 'bg-[#21DBA4]/10 border-[#21DBA4]/30 text-[#21DBA4] dark:bg-[#21DBA4]/20'
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
                                    <>
                                       <div
                                          className="fixed inset-0 z-10 bg-transparent"
                                          onClick={() => setIsFilterOpen(false)}
                                       />
                                       <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-xl border py-2 z-20 overflow-hidden max-h-[80vh] overflow-y-auto no-scrollbar ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100'}`}>
                                          <div className="px-4 py-2">
                                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort By</span>
                                             <div className="mt-2 space-y-1">
                                                {[
                                                   { id: 'date-desc', label: t('recentlyAdded') },
                                                   { id: 'date-asc', label: t('oldestFirst') },
                                                   { id: 'unread', label: language === 'ko' ? '미열람' : 'Unread First' }
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
                                                            onClick={() => toggleFilter(setFilterCategories, cat.id)}
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
                                                               onClick={() => toggleFilter(setFilterSources, src)}
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
                                                            onClick={() => toggleFilter(setFilterTags, tag)}
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
                                    </>
                                 )}
                              </div>
                           )}
                        </div>

                        {/* Grid / List View */}
                        {activeTab === 'insights' ? (
                           <AIInsightsDashboard
                              links={links}
                              categories={categories}
                              theme={theme}
                              t={t}
                              language={language}
                              onOpenSettings={() => setIsSettingsOpen(true)}
                              onNavigateToUnread={() => {
                                 setActiveTab('home');
                                 setFilterUnread(true);
                                 toast.success(language === 'ko' ? '읽지 않은 클립을 표시합니다' : 'Showing unread clips');
                              }}
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
                                          onClick={() => isSelectionMode ? toggleSelection(link.id) : handleSelectLink(link.id)}
                                          className={`rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col ${theme === 'dark' ? 'bg-slate-900' : 'bg-white border border-slate-100 shadow-sm'
                                             } ${selectedItemIds.has(link.id) ? 'ring-2 ring-[#21DBA4]' : ''}`}
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
                                             {/* Chat History Badge - Show if chatHistory exists */}
                                             {link.chatHistory && link.chatHistory.length > 0 && (
                                                <div className={`absolute ${link.isFavorite ? 'top-2 right-10' : 'top-2 right-2'} w-6 h-6 rounded-full bg-[#21DBA4] flex items-center justify-center shadow-sm`}>
                                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                   </svg>
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

                              {/* Mobile List View */}
                              <div className={`md:hidden ${mobileViewMode === 'list' ? 'flex flex-col gap-3' : 'hidden'}`}>
                                 {filteredLinks.map(link => {
                                    const source = getSourceInfo(link.url);
                                    const truncatedUrl = link.url.replace(/^https?:\/\//, '').split('/')[0];
                                    return (
                                       <div
                                          key={link.id}
                                          onClick={() => isSelectionMode ? toggleSelection(link.id) : handleSelectLink(link.id)}
                                          className={`rounded-xl overflow-hidden cursor-pointer transition-all flex gap-3 p-3 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white border border-slate-100 shadow-sm'
                                             } ${selectedItemIds.has(link.id) ? 'ring-2 ring-[#21DBA4]' : ''}`}
                                       >
                                          {/* Thumbnail */}
                                          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                                             <img
                                                src={link.image || '/placeholder.jpg'}
                                                alt=""
                                                className="w-full h-full object-cover"
                                             />
                                             {/* Source Badge */}
                                             <div className={`absolute bottom-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white ${source.color || 'bg-slate-600'}`}>
                                                {source.icon}
                                             </div>
                                          </div>
                                          {/* Content - Matches thumbnail height (h-24 = 96px) */}
                                          <div className="flex-1 min-w-0 h-24 flex flex-col justify-between">
                                             {/* Title with inline badges */}
                                             <div className="flex items-start gap-1.5">
                                                <h3 className={`flex-1 min-w-0 text-sm font-bold leading-tight truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                   {link.title}
                                                </h3>
                                                {link.isFavorite && <Star size={12} fill="currentColor" className="text-yellow-400 shrink-0 mt-0.5" />}
                                                {link.chatHistory && link.chatHistory.length > 0 && (
                                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#21DBA4] shrink-0 mt-0.5">
                                                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                   </svg>
                                                )}
                                             </div>
                                             {/* AI Summary - 2 lines */}
                                             <div className={`text-[10px] p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-[#E0FBF4]'}`}>
                                                <div className={`flex items-center gap-1 font-bold text-[#21DBA4] mb-0.5`}>
                                                   <span>✨</span> AI Summary
                                                </div>
                                                <p className={`line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                   {link.keyTakeaways && link.keyTakeaways.length > 0 ? link.keyTakeaways[0] : link.summary?.slice(0, 100) || 'No summary'}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>

                              {/* Desktop Masonry Grid */}
                              <div className="hidden md:block">
                                 <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1400: 4 }}>
                                    <Masonry gutter="24px">
                                       {filteredLinks.map(link => (
                                          <LinkCard
                                             key={link.id}
                                             data={link}
                                             selected={selectedItemIds.has(link.id)}
                                             selectionMode={isSelectionMode}
                                             onToggleSelect={() => toggleSelection(link.id)}
                                             onClick={() => isSelectionMode ? toggleSelection(link.id) : handleSelectLink(link.id)}
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
                                    onClick={() => isSelectionMode ? toggleSelection(link.id) : handleSelectLink(link.id)}
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
                              <LinkBrainLogo variant="green" size={48} className="mx-auto mb-4 opacity-20" />
                              <p>{t('noLinks')}</p>
                           </div>
                        )}

                        <div className="h-20"></div>
                     </div>
                  )}
               </div>

            </main>
         </div> {/* End of mainContentWrapperRef */}

         {/* --- OVERLAYS & MODALS (Moved to end for correct z-index stacking) --- */}

         {/* Loading Overlay for Data Fetch */}
         {dataLoading && links.length === 0 && (
            <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
               <div className="w-10 h-10 rounded-full bg-[#21DBA4]/20 flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-[#21DBA4]" />
               </div>
               <p className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {language === 'ko' ? '데이터를 불러오는 중...' : 'Loading your data...'}
               </p>
            </div>
         )}

         {/* Analyzing Overlay - REMOVED: Now using AnalysisIndicator in header only */}
         {/* Analysis status is shown in the header indicator */}

         {/* Detail Overlay */}
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
               onUpdateClip={updateClip}
               onToggleCollection={handleToggleLinkCollection}
               onClearCollections={handleClearCollections}
               theme={theme}
               t={t}
               language={language}
            />
         )}


         {/* Modals */}
         <AnimatePresence>
            {isAddModalOpen && (
               <AddLinkModal
                  onClose={() => setIsAddModalOpen(false)}
                  onAdd={handleAddLink}
                  theme={theme}
                  t={t}
                  language={language}
                  categories={categories}
                  collections={collections}
                  onCreateCategory={async (name, color) => {
                     const result = await createCategory({ name, color });
                     return result;
                  }}
                  onCreateCollection={async (name) => {
                     const result = await createCollection({ name });
                     return result;
                  }}
               />
            )}
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
                     if (!canEdit) {
                        toast.error(language === 'ko' ? '읽기 전용 모드입니다.' : 'Read-only mode.');
                        return;
                     }
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
                  initialTab={settingsInitialTab}
                  onClose={() => setIsSettingsOpen(false)}
                  settings={{ theme, themePreference, language, showThumbnails, notifications }}
                  setSettings={{ setTheme, setLanguage, setShowThumbnails: handleSetShowThumbnails, setNotifications: handleSetNotifications }}
                  onLogout={onLogout || (() => { })}
                  onAdmin={onAdmin}
                  isAdmin={isAdmin}
                  t={t}
                  user={user}
               />
            )}
         </AnimatePresence>

         {/* Announcement Popup from Admin */}
         {currentModalPopup && (
            <AnnouncementPopup
               popup={currentModalPopup}
               theme={theme}
               language={language}
               onClose={() => handlePopupClose(currentModalPopup.id)}
               onDismissToday={() => handlePopupDismissToday(currentModalPopup.id)}
               onDismissForever={() => handlePopupDismissForever(currentModalPopup.id)}
            />
         )}

         {/* Floating Selection Bar */}
         <AnimatePresence>
            {isSelectionMode && (
               <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-800 text-white shadow-2xl flex items-center border border-slate-700
                          px-4 py-2.5 rounded-full gap-3
                          md:px-6 md:py-3 md:gap-6"
               >
                  {/* Count - Number only for mobile */}
                  <div className="flex items-center gap-1.5">
                     <span className="font-black text-base md:text-sm">{selectedItemIds.size}</span>
                     <span className="hidden md:inline text-sm font-medium text-slate-300">
                        {t('selected')}
                     </span>
                  </div>

                  {/* Divider */}
                  <div className="h-5 md:h-4 w-px bg-white/20"></div>

                  {/* Archive/Home - Conditional based on current tab */}
                  {activeTab === 'archive' ? (
                     <button onClick={handleBulkUnarchive} className="group flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                        <Home className="w-[18px] h-[18px] md:w-4 md:h-4" />
                        <span className="hidden md:inline text-sm font-medium">{t('home')}</span>
                     </button>
                  ) : (
                     <button onClick={handleBulkArchive} className="group flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                        <Archive className="w-[18px] h-[18px] md:w-4 md:h-4" />
                        <span className="hidden md:inline text-sm font-medium">{t('archiveClips')}</span>
                     </button>
                  )}

                  {/* Divider */}
                  <div className="h-5 md:h-4 w-px bg-white/20"></div>

                  {/* Delete - Icon only on mobile */}
                  <button onClick={handleBulkDeleteRequest} className="group flex items-center gap-1.5 hover:text-red-400 transition-colors">
                     <Trash2 className="w-[18px] h-[18px] md:w-4 md:h-4" />
                     <span className="hidden md:inline text-sm font-medium">{t('delete')}</span>
                  </button>

                  {/* Close */}
                  <button
                     onClick={() => { setIsSelectionMode(false); setSelectedItemIds(new Set()); }}
                     className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                     <X className="w-3.5 h-3.5 md:w-[14px] md:h-[14px]" />
                  </button>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Mobile FAB - outside main for proper fixed positioning */}
         {!selectedLink && (
            <button
               onClick={() => setIsAddModalOpen(true)}
               className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#21DBA4] text-white rounded-full shadow-xl flex items-center justify-center z-30 hover:scale-110 transition-transform active:scale-90"
            >
               <Plus size={24} />
            </button>
         )}

         {/* Mobile Scroll-to-Top Button */}
         <AnimatePresence>
            {showScrollTop && !selectedLink && (
               <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={`md:hidden fixed bottom-6 left-4 w-9 h-9 rounded-full shadow-lg flex items-center justify-center z-30 transition-all ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
               >
                  <ChevronUp size={20} />
               </motion.button>
            )}
         </AnimatePresence>

      </div>
   );
};


// ----------------------------------------------------------------------
// Sub-components (NavItem, LinkCard, LinkRow are now imported from ./Cards)
// Panels (LinkDetailPanel, SettingsModal) are now imported from ./Panels
// ----------------------------------------------------------------------
