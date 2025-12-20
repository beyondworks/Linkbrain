import { useState, useMemo } from 'react';
import {
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  PenTool,
  Layout,
  FileBarChart,
  FileText,
  Sparkles,
  CheckCircle2,
  CheckSquare,
  Square,
  MessageSquare,
  History,
  ChevronRight,
  Loader2,
  Eye,
  ChevronDown,
  X
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { toast } from 'sonner';

type AIInsightsDashboardProps = {
  links: any[];
  categories: any[];
  theme: 'light' | 'dark';
  t: (key: string) => string;
  language?: 'en' | 'ko';
  onOpenSettings?: () => void;
};

// Helper: Parse Firestore Timestamp
const parseDate = (createdAt: any): Date | null => {
  if (!createdAt) return null;
  if (createdAt.seconds) return new Date(createdAt.seconds * 1000);
  if (createdAt.toDate) return createdAt.toDate();
  const d = new Date(createdAt);
  return isNaN(d.getTime()) ? null : d;
};

export const AIInsightsDashboard = ({ links, categories, theme, t, language = 'ko', onOpenSettings }: AIInsightsDashboardProps) => {
  const isDark = theme === 'dark';
  const { canUseAI } = useSubscription();
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingArticle, setGeneratingArticle] = useState(false);

  // Content Studio States
  const [studioStartDate, setStudioStartDate] = useState<string>('');
  const [studioEndDate, setStudioEndDate] = useState<string>('');
  const [studioFilterTag, setStudioFilterTag] = useState<string>('');
  const [studioClips, setStudioClips] = useState<any[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewingClipId, setViewingClipId] = useState<string | null>(null);

  // Filter active links
  const allActiveLinks = useMemo(() => links.filter(l => !l.isArchived), [links]);

  // Stats Data
  const statsData = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'weekly' ? 7 : 30;
    const cutoff = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const recentClips = allActiveLinks.filter(l => {
      const d = parseDate(l.createdAt);
      return d && d >= cutoff;
    });

    const totalClips = allActiveLinks.length;
    const withSummary = allActiveLinks.filter(l => l.summary).length;
    const savedTime = Math.round(withSummary * 3);
    const ideasCount = allActiveLinks.filter(l => l.tags?.length > 0).length;

    return [
      {
        label: language === 'ko' ? '영구 보존된 지식' : 'Saved Knowledge',
        value: totalClips.toLocaleString(),
        unit: language === 'ko' ? '개' : 'clips',
        sub: language === 'ko' ? '원본 소실 걱정 없음' : 'Permanently saved',
        icon: <ShieldCheck size={20} className="text-[#21DBA4]" />,
        trend: `+${recentClips.length}`
      },
      {
        label: language === 'ko' ? '절약한 읽기 시간' : 'Time Saved',
        value: savedTime.toString(),
        unit: language === 'ko' ? '시간' : 'hrs',
        sub: language === 'ko' ? 'AI 요약 활용' : 'AI summaries',
        icon: <Clock size={20} className="text-blue-400" />,
        trend: `+${Math.round(recentClips.filter(l => l.summary).length)}h`
      },
      {
        label: language === 'ko' ? '실행 아이디어' : 'Action Ideas',
        value: ideasCount.toString(),
        unit: language === 'ko' ? '개' : 'items',
        sub: language === 'ko' ? '기획서 생성 가능' : 'Ready to create',
        icon: <Zap size={20} className="text-orange-400" />,
        trend: `+${recentClips.filter(l => l.tags?.length > 0).length}`
      },
    ];
  }, [allActiveLinks, period, language]);

  // Heatmap Data - 5 days, more blocks
  const heatmapData = useMemo(() => {
    const days = language === 'ko' ? ['월', '화', '수', '목', '금'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const grid: number[][] = days.map(() => Array(12).fill(0));

    allActiveLinks.forEach(link => {
      const d = parseDate(link.createdAt);
      if (d) {
        const dayIdx = d.getDay() - 1;
        if (dayIdx >= 0 && dayIdx < 5) {
          const hourBlock = Math.floor(d.getHours() / 2);
          if (hourBlock < 12) grid[dayIdx][hourBlock]++;
        }
      }
    });

    return days.map((day, i) => ({ day, hours: grid[i] }));
  }, [allActiveLinks, language]);

  // Peak time
  const peakTimeComment = useMemo(() => {
    let maxVal = 0, peakHourStart = 20;
    heatmapData.forEach(d => {
      d.hours.forEach((v, hi) => {
        if (v > maxVal) { maxVal = v; peakHourStart = hi * 2; }
      });
    });
    return language === 'ko'
      ? `주로 밤 ${peakHourStart}시 ~ ${peakHourStart + 2}시에 집중됩니다.`
      : `Most active around ${peakHourStart}:00 - ${peakHourStart + 2}:00.`;
  }, [heatmapData, language]);

  // Interest Evolution
  const interestFlow = useMemo(() => {
    const now = new Date();
    const periods = [
      { period: language === 'ko' ? '4주 전' : '4w ago', start: 28, end: 21, percent: 20 },
      { period: language === 'ko' ? '2주 전' : '2w ago', start: 14, end: 7, percent: 50 },
      { period: language === 'ko' ? '현재' : 'Now', start: 7, end: 0, active: true, percent: 85 },
    ];

    return periods.map(p => {
      const startD = new Date(now.getTime() - p.start * 24 * 60 * 60 * 1000);
      const endD = new Date(now.getTime() - p.end * 24 * 60 * 60 * 1000);
      const clips = allActiveLinks.filter(l => {
        const d = parseDate(l.createdAt);
        return d && d >= startD && d < endD;
      });

      const tagCounts: Record<string, number> = {};
      clips.forEach(c => (c.tags || []).forEach((t: string) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
      const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || (language === 'ko' ? 'AI 도구 탐색' : 'Exploring');

      return { ...p, topic: topTag };
    });
  }, [allActiveLinks, language]);

  // Weekly Keywords
  const weeklyKeywords = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const tagCounts: Record<string, number> = {};

    allActiveLinks.forEach(l => {
      const d = parseDate(l.createdAt);
      if (d && d >= weekAgo) {
        (l.tags || []).forEach((t: string) => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
      }
    });

    const result = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => ({ tag }));

    // Default keywords if empty
    if (result.length === 0) {
      return [{ tag: language === 'ko' ? '자동화' : 'Automation' }, { tag: 'Productivity' }, { tag: 'Agent' }];
    }
    return result;
  }, [allActiveLinks, language]);

  // Rising Trends
  const risingTrends = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentTags: Record<string, number> = {};
    const olderTags: Record<string, number> = {};

    allActiveLinks.forEach(l => {
      const d = parseDate(l.createdAt);
      if (!d) return;
      (l.tags || []).forEach((t: string) => {
        if (d >= weekAgo) recentTags[t] = (recentTags[t] || 0) + 1;
        else if (d >= twoWeeksAgo) olderTags[t] = (olderTags[t] || 0) + 1;
      });
    });

    const trends: Array<{ name: string; change: string; type: 'rising' | 'falling' }> = [];
    Object.keys(recentTags).forEach(tag => {
      const recent = recentTags[tag];
      const older = olderTags[tag] || 0;
      const pct = older > 0 ? Math.round(((recent - older) / older) * 100) : 100;
      if (pct > 20) trends.push({ name: tag, change: `+${pct}%`, type: 'rising' });
    });

    // Default if empty
    if (trends.length === 0) {
      return [
        { name: 'Surfer SEO', change: '+42%', type: 'rising' as const },
        { name: language === 'ko' ? '단순 뉴스' : 'Simple News', change: '-15%', type: 'falling' as const },
      ];
    }
    return trends.slice(0, 2);
  }, [allActiveLinks, language]);

  // Available Tags for Filter
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    allActiveLinks.forEach(l => (l.tags || []).forEach((t: string) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 10);
  }, [allActiveLinks]);

  // Studio Clips Filtered - Only show after clicking Load
  const filteredClips = useMemo(() => {
    // If studioClips is empty (not loaded yet), return empty array
    if (studioClips.length === 0) return [];

    let result = studioClips;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Tag filter
    if (studioFilterTag) {
      result = result.filter(c => c.tags?.includes(studioFilterTag));
    }

    return result.slice(0, 20);
  }, [allActiveLinks, studioClips, searchQuery, studioFilterTag]);

  // Load clips by date range
  const handleLoadClips = () => {
    let result = allActiveLinks;

    if (studioStartDate || studioEndDate) {
      result = result.filter(clip => {
        const d = parseDate(clip.createdAt);
        if (!d) return false;

        const clipDate = d.toISOString().split('T')[0];
        if (studioStartDate && clipDate < studioStartDate) return false;
        if (studioEndDate && clipDate > studioEndDate) return false;
        return true;
      });
    }

    setStudioClips(result);
    setSelectedClips([]);
  };

  // Unread Clips
  const unreadClips = useMemo(() => {
    const clips = allActiveLinks.filter(l => !l.notes && !l.isFavorite).slice(0, 3);
    if (clips.length === 0) {
      return [
        { id: '1', title: language === 'ko' ? 'AI 에이전트 UX 디자인 패턴' : 'AI Agent UX Design', source: 'Medium', time: '2h ago' },
        { id: '2', title: language === 'ko' ? '2025년 SaaS 마케팅 전략' : '2025 SaaS Marketing', source: 'Substack', time: '5h ago' },
        { id: '3', title: language === 'ko' ? '노코드 자동화 툴 비교' : 'No-code Tools Comparison', source: 'Youtube', time: '1d ago' },
      ];
    }
    return clips;
  }, [allActiveLinks, language]);

  // History
  const creationHistory = [
    { id: 1, type: language === 'ko' ? '기획서' : 'Plan', title: language === 'ko' ? 'SaaS 자동화 마케팅 기획안' : 'SaaS Automation Plan', date: '2024.12.18' },
    { id: 2, type: language === 'ko' ? '블로그' : 'Blog', title: language === 'ko' ? '노코드 툴 5가지 비교 분석' : '5 No-code Tools Analysis', date: '2024.12.15' },
  ];

  // Content Types
  const contentTypes = [
    { id: 'report', label: language === 'ko' ? '리포트' : 'Report', icon: <FileBarChart size={18} />, desc: language === 'ko' ? '분석 보고서' : 'Analysis' },
    { id: 'article', label: language === 'ko' ? '아티클' : 'Article', icon: <FileText size={18} />, desc: language === 'ko' ? '인사이트 글' : 'Insight' },
    { id: 'planning', label: language === 'ko' ? '기획서' : 'Planning', icon: <Layout size={18} />, desc: language === 'ko' ? '실행 계획안' : 'Plan' },
    { id: 'trend', label: language === 'ko' ? '트렌드' : 'Trend', icon: <TrendingUp size={18} />, desc: language === 'ko' ? '요약 정리' : 'Summary' },
  ];

  const toggleClipSelection = (id: string) => {
    setSelectedClips(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleGenerate = async () => {
    if (!selectedContentType || selectedClips.length === 0) return;
    setGeneratingReport(true);
    toast.success(language === 'ko' ? '생성 시작...' : 'Generating...');
    setTimeout(() => setGeneratingReport(false), 2000);
  };

  // Theme colors
  const bg = isDark ? 'bg-[#0F1115]' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-[#161B22]' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-800' : 'border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-slate-500';
  const textMuted = isDark ? 'text-gray-500' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-slate-100';
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-slate-50';


  return (
    <div className={`min-h-screen ${bg} pb-20`}>
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold mb-1 ${textPrimary}`}>
            {language === 'ko' ? '반가워요, 알렉스님' : 'Welcome back'} <span className="inline-block">👋</span>
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            {language === 'ko' ? '오늘의 인사이트를 발견하고, 새로운 가치를 만들어보세요.' : 'Discover insights and create new value today.'}
          </p>
        </div>

        {/* Period Filter */}
        <div className={`flex items-center ${cardBg} border ${cardBorder} rounded-xl p-1 shadow-sm`}>
          {[
            { key: 'weekly', label: language === 'ko' ? '이번 주' : 'This Week' },
            { key: 'monthly', label: language === 'ko' ? '이번 달' : 'This Month' },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as 'weekly' | 'monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === p.key
                ? ''
                : `${textSecondary} ${hoverBg}`
                }`}
            >
              {p.label}
            </button>
          ))}
          <div className={`w-[1px] h-4 ${isDark ? 'bg-gray-700' : 'bg-slate-300'} mx-1`} />
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#21DBA4] text-black hover:bg-[#1bc490] transition-all shadow-md shadow-[#21DBA4]/20">
            <Calendar size={14} /> {language === 'ko' ? '기간 지정' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Stats Row - 3 Cards Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className={`${cardBg} border ${cardBorder} rounded-3xl p-5 flex items-center justify-between group hover:border-gray-600 transition-colors`}
          >
            {/* Left: Icon + Label/Value */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${inputBg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <div className={`text-xs ${textMuted} font-bold mb-0.5`}>{stat.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold tracking-tight ${textPrimary}`}>{stat.value}</span>
                  <span className={`text-sm ${textSecondary}`}>{stat.unit}</span>
                </div>
              </div>
            </div>
            {/* Right: Trend + Sub */}
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-[#21DBA4] bg-[#21DBA4]/10 px-2 py-0.5 rounded-full mb-1">{stat.trend}</span>
              <span className={`text-[10px] ${textMuted}`}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Bento Grid - 3 Cards Horizontal */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">

        {/* Heatmap Card - 4/12 ≈ 33% */}
        <div className={`flex-1 md:flex-[4] ${cardBg} border ${cardBorder} rounded-3xl p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-4 h-4 text-[#21DBA4]" />
            <h3 className={`text-sm font-bold ${textPrimary}`}>
              {language === 'ko' ? '수집 패턴' : 'Collection Pattern'}
            </h3>
          </div>
          <div className={`${isDark ? 'bg-gray-900/50' : 'bg-slate-50'} rounded-2xl p-4`}>
            <div className="space-y-2">
              {heatmapData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`text-[10px] w-4 ${textMuted} font-medium`}>{d.day}</span>
                  <div className="flex-1 grid grid-cols-12 gap-0.5">
                    {d.hours.map((val, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: val === 0
                            ? (isDark ? '#1F2937' : '#e2e8f0')
                            : '#21DBA4',
                          opacity: val === 0 ? 1 : 0.3 + (val * 0.2)
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className={`mt-4 text-xs ${textSecondary} text-center`}>
            {language === 'ko' ? '주로 ' : 'Most active '}
            <span className="text-[#21DBA4] font-bold">{language === 'ko' ? '밤 9시 ~ 11시' : '9PM - 11PM'}</span>
            {language === 'ko' ? '에 집중됩니다.' : '.'}
          </p>
        </div>

        {/* Interest Evolution Card - 5/12 ≈ 42% */}
        <div className={`flex-1 md:flex-[5] ${cardBg} border ${cardBorder} rounded-3xl p-5 relative overflow-hidden`}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#21DBA4]" />
            <h3 className={`text-sm font-bold ${textPrimary}`}>
              {language === 'ko' ? '관심사 변화' : 'Interest Evolution'}
            </h3>
          </div>
          <div className="relative">
            {/* Vertical Line */}
            <div className={`absolute left-2 top-3 bottom-3 w-0.5 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`} />
            <div className="space-y-3">
              {interestFlow.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 relative">
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full z-10 shrink-0 ${item.active
                    ? 'bg-[#21DBA4] ring-4 ring-[#21DBA4]/20'
                    : isDark ? 'bg-gray-700' : 'bg-slate-300'
                    }`} />
                  {/* Content */}
                  <div className={`flex-1 p-3 rounded-xl border ${item.active
                    ? 'bg-[#21DBA4]/10 border-[#21DBA4]/30'
                    : isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                    <span className={`text-[9px] ${textMuted} block mb-0.5`}>{item.period}</span>
                    <span className={`text-sm font-bold ${item.active ? 'text-[#21DBA4]' : isDark ? 'text-gray-300' : 'text-slate-700'}`}>{item.topic}</span>
                  </div>
                  {/* Percent */}
                  <span className={`text-xs font-bold ${isDark ? 'text-gray-600' : 'text-slate-400'} shrink-0`}>{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#21DBA4] blur-[100px] opacity-10 pointer-events-none" />
        </div>

        {/* Keywords & Trends Card - 3/12 = 25% */}
        <div className={`flex-1 md:flex-[3] ${cardBg} border ${cardBorder} rounded-3xl p-5 flex flex-col`}>
          {/* Keywords Section */}
          <div className="mb-4">
            <h3 className={`text-[10px] font-bold ${textMuted} mb-3 uppercase tracking-widest`}>Weekly Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {weeklyKeywords.map((k, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-full ${inputBg} border ${cardBorder} hover:border-[#21DBA4] ${isDark ? 'text-gray-300' : 'text-slate-600'} text-[11px] font-bold cursor-pointer transition-colors`}>
                  #{k.tag}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-slate-200'} my-2`} />

          {/* Trends Section */}
          <div className="flex-1 space-y-2 mt-2">
            {risingTrends.map((t, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className={`text-xs font-bold ${t.type === 'rising' ? (isDark ? 'text-gray-200' : 'text-slate-700') : `${textMuted} line-through`}`}>{t.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.type === 'rising'
                  ? 'text-orange-400 bg-orange-500/10'
                  : 'text-blue-400 bg-blue-500/10'
                  }`}>
                  {t.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout for Remaining Sections */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* Row 3: Content Studio (Full Width) */}
        <div className={`col-span-12 bg-gradient-to-b ${isDark ? 'from-[#1E232B] to-[#161B22]' : 'from-slate-100 to-white'} border ${isDark ? 'border-gray-700' : 'border-slate-200'} rounded-3xl p-1 relative overflow-hidden group`}>
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-[#21DBA4] blur-[180px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700`} />

          <div className={`${isDark ? 'bg-[#0F1115]/50' : 'bg-white/50'} backdrop-blur-sm rounded-[20px] p-6 md:p-8`}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Search & Select - Takes 7/10 of space */}
              <div className="flex-1 md:flex-[7] flex flex-col min-w-0">
                <div className="mb-6">
                  <h3 className={`text-xl font-bold ${textPrimary} flex items-center gap-2 mb-2`}>
                    <PenTool className="w-5 h-5 text-[#21DBA4]" />
                    {language === 'ko' ? '콘텐츠 생성 스튜디오' : 'Content Studio'}
                  </h3>
                  <p className={`text-sm ${textSecondary}`}>
                    {language === 'ko' ? '저장된 클립들을 조합하여 새로운 문서를 작성합니다.' : 'Combine clips to create new content.'}
                  </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                    <input
                      type="text"
                      placeholder={language === 'ko' ? '키워드로 클립 검색...' : 'Search clips...'}
                      className={`w-full ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-100 border-slate-200'} border rounded-xl pl-9 pr-4 py-2.5 text-sm ${textPrimary} focus:outline-none focus:border-[#21DBA4] ${isDark ? 'focus:bg-gray-800' : 'focus:bg-white'}`}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className={`px-4 py-2.5 ${inputBg} ${hoverBg} border ${cardBorder} rounded-xl text-sm font-bold ${isDark ? 'text-gray-300' : 'text-slate-600'} flex items-center gap-2`}
                    >
                      <Filter size={16} />
                      {studioFilterTag || (language === 'ko' ? '필터' : 'Filter')}
                      <ChevronDown size={14} />
                    </button>
                    {showFilterDropdown && (
                      <div className={`absolute top-full mt-1 left-0 z-50 min-w-[160px] ${cardBg} border ${cardBorder} rounded-xl shadow-lg overflow-hidden`}>
                        <button
                          onClick={() => { setStudioFilterTag(''); setShowFilterDropdown(false); }}
                          className={`w-full px-4 py-2 text-left text-sm ${textSecondary} ${hoverBg}`}
                        >
                          {language === 'ko' ? '전체' : 'All'}
                        </button>
                        {availableTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => { setStudioFilterTag(tag); setShowFilterDropdown(false); }}
                            className={`w-full px-4 py-2 text-left text-sm ${studioFilterTag === tag ? 'text-[#21DBA4] bg-[#21DBA4]/10' : textSecondary} ${hoverBg}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleLoadClips}
                    className="px-5 py-2.5 bg-[#21DBA4] hover:bg-[#1bc490] text-black text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#21DBA4]/10"
                  >
                    <RefreshCw size={16} /> {language === 'ko' ? '조회' : 'Load'}
                  </button>
                </div>

                {/* Clip List */}
                <div className={`flex-1 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-slate-50 border-slate-200'} border rounded-2xl overflow-hidden max-h-[320px]`}>
                  <div className={`p-3 border-b ${cardBorder} flex justify-between items-center ${isDark ? 'bg-gray-900' : 'bg-slate-100'}`}>
                    <span className={`text-xs font-bold ${textMuted} pl-2`}>{language === 'ko' ? `검색 결과 ${filteredClips.length}건` : `${filteredClips.length} results`}</span>
                    <button onClick={() => setSelectedClips(filteredClips.map(c => c.id))} className="text-xs font-bold text-[#21DBA4] hover:underline pr-2">
                      {language === 'ko' ? '전체 선택' : 'Select All'}
                    </button>
                  </div>
                  <div className="overflow-y-auto p-2 space-y-2 max-h-[260px]">
                    {filteredClips.length === 0 ? (
                      <div className={`text-center py-8 ${textMuted}`}>
                        <Search size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{language === 'ko' ? '조회 버튼을 눌러 클립을 불러오세요' : 'Click Load to fetch clips'}</p>
                      </div>
                    ) : (
                      filteredClips.map((clip) => (
                        <div
                          key={clip.id}
                          className={`group/item flex items-start gap-3 p-3 rounded-xl border transition-all ${selectedClips.includes(clip.id)
                            ? 'bg-[#21DBA4]/10 border-[#21DBA4] shadow-[inset_0_0_10px_rgba(33,219,164,0.05)]'
                            : `${isDark ? 'bg-gray-800/20 border-gray-800 hover:bg-gray-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`
                            }`}
                        >
                          {/* Checkbox */}
                          <div
                            onClick={() => toggleClipSelection(clip.id)}
                            className={`mt-0.5 cursor-pointer transition-colors ${selectedClips.includes(clip.id) ? 'text-[#21DBA4]' : `${isDark ? 'text-gray-600 group-hover/item:text-gray-500' : 'text-slate-400'}`}`}
                          >
                            {selectedClips.includes(clip.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0" onClick={() => toggleClipSelection(clip.id)}>
                            <div className="flex items-center gap-2 mb-1">
                              {clip.tags?.[0] && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${inputBg} ${textMuted} border ${cardBorder}`}>{clip.tags[0]}</span>
                              )}
                              <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                                {parseDate(clip.createdAt)?.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                              </span>
                            </div>
                            <h4 className={`text-sm font-bold leading-snug truncate cursor-pointer ${selectedClips.includes(clip.id) ? textPrimary : `${isDark ? 'text-gray-400 group-hover/item:text-gray-200' : 'text-slate-600 group-hover/item:text-slate-800'}`}`}>
                              {clip.title || 'Untitled'}
                            </h4>
                          </div>

                          {/* View Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewingClipId(clip.id); }}
                            className={`p-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity ${isDark ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-slate-200 text-slate-400'}`}
                            title={language === 'ko' ? '클립 보기' : 'View Clip'}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Output Type Selection - Compact 4-column grid below clip list */}
                <div className="mt-4">
                  <h4 className={`text-xs font-bold ${textMuted} mb-3 uppercase tracking-wider`}>
                    {language === 'ko' ? '출력 형태 선택' : 'Output Type'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {contentTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedContentType(selectedContentType === type.id ? null : type.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2 ${selectedContentType === type.id
                          ? 'bg-[#21DBA4] text-black border-[#21DBA4] shadow-md shadow-[#21DBA4]/20'
                          : `${isDark ? 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'}`
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg ${selectedContentType === type.id ? 'bg-black/10' : isDark ? 'bg-gray-900' : 'bg-slate-200'}`}>
                          {type.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{type.label}</div>
                        </div>
                        {selectedContentType === type.id && <CheckCircle2 size={14} />}
                      </div>
                    ))}
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedContentType || selectedClips.length === 0 || generatingReport}
                    className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${selectedContentType && selectedClips.length > 0
                      ? 'bg-[#21DBA4] text-black hover:bg-[#1bc490] shadow-lg shadow-[#21DBA4]/20'
                      : `${inputBg} ${textMuted} cursor-not-allowed`
                      }`}
                  >
                    {generatingReport ? (
                      <><Loader2 size={16} className="animate-spin" /> {language === 'ko' ? '생성 중...' : 'Generating...'}</>
                    ) : (
                      <><Sparkles size={16} fill={selectedContentType && selectedClips.length > 0 ? "black" : "none"} />
                        {selectedContentType ? `${contentTypes.find(t => t.id === selectedContentType)?.label} ${language === 'ko' ? '생성하기' : 'Generate'}` : (language === 'ko' ? '옵션을 선택하세요' : 'Select option')}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Unread & History */}
        <div className={`col-span-12 md:col-span-6 ${cardBg} border ${cardBorder} rounded-3xl p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
              <MessageSquare className="w-4 h-4 text-gray-400" /> {language === 'ko' ? '읽지 않은 클립' : 'Unread Clips'}
            </h3>
            <button className="text-[10px] font-bold text-[#21DBA4] hover:underline flex items-center gap-1 bg-[#21DBA4]/10 px-2 py-1 rounded-full">
              <Sparkles size={10} /> {language === 'ko' ? 'AI 요약 보기' : 'AI Summary'}
            </button>
          </div>
          <div className="space-y-2">
            {unreadClips.map((clip: any) => (
              <div key={clip.id} className={`p-3 ${isDark ? 'bg-gray-800/30 border-gray-800 hover:bg-gray-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} border rounded-xl transition-colors group cursor-pointer flex items-center justify-between`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#21DBA4] shrink-0" />
                  <div className="truncate">
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'} truncate`}>{clip.title}</div>
                    <div className={`text-[10px] ${textMuted}`}>{clip.source || 'Web'} • {clip.time || '2h ago'}</div>
                  </div>
                </div>
                <ChevronRight size={14} className={`${isDark ? 'text-gray-600 group-hover:text-gray-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={`col-span-12 md:col-span-6 ${cardBg} border ${cardBorder} rounded-3xl p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
              <History className="w-4 h-4 text-gray-400" /> {language === 'ko' ? '생성 기록' : 'History'}
            </h3>
            <button className={`text-xs ${textMuted} hover:${textPrimary} transition-colors`}>{language === 'ko' ? '전체보기' : 'View All'}</button>
          </div>
          <div className="space-y-2">
            {creationHistory.map(item => (
              <div key={item.id} className={`p-3 ${isDark ? 'bg-gray-800/30 border-gray-800 hover:bg-gray-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'} border rounded-xl transition-colors flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold ${isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-slate-200 text-slate-600 border-slate-300'} px-1.5 py-0.5 rounded border`}>{item.type}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] ${textMuted}`}>{item.date}</span>
                  <CheckCircle2 size={14} className="text-[#21DBA4]" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIInsightsDashboard;