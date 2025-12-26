import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Clock,
  Zap,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  PenTool,
  FileBarChart,
  FileText,
  Sparkles,
  CheckSquare,
  Square,
  History,
  ChevronRight,
  Loader2,
  Eye,
  Layout,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  CheckCircle2,
  Hash,
  Inbox
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { toast } from 'sonner';
import { cn } from './ui/utils';

// ═══════════════════════════════════════════════════
// Types & Interfaces
// ═══════════════════════════════════════════════════

type AIInsightsDashboardProps = {
  links: any[];
  categories: any[];
  theme: 'light' | 'dark';
  t: (key: string) => string;
  language?: 'en' | 'ko';
  onOpenSettings?: () => void;
  onNavigate?: (path: string) => void;
  onNavigateToUnread?: () => void; // Navigate to home with unread filter
};

type ContentType = 'report' | 'article' | 'planning' | 'trend';
type Period = 'weekly' | 'monthly';

// ═══════════════════════════════════════════════════
// Theme System (Reference Design)
// ═══════════════════════════════════════════════════

const useTheme = (isDark: boolean) => ({
  bg: isDark ? 'bg-[#0F1115]' : 'bg-[#F9FAFB]',
  text: isDark ? 'text-white' : 'text-gray-900',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
  textSub: isDark ? 'text-gray-500' : 'text-gray-400',
  card: isDark ? 'bg-[#161B22]' : 'bg-white',
  cardBorder: isDark ? 'border-gray-800' : 'border-gray-200',
  cardHover: isDark ? 'hover:border-gray-600' : 'hover:border-gray-300',
  itemBg: isDark ? 'bg-gray-900/50' : 'bg-gray-50',
  itemHover: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
  border: isDark ? 'border-gray-800' : 'border-gray-200',
  divider: isDark ? 'bg-gray-800' : 'bg-gray-200',
  inputBg: isDark ? 'bg-gray-800/50' : 'bg-white',
});

// ═══════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════

const parseDate = (createdAt: any): Date | null => {
  if (!createdAt) return null;
  if (createdAt.seconds) return new Date(createdAt.seconds * 1000);
  if (createdAt.toDate) return createdAt.toDate();
  const d = new Date(createdAt);
  return isNaN(d.getTime()) ? null : d;
};

const formatNumber = (num: number): string => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toLocaleString();
};

// ═══════════════════════════════════════════════════
// StatCard Component - Reference Design (rounded-3xl)
// ═══════════════════════════════════════════════════

