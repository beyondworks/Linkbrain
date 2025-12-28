import { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronRight,
  Loader2,
  Eye,
  Layout,
  TrendingUp,
  TrendingDown,
  Hash,
  Inbox
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { StatCard } from './AIInsightsDashboard/StatCard';

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

// StatCard is now imported from ./AIInsightsDashboard/StatCard

// ═══════════════════════════════════════════════════
// Tag Reading Rate Card - Bar Chart Style
// ═══════════════════════════════════════════════════

const TagReadingRateCard = ({
  tagData, isDark, theme, language
}: {
  tagData: Array<{ tag: string; rate: number; total: number }>;
  isDark: boolean; theme: any; language: string;
}) => (
  <div className={cn(
    "col-span-12 md:col-span-4 border rounded-3xl p-6 transition-colors",
    theme.card, theme.cardBorder, theme.cardHover
  )}>
    <div className="flex items-center gap-3 mb-6">
      <Zap size={20} className="text-orange-400 shrink-0" />
      <div className={cn("text-sm font-bold", theme.text)}>
        {language === 'ko' ? '태그별 열람율' : 'Tag Reading Rate'}
      </div>
    </div>

    <div className="space-y-4">
      {tagData.length > 0 ? tagData.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <span className={cn("text-sm font-semibold w-20 shrink-0", theme.text)}>
            {item.tag}
          </span>
          <div className="flex-1 flex items-center gap-3">
            <div className={cn("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-gray-700" : "bg-gray-200")}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(item.rate, 3)}%`,
                  backgroundColor: `rgba(33, 219, 164, ${0.3 + (item.rate / 100) * 0.7})`
                }}
              />
            </div>
            <span className={cn("text-sm font-bold tabular-nums shrink-0", theme.text)}>
              {item.rate}%
            </span>
          </div>
        </div>
      )) : (
        <div className={cn("text-sm text-center py-6", theme.textSub)}>
          {language === 'ko' ? '클립을 읽어보세요!' : 'Start reading clips!'}
        </div>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════
// Heatmap Component - Reference Design
// ═══════════════════════════════════════════════════

const SavePatternHeatmapCard = ({ links, isDark, theme, language, period }: any) => {
  const heatmapData = useMemo(() => {
    const days = language === 'ko' ? ['월', '화', '수', '목', '금', '토', '일'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const grid: number[][] = days.map(() => Array(12).fill(0));
    const hourCounts: number[] = Array(24).fill(0);

    links.forEach((link: any) => {
      // Use timestamp (LinkItem) or createdAt (ClipData) for compatibility
      const date = parseDate(link.timestamp || link.createdAt);
      if (date) {
        const day = (date.getDay() + 6) % 7;
        const hour = Math.floor(date.getHours() / 2);
        const actualHour = date.getHours();
        if (day >= 0 && day < 7 && hour >= 0 && hour < 12) {
          grid[day][hour]++;
        }
        hourCounts[actualHour]++;
      }
    });

    // Find peak hour range
    const maxHourCount = Math.max(...hourCounts);
    const peakHour = hourCounts.indexOf(maxHourCount);
    const peakStartHour = Math.max(0, peakHour - 1);
    const peakEndHour = Math.min(23, peakHour + 1);

    const formatHour = (h: number) => {
      if (language === 'ko') {
        if (h < 12) return h === 0 ? '자정' : `오전 ${h}시`;
        return h === 12 ? '정오' : `오후 ${h - 12}시`;
      }
      return h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`;
    };

    const maxCount = Math.max(...grid.flat(), 1);
    const peakTimeLabel = links.length > 0
      ? `${formatHour(peakStartHour)} ~ ${formatHour(peakEndHour)}`
      : (language === 'ko' ? '데이터 없음' : 'No data');

    return { days, grid, maxCount, peakTimeLabel, totalClips: links.length };
  }, [links, language]);

  return (
    <div className={cn("col-span-12 lg:col-span-4 border rounded-3xl p-6 flex flex-col h-full overflow-visible", theme.card, theme.cardBorder)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
          <Clock className="w-4 h-4 text-[#21DBA4]" />
          {language === 'ko' ? '수집 패턴' : 'Save Pattern'}
        </h3>
        <span className={cn("text-xs px-2 py-0.5 rounded-full", isDark ? "bg-gray-800" : "bg-gray-100", theme.textMuted)}>
          {heatmapData.totalClips}{language === 'ko' ? '개' : ' clips'}
        </span>
      </div>
      <Tooltip.Provider delayDuration={100}>
        <div className={cn("flex-1 flex flex-col justify-center gap-2 rounded-2xl p-4", theme.itemBg)}>
          {heatmapData.days.map((day: string, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <span className={cn("text-[10px] w-8 font-medium", theme.textMuted)}>{day}</span>
              <div className="flex-1 flex gap-1 h-5">
                {heatmapData.grid[i].map((val: number, idx: number) => {
                  const intensity = heatmapData.maxCount > 0 ? val / heatmapData.maxCount : 0;
                  const startHour = idx * 2;
                  const endHour = startHour + 2;
                  return (
                    <Tooltip.Root key={idx}>
                      <Tooltip.Trigger asChild>
                        <div
                          className="flex-1 rounded-sm transition-all duration-200 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-[#21DBA4]/50"
                          style={{
                            backgroundColor: val === 0
                              ? (isDark ? '#1F2937' : '#E5E7EB')
                              : `rgba(33, 219, 164, ${0.3 + intensity * 0.7})`,
                          }}
                        />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          sideOffset={8}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium shadow-xl border z-[9999]",
                            isDark ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
                          )}
                        >
                          <div className="font-bold mb-1">{day} {startHour}:00~{endHour}:00</div>
                          <div className="text-[#21DBA4] font-bold">{val}{language === 'ko' ? '개 클립' : ' clips'}</div>
                          <Tooltip.Arrow className={isDark ? "fill-gray-900" : "fill-white"} />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Tooltip.Provider>
      <p className={cn("mt-4 text-xs text-center", theme.textMuted)}>
        {links.length > 0 ? (
          <>
            {language === 'ko' ? '주로 ' : 'Mostly at '}
            <span className="text-[#21DBA4] font-bold">{heatmapData.peakTimeLabel}</span>
            {language === 'ko' ? '에 집중됩니다.' : ''}
          </>
        ) : (
          language === 'ko' ? '이 기간에 저장된 클립이 없습니다.' : 'No clips saved in this period.'
        )}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Interest Evolution - Reference Design
// ═══════════════════════════════════════════════════

const InterestEvolutionCard = ({ links, allLinks, isDark, theme, language, period, categories }: any) => {
  const interestFlow = useMemo(() => {
    const now = new Date();
    // Use allLinks for trend analysis to show full history
    const sourceLinks = allLinks || links;

    // Format date as MM/DD
    const formatDateShort = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

    const periods = [
      { label: language === 'ko' ? '4주 전' : '4 weeks ago', start: 28, end: 21 },
      { label: language === 'ko' ? '2주 전' : '2 weeks ago', start: 14, end: 7 },
      { label: language === 'ko' ? '현재' : 'Now', start: 7, end: 0, active: true },
    ].map(p => {
      const startDate = new Date(now.getTime() - p.start * 24 * 60 * 60 * 1000);
      const endDate = new Date(now.getTime() - p.end * 24 * 60 * 60 * 1000);
      const dateRange = `${formatDateShort(startDate)}~${formatDateShort(endDate)}`;
      return { ...p, dateRange, startDate, endDate };
    });

    // Helper to get category name from ID
    const getCategoryName = (id: string): string => {
      const cat = categories?.find((c: any) => c.id === id);
      return cat?.name || id;
    };

    return periods.map(p => {
      const periodClips = sourceLinks.filter((link: any) => {
        // Use timestamp (LinkItem) or createdAt (ClipData) for compatibility
        const date = parseDate(link.timestamp || link.createdAt);
        return date && date >= p.startDate && date < p.endDate;
      });

      const tagCounts: Record<string, number> = {};
      periodClips.forEach((clip: any) => {
        // Use keywords if available, otherwise use category
        const tags = (clip.keywords && clip.keywords.length > 0)
          ? clip.keywords
          : (clip.categoryId ? [clip.categoryId] : []);
        tags.forEach((tag: string) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
      });

      const topTagEntry = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
      const topTag = topTagEntry ? getCategoryName(topTagEntry[0]) : (language === 'ko' ? '데이터 없음' : 'No data');
      const topTagCount = topTagEntry ? topTagEntry[1] : 0;
      const percentage = periodClips.length > 0 ? Math.round((topTagCount / periodClips.length) * 100) : 0;

      // Return enriched data for this period
      return {
        ...p,
        topic: topTag,
        count: periodClips.length,
        topTagCount,
        percentage
      };
    });
  }, [allLinks, links, language, categories]);

  return (
    <div className={cn("border rounded-3xl p-6 flex flex-col", theme.card, theme.cardBorder)}>
      <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme.text)}>
        <div className="w-3 h-3 rounded-full border-2 border-[#21DBA4]" />
        {language === 'ko' ? '관심사 변화' : 'Interest Evolution'}
      </h3>

      <div className="space-y-3 flex-1">
        {interestFlow.map((item: any, idx: number) => (
          <div
            key={idx}
            className={cn(
              "p-4 rounded-2xl border transition-colors",
              item.active ? "bg-[#21DBA4]/5 border-[#21DBA4]/30" : cn(theme.itemBg, theme.border)
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-xs font-bold", item.active ? "text-[#21DBA4]" : theme.textSub)}>
                {item.label}
              </span>
              <span className={cn("text-[10px]", theme.textMuted)}>({item.dateRange})</span>
            </div>
            <div className={cn("text-lg font-bold", item.active ? "text-[#21DBA4]" : theme.text)}>
              {item.topic}
            </div>
            {item.count > 0 && (
              <div className={cn("text-xs mt-1", theme.textMuted)}>
                {item.count}{language === 'ko' ? '개' : ''} · {item.percentage}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Keywords & Trends Sidebar - Reference Design
// ═══════════════════════════════════════════════════

const KeywordsTrendsCard = ({ links, isDark, theme, language, period, categories }: any) => {
  const { keywords, trends } = useMemo(() => {
    // Helper to get category name from ID
    const getCategoryName = (id: string): string => {
      const cat = categories?.find((c: any) => c.id === id);
      return cat?.name || id;
    };

    // Keywords are from the passed links (already period-filtered)
    const tagCounts: Record<string, number> = {};
    links.forEach((link: any) => {
      // Use keywords if available, otherwise use category
      const tags = (link.keywords && link.keywords.length > 0)
        ? link.keywords
        : (link.categoryId ? [link.categoryId] : []);
      tags.forEach((tag: string) => {
        const displayName = getCategoryName(tag);
        tagCounts[displayName] = (tagCounts[displayName] || 0) + 1;
      });
    });

    const topKeywords = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // For trends, compare with previous period (need full date analysis)
    const now = new Date();
    const periodDays = period === 'weekly' ? 7 : 30;
    const cutoff = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousCutoff = new Date(cutoff.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const recentTags: Record<string, number> = {};
    const olderTags: Record<string, number> = {};

    links.forEach((link: any) => {
      // Use timestamp (LinkItem) or createdAt (ClipData) for compatibility
      const date = parseDate(link.timestamp || link.createdAt);
      if (!date) return;
      const tags = (link.keywords && link.keywords.length > 0)
        ? link.keywords
        : (link.categoryId ? [link.categoryId] : []);
      tags.forEach((tag: string) => {
        const displayName = getCategoryName(tag);
        if (date >= cutoff) recentTags[displayName] = (recentTags[displayName] || 0) + 1;
        else if (date >= previousCutoff) olderTags[displayName] = (olderTags[displayName] || 0) + 1;
      });
    });

    const risingTrends: any[] = [];
    Object.keys(recentTags).forEach(tag => {
      const recent = recentTags[tag] || 0;
      const older = olderTags[tag] || 0;
      if (older > 0) {
        const change = Math.round(((recent - older) / older) * 100);
        if (Math.abs(change) > 10) {
          risingTrends.push({
            name: tag,
            change: `${change > 0 ? '+' : ''}${change}%`,
            type: change > 0 ? 'rising' : 'falling',
            recent,
            older,
            detail: language === 'ko'
              ? `${older}개 → ${recent}개`
              : `${older} → ${recent}`
          });
        }
      } else if (recent >= 2) {
        risingTrends.push({
          name: tag,
          change: language === 'ko' ? '신규' : 'NEW',
          type: 'rising',
          recent,
          older: 0,
          detail: language === 'ko' ? `이번 ${recent}개` : `${recent} new`
        });
      }
    });

    return { keywords: topKeywords, trends: risingTrends.slice(0, 5) };
  }, [links, language, period, categories]);

  const periodLabel = period === 'weekly'
    ? (language === 'ko' ? '이번 주' : 'This Week')
    : (language === 'ko' ? '이번 달' : 'This Month');

  return (
    <>
      {/* Keywords Card */}
      <div className={cn("border rounded-3xl p-6", theme.card, theme.cardBorder)}>
        <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme.text)}>
          <Hash className="w-4 h-4 text-[#21DBA4]" />
          {periodLabel} {language === 'ko' ? '키워드' : 'Keywords'}
        </h3>
        <div className="space-y-3">
          {keywords.length > 0 ? keywords.map((k: any, i: number) => (
            <div key={i} className={cn(
              "p-4 rounded-2xl border hover:border-[#21DBA4] cursor-pointer transition-colors",
              theme.itemBg, theme.border
            )}>
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-bold", theme.text)}>#{k.tag}</span>
                <span className="text-xs font-medium text-[#21DBA4]">{k.count}{language === 'ko' ? '회' : 'x'}</span>
              </div>
            </div>
          )) : (
            <div className={cn("p-4 rounded-2xl border text-center", theme.itemBg, theme.border)}>
              <span className={cn("text-xs", theme.textSub)}>{language === 'ko' ? '데이터 없음' : 'No data'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Trends Card */}
      <div className={cn("border rounded-3xl p-6", theme.card, theme.cardBorder)}>
        <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme.text)}>
          <TrendingUp className="w-4 h-4 text-[#21DBA4]" />
          {language === 'ko' ? '트렌드' : 'Trends'}
        </h3>
        <div className="space-y-3">
          {trends.length > 0 ? trends.map((t: any, i: number) => (
            <div key={i} className={cn(
              "p-4 rounded-2xl border transition-colors",
              theme.itemBg, theme.border
            )}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-bold truncate", theme.text)}>{t.name}</div>
                  <div className={cn("text-[10px]", t.type === 'rising' ? "text-blue-400" : "text-red-400")}>{t.detail}</div>
                </div>
                <span className={cn(
                  "text-xs font-bold shrink-0",
                  t.type === 'rising' ? "text-blue-400" : "text-red-400"
                )}>{t.change}</span>
              </div>
            </div>
          )) : (
            <div className={cn("p-4 rounded-2xl border text-center", theme.itemBg, theme.border)}>
              <span className={cn("text-xs", theme.textSub)}>{language === 'ko' ? '비교할 데이터가 부족합니다' : 'Need more data'}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════
// Content Studio - Reference Design (Hero Section)
// ═══════════════════════════════════════════════════

const ContentStudio = ({
  clips, selectedClips, onToggleClip, onSelectAll, contentTypes, selectedContentType,
  onSelectContentType, onGenerate, isGenerating, searchQuery, onSearchChange,
  filterTag, onFilterChange, availableTags,
  selectedKeywords, availableKeywords, categories, onToggleKeyword, onClearKeywords,
  startDate, endDate, onStartDateChange, onEndDateChange,
  onLoadClips, loadClipsWithDates, onClearResults, language, isDark, theme
}: any) => {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [previewClip, setPreviewClip] = useState<any>(null);

  return (
    <>
      {/* Clip Preview Modal */}
      {previewClip && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          onClick={() => setPreviewClip(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className={cn(
              "relative w-full max-w-2xl flex flex-col rounded-2xl shadow-2xl",
              isDark ? "bg-[#1E2228]" : "bg-white"
            )}
            style={{ maxHeight: 'min(720px, calc(100vh - 48px))' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn(
              "flex-none flex items-center justify-between px-5 py-4 border-b",
              isDark ? "border-gray-700" : "border-gray-200"
            )}>
              <h3 className={cn("text-base font-bold", isDark ? "text-white" : "text-gray-900")}>
                {language === 'ko' ? '클립 상세보기' : 'Clip Details'}
              </h3>
              <button
                onClick={() => setPreviewClip(null)}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded-md text-base transition-colors",
                  isDark ? "text-gray-500 hover:text-white hover:bg-gray-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                )}
              >
                ✕
              </button>
            </div>

            {/* Content - Only vertical scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="px-6 pt-6 pb-10 space-y-6">

                {/* Title */}
                <h4 className={cn(
                  "text-xl font-bold leading-snug break-words",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {previewClip.title || 'Untitled'}
                </h4>

                {/* Date + Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {previewClip.createdAt && (
                    <span className={cn(
                      "text-[11px] px-2 py-0.5 rounded",
                      isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                    )}>
                      {new Date(previewClip.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                  {previewClip.keywords?.slice(0, 3).map((k: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#21DBA4]/15 text-[#21DBA4] font-medium"
                    >
                      #{k}
                    </span>
                  ))}
                </div>

                {/* AI Summary */}
                {previewClip.summary && (
                  <div className={cn(
                    "p-4 rounded-lg",
                    isDark ? "bg-gray-800/60" : "bg-gray-50"
                  )}>
                    <p className={cn(
                      "text-xs font-semibold uppercase tracking-wide mb-2",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}>
                      {language === 'ko' ? 'AI 요약' : 'AI Summary'}
                    </p>
                    <p className={cn(
                      "text-sm leading-[1.7] break-words",
                      isDark ? "text-gray-300" : "text-gray-600"
                    )}>
                      {previewClip.summary}
                    </p>
                  </div>
                )}

                {/* Memo */}
                {previewClip.memo && (
                  <div className={cn(
                    "p-4 rounded-lg border-l-[3px] border-[#21DBA4]",
                    isDark ? "bg-[#21DBA4]/8" : "bg-[#21DBA4]/5"
                  )}>
                    <p className={cn(
                      "text-xs font-semibold uppercase tracking-wide mb-2",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}>
                      {language === 'ko' ? '내 메모' : 'My Notes'}
                    </p>
                    <p className={cn(
                      "text-sm leading-[1.7] break-words",
                      isDark ? "text-gray-300" : "text-gray-600"
                    )}>
                      {previewClip.memo}
                    </p>
                  </div>
                )}

                {/* Original Content */}
                {previewClip.content && (
                  <div className={cn(
                    "p-4 rounded-lg",
                    isDark ? "bg-gray-800/60" : "bg-gray-50"
                  )}>
                    <p className={cn(
                      "text-xs font-semibold uppercase tracking-wide mb-2",
                      isDark ? "text-gray-500" : "text-gray-400"
                    )}>
                      {language === 'ko' ? '원본 콘텐츠' : 'Original Content'}
                    </p>
                    <p className={cn(
                      "text-sm leading-[1.7] break-words whitespace-pre-line",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      {previewClip.content.substring(0, 500)}{previewClip.content.length > 500 ? '...' : ''}
                    </p>
                  </div>
                )}

                {/* URL */}
                {previewClip.url && (
                  <a
                    href={previewClip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block text-xs p-3 rounded-lg truncate",
                      isDark ? "bg-gray-800/60 text-[#21DBA4]" : "bg-gray-50 text-[#21DBA4]"
                    )}
                  >
                    🔗 {previewClip.url}
                  </a>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={cn(
              "flex-none flex items-center justify-end gap-2 px-5 py-4 border-t",
              isDark ? "border-gray-700" : "border-gray-200"
            )}>
              <button
                onClick={() => setPreviewClip(null)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {language === 'ko' ? '닫기' : 'Close'}
              </button>
              <button
                onClick={() => {
                  if (!selectedClips.includes(previewClip.id)) {
                    onToggleClip(previewClip.id);
                  }
                  setPreviewClip(null);
                }}
                disabled={selectedClips.includes(previewClip.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                  selectedClips.includes(previewClip.id)
                    ? isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-400"
                    : "bg-[#21DBA4] hover:bg-[#1bc490] text-black"
                )}
              >
                {selectedClips.includes(previewClip.id)
                  ? (language === 'ko' ? '✓ 선택됨' : '✓ Selected')
                  : (language === 'ko' ? '선택하기' : 'Select')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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

            {/* Search Bar */}
            <div className={cn("relative border rounded-2xl", theme.border)}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ko' ? '키워드로 클립 검색...' : 'Search clips by keyword...'}
                className={cn("w-full rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/50", theme.inputBg, theme.text)}
                value={searchQuery}
                onChange={(e: any) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Filter Section */}
            <div className="space-y-4">
              {/* Row 1: Period + Action Buttons */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-bold shrink-0", theme.textMuted)}>
                    {language === 'ko' ? '기간' : 'Period'}
                  </span>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: language === 'ko' ? '전체' : 'All' },
                      { id: 'today', label: language === 'ko' ? '오늘' : 'Today' },
                      { id: 'week', label: language === 'ko' ? '이번 주' : 'Week' },
                      { id: 'month', label: language === 'ko' ? '이번 달' : 'Month' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedPeriod(opt.id);
                          const now = new Date();
                          let newStart = '';
                          let newEnd = '';
                          if (opt.id === 'all') { newStart = ''; newEnd = ''; }
                          else if (opt.id === 'today') { newStart = now.toISOString().split('T')[0]; newEnd = newStart; }
                          else if (opt.id === 'week') { newStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; newEnd = now.toISOString().split('T')[0]; }
                          else if (opt.id === 'month') { newStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; newEnd = now.toISOString().split('T')[0]; }
                          onStartDateChange(newStart);
                          onEndDateChange(newEnd);
                          // Load clips with the new dates directly (bypasses stale state)
                          loadClipsWithDates(newStart, newEnd);
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          selectedPeriod === opt.id
                            ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                            : cn(
                              isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600",
                              "hover:border-[#21DBA4] hover:text-[#21DBA4]"
                            )
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearResults}
                    disabled={clips.length === 0}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors",
                      clips.length === 0
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-red-400 hover:text-red-400",
                      isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
                    )}
                  >
                    {language === 'ko' ? '초기화' : 'Clear'}
                  </button>
                  <button
                    onClick={onLoadClips}
                    className="px-4 py-1.5 bg-[#21DBA4] hover:bg-[#1bc490] text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.02] shadow-lg shadow-[#21DBA4]/20"
                  >
                    <RefreshCw size={12} /> {language === 'ko' ? '클립 불러오기' : 'Load Clips'}
                  </button>
                </div>
              </div>

              {/* Row 2: Categories */}
              {availableTags.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn("text-xs font-bold shrink-0", theme.textMuted)}>
                    {language === 'ko' ? '카테고리' : 'Category'}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onFilterChange('')}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                        !filterTag
                          ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                          : cn(
                            isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600",
                            "hover:border-[#21DBA4] hover:text-[#21DBA4]"
                          )
                      )}
                    >
                      {language === 'ko' ? '전체' : 'All'}
                    </button>
                    {availableTags.slice(0, 8).map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => onFilterChange(tag)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                          filterTag === tag
                            ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                            : cn(
                              isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600",
                              "hover:border-[#21DBA4] hover:text-[#21DBA4]"
                            )
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Filter Toggle */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium transition-colors",
                    showAdvancedFilter ? "text-[#21DBA4]" : theme.textMuted
                  )}
                >
                  <Filter size={12} />
                  {language === 'ko' ? '고급 필터' : 'Advanced Filters'}
                  <span className={cn("transition-transform", showAdvancedFilter && "rotate-180")}>▼</span>
                </button>

                {/* Active Filters Badge */}
                {selectedKeywords.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#21DBA4]/15 text-[#21DBA4] font-medium">
                      {selectedKeywords.length} {language === 'ko' ? '개 키워드' : 'keywords'}
                    </span>
                    <button
                      onClick={onClearKeywords}
                      className="text-xs text-red-400 hover:text-red-500 font-medium"
                    >
                      {language === 'ko' ? '초기화' : 'Clear'}
                    </button>
                  </div>
                )}
              </div>

              {/* Advanced Filter Panel */}
              {showAdvancedFilter && (
                <div className={cn(
                  "p-5 rounded-2xl border space-y-4",
                  isDark ? "bg-[#161B22] border-gray-800" : "bg-gray-50/50 border-gray-200"
                )}>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-bold", theme.text)}>
                      {language === 'ko' ? '키워드 필터' : 'Keyword Filter'}
                    </p>
                    {selectedKeywords.length > 0 && (
                      <button
                        onClick={onClearKeywords}
                        className="text-xs text-red-400 hover:text-red-500 font-medium"
                      >
                        {language === 'ko' ? '선택 해제' : 'Clear'}
                      </button>
                    )}
                  </div>

                  {availableKeywords.length === 0 ? (
                    <p className={cn("text-sm py-4 text-center", theme.textMuted)}>
                      {language === 'ko'
                        ? '먼저 클립을 불러오세요. 불러온 클립의 키워드가 여기에 표시됩니다.'
                        : 'Load clips first. Keywords from loaded clips will appear here.'}
                    </p>
                  ) : (
                    <>
                      <p className={cn("text-xs", theme.textMuted)}>
                        {language === 'ko'
                          ? `${availableKeywords.length}개 키워드 중 선택 (다중 선택 가능)`
                          : `Select from ${availableKeywords.length} keywords (multi-select)`}
                      </p>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto py-1">
                        {availableKeywords.slice(0, 40).map((kw: string) => (
                          <button
                            key={kw}
                            onClick={() => onToggleKeyword(kw)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                              selectedKeywords.includes(kw)
                                ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                                : cn(
                                  isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600",
                                  "hover:border-[#21DBA4] hover:text-[#21DBA4]"
                                )
                            )}
                          >
                            {selectedKeywords.includes(kw) && <span className="mr-1">✓</span>}
                            {kw}
                          </button>
                        ))}
                      </div>
                      {availableKeywords.length > 40 && (
                        <p className={cn("text-xs", theme.textSub)}>
                          +{availableKeywords.length - 40} {language === 'ko' ? '개 더...' : 'more...'}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Results Header with Selection Info */}
            <div className={cn("flex items-center justify-between py-3 px-1", theme.textMuted)}>
              <div className="flex items-center gap-3">
                <span className={cn("text-sm font-bold", theme.text)}>
                  {language === 'ko'
                    ? `검색 결과 ${clips.length}건`
                    : `${clips.length} clips found`}
                </span>
                {selectedClips.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#21DBA4]/15 text-[#21DBA4] font-bold">
                    {language === 'ko'
                      ? `${selectedClips.length}개 선택됨`
                      : `${selectedClips.length} selected`}
                  </span>
                )}
              </div>
              <button
                onClick={onSelectAll}
                disabled={clips.length === 0}
                className={cn(
                  "text-xs font-bold transition-colors",
                  clips.length === 0 ? "opacity-40 cursor-not-allowed" : "text-[#21DBA4] hover:underline"
                )}
              >
                {language === 'ko' ? '전체 선택' : 'Select All'}
              </button>
            </div>

            {/* Clip List */}
            <div className={cn("flex-1 border rounded-2xl overflow-hidden flex flex-col max-h-[320px]", theme.border)}>

              <div className={cn("overflow-y-auto flex-1", theme.itemBg)}>
                {clips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search size={24} className={cn("mb-3", theme.textSub)} />
                    <p className={cn("text-sm font-medium", theme.textMuted)}>{language === 'ko' ? '클립을 불러오세요' : 'Load clips to start'}</p>
                  </div>
                ) : clips.map((clip: any) => (
                  <div
                    key={clip.id}
                    className={cn(
                      "group/item flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-all",
                      selectedClips.includes(clip.id)
                        ? "bg-[#21DBA4]/5"
                        : theme.itemHover,
                      theme.border
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={() => onToggleClip(clip.id)}
                      className={cn("mt-1 transition-colors shrink-0", selectedClips.includes(clip.id) ? "text-[#21DBA4]" : "text-gray-400")}
                    >
                      {selectedClips.includes(clip.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0" onClick={() => onToggleClip(clip.id)}>
                      {/* Title */}
                      <h4 className={cn("text-sm font-bold truncate mb-1", selectedClips.includes(clip.id) ? theme.text : theme.textMuted)}>
                        {clip.title || 'Untitled'}
                      </h4>

                      {/* Summary Preview - 2 lines max */}
                      {(clip.summary || clip.memo) && (
                        <p className={cn("text-xs leading-relaxed mb-1.5 line-clamp-2", theme.textSub)}>
                          {clip.summary || clip.memo}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {clip.keywords?.slice(0, 3).map((keyword: string, idx: number) => (
                          <span
                            key={idx}
                            className={cn("text-[10px] px-1.5 py-0.5 rounded", isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500")}
                          >
                            #{keyword}
                          </span>
                        ))}
                        {clip.createdAt && (
                          <span className={cn("text-[10px]", theme.textSub)}>
                            {new Date(clip.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewClip(clip); }}
                      className={cn("p-2 rounded-lg transition-colors shrink-0 mt-1", isDark ? "text-gray-500 hover:text-white hover:bg-gray-700" : "text-gray-400 hover:text-black hover:bg-gray-200")}
                      title={language === 'ko' ? '클립 보기' : 'View clip'}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className={cn("border-t -mx-6 lg:-mx-8", theme.border)} />

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
                disabled={!selectedContentType || isGenerating}
                className={cn(
                  "mt-4 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                  selectedContentType
                    ? "bg-[#21DBA4] text-black hover:bg-[#1bc490] hover:scale-[1.02] shadow-lg shadow-[#21DBA4]/20"
                    : cn(isDark ? "bg-gray-800 text-gray-600" : "bg-gray-200 text-gray-400", "cursor-not-allowed")
                )}
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="animate-spin" />{language === 'ko' ? '생성 중...' : 'Generating...'}</>
                ) : (
                  <><Sparkles size={16} fill={selectedContentType ? "black" : "none"} />
                    {selectedContentType
                      ? (language === 'ko'
                        ? `${contentTypes.find((t: any) => t.id === selectedContentType)?.label} 생성하기`
                        : `Generate ${contentTypes.find((t: any) => t.id === selectedContentType)?.label}`)
                      : (language === 'ko' ? '옵션을 선택하세요' : 'Select an option')}</>
                )}
              </button>
            </div>
          </div>
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [studioClips, setStudioClips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Creation history - persisted in localStorage
  const [creationHistory, setCreationHistory] = useState<Array<{
    id: string;
    type: string;
    title: string;
    date: string;
    clipCount: number;
  }>>([]);

  // Load creation history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('linkbrain_creation_history');
    if (saved) {
      try {
        setCreationHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load creation history', e);
      }
    }
  }, []);

  const isDark = themeMode === 'dark';
  const theme = useTheme(isDark);

  useEffect(() => { setTimeout(() => setIsLoading(false), 300); }, []);

  const allActiveLinks = useMemo(() => links.filter(l => !l.isArchived), [links]);

  // Period filtered links - used by all charts
  const periodFilteredLinks = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'weekly' ? 7 : 30;
    const cutoff = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    return allActiveLinks.filter(l => {
      const d = parseDate(l.createdAt);
      return d && d >= cutoff;
    });
  }, [allActiveLinks, period]);

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

    // Category/Keyword engagement analysis - use category if keywords are empty
    const tagStats: Record<string, { total: number; read: number }> = {};
    allActiveLinks.forEach(l => {
      const isRead = !!l.lastViewedAt;
      // Use keywords if available, otherwise use category
      const tags = (l.keywords && l.keywords.length > 0) ? l.keywords : (l.categoryId ? [l.categoryId] : []);
      tags.forEach((tag: string) => {
        if (!tagStats[tag]) tagStats[tag] = { total: 0, read: 0 };
        tagStats[tag].total++;
        if (isRead) tagStats[tag].read++;
      });
    });

    // Sort tags by total count for display (more clips = more relevant)
    const tagEntries = Object.entries(tagStats).filter(([_, v]) => v.total >= 1);
    const sortedByEngagement = tagEntries.sort((a, b) => b[1].total - a[1].total);

    // Helper to get category name from ID
    const getCategoryName = (tagOrId: string): string => {
      // Check if it's a category ID by looking it up
      const cat = categories.find((c: any) => c.id === tagOrId);
      return cat?.name || tagOrId;
    };

    // Get top 5 tags for bar chart display
    const top5Tags = sortedByEngagement.slice(0, 5).map(([tag, stats]: [string, { total: number; read: number }]) => ({
      tag: getCategoryName(tag),
      rate: Math.round((stats.read / stats.total) * 100),
      total: stats.total
    }));

    return {
      stats: [
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
      ],
      tagReadingData: top5Tags
    };
  }, [allActiveLinks, period, language, onNavigateToUnread]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    allActiveLinks.forEach(l => (l.keywords || []).forEach((t: string) => tagSet.add(t)));
    return Array.from(tagSet).slice(0, 10);
  }, [allActiveLinks]);

  // Get all unique keywords from loaded clips for keyword multi-select
  const availableKeywords = useMemo(() => {
    console.log('[DEBUG] availableKeywords recalculating, studioClips:', studioClips.length);
    if (studioClips.length === 0) return [];

    const keywordSet = new Set<string>();

    // Add all category names that exist in the loaded clips
    const clipCategoryIds = new Set(studioClips.map(c => c.category).filter(Boolean));
    console.log('[DEBUG] clipCategoryIds:', Array.from(clipCategoryIds));
    console.log('[DEBUG] categories prop:', categories?.length, categories?.slice(0, 3));

    categories?.forEach((cat: any) => {
      if (clipCategoryIds.has(cat.id) && cat.name) {
        console.log('[DEBUG] Adding category name:', cat.name);
        keywordSet.add(cat.name);
      }
    });

    // Also add any keywords from clips if they exist
    studioClips.forEach(c => {
      (c.keywords || []).forEach((k: string) => {
        if (k && k.trim()) keywordSet.add(k.trim());
      });
    });

    const result = Array.from(keywordSet).sort();
    console.log('[DEBUG] availableKeywords result:', result);
    return result;
  }, [studioClips, categories]);

  const filteredClips = useMemo(() => {
    if (studioClips.length === 0) return [];
    let result = studioClips;
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.title?.toLowerCase().includes(q) || c.keywords?.some((t: string) => t.toLowerCase().includes(q)));
    }
    // Single category filter (legacy)
    if (studioFilterTag) {
      result = result.filter(c => c.keywords?.includes(studioFilterTag));
    }
    // Multi-select keyword filter (includes category name matching)
    if (selectedKeywords.length > 0) {
      result = result.filter(c => {
        // Check keywords array
        if (c.keywords?.some((kw: string) => selectedKeywords.includes(kw))) return true;
        // Check category name
        if (c.category) {
          const cat = categories?.find((cat: any) => cat.id === c.category);
          if (cat?.name && selectedKeywords.includes(cat.name)) return true;
        }
        return false;
      });
    }
    return result.slice(0, 50);
  }, [studioClips, searchQuery, studioFilterTag, selectedKeywords, categories]);

  const handleLoadClips = useCallback(() => {
    let result = allActiveLinks;
    if (studioStartDate || studioEndDate) {
      result = result.filter(clip => { const d = parseDate(clip.createdAt); if (!d) return false; const clipDate = d.toISOString().split('T')[0]; if (studioStartDate && clipDate < studioStartDate) return false; if (studioEndDate && clipDate > studioEndDate) return false; return true; });
    }
    setStudioClips(result);
    setSelectedClips([]);
    setSelectedKeywords([]);
    toast.success(language === 'ko' ? `${result.length}개의 클립을 불러왔습니다` : `Loaded ${result.length} clips`);
  }, [allActiveLinks, studioStartDate, studioEndDate, language]);

  // Load clips with specific dates (bypasses stale state issue)
  const loadClipsWithDates = useCallback((startDate: string, endDate: string) => {
    console.log('[DEBUG] loadClipsWithDates called with:', { startDate, endDate });
    console.log('[DEBUG] allActiveLinks count:', allActiveLinks.length);

    let result = allActiveLinks;
    if (startDate || endDate) {
      result = result.filter(clip => {
        const d = parseDate(clip.createdAt);
        if (!d) {
          console.log('[DEBUG] parseDate returned null for:', clip.createdAt);
          return false;
        }
        const clipDate = d.toISOString().split('T')[0];
        const include = (!startDate || clipDate >= startDate) && (!endDate || clipDate <= endDate);
        if (!include && result.length < 5) {
          console.log('[DEBUG] Excluded clip:', { clipDate, startDate, endDate, createdAt: clip.createdAt });
        }
        return include;
      });
    }

    console.log('[DEBUG] Filtered result count:', result.length);
    console.log('[DEBUG] Categories available:', categories?.length);

    setStudioClips(result);
    setSelectedClips([]);
    setSelectedKeywords([]);
    toast.success(language === 'ko' ? `${result.length}개의 클립을 불러왔습니다` : `Loaded ${result.length} clips`);
  }, [allActiveLinks, language, categories]);

  const toggleClipSelection = useCallback((id: string) => { setSelectedClips(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]); }, []);
  const selectAllClips = useCallback(() => { setSelectedClips(filteredClips.map(c => c.id)); }, [filteredClips]);
  const clearResults = useCallback(() => {
    setStudioClips([]);
    setSelectedClips([]);
    toast.success(language === 'ko' ? '검색 결과가 초기화되었습니다' : 'Results cleared');
  }, [language]);

  const handleGenerate = useCallback(async () => {
    if (!selectedContentType || selectedClips.length === 0) return;
    setGeneratingReport(true);
    toast.loading(language === 'ko' ? '콘텐츠 생성 중...' : 'Generating...');

    // Get selected clip titles for generating content title
    const selectedClipData = studioClips.filter(c => selectedClips.includes(c.id));
    const mainTopic = selectedClipData[0]?.keywords?.[0] || selectedClipData[0]?.title?.slice(0, 20) || 'Content';

    const typeLabels: Record<string, { ko: string, en: string }> = {
      report: { ko: '리포트', en: 'Report' },
      article: { ko: '아티클', en: 'Article' },
      planning: { ko: '기획서', en: 'Planning' },
      trend: { ko: '트렌드 분석', en: 'Trend Analysis' },
    };

    // Simulate generation (in real implementation, call AI API here)
    setTimeout(() => {
      setGeneratingReport(false);
      toast.dismiss();
      toast.success(language === 'ko' ? '콘텐츠가 생성되었습니다!' : 'Content generated!');

      // Save to creation history
      const newEntry = {
        id: `gen_${Date.now()}`,
        type: typeLabels[selectedContentType]?.[language === 'ko' ? 'ko' : 'en'] || selectedContentType,
        title: `${mainTopic} ${typeLabels[selectedContentType]?.[language === 'ko' ? 'ko' : 'en'] || ''}`,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', ''),
        clipCount: selectedClips.length,
      };

      setCreationHistory(prev => {
        const updated = [newEntry, ...prev].slice(0, 10); // Keep last 10
        localStorage.setItem('linkbrain_creation_history', JSON.stringify(updated));
        return updated;
      });

      // Reset selection
      setSelectedClips([]);
      setSelectedContentType(null);
    }, 2000);
  }, [selectedContentType, selectedClips, studioClips, language]);

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

        {/* Date Filter - Rounded Pill Style */}
        <div className={cn("flex items-center border rounded-full p-1.5 shadow-sm", theme.card, theme.border)}>
          {[
            { key: 'weekly' as Period, label: language === 'ko' ? '이번 주' : 'This Week' },
            { key: 'monthly' as Period, label: language === 'ko' ? '이번 달' : 'This Month' },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                period === p.key
                  ? "bg-[#21DBA4]/20 text-[#21DBA4]"
                  : cn(theme.text, "hover:bg-gray-100 dark:hover:bg-gray-800")
              )}
            >
              {p.label}
            </button>
          ))}
          <button className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all",
            theme.text, "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}>
            <Calendar size={16} />
            {language === 'ko' ? '기간 지정' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Grid System */}
      <div className="grid grid-cols-12 gap-6 mb-8">

        {/* Stats Row - 2 columns */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {statsData.stats.map((stat: any, idx: number) => (
            <StatCard key={idx} {...stat} isDark={isDark} theme={theme} />
          ))}
        </div>
        <TagReadingRateCard tagData={statsData.tagReadingData} isDark={isDark} theme={theme} language={language} />

        {/* Analysis Row: Heatmap */}
        <SavePatternHeatmapCard links={allActiveLinks} isDark={isDark} theme={theme} language={language} period={period} />

        {/* Interest + Keywords + Trends Row - 3 columns */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InterestEvolutionCard links={allActiveLinks} allLinks={allActiveLinks} isDark={isDark} theme={theme} language={language} period={period} categories={categories} />
          <KeywordsTrendsCard links={allActiveLinks} isDark={isDark} theme={theme} language={language} period={period} categories={categories} />
        </div>

        {/* Content Studio */}
        <ContentStudio
          clips={filteredClips} selectedClips={selectedClips} onToggleClip={toggleClipSelection} onSelectAll={selectAllClips}
          contentTypes={contentTypes} selectedContentType={selectedContentType} onSelectContentType={(id: any) => setSelectedContentType(id as ContentType)}
          onGenerate={handleGenerate} isGenerating={generatingReport} searchQuery={searchQuery} onSearchChange={setSearchQuery}
          filterTag={studioFilterTag} onFilterChange={setStudioFilterTag} availableTags={availableTags}
          selectedKeywords={selectedKeywords} availableKeywords={availableKeywords} categories={categories}
          onToggleKeyword={(kw: string) => setSelectedKeywords(prev => prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw])}
          onClearKeywords={() => setSelectedKeywords([])}
          startDate={studioStartDate} endDate={studioEndDate} onStartDateChange={setStudioStartDate} onEndDateChange={setStudioEndDate}
          onLoadClips={handleLoadClips} loadClipsWithDates={loadClipsWithDates} onClearResults={clearResults} language={language} isDark={isDark} theme={theme}
        />

        {/* Creation History */}
        {creationHistory.length > 0 && (
          <div className={cn("col-span-12 border rounded-3xl p-6", theme.card, theme.cardBorder)}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
                <FileBarChart className="w-4 h-4 text-gray-400" />
                {language === 'ko' ? '생성 기록' : 'Creation History'}
              </h3>
              <button
                onClick={() => {
                  setCreationHistory([]);
                  localStorage.removeItem('linkbrain_creation_history');
                }}
                className={cn("text-xs transition-colors", theme.textSub, "hover:text-red-500")}
              >
                {language === 'ko' ? '전체 삭제' : 'Clear All'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {creationHistory.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 border rounded-xl transition-colors flex items-center justify-between group",
                    isDark ? "bg-gray-800/30 border-gray-800 hover:bg-gray-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-lg",
                      item.type.includes('리포트') || item.type.includes('Report') ? "bg-blue-500/10 text-blue-500" :
                        item.type.includes('아티클') || item.type.includes('Article') ? "bg-green-500/10 text-green-500" :
                          item.type.includes('기획서') || item.type.includes('Planning') ? "bg-purple-500/10 text-purple-500" :
                            "bg-orange-500/10 text-orange-500"
                    )}>
                      {item.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={cn("text-sm font-medium truncate block", isDark ? "text-gray-300" : "text-gray-700")}>
                        {item.title}
                      </span>
                      <span className={cn("text-[10px]", theme.textSub)}>
                        {item.date} · {item.clipCount}{language === 'ko' ? '개 클립' : ' clips'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className={cn(theme.textSub, "group-hover:text-[#21DBA4]")} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default AIInsightsDashboard;