const StatCard = ({
  label, value, unit, trend, sub, icon, isDark, theme, onClick
}: {
  label: string; value: string; unit: string; trend: string; sub: string;
  icon: React.ReactNode; isDark: boolean; theme: any; onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "col-span-12 md:col-span-4 border rounded-3xl p-5 transition-colors flex items-center justify-between group",
      theme.card, theme.cardBorder, theme.cardHover,
      onClick && "cursor-pointer hover:border-[#21DBA4]/50"
    )}
  >
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
        isDark ? "bg-gray-800 group-hover:bg-gray-700" : "bg-gray-100 group-hover:bg-gray-200"
      )}>
        {icon}
      </div>
      <div>
        <div className={cn("text-xs font-bold mb-0.5", theme.textSub)}>{label}</div>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-2xl font-bold tracking-tight tabular-nums", theme.text)}>{value}</span>
          <span className={cn("text-sm", theme.textMuted)}>{unit}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-xs font-bold text-[#21DBA4] bg-[#21DBA4]/10 px-2 py-0.5 rounded-full mb-1">{trend}</span>
      <span className={cn("text-[10px]", theme.textSub)}>{sub}</span>
      {onClick && <ChevronRight size={14} className={cn("mt-1", theme.textSub)} />}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// Heatmap Component - Reference Design
// ═══════════════════════════════════════════════════

const SavePatternHeatmapCard = ({ links, isDark, theme, language }: any) => {
  const heatmapData = useMemo(() => {
    const days = language === 'ko' ? ['월', '화', '수', '목', '금', '토', '일'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const grid: number[][] = days.map(() => Array(12).fill(0));
    let peakHour = 21;

    links.forEach((link: any) => {
      const date = parseDate(link.createdAt);
      if (date) {
        const day = (date.getDay() + 6) % 7;
        const hour = Math.floor(date.getHours() / 2);
        if (day >= 0 && day < 7 && hour >= 0 && hour < 12) {
          grid[day][hour]++;
        }
      }
    });

    const maxCount = Math.max(...grid.flat(), 1);
    return { days, grid, maxCount, peakHour };
  }, [links, language]);

  return (
    <div className={cn("col-span-12 lg:col-span-4 border rounded-3xl p-6 flex flex-col h-full", theme.card, theme.cardBorder)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
          <Clock className="w-4 h-4 text-[#21DBA4]" />
          {language === 'ko' ? '수집 패턴' : 'Save Pattern'}
        </h3>
      </div>
      <div className={cn("flex-1 flex flex-col justify-center gap-3 rounded-2xl p-4", theme.itemBg)}>
        {heatmapData.days.map((day: string, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <span className={cn("text-[10px] w-8 font-medium", theme.textMuted)}>{day}</span>
            <div className="flex-1 flex gap-1 h-6">
              {heatmapData.grid[i].map((val: number, idx: number) => (
                <div
                  key={idx}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    backgroundColor: val === 0 ? (isDark ? '#272E38' : '#E5E7EB') : '#21DBA4',
                    opacity: val === 0 ? 0.5 : 0.2 + (val / heatmapData.maxCount) * 0.8
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className={cn("mt-4 text-xs text-center", theme.textMuted)}>
        {language === 'ko' ? '주로 ' : 'Mostly at '}
        <span className="text-[#21DBA4] font-bold">
          {language === 'ko' ? '밤 9시 ~ 11시' : '9PM - 11PM'}
        </span>
        {language === 'ko' ? '에 집중됩니다.' : ''}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Interest Evolution - Reference Design
// ═══════════════════════════════════════════════════

const InterestEvolutionCard = ({ links, isDark, theme, language }: any) => {
  const interestFlow = useMemo(() => {
    const now = new Date();
    const periods = [
      { label: language === 'ko' ? '4주 전' : '4 weeks ago', start: 28, end: 21 },
      { label: language === 'ko' ? '2주 전' : '2 weeks ago', start: 14, end: 7 },
      { label: language === 'ko' ? '현재' : 'Now', start: 7, end: 0, active: true },
    ];

    return periods.map(period => {
      const startDate = new Date(now.getTime() - period.start * 24 * 60 * 60 * 1000);
      const endDate = new Date(now.getTime() - period.end * 24 * 60 * 60 * 1000);
      const periodClips = links.filter((link: any) => {
        const date = parseDate(link.createdAt);
        return date && date >= startDate && date < endDate;
      });

      const tagCounts: Record<string, number> = {};
      periodClips.forEach((clip: any) => {
        (clip.tags || []).forEach((tag: string) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
      });
      const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || (language === 'ko' ? '탐색 중' : 'Exploring');

      return { ...period, topic: topTag, percent: Math.min(100, periodClips.length * 10 + 20) };
    });
  }, [links, language]);

  return (
    <div className={cn("col-span-12 lg:col-span-5 border rounded-3xl p-6 flex flex-col h-full relative overflow-hidden", theme.card, theme.cardBorder)}>
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
          <TrendingUp className="w-4 h-4 text-[#21DBA4]" />
          {language === 'ko' ? '관심사 변화' : 'Interest Evolution'}
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 relative z-10">
        <div className={cn("absolute left-[7px] top-4 bottom-4 w-0.5", theme.divider)} />
        {interestFlow.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-4 relative">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 z-10",
              isDark ? "border-[#161B22]" : "border-white",
              item.active ? "bg-[#21DBA4] ring-4 ring-[#21DBA4]/20" : (isDark ? "bg-gray-700" : "bg-gray-300")
            )} />
            <div className={cn(
              "flex-1 p-3 rounded-xl border flex justify-between items-center transition-colors",
              item.active ? "bg-[#21DBA4]/5 border-[#21DBA4]/30" : cn(theme.itemBg, theme.border)
            )}>
              <div>
                <span className={cn("text-[10px] block mb-0.5", theme.textSub)}>{item.label}</span>
                <span className={cn("text-sm font-bold", item.active ? "text-[#21DBA4]" : theme.text)}>{item.topic}</span>
              </div>
              <span className={cn("text-xs font-bold", theme.textSub)}>{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Decor */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#21DBA4] blur-[100px] opacity-[0.03] pointer-events-none" />
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Keywords & Trends Sidebar - Reference Design
// ═══════════════════════════════════════════════════

const KeywordsTrendsCard = ({ links, isDark, theme, language }: any) => {
  const { keywords, trends } = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentTags: Record<string, number> = {};
    const olderTags: Record<string, number> = {};

    links.forEach((link: any) => {
      const date = parseDate(link.createdAt);
      if (!date) return;
      (link.tags || []).forEach((tag: string) => {
        if (date >= weekAgo) recentTags[tag] = (recentTags[tag] || 0) + 1;
        else if (date >= twoWeeksAgo) olderTags[tag] = (olderTags[tag] || 0) + 1;
      });
    });

    const topKeywords = Object.entries(recentTags).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag, count]) => ({ tag, count }));

    const risingTrends: any[] = [];
    Object.keys(recentTags).forEach(tag => {
      const recent = recentTags[tag] || 0;
      const older = olderTags[tag] || 0;
      if (older > 0) {
        const change = Math.round(((recent - older) / older) * 100);
        if (Math.abs(change) > 10) {
          risingTrends.push({ name: tag, change: `${change > 0 ? '+' : ''}${change}%`, type: change > 0 ? 'rising' : 'falling' });
        }
      }
    });

    return { keywords: topKeywords, trends: risingTrends.slice(0, 3) };
  }, [links]);

  return (
    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
      {/* Keywords */}
      <div className={cn("border rounded-3xl p-6 flex-1", theme.card, theme.cardBorder)}>
        <h3 className={cn("text-sm font-bold mb-4 uppercase tracking-wider", theme.textMuted)}>
          {language === 'ko' ? '이번 주 키워드' : 'Weekly Keywords'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.length > 0 ? keywords.map((k: any, i: number) => (
            <span key={i} className={cn(
              "px-3 py-1.5 rounded-lg border hover:border-[#21DBA4] text-xs font-bold cursor-pointer transition-colors",
              theme.itemBg, theme.border, theme.text
            )}>
              #{k.tag}
            </span>
          )) : (
            <span className={cn("text-xs", theme.textSub)}>{language === 'ko' ? '데이터 없음' : 'No data'}</span>
          )}
        </div>
      </div>

      {/* Trends */}
      <div className={cn("border rounded-3xl p-6 flex-1 flex flex-col justify-center", theme.card, theme.cardBorder)}>
        <h3 className={cn("text-sm font-bold mb-4 uppercase tracking-wider", theme.textMuted)}>
          {language === 'ko' ? '트렌드' : 'Trends'}
        </h3>
        <div className="space-y-3">
          {trends.length > 0 ? trends.map((t: any, i: number) => (
            <div key={i} className="flex justify-between items-center">
              <span className={cn("text-xs font-bold", t.type === 'rising' ? theme.text : cn(theme.textSub, "line-through"))}>{t.name}</span>
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                t.type === 'rising' ? "text-orange-400 bg-orange-400/10" : "text-blue-400 bg-blue-400/10"
              )}>{t.change}</span>
            </div>
          )) : (
            <span className={cn("text-xs", theme.textSub)}>{language === 'ko' ? '분석 중...' : 'Analyzing...'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Content Studio - Reference Design (Hero Section)
// ═══════════════════════════════════════════════════

const ContentStudio = ({
  clips, selectedClips, onToggleClip, onSelectAll, contentTypes, selectedContentType,
  onSelectContentType, onGenerate, isGenerating, searchQuery, onSearchChange,
  filterTag, onFilterChange, availableTags, startDate, endDate,
  onStartDateChange, onEndDateChange, onLoadClips, language, isDark, theme
}: any) => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className={cn(
      "col-span-12 bg-gradient-to-b border rounded-3xl p-1 relative overflow-hidden group",
      isDark ? "from-[#1E232B] to-[#161B22]" : "from-gray-50 to-white",
      theme.cardBorder
    )}>
      {/* Gradient Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#21DBA4] blur-[180px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700" />

      <div className={cn("backdrop-blur-sm rounded-[20px] p-6 lg:p-8 h-full", isDark ? "bg-[#0F1115]/50" : "bg-white/80")}>
        <div className="flex flex-col gap-6 h-full">

          {/* Header */}
          <div>
            <h3 className={cn("text-xl font-bold flex items-center gap-2 mb-2", theme.text)}>
              <PenTool className="w-5 h-5 text-[#21DBA4]" />
              {language === 'ko' ? '콘텐츠 생성 스튜디오' : 'Content Creation Studio'}
            </h3>
            <p className={cn("text-sm", theme.textMuted)}>
              {language === 'ko' ? '저장된 클립들을 조합하여 새로운 문서를 작성합니다.' : 'Combine saved clips to create new documents.'}
            </p>
          </div>

          {/* Toolbar */}
          <div className="space-y-3">
            {/* Search Row */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ko' ? '키워드로 클립 검색...' : 'Search clips...'}
                className={cn("w-full border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#21DBA4]", theme.inputBg, theme.border, theme.text)}
                value={searchQuery}
                onChange={(e: any) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Filter Row */}
            <div className="flex gap-2 items-center flex-wrap">
              <div className="relative">
                <button onClick={() => setShowFilter(!showFilter)} className={cn("px-3 py-2 border rounded-xl text-sm font-medium flex items-center gap-2", theme.itemBg, theme.border, theme.text, theme.itemHover)}>
                  <Filter size={14} /> {language === 'ko' ? '필터' : 'Filter'}
                </button>
                {showFilter && (
                  <div className={cn("absolute top-full mt-2 left-0 z-50 min-w-[140px] border rounded-xl shadow-lg overflow-hidden", theme.card, theme.border)}>
                    <button onClick={() => { onFilterChange(''); setShowFilter(false); }} className={cn("w-full px-4 py-2.5 text-left text-sm", theme.textMuted, theme.itemHover)}>
                      {language === 'ko' ? '전체' : 'All'}
                    </button>
                    {availableTags.slice(0, 5).map((tag: string) => (
                      <button key={tag} onClick={() => { onFilterChange(tag); setShowFilter(false); }} className={cn("w-full px-4 py-2.5 text-left text-sm", filterTag === tag ? "text-[#21DBA4]" : theme.textMuted, theme.itemHover)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input type="date" value={startDate} onChange={(e: any) => onStartDateChange(e.target.value)} className={cn("px-3 py-2 text-sm w-[120px] border rounded-xl", theme.inputBg, theme.border, theme.textMuted)} />
              <span className={cn("text-xs", theme.textSub)}>~</span>
              <input type="date" value={endDate} onChange={(e: any) => onEndDateChange(e.target.value)} className={cn("px-3 py-2 text-sm w-[120px] border rounded-xl", theme.inputBg, theme.border, theme.textMuted)} />

              <button onClick={onLoadClips} className="ml-auto px-4 py-2 bg-[#21DBA4] hover:bg-[#1bc490] text-black text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#21DBA4]/10">
                <RefreshCw size={14} /> {language === 'ko' ? '조회' : 'Load'}
              </button>
            </div>
          </div>

          {/* Clip List */}
          <div className={cn("flex-1 border rounded-2xl overflow-hidden flex flex-col max-h-[240px]", theme.itemBg, theme.border)}>
            <div className={cn("p-3 border-b flex justify-between items-center", isDark ? "bg-gray-900 border-gray-800" : "bg-gray-100 border-gray-200")}>
              <span className={cn("text-xs font-bold pl-2", theme.textSub)}>
                {language === 'ko' ? `검색 결과 ${clips.length}건` : `${clips.length} clips found`}
              </span>
              <button onClick={onSelectAll} className="text-xs font-bold text-[#21DBA4] hover:underline pr-2">
                {language === 'ko' ? '전체 선택' : 'Select All'}
              </button>
            </div>

            <div className="overflow-y-auto p-2 space-y-2 flex-1">
              {clips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search size={20} className={cn("mb-3", theme.textSub)} />
                  <p className={cn("text-sm font-medium", theme.textMuted)}>{language === 'ko' ? '클립을 불러오세요' : 'Load clips to start'}</p>
                </div>
              ) : clips.map((clip: any) => (
                <div
                  key={clip.id}
                  onClick={() => onToggleClip(clip.id)}
                  className={cn(
                    "group/item flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                    selectedClips.includes(clip.id)
                      ? "bg-[#21DBA4]/10 border-[#21DBA4] shadow-[inset_0_0_10px_rgba(33,219,164,0.05)]"
                      : cn(isDark ? "bg-gray-800/20" : "bg-white", theme.border, theme.itemHover)
                  )}
                >
                  <div className={cn("mt-0.5 transition-colors", selectedClips.includes(clip.id) ? "text-[#21DBA4]" : "text-gray-400")}>
                    {selectedClips.includes(clip.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", isDark ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-600 border-gray-200")}>
                        {clip.tags?.[0] || 'Clip'}
                      </span>
                    </div>
                    <h4 className={cn("text-sm font-bold leading-snug truncate", selectedClips.includes(clip.id) ? theme.text : theme.textMuted)}>
                      {clip.title || 'Untitled'}
                    </h4>
                  </div>
                  <button className={cn("p-1.5 rounded-lg transition-colors opacity-0 group-hover/item:opacity-100", isDark ? "text-gray-600 hover:text-white hover:bg-gray-700" : "text-gray-400 hover:text-black hover:bg-gray-200")}>
                    <Eye size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Output Type - Full Width at Bottom */}
          <div>
            <h4 className={cn("text-sm font-bold mb-3 flex items-center gap-2", theme.textMuted)}>
              <Layout size={16} /> {language === 'ko' ? '출력 형태 선택' : 'Select Output Type'}
            </h4>

            <div className="flex gap-3">
              {contentTypes.map((type: any) => (
                <button
                  key={type.id}
                  onClick={() => onSelectContentType(type.id)}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2",
                    selectedContentType === type.id
                      ? "bg-[#21DBA4] text-black border-[#21DBA4] shadow-lg shadow-[#21DBA4]/20 font-bold"
                      : cn(isDark ? "bg-gray-800/40" : "bg-white", theme.border, theme.textMuted, "hover:border-[#21DBA4] hover:text-[#21DBA4]")
                  )}
                >
                  {type.icon}
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={onGenerate}
              disabled={!selectedContentType || selectedClips.length === 0 || isGenerating}
              className={cn(
                "mt-4 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                selectedContentType && selectedClips.length > 0
                  ? "bg-[#21DBA4] text-black hover:bg-[#1bc490] hover:scale-[1.02] shadow-lg shadow-[#21DBA4]/20"
                  : cn(isDark ? "bg-gray-800 text-gray-600" : "bg-gray-200 text-gray-400", "cursor-not-allowed")
              )}
            >
              {isGenerating ? (
                <><Loader2 size={16} className="animate-spin" />{language === 'ko' ? '생성 중...' : 'Generating...'}</>
              ) : (
                <><Sparkles size={16} fill={selectedContentType && selectedClips.length > 0 ? "black" : "none"} />
                  {selectedContentType ? (language === 'ko' ? `${contentTypes.find((t: any) => t.id === selectedContentType)?.label} 생성하기` : `Generate ${contentTypes.find((t: any) => t.id === selectedContentType)?.label}`) : (language === 'ko' ? '옵션을 선택하세요' : 'Select an option')}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Unread & History Row - Reference Design
// ═══════════════════════════════════════════════════

const UnreadHistoryRow = ({ links, creationHistory, isDark, theme, language }: any) => {
  const unreadClips = useMemo(() => {
    return links.filter((l: any) => !l.isArchived && !l.notes && !l.isFavorite).slice(0, 4);
  }, [links]);

  return (
    <>
      {/* Unread Clips */}
      <div className={cn("col-span-12 md:col-span-6 border rounded-3xl p-6 flex flex-col", theme.card, theme.cardBorder)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
            <MessageSquare className="w-4 h-4 text-gray-400" />
            {language === 'ko' ? '읽지 않은 클립' : 'Unread Clips'}
          </h3>
          <button className="text-[10px] font-bold text-[#21DBA4] hover:underline flex items-center gap-1 bg-[#21DBA4]/10 px-2 py-1 rounded-full">
            <Sparkles size={10} /> {language === 'ko' ? 'AI 요약 보기' : 'AI Summary'}
          </button>
        </div>
        <div className="flex-1 space-y-2">
          {unreadClips.length > 0 ? unreadClips.map((clip: any) => (
            <div key={clip.id} className={cn("p-3 border rounded-xl transition-colors group cursor-pointer flex items-center justify-between", isDark ? "bg-gray-800/30 border-gray-800 hover:bg-gray-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100")}>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-[#21DBA4] shrink-0" />
                <div className="truncate">
                  <div className={cn("text-sm font-medium truncate", isDark ? "text-gray-300" : "text-gray-700")}>{clip.title || 'Untitled'}</div>
                  <div className={cn("text-[10px]", theme.textSub)}>{clip.platform || 'Web'}</div>
                </div>
              </div>
              <ChevronRight size={14} className={theme.textSub} />
            </div>
          )) : (
            <div className={cn("text-center py-8 text-sm", theme.textSub)}>
              {language === 'ko' ? '모두 읽음!' : 'All caught up!'}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className={cn("col-span-12 md:col-span-6 border rounded-3xl p-6 flex flex-col", theme.card, theme.cardBorder)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
            <History className="w-4 h-4 text-gray-400" />
            {language === 'ko' ? '생성 기록' : 'Creation History'}
          </h3>
          <button className={cn("text-xs transition-colors", theme.textSub, "hover:text-current")}>
            {language === 'ko' ? '전체보기' : 'View All'}
          </button>
        </div>
        <div className="flex-1 space-y-2">
          {creationHistory.map((item: any) => (
            <div key={item.id} className={cn("p-3 border rounded-xl transition-colors flex items-center justify-between", isDark ? "bg-gray-800/30 border-gray-800 hover:bg-gray-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100")}>
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", isDark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-white text-gray-600 border-gray-300")}>{item.type}</span>
                <span className={cn("text-sm font-medium", isDark ? "text-gray-300" : "text-gray-700")}>{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px]", theme.textSub)}>{item.date}</span>
                <CheckCircle2 size={14} className="text-[#21DBA4]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════

export const AIInsightsDashboard = ({
  links, categories, theme: themeMode, t, language = 'ko', onOpenSettings, onNavigateToUnread,
}: AIInsightsDashboardProps) => {
  const { isMaster } = useSubscription();
  const [period, setPeriod] = useState<Period>('weekly');
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [studioStartDate, setStudioStartDate] = useState<string>('');
  const [studioEndDate, setStudioEndDate] = useState<string>('');
  const [studioFilterTag, setStudioFilterTag] = useState<string>('');
  const [studioClips, setStudioClips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = themeMode === 'dark';
  const theme = useTheme(isDark);

  useEffect(() => { setTimeout(() => setIsLoading(false), 300); }, []);

  const allActiveLinks = useMemo(() => links.filter(l => !l.isArchived), [links]);

  // Stats Data
  const statsData = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'weekly' ? 7 : 30;
    const cutoff = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const recentClips = allActiveLinks.filter(l => { const d = parseDate(l.createdAt); return d && d >= cutoff; });
    const totalClips = allActiveLinks.length;

    // Unread clips - clips without lastViewedAt
    const unreadClips = allActiveLinks.filter(l => !l.lastViewedAt);
    const unreadCount = unreadClips.length;
    const recentUnread = recentClips.filter(l => !l.lastViewedAt).length;

    // Keyword engagement analysis
    const tagStats: Record<string, { total: number; read: number }> = {};
    allActiveLinks.forEach(l => {
      const isRead = !!l.lastViewedAt;
      (l.tags || []).forEach((tag: string) => {
        if (!tagStats[tag]) tagStats[tag] = { total: 0, read: 0 };
        tagStats[tag].total++;
        if (isRead) tagStats[tag].read++;
      });
    });

    // Find highest and lowest engagement tags
    const tagEntries = Object.entries(tagStats).filter(([_, v]) => v.total >= 2);
    const sortedByEngagement = tagEntries.sort((a, b) => (b[1].read / b[1].total) - (a[1].read / a[1].total));
    const highEngagementTag = sortedByEngagement[0];
    const lowEngagementTag = sortedByEngagement[sortedByEngagement.length - 1];

    // Calculate overall engagement rate
    const readClips = allActiveLinks.filter(l => l.lastViewedAt).length;
    const engagementRate = totalClips > 0 ? Math.round((readClips / totalClips) * 100) : 0;

    // Build engagement sub text
    let engagementSub = '';
    if (highEngagementTag && lowEngagementTag && highEngagementTag[0] !== lowEngagementTag[0]) {
      const highRate = Math.round((highEngagementTag[1].read / highEngagementTag[1].total) * 100);
      const lowRate = Math.round((lowEngagementTag[1].read / lowEngagementTag[1].total) * 100);
      engagementSub = language === 'ko'
        ? `${highEngagementTag[0]} ${highRate}%↑ / ${lowEngagementTag[0]} ${lowRate}%↓`
        : `${highEngagementTag[0]} ${highRate}%↑ / ${lowEngagementTag[0]} ${lowRate}%↓`;
    } else {
      engagementSub = language === 'ko' ? '태그별 열람율 분석' : 'Tag engagement analysis';
    }

    return [
      {
        label: language === 'ko' ? '영구 보존된 지식' : 'Saved Knowledge',
        value: formatNumber(totalClips),
        unit: language === 'ko' ? '개' : 'clips',
        trend: `+${recentClips.length}`,
        sub: language === 'ko' ? '원본 소실 걱정 없음' : 'Permanently saved',
        icon: <ShieldCheck size={20} className="text-[#21DBA4]" />
      },
      {
        label: language === 'ko' ? '읽지 않은 클립' : 'Unread Clips',
        value: formatNumber(unreadCount),
        unit: language === 'ko' ? '개' : 'clips',
        trend: `+${recentUnread}`,
        sub: language === 'ko' ? '클릭하여 확인하기' : 'Click to view',
        icon: <Inbox size={20} className="text-blue-400" />,
        onClick: onNavigateToUnread
      },
      {
        label: language === 'ko' ? '저장 vs 활용' : 'Save vs Use',
        value: `${engagementRate}`,
        unit: '%',
        trend: readClips > 0 ? `${readClips}/${totalClips}` : '0',
        sub: engagementSub,
        icon: <Zap size={20} className="text-orange-400" />
      },
    ];
  }, [allActiveLinks, period, language, onNavigateToUnread]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    allActiveLinks.forEach(l => (l.tags || []).forEach((t: string) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 10);
  }, [allActiveLinks]);

  const filteredClips = useMemo(() => {
    if (studioClips.length === 0) return [];
    let result = studioClips;
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(c => c.title?.toLowerCase().includes(q) || c.tags?.some((t: string) => t.toLowerCase().includes(q))); }
    if (studioFilterTag) { result = result.filter(c => c.tags?.includes(studioFilterTag)); }
    return result.slice(0, 20);
  }, [studioClips, searchQuery, studioFilterTag]);

  const handleLoadClips = useCallback(() => {
    let result = allActiveLinks;
    if (studioStartDate || studioEndDate) {
      result = result.filter(clip => { const d = parseDate(clip.createdAt); if (!d) return false; const clipDate = d.toISOString().split('T')[0]; if (studioStartDate && clipDate < studioStartDate) return false; if (studioEndDate && clipDate > studioEndDate) return false; return true; });
    }
    setStudioClips(result);
    setSelectedClips([]);
    toast.success(language === 'ko' ? `${result.length}개의 클립을 불러왔습니다` : `Loaded ${result.length} clips`);
  }, [allActiveLinks, studioStartDate, studioEndDate, language]);

  const toggleClipSelection = useCallback((id: string) => { setSelectedClips(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]); }, []);
  const selectAllClips = useCallback(() => { setSelectedClips(filteredClips.map(c => c.id)); }, [filteredClips]);
  const handleGenerate = useCallback(async () => {
    if (!selectedContentType || selectedClips.length === 0) return;
    setGeneratingReport(true);
    toast.loading(language === 'ko' ? '콘텐츠 생성 중...' : 'Generating...');
    setTimeout(() => { setGeneratingReport(false); toast.success(language === 'ko' ? '콘텐츠가 생성되었습니다!' : 'Content generated!'); }, 2000);
  }, [selectedContentType, selectedClips, language]);

  const creationHistory = [
    { id: 1, type: language === 'ko' ? '기획서' : 'Plan', title: language === 'ko' ? 'SaaS 자동화 마케팅 기획안' : 'SaaS Automation Plan', date: '2024.12.18' },
    { id: 2, type: language === 'ko' ? '블로그' : 'Blog', title: language === 'ko' ? '노코드 툴 5가지 비교 분석' : '5 No-code Tools Analysis', date: '2024.12.15' },
  ];

  const contentTypes = [
    { id: 'report', label: language === 'ko' ? '리포트' : 'Report', icon: <FileBarChart size={18} />, desc: language === 'ko' ? '분석 보고서' : 'Analysis' },
    { id: 'article', label: language === 'ko' ? '아티클' : 'Article', icon: <FileText size={18} />, desc: language === 'ko' ? '인사이트 글' : 'Insight' },
    { id: 'planning', label: language === 'ko' ? '기획서' : 'Planning', icon: <Layout size={18} />, desc: language === 'ko' ? '실행 계획안' : 'Plan' },
    { id: 'trend', label: language === 'ko' ? '트렌드' : 'Trend', icon: <TrendingUp size={18} />, desc: language === 'ko' ? '요약 정리' : 'Summary' },
  ];

  // Access Check
  if (!isMaster) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-8", theme.bg)}>
        <div className={cn("text-center p-12 max-w-md rounded-3xl border", theme.card, theme.cardBorder)}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#21DBA4] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#21DBA4]/20">
            <Sparkles size={32} className="text-black" />
          </div>
          <h2 className={cn("text-2xl font-bold mb-3", theme.text)}>{language === 'ko' ? '준비중입니다' : 'Coming Soon'}</h2>
          <p className={cn("text-sm mb-6 leading-relaxed", theme.textMuted)}>{language === 'ko' ? 'AI 인사이트 기능은 현재 개발 중입니다.' : 'AI Insights is under development.'}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("min-h-screen p-8 space-y-8", theme.bg)}>
        <div className="space-y-2"><div className="h-8 w-64 bg-gray-800 rounded-xl animate-pulse" /><div className="h-4 w-96 bg-gray-800 rounded animate-pulse" /></div>
        <div className="grid grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-28 rounded-3xl bg-gray-800 animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <main className={cn("min-h-screen p-6 lg:p-10 max-w-[1600px] mx-auto pb-40 transition-colors duration-300", theme.bg, theme.text)}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {language === 'ko' ? '반가워요' : 'Welcome back'} <span className="text-[#21DBA4]">👋</span>
          </h1>
          <p className={cn("text-sm", theme.textMuted)}>
            {language === 'ko' ? '오늘의 인사이트를 발견하고, 새로운 가치를 만들어보세요.' : 'Discover insights and create new value today.'}
          </p>
        </div>

        {/* Date Filter */}
        <div className={cn("flex items-center border rounded-xl p-1 shadow-sm", theme.card, theme.border)}>
          {[
            { key: 'weekly' as Period, label: language === 'ko' ? '이번 주' : 'This Week' },
            { key: 'monthly' as Period, label: language === 'ko' ? '이번 달' : 'This Month' },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                period === p.key ? "bg-[#21DBA4] text-black" : cn(theme.textMuted, theme.itemHover)
              )}
            >
              {p.label}
            </button>
          ))}
          <div className={cn("w-[1px] h-4 mx-1", theme.divider)} />
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#21DBA4] text-black hover:bg-[#1bc490] transition-all">
            <Calendar size={14} /> {language === 'ko' ? '기간 지정' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Grid System */}
      <div className="grid grid-cols-12 gap-6 mb-8">

        {/* Stats Row */}
        {statsData.map((stat, idx) => (
          <StatCard key={idx} {...stat} isDark={isDark} theme={theme} />
        ))}

        {/* Analysis Row: Heatmap + Interest + Keywords */}
        <SavePatternHeatmapCard links={allActiveLinks} isDark={isDark} theme={theme} language={language} />
        <InterestEvolutionCard links={allActiveLinks} isDark={isDark} theme={theme} language={language} />
        <KeywordsTrendsCard links={allActiveLinks} isDark={isDark} theme={theme} language={language} />

        {/* Content Studio */}
        <ContentStudio
          clips={filteredClips} selectedClips={selectedClips} onToggleClip={toggleClipSelection} onSelectAll={selectAllClips}
          contentTypes={contentTypes} selectedContentType={selectedContentType} onSelectContentType={(id: any) => setSelectedContentType(id as ContentType)}
          onGenerate={handleGenerate} isGenerating={generatingReport} searchQuery={searchQuery} onSearchChange={setSearchQuery}
          filterTag={studioFilterTag} onFilterChange={setStudioFilterTag} availableTags={availableTags}
          startDate={studioStartDate} endDate={studioEndDate} onStartDateChange={setStudioStartDate} onEndDateChange={setStudioEndDate}
          onLoadClips={handleLoadClips} language={language} isDark={isDark} theme={theme}
        />

        {/* Unread & History */}
        <UnreadHistoryRow links={allActiveLinks} creationHistory={creationHistory} isDark={isDark} theme={theme} language={language} />

      </div>
    </main>
  );
};

export default AIInsightsDashboard;
