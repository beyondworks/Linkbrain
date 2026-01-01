import { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  Zap,
  ShieldCheck,
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
  ChevronDown,
  Loader2,
  Eye,
  Layout,
  TrendingUp,
  TrendingDown,
  Hash,
  Inbox,
  Calendar as CalendarIcon,
  ArrowUpDown
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DateRange } from "react-day-picker";
import { addDays, subDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { StatCard } from './AIInsightsDashboard/StatCard';
import { TagReadingRateCard } from './AIInsightsDashboard/TagReadingRateCard';
import { generateStudioContent, StudioContentType } from '../lib/aiService';
import { getSourceInfo } from './app/Cards';

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
  bg: isDark ? 'bg-[#121212]' : 'bg-[#F9FAFB]',
  text: isDark ? 'text-white' : 'text-gray-900',
  textMuted: isDark ? 'text-neutral-400' : 'text-gray-500',
  textSub: isDark ? 'text-neutral-500' : 'text-gray-400',
  card: isDark ? 'bg-[#1E1E1E]' : 'bg-white',
  cardBorder: isDark ? 'border-[#454545]' : 'border-gray-200',
  cardBorderStyle: isDark ? { borderColor: '#454545' } : {},
  cardHover: isDark ? 'hover:border-[#555555]' : 'hover:border-gray-300',
  itemBg: isDark ? 'bg-[#131313]' : 'bg-gray-50',
  itemHover: isDark ? 'hover:bg-[#2D2D2D]' : 'hover:bg-gray-100',
  border: isDark ? 'border-[#454545]' : 'border-gray-200',
  borderStyle: isDark ? { borderColor: '#454545' } : {},
  divider: isDark ? 'bg-[#2D2D2D]' : 'bg-gray-200',
  inputBg: isDark ? 'bg-[#131313]' : 'bg-white',
  // Modal-specific tokens (inline style values)
  modal: {
    bg: isDark ? '#1A1A1A' : '#FFFFFF',
    border: isDark ? '#454545' : '#E5E7EB',
    sectionBg: isDark ? '#2A2A2A' : '#F9FAFB',
    memoBg: isDark ? 'rgba(33, 219, 164, 0.12)' : 'rgba(33, 219, 164, 0.05)',
    title: isDark ? '#FFFFFF' : '#111827',
    label: isDark ? '#A1A1AA' : '#6B7280',
    body: isDark ? '#E4E4E7' : '#4B5563',
    muted: isDark ? '#D4D4D8' : '#6B7280',
    badgeBg: isDark ? '#3F3F46' : '#F3F4F6',
    badgeText: isDark ? '#A1A1AA' : '#6B7280',
  },
  isDark,
});

// ═══════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════

const parseDate = (createdAt: any): Date | null => {
  if (!createdAt) return null;
  if (createdAt.seconds) return new Date(createdAt.seconds * 1000);
  if (createdAt.toDate) return createdAt.toDate();

  // Custom Korean format check with robust regex
  // Matches: '2025년 12월 22일 AM 4시...', '2025년 12월 22일 오전 4시...'
  if (typeof createdAt === 'string' && createdAt.includes('년')) {
    const regex = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(AM|PM|오전|오후)\s*(\d{1,2})시\s*(\d{1,2})분\s*(\d{1,2})초/;
    const match = createdAt.match(regex);
    if (match) {
      let [_, year, month, day, meridian, hour, minute, second] = match;
      let h = parseInt(hour, 10);

      // Handle 12-hour format konversion
      if (meridian === 'PM' || meridian === '오후') {
        if (h < 12) h += 12;
      }
      if (meridian === 'AM' || meridian === '오전') {
        if (h === 12) h = 0;
      }

      const pad = (n: string | number) => String(n).padStart(2, '0');
      // Construct ISO string with KST offset (+09:00) 
      const isoStr = `${year}-${pad(month)}-${pad(day)}T${pad(h)}:${pad(minute)}:${pad(second)}+09:00`;
      const d = new Date(isoStr);

      // Debug log for verification
      console.log(`[parseDate] Parsed KST Date: ${createdAt} -> ${isoStr} -> ${d.toISOString()}`);

      return isNaN(d.getTime()) ? null : d;
    }
  }

  // Handle number timestamp
  if (typeof createdAt === 'number') {
    const d = new Date(createdAt);
    return isNaN(d.getTime()) ? null : d;
  }

  // Handle "YYYY. MM. DD." format
  if (typeof createdAt === 'string' && /^\d{4}\.\s*\d{1,2}\.\s*\d{1,2}\.?$/.test(createdAt.trim())) {
    const parts = createdAt.split('.').map(s => s.trim()).filter(Boolean);
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const d = new Date(createdAt);
  return isNaN(d.getTime()) ? null : d;
};

// Helper: Get 'YYYY-MM-DD' string in local time
const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toLocaleString();
};

// StatCard is now imported from ./AIInsightsDashboard/StatCard

// TagReadingRateCard is now imported from ./AIInsightsDashboard/TagReadingRateCard

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
    <div className={cn("col-span-12 lg:col-span-4 border rounded-3xl p-4 flex flex-col h-full overflow-visible", theme.card, theme.cardBorder)} style={theme.cardBorderStyle}>
      {/* Inner Container for better visibility */}
      <div
        className="rounded-2xl p-4 flex-1 flex flex-col"
        style={{ backgroundColor: isDark ? '#131313' : '#f9fafb' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
            <Clock className="w-4 h-4 text-[#21DBA4]" />
            {language === 'ko' ? '수집 패턴' : 'Save Pattern'}
          </h3>
          <span className={cn("text-xs px-2 py-0.5 rounded-full", theme.textMuted)} style={{ backgroundColor: isDark ? '#333333' : '#f3f4f6' }}>
            {heatmapData.totalClips}{language === 'ko' ? '개' : ' clips'}
          </span>
        </div>
        <Tooltip.Provider delayDuration={100}>
          <div className="flex-1 flex flex-col justify-center gap-2">
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
                                ? (isDark ? '#2D2D2D' : '#E5E7EB')
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
                              isDark ? "bg-[#131313] text-white border-[#454545]" : "bg-white text-gray-900 border-gray-200"
                            )}
                          >
                            <div className="font-bold mb-1">{day} {startHour}:00~{endHour}:00</div>
                            <div className="text-[#21DBA4] font-bold">{val}{language === 'ko' ? '개 클립' : ' clips'}</div>
                            <Tooltip.Arrow className={isDark ? "fill-[#131313]" : "fill-white"} />
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
    <div className={cn("border rounded-3xl p-4 flex flex-col", theme.card, theme.cardBorder)} style={theme.cardBorderStyle}>
      {/* Inner Container for better visibility */}
      <div
        className="rounded-2xl p-4 flex-1 flex flex-col"
        style={{ backgroundColor: isDark ? '#131313' : '#f9fafb' }}
      >
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
                item.active ? "border-[#21DBA4]/30" : theme.border
              )}
              style={{
                ...(!item.active ? theme.borderStyle : {}),
                backgroundColor: item.active
                  ? (isDark ? 'rgba(33, 219, 164, 0.05)' : 'rgba(33, 219, 164, 0.05)')
                  : (isDark ? '#1E1E1E' : 'white')
              }}
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
    </div>
  );
};

// ═══════════════════════════════════════════════════
// Keywords & Trends Sidebar - Reference Design
// ═══════════════════════════════════════════════════

const KeywordsCard = ({ links, isDark, theme, language, period, categories }: any) => {
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
      <div className={cn("border rounded-3xl p-4 h-full", theme.card, theme.cardBorder)} style={theme.cardBorderStyle}>
        {/* Inner Container for better visibility */}
        <div
          className="rounded-2xl p-4 h-full"
          style={{ backgroundColor: isDark ? '#131313' : '#f9fafb' }}
        >
          <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme.text)}>
            <Hash className="w-4 h-4 text-[#21DBA4]" />
            {periodLabel} {language === 'ko' ? '키워드' : 'Keywords'}
          </h3>
          <div className="space-y-3">
            {keywords.length > 0 ? keywords.map((k: any, i: number) => (
              <div key={i} className={cn(
                "p-4 rounded-2xl border hover:border-[#21DBA4] cursor-pointer transition-colors",
                theme.border
              )} style={{ ...theme.borderStyle, backgroundColor: isDark ? '#1E1E1E' : 'white' }}>
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-bold", theme.text)}>#{k.tag}</span>
                  <span className="text-xs font-medium text-[#21DBA4]">{k.count}{language === 'ko' ? '회' : 'x'}</span>
                </div>
              </div>
            )) : (
              <div className={cn("p-4 rounded-2xl border text-center", theme.border)} style={{ ...theme.borderStyle, backgroundColor: isDark ? '#1E1E1E' : 'white' }}>
                <span className={cn("text-xs", theme.textSub)}>{language === 'ko' ? '데이터 없음' : 'No data'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const TrendsCard = ({ links, isDark, theme, language = 'ko', categories, period = 'weekly' }: any) => {
  // Theme is now passed directly as an object, matching other cards

  const { trends } = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'weekly' ? 7 : 30;
    const cutoff = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const previousCutoff = new Date(cutoff.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const recentTags: Record<string, number> = {};
    const olderTags: Record<string, number> = {};

    links.forEach((link: any) => {
      const date = parseDate(link.timestamp || link.createdAt);
      if (!date) return;
      const tags = (link.keywords && link.keywords.length > 0)
        ? link.keywords
        : (link.categoryId ? [link.categoryId] : []);
      tags.forEach((tag: string) => {
        const displayName = categories.find((c: any) => c.id === tag)?.name || tag;
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
            detail: language === 'ko' ? `${older}개 → ${recent}개` : `${older} → ${recent}`
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

    return { trends: risingTrends.slice(0, 5) };
  }, [links, language, period, categories]);

  return (
    <div className={cn("border rounded-3xl p-4 h-full", theme.card, theme.cardBorder)} style={theme.cardBorderStyle}>
      {/* Inner Container for better visibility */}
      <div
        className="rounded-2xl p-4 h-full"
        style={{ backgroundColor: isDark ? '#131313' : '#f9fafb' }}
      >
        <h3 className={cn("text-sm font-bold mb-4 flex items-center gap-2", theme.text)}>
          <TrendingUp className="w-4 h-4 text-[#21DBA4]" />
          {language === 'ko' ? '트렌드' : 'Trends'}
        </h3>
        <div className="space-y-3">
          {trends.length > 0 ? trends.map((t: any, i: number) => (
            <div key={i} className={cn(
              "p-4 rounded-2xl border transition-colors",
              theme.border
            )} style={{ ...theme.borderStyle, backgroundColor: isDark ? '#1E1E1E' : 'white' }}>
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
            <div className={cn("p-4 rounded-2xl border text-center", theme.border)} style={{ ...theme.borderStyle, backgroundColor: isDark ? '#1E1E1E' : 'white' }}>
              <span className={cn("text-xs", theme.textSub)}>{language === 'ko' ? '비교할 데이터가 부족합니다' : 'Need more data'}</span>
            </div>
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
  startDate, endDate, onStartDateChange, onEndDateChange,
  onLoadClips, loadClipsWithDates, onClearResults, language, isDark, theme,
  // 정렬 props
  clipSortOrder, onSortOrderChange,
  // 필터 props
  availableSources, selectedSources, onToggleSource, onClearSources,
  allAvailableCategories, selectedCategories, onToggleCategory, onClearCategories,
  // 생성 결과
  generatedContent, onClearContent
}: any) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [previewClip, setPreviewClip] = useState<any>(null);

  // Debug: Log previewClip data when it changes
  useEffect(() => {
    if (previewClip) {
      console.log('[Modal Debug] previewClip fields:', Object.keys(previewClip));
      console.log('[Modal Debug] previewClip.summary:', previewClip.summary?.substring(0, 100));
      console.log('[Modal Debug] previewClip.content:', previewClip.content?.substring(0, 100));
    }
  }, [previewClip]);

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
            className="relative w-full max-w-2xl flex flex-col rounded-2xl shadow-2xl border"
            style={{
              maxHeight: 'min(720px, calc(100vh - 48px))',
              backgroundColor: theme.modal.bg,
              borderColor: theme.modal.border
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex-none flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: theme.modal.border }}
            >
              <h3
                className="text-base font-bold"
                style={{ color: theme.modal.title }}
              >
                {language === 'ko' ? '클립 상세보기' : 'Clip Details'}
              </h3>
              <button
                onClick={() => setPreviewClip(null)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-base transition-colors hover:bg-white/10"
                style={{ color: theme.modal.label }}
              >
                ✕
              </button>
            </div>

            {/* Content - Only vertical scroll */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden"
              style={{ color: theme.modal.body }}
            >
              <div className="px-6 pt-6 pb-10 space-y-6">

                {/* Title */}
                <h4
                  className="text-xl font-bold leading-snug break-words"
                  style={{ color: theme.modal.title }}
                >
                  {previewClip.title || 'Untitled'}
                </h4>

                {/* Date + Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {previewClip.createdAt && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: theme.modal.badgeBg,
                        color: theme.modal.badgeText
                      }}
                    >
                      {new Date(previewClip.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                  {previewClip.keywords?.slice(0, 3).map((k: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded font-medium"
                      style={{ backgroundColor: 'rgba(33, 219, 164, 0.15)', color: '#21DBA4' }}
                    >
                      #{k}
                    </span>
                  ))}
                </div>

                {/* AI 핵심 요약 */}
                {previewClip.summary && (
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: theme.modal.sectionBg }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} style={{ color: '#21DBA4' }} />
                      <p
                        className="text-sm font-bold"
                        style={{ color: theme.modal.title }}
                      >
                        {language === 'ko' ? 'AI 핵심 요약' : 'AI Summary'}
                      </p>
                    </div>
                    <p
                      className="text-sm leading-[1.7] break-words whitespace-pre-line"
                      style={{ color: theme.modal.body }}
                    >
                      {previewClip.summary}
                    </p>
                  </div>
                )}

                {/* Content - 원문 내용 */}
                {previewClip.content && (
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: theme.modal.sectionBg }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={16} style={{ color: theme.modal.label }} />
                      <p
                        className="text-sm font-bold"
                        style={{ color: theme.modal.title }}
                      >
                        Content
                      </p>
                    </div>
                    <p
                      className="text-sm leading-[1.7] break-words whitespace-pre-line"
                      style={{ color: theme.modal.body }}
                    >
                      {previewClip.content.length > 1500
                        ? previewClip.content.substring(0, 1500) + '...'
                        : previewClip.content
                      }
                    </p>
                  </div>
                )}

                {/* Memo */}
                {previewClip.notes && (
                  <div
                    className="p-4 rounded-lg border-l-[3px] border-[#21DBA4]"
                    style={{ backgroundColor: theme.modal.memoBg }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: theme.modal.label }}
                    >
                      {language === 'ko' ? '내 메모' : 'My Notes'}
                    </p>
                    <p
                      className="text-sm leading-[1.7] break-words"
                      style={{ color: theme.modal.body }}
                    >
                      {previewClip.notes}
                    </p>
                  </div>
                )}

                {/* URL */}
                {previewClip.url && (
                  <a
                    href={previewClip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs p-3 rounded-lg truncate hover:underline"
                    style={{
                      backgroundColor: theme.modal.sectionBg,
                      color: '#21DBA4'
                    }}
                  >
                    🔗 {previewClip.url}
                  </a>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex-none flex items-center justify-end gap-2 px-5 py-4 border-t"
              style={{ borderColor: theme.modal.border }}
            >
              <button
                onClick={() => setPreviewClip(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                style={{
                  color: theme.modal.body,
                  borderColor: theme.modal.border,
                  backgroundColor: 'transparent'
                }}
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
        isDark ? "from-[#1E1E1E] to-[#121212]" : "from-gray-50 to-white",
        theme.cardBorder
      )} style={theme.cardBorderStyle}>
        {/* Gradient Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#21DBA4] blur-[180px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700" />

        <div
          className="backdrop-blur-sm rounded-[20px] p-6 lg:p-8 h-full"
          style={{ backgroundColor: isDark ? 'rgba(18, 18, 18, 0.5)' : 'rgba(255, 255, 255, 0.8)' }}
        >
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
            <div className={cn("relative border rounded-2xl", theme.border)} style={theme.borderStyle}>
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
            <div className="space-y-2 md:space-y-4">
              {/* Row 1: Period + Action Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">

                {/* Desktop: Period & Actions */}
                <div className="hidden md:flex items-center justify-between w-full">
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

                            if (opt.id === 'all') {
                              newStart = '';
                              newEnd = '';
                            } else if (opt.id === 'today') {
                              newStart = getLocalDateString(now);
                              newEnd = newStart;
                            } else if (opt.id === 'week') {
                              const weekAgo = new Date(now);
                              weekAgo.setDate(now.getDate() - 7);
                              newStart = getLocalDateString(weekAgo);
                              newEnd = getLocalDateString(now);
                            } else if (opt.id === 'month') {
                              const monthAgo = new Date(now);
                              monthAgo.setDate(now.getDate() - 30);
                              newStart = getLocalDateString(monthAgo);
                              newEnd = getLocalDateString(now);
                            }

                            onStartDateChange(newStart);
                            onEndDateChange(newEnd);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                            selectedPeriod === opt.id
                              ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                              : cn(
                                isDark ? "bg-gray-800 border-[#454545] text-gray-300" : "bg-white border-gray-200 text-gray-600",
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
                        isDark ? "border-[#454545] text-gray-400" : "border-gray-200 text-gray-500"
                      )}
                    >
                      {language === 'ko' ? '초기화' : 'Clear'}
                    </button>
                    <button
                      onClick={onLoadClips}
                      className="px-4 py-1.5 bg-[#21DBA4] hover:bg-[#1bc490] text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                    >
                      <RefreshCw size={12} /> {language === 'ko' ? '클립 불러오기' : 'Load Clips'}
                    </button>
                  </div>
                </div>

                {/* Mobile: Period Dropdown (Accordion) */}
                <details className={cn("md:hidden group w-full border rounded-xl overflow-hidden", isDark ? "bg-[#1E1E1E] border-[#454545]" : "bg-white border-gray-200")}>
                  <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                    <span className={cn("text-xs font-bold", theme.textMuted)}>
                      {language === 'ko' ? '기간' : 'Period'}: <span className="text-[#21DBA4] ml-1">{
                        selectedPeriod === 'all' ? (language === 'ko' ? '전체' : 'All') :
                          selectedPeriod === 'today' ? (language === 'ko' ? '오늘' : 'Today') :
                            selectedPeriod === 'week' ? (language === 'ko' ? '이번 주' : 'Week') :
                              selectedPeriod === 'month' ? (language === 'ko' ? '이번 달' : 'Month') : ''
                      }</span>
                    </span>
                    <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="p-3 pt-0 flex gap-2 overflow-x-auto pb-3">
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
                          else if (opt.id === 'today') { newStart = getLocalDateString(now); newEnd = newStart; }
                          else if (opt.id === 'week') { const d = new Date(now); d.setDate(now.getDate() - 7); newStart = getLocalDateString(d); newEnd = getLocalDateString(now); }
                          else if (opt.id === 'month') { const d = new Date(now); d.setDate(now.getDate() - 30); newStart = getLocalDateString(d); newEnd = getLocalDateString(now); }
                          onStartDateChange(newStart);
                          onEndDateChange(newEnd);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-bold border shrink-0 transition-all",
                          selectedPeriod === opt.id
                            ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                            : cn(isDark ? "bg-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-600", "hover:border-[#21DBA4]")
                        )}
                        style={selectedPeriod !== opt.id && isDark ? { borderColor: '#454545' } : undefined}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </details>
              </div>

              {/* Row 2: 출처 필터 */}
              {availableSources && availableSources.length > 0 && (
                <>
                  {/* Desktop Source */}
                  <div className="hidden md:flex items-start gap-3 flex-wrap">
                    <span className={cn("text-xs font-bold shrink-0 pt-1.5", theme.textMuted)}>
                      {language === 'ko' ? '출처' : 'Source'}
                    </span>
                    <div className="flex gap-2 flex-wrap flex-1">
                      {availableSources.map((src: any) => (
                        <button
                          key={src.group}
                          onClick={() => onToggleSource(src.group)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                            selectedSources.includes(src.group)
                              ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                              : cn(
                                isDark ? "bg-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-600",
                                "hover:border-[#21DBA4] hover:text-[#21DBA4]"
                              )
                          )}
                          style={!selectedSources.includes(src.group) && isDark ? { borderColor: '#454545' } : undefined}
                        >
                          {src.group} <span className="opacity-60">({src.count})</span>
                        </button>
                      ))}
                      {selectedSources.length > 0 && (
                        <button
                          onClick={onClearSources}
                          className="text-xs text-red-400 hover:text-red-500 font-medium px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Source Dropdown */}
                  <details className={cn("md:hidden group w-full border rounded-xl overflow-hidden", isDark ? "bg-[#1E1E1E] border-[#454545]" : "bg-white border-gray-200")}>
                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                      <span className={cn("text-xs font-bold", theme.textMuted)}>
                        {language === 'ko' ? '출처' : 'Source'} {selectedSources.length > 0 && <span className="text-[#21DBA4]">({selectedSources.length})</span>}
                      </span>
                      <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="p-3 pt-0 flex flex-wrap gap-2">
                      {availableSources.map((src: any) => (
                        <button
                          key={src.group}
                          onClick={() => onToggleSource(src.group)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                            selectedSources.includes(src.group)
                              ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                              : cn(isDark ? "bg-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-600", "hover:border-[#21DBA4]")
                          )}
                          style={!selectedSources.includes(src.group) && isDark ? { borderColor: '#454545' } : undefined}
                        >
                          {src.group} <span className="opacity-60">({src.count})</span>
                        </button>
                      ))}
                    </div>
                  </details>
                </>
              )}

              {/* Row 3: 카테고리 필터 */}
              {allAvailableCategories && allAvailableCategories.length > 0 && (
                <>
                  {/* Desktop Category */}
                  <div className="hidden md:flex items-start gap-3 flex-wrap">
                    <span className={cn("text-xs font-bold shrink-0 pt-1.5", theme.textMuted)}>
                      {language === 'ko' ? '카테고리' : 'Category'}
                    </span>
                    <div className="flex gap-2 flex-wrap flex-1">
                      {allAvailableCategories.map((cat: any) => (
                        <button
                          key={cat.id}
                          onClick={() => onToggleCategory(cat.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                            selectedCategories.includes(cat.id)
                              ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                              : cn(
                                isDark ? "bg-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-600",
                                "hover:border-[#21DBA4] hover:text-[#21DBA4]"
                              )
                          )}
                          style={!selectedCategories.includes(cat.id) && isDark ? { borderColor: '#454545' } : undefined}
                        >
                          {cat.name} <span className="opacity-60">({cat.count})</span>
                        </button>
                      ))}
                      {selectedCategories.length > 0 && (
                        <button
                          onClick={onClearCategories}
                          className="text-xs text-red-400 hover:text-red-500 font-medium px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Category Dropdown */}
                  <details className={cn("md:hidden group w-full border rounded-xl overflow-hidden", isDark ? "bg-[#1E1E1E] border-[#454545]" : "bg-white border-gray-200")}>
                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                      <span className={cn("text-xs font-bold", theme.textMuted)}>
                        {language === 'ko' ? '카테고리' : 'Category'} {selectedCategories.length > 0 && <span className="text-[#21DBA4]">({selectedCategories.length})</span>}
                      </span>
                      <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="p-3 pt-0 flex flex-wrap gap-2">
                      {allAvailableCategories.map((cat: any) => (
                        <button
                          key={cat.id}
                          onClick={() => onToggleCategory(cat.id)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                            selectedCategories.includes(cat.id)
                              ? "bg-[#21DBA4] text-black border-[#21DBA4]"
                              : cn(isDark ? "bg-gray-800 text-gray-300" : "bg-white border-gray-200 text-gray-600", "hover:border-[#21DBA4]")
                          )}
                          style={!selectedCategories.includes(cat.id) && isDark ? { borderColor: '#454545' } : undefined}
                        >
                          {cat.name} <span className="opacity-60">({cat.count})</span>
                        </button>
                      ))}
                    </div>
                  </details>
                </>
              )}

              {/* Mobile Action Buttons (Bottom of Filters) */}
              <div
                className={cn("flex md:hidden items-center gap-2 mt-4 pt-2 border-t", isDark ? "" : "border-gray-200")}
                style={isDark ? { borderColor: '#454545' } : undefined}
              >
                <button
                  onClick={onClearResults}
                  disabled={clips.length === 0}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors",
                    clips.length === 0
                      ? "opacity-40 cursor-not-allowed bg-gray-50 dark:bg-gray-800 text-gray-400 border-transparent"
                      : "hover:border-red-400 hover:text-red-400 bg-white dark:bg-gray-900",
                    isDark ? "text-gray-400" : "border-gray-200 text-gray-500"
                  )}
                  style={clips.length !== 0 && isDark ? { borderColor: '#454545' } : undefined}
                >
                  {language === 'ko' ? '초기화' : 'Clear'}
                </button>
                <button
                  onClick={onLoadClips}
                  className="flex-[2] px-4 py-2.5 bg-[#21DBA4] hover:bg-[#1bc490] text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <RefreshCw size={14} /> {language === 'ko' ? '클립 불러오기' : 'Load Clips'}
                </button>
              </div>




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
              <div className="flex items-center gap-3">
                {/* Sort Toggle */}
                <button
                  onClick={() => {
                    const newOrder = (clipSortOrder || 'newest') === 'newest' ? 'oldest' : 'newest';
                    console.log('[Sort Debug] Button clicked. Current:', clipSortOrder, 'New:', newOrder);
                    if (onSortOrderChange) {
                      onSortOrderChange(newOrder);
                    } else {
                      console.error('[Sort Debug] onSortOrderChange is undefined!');
                    }
                  }}
                  disabled={clips.length === 0}
                  className={cn(
                    "text-xs font-medium flex items-center gap-1 transition-colors",
                    clips.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:text-[#21DBA4]"
                  )}
                  style={{ color: isDark ? '#A1A1AA' : '#6B7280' }}
                >
                  <ArrowUpDown size={12} />
                  {(clipSortOrder || 'newest') === 'newest'
                    ? (language === 'ko' ? '최신순' : 'Newest')
                    : (language === 'ko' ? '오래된순' : 'Oldest')
                  }
                </button>
                {/* Select All */}
                <button
                  onClick={onSelectAll}
                  disabled={clips.length === 0}
                  className={cn(
                    "text-xs font-bold transition-colors",
                    clips.length === 0 ? "opacity-40 cursor-not-allowed" : "text-[#21DBA4] hover:underline"
                  )}
                >
                  {clips.length > 0 && selectedClips.length === clips.length
                    ? (language === 'ko' ? '전체 해제' : 'Deselect All')
                    : (language === 'ko' ? '전체 선택' : 'Select All')}
                </button>
              </div>
            </div>

            {/* Clip List */}
            <div
              className={cn("w-full border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out", theme.cardBorder)}
              style={{
                height: clips.length > 0 ? '600px' : 'auto',
                ...theme.cardBorderStyle,
                backgroundColor: isDark ? '#1E1E1E' : 'white'
              }}
            >
              <div
                className="flex-1"
                style={{
                  overflowY: 'auto',
                  backgroundColor: isDark ? '#131313' : '#f9fafb'
                }}
              >
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
            <div className={cn("border-t -mx-6 lg:-mx-8", theme.cardBorder)} />

            {/* Output Type - Full Width at Bottom */}
            <div>
              <h4 className={cn("text-sm font-bold mb-3 flex items-center gap-2", theme.textMuted)}>
                <Layout size={16} /> {language === 'ko' ? '출력 형태 선택' : 'Select Output Type'}
              </h4>

              <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
                {contentTypes.map((type: any) => (
                  <button
                    key={type.id}
                    onClick={() => onSelectContentType(type.id)}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2",
                      selectedContentType === type.id
                        ? "bg-[#21DBA4] text-black border-[#21DBA4] font-bold"
                        : cn(theme.cardBorder, theme.textMuted, "hover:border-[#21DBA4] hover:text-[#21DBA4]")
                    )}
                    style={selectedContentType !== type.id
                      ? { ...theme.cardBorderStyle, backgroundColor: isDark ? '#131313' : 'white' }
                      : undefined
                    }
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
                    ? "bg-[#21DBA4] text-black hover:bg-[#1bc490] hover:scale-[1.02]"
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

              {/* Generated Content Display */}
              {generatedContent && (
                <div className={cn(
                  "mt-6 p-6 rounded-2xl border",
                  isDark ? "bg-gray-900/50 border-[#454545]" : "bg-gray-50 border-gray-200"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={cn("text-sm font-bold flex items-center gap-2", theme.text)}>
                      <Sparkles size={16} className="text-[#21DBA4]" />
                      {language === 'ko' ? '생성된 콘텐츠' : 'Generated Content'}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedContent);
                          toast.success(language === 'ko' ? '클립보드에 복사되었습니다!' : 'Copied to clipboard!');
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"
                        )}
                      >
                        {language === 'ko' ? '복사' : 'Copy'}
                      </button>
                      <button
                        onClick={onClearContent}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-500 transition-colors"
                      >
                        {language === 'ko' ? '닫기' : 'Close'}
                      </button>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "prose prose-sm max-w-none max-h-[500px] overflow-y-auto",
                      isDark ? "prose-invert" : ""
                    )}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {/* 마크다운 렌더링 (간단 버전) */}
                    {generatedContent.split('\n').map((line: string, i: number) => {
                      // Heading 처리
                      if (line.startsWith('# ')) return <h1 key={i} className={cn("text-xl font-bold mt-4 mb-2", theme.text)}>{line.slice(2)}</h1>;
                      if (line.startsWith('## ')) return <h2 key={i} className={cn("text-lg font-bold mt-4 mb-2", theme.text)}>{line.slice(3)}</h2>;
                      if (line.startsWith('### ')) return <h3 key={i} className={cn("text-base font-bold mt-3 mb-1", theme.text)}>{line.slice(4)}</h3>;
                      // List 처리
                      if (line.startsWith('- ')) return <li key={i} className={cn("ml-4", theme.textSub)}>{line.slice(2)}</li>;
                      if (line.startsWith('* ')) return <li key={i} className={cn("ml-4", theme.textSub)}>{line.slice(2)}</li>;
                      // Blockquote 처리
                      if (line.startsWith('> ')) return <blockquote key={i} className={cn("border-l-4 border-[#21DBA4] pl-4 italic my-2", theme.textMuted)}>{line.slice(2)}</blockquote>;
                      // Empty line
                      if (line.trim() === '') return <br key={i} />;
                      // Regular paragraph
                      return <p key={i} className={cn("my-1", theme.textSub)}>{line}</p>;
                    })}
                  </div>
                </div>
              )}
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [studioClips, setStudioClips] = useState<any[]>([]);
  const [clipSortOrder, setClipSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

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

  // ═══════════════════════════════════════════════════
  // Dashboard Date Filtering State
  // ═══════════════════════════════════════════════════
  const [dashboardPeriod, setDashboardPeriod] = useState<Period | 'custom'>('weekly');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return {
      from: subDays(now, 6), // Recent 7 days (including today)
      to: now
    };
  });

  const handleDashboardPeriodChange = (period: Period | 'custom') => {
    setDashboardPeriod(period);
    const now = new Date();
    if (period === 'weekly') {
      setDateRange({
        from: subDays(now, 6),
        to: now
      });
    } else if (period === 'monthly') {
      setDateRange({
        from: subDays(now, 29),
        to: now
      });
    }
  };

  // 1. Dashboard Filtered Links (Target for top dashboard charts)
  const dashboardFilteredLinks = useMemo(() => {
    if (!dateRange?.from) return allActiveLinks;

    // Normalize range to start of day and end of day
    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);

    const to = dateRange.to ? new Date(dateRange.to) : new Date(from);
    to.setHours(23, 59, 59, 999);

    return allActiveLinks.filter(link => {
      const date = parseDate(link.createdAt || link.timestamp);
      if (!date) return false;
      return date >= from && date <= to;
    });
  }, [allActiveLinks, dateRange]);

  // Stats Data Calculation
  const statsData = useMemo(() => {
    // 1. Global Counts (Total)
    const totalClips = allActiveLinks.length;
    const totalUnread = allActiveLinks.filter(l => !l.lastViewedAt).length;

    // 2. Period Counts (Filtered)
    const periodCount = dashboardFilteredLinks.length;
    const periodUnread = dashboardFilteredLinks.filter(l => !l.lastViewedAt).length;

    // Category/Keyword engagement analysis (Based on Period for relevance)
    const tagStats: Record<string, { total: number; read: number }> = {};
    dashboardFilteredLinks.forEach(l => {
      const isRead = !!l.lastViewedAt;
      const tags = (l.keywords && l.keywords.length > 0) ? l.keywords : (l.categoryId ? [l.categoryId] : []);
      tags.forEach((tag: string) => {
        if (!tagStats[tag]) tagStats[tag] = { total: 0, read: 0 };
        tagStats[tag].total++;
        if (isRead) tagStats[tag].read++;
      });
    });

    const tagEntries = Object.entries(tagStats).filter(([_, v]) => v.total >= 1);
    const sortedByEngagement = tagEntries.sort((a, b) => b[1].total - a[1].total);

    // Helper to get category name
    const getCategoryName = (tagOrId: string): string => {
      const cat = categories.find((c: any) => c.id === tagOrId);
      return cat?.name || tagOrId;
    };

    const top5Tags = sortedByEngagement.slice(0, 5).map(([tag, stats]: [string, { total: number; read: number }]) => ({
      tag: getCategoryName(tag),
      rate: Math.round((stats.read / stats.total) * 100),
      total: stats.total
    }));

    return {
      stats: [
        {
          label: language === 'ko' ? '영구 보존된 지식' : 'Saved Knowledge',
          value: formatNumber(totalClips), // Show Total
          unit: language === 'ko' ? '개' : 'clips',
          trend: `+${periodCount}`, // Show Period Contribution
          sub: language === 'ko' ? '전체 저장된 클립' : 'Total saved clips',
          icon: <ShieldCheck size={20} className="text-[#21DBA4]" />,
          isDark
        },
        {
          label: language === 'ko' ? '읽지 않은 클립' : 'Unread Clips',
          value: formatNumber(totalUnread), // Show Total Unread
          unit: language === 'ko' ? '개' : 'clips',
          trend: `+${periodUnread}`, // Show Period Unread
          sub: language === 'ko' ? '전체 읽지 않은 클립' : 'Total unread clips',
          icon: <Inbox size={20} className="text-blue-400" />,
          onClick: onNavigateToUnread,
          isDark
        },
      ],
      tagReadingData: top5Tags
    };
  }, [allActiveLinks, dashboardFilteredLinks, language, categories, isDark, onNavigateToUnread]);

  // 2. Studio Filtered Links (For Content Studio - includes Search & explicit Date filters)
  const studioFilteredLinks = useMemo(() => {
    let links = allActiveLinks;
    if (studioStartDate || studioEndDate) {
      links = links.filter(clip => {
        const dateValue = clip.createdAt || clip.date || clip.timestamp;
        const d = parseDate(dateValue);
        if (!d) return false;
        const clipDate = getLocalDateString(d);
        return (!studioStartDate || clipDate >= studioStartDate) && (!studioEndDate || clipDate <= studioEndDate);
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      links = links.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.keywords?.some((t: string) => t.toLowerCase().includes(q)) ||
        c.summary?.toLowerCase().includes(q)
      );
    }
    return links;
  }, [allActiveLinks, studioStartDate, studioEndDate, searchQuery]);



  // 출처 그룹별 카운트 (기간 + 검색 + 카테고리 필터 적용)
  const availableSources = useMemo(() => {
    let baseClips = studioFilteredLinks;
    if (selectedCategories.length > 0) {
      baseClips = baseClips.filter(l => {
        if (!l.categoryId) return false;
        if (selectedCategories.includes(l.categoryId)) return true;
        const catName = categories?.find(c => c.id === l.categoryId)?.name;
        if (catName && selectedCategories.some(id => categories?.find(c => c.id === id)?.name?.toLowerCase() === catName.toLowerCase())) return true;
        return false;
      });
    }

    const sourceMap = new Map<string, number>();
    baseClips.forEach(l => {
      if (l.url) {
        const group = getSourceInfo(l.url).name;
        sourceMap.set(group, (sourceMap.get(group) || 0) + 1);
      }
    });
    return Array.from(sourceMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([group, count]) => ({ group, count }));
  }, [studioFilteredLinks, selectedCategories, categories]);

  // 카테고리별 카운트 (기간 + 검색 + 출처 필터 적용)
  const allAvailableCategories = useMemo(() => {
    let baseClips = studioFilteredLinks;
    if (selectedSources.length > 0) {
      baseClips = baseClips.filter(l => l.url && selectedSources.includes(getSourceInfo(l.url).name));
    }

    return categories
      ?.map((cat: any) => {
        const count = baseClips.filter((l: any) =>
          l.categoryId === cat.id ||
          (cat.name && l.categoryId?.toLowerCase() === cat.name.toLowerCase())
        ).length;
        return { ...cat, count };
      })
      .sort((a: any, b: any) => b.count - a.count) || [];
  }, [studioFilteredLinks, selectedSources, categories]);

  const filteredClips = useMemo(() => {
    if (studioClips.length === 0) return [];
    let result = [...studioClips];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.keywords?.some((t: string) => t.toLowerCase().includes(q)) ||
        c.summary?.toLowerCase().includes(q)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = parseDate(a.createdAt)?.getTime() || 0;
      const dateB = parseDate(b.createdAt)?.getTime() || 0;
      return clipSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result.slice(0, 100);
  }, [studioClips, searchQuery, clipSortOrder]);

  // Load clips with specific dates (bypasses stale state issue)
  const loadClipsWithDates = useCallback((startDate: string, endDate: string) => {
    console.log('[DEBUG] loadClipsWithDates called with:', { startDate, endDate, selectedSources, selectedCategories });

    let result = allActiveLinks;

    // 1. 기간 필터 (Local Date String Comparison)
    if (startDate || endDate) {
      console.log(`[DEBUG] Filtering with dates: ${startDate} ~ ${endDate}. Total clips: ${result.length}`);
      result = result.filter((clip: any, index) => {
        // Fallback checks for date field
        const dateValue = clip.createdAt || clip.date || clip.timestamp;

        // Log first 3 items to debug format if parsing fails (optional, keep it clean for now)
        // if (index < 3) console.log(`[DEBUG] Clip[${index}] dateValue:`, dateValue);

        const d = parseDate(dateValue);
        if (!d) {
          // Only log failures for first few items to avoid spam
          if (index < 3) console.log(`[DEBUG] Clip[${index}] parseDate failed for:`, dateValue);
          return false;
        }

        const clipDate = getLocalDateString(d); // Use local date string
        const match = (!startDate || clipDate >= startDate) && (!endDate || clipDate <= endDate);
        return match;
      });
    }

    // 2. 출처 필터 (그룹 기반)
    if (selectedSources.length > 0) {
      result = result.filter(clip => {
        if (!clip.url) return false;
        return selectedSources.includes(getSourceInfo(clip.url).name);
      });
    }

    // 3. 카테고리 필터
    if (selectedCategories.length > 0) {
      result = result.filter(clip => {
        if (!clip.categoryId) return false;
        if (selectedCategories.includes(clip.categoryId)) return true;

        // Name match fallback
        const catName = categories?.find(c => c.id === clip.categoryId)?.name;
        if (catName && selectedCategories.some(id => categories?.find(c => c.id === id)?.name?.toLowerCase() === catName.toLowerCase())) return true;
        return false;
      });
    }

    console.log('[DEBUG] Filtered result count:', result.length);

    setStudioClips(result);
    setSelectedClips([]);

    if (result.length === 0) {
      toast.error(language === 'ko' ? '조건에 맞는 클립이 없습니다' : 'No clips match the criteria');
    } else {
      toast.success(language === 'ko' ? `${result.length}개의 클립을 불러왔습니다` : `Loaded ${result.length} clips`);
    }
  }, [allActiveLinks, language, selectedSources, selectedCategories, categories]);

  // handleLoadClips - 현재 설정된 날짜로 loadClipsWithDates 호출
  const handleLoadClips = useCallback(() => {
    loadClipsWithDates(studioStartDate, studioEndDate);
  }, [loadClipsWithDates, studioStartDate, studioEndDate]);

  const toggleClipSelection = useCallback((id: string) => { setSelectedClips(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]); }, []);
  const selectAllClips = useCallback(() => {
    setSelectedClips(prev => {
      const allIds = filteredClips.map(c => c.id);
      if (prev.length === allIds.length && allIds.every(id => prev.includes(id))) {
        return [];
      }
      return allIds;
    });
  }, [filteredClips]);
  const clearResults = useCallback(() => {
    setStudioClips([]);
    setSelectedClips([]);
    toast.success(language === 'ko' ? '검색 결과가 초기화되었습니다' : 'Results cleared');
  }, [language]);

  const handleGenerate = useCallback(async () => {
    if (!selectedContentType || selectedClips.length === 0) return;
    setGeneratingReport(true);
    setGeneratedContent(null);
    toast.loading(language === 'ko' ? 'AI가 콘텐츠를 생성하고 있습니다...' : 'AI is generating content...');

    // Get selected clip data
    const selectedClipData = studioClips.filter(c => selectedClips.includes(c.id));
    const mainTopic = selectedClipData[0]?.keywords?.[0] || selectedClipData[0]?.title?.slice(0, 20) || 'Content';

    const typeLabels: Record<string, { ko: string, en: string }> = {
      report: { ko: '리포트', en: 'Report' },
      article: { ko: '아티클', en: 'Article' },
      planning: { ko: '기획서', en: 'Planning' },
      trend: { ko: '트렌드 분석', en: 'Trend Analysis' },
    };

    try {
      // 실제 AI API 호출
      const result = await generateStudioContent(
        selectedClipData,
        selectedContentType as StudioContentType,
        language as 'ko' | 'en'
      );

      setGeneratingReport(false);
      toast.dismiss();

      if (result.success && result.content) {
        setGeneratedContent(result.content);
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
          const updated = [newEntry, ...prev].slice(0, 10);
          localStorage.setItem('linkbrain_creation_history', JSON.stringify(updated));
          return updated;
        });
      } else {
        toast.error(result.error || (language === 'ko' ? '생성 중 오류가 발생했습니다.' : 'An error occurred.'));
      }
    } catch (error: any) {
      setGeneratingReport(false);
      toast.dismiss();
      toast.error(error.message || (language === 'ko' ? '생성 중 오류가 발생했습니다.' : 'An error occurred.'));
    }
  }, [selectedContentType, selectedClips, studioClips, language]);

  const contentTypes = [
    { id: 'report', label: language === 'ko' ? '리포트' : 'Report', icon: <FileBarChart size={18} />, desc: language === 'ko' ? '분석 보고서' : 'Analysis' },
    { id: 'article', label: language === 'ko' ? '아티클' : 'Article', icon: <FileText size={18} />, desc: language === 'ko' ? '인사이트 글' : 'Insight' },
    { id: 'planning', label: language === 'ko' ? '기획서' : 'Planning', icon: <Layout size={18} />, desc: language === 'ko' ? '실행 계획안' : 'Plan' },
    { id: 'trend', label: language === 'ko' ? '트렌드' : 'Trend', icon: <TrendingUp size={18} />, desc: language === 'ko' ? '요약 정리' : 'Summary' },
  ];



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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className={cn("text-2xl font-bold flex items-center gap-2", theme.text)}>
            {language === 'ko' ? '반가워요 👋' : 'Welcome back 👋'}
          </h1>
          <p className={cn("text-sm mt-1 mb-3", theme.textMuted)}>
            {language === 'ko'
              ? '오늘의 인사이트를 발견하고, 새로운 가치를 만들어보세요.'
              : 'Discover today\'s insights and create new value.'}
          </p>


        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          {/* Date Range Display (Moved) */}
          <div className={cn(
            "flex md:inline-flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-lg text-xs font-medium border w-full md:w-auto",
            theme.itemBg, theme.textMuted, theme.border
          )}>
            <CalendarIcon size={14} />
            {dateRange?.from ? (
              <>
                {format(dateRange.from, 'yyyy-MM-dd')} ~ {dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(dateRange.from, 'yyyy-MM-dd')}
              </>
            ) : (
              language === 'ko' ? '전체 기간' : 'All time'
            )}
          </div>

          {/* Dashboard Date Filter Control (Pill Style) */}
          <div
            className={cn(
              "flex items-center p-1 rounded-full shadow-sm border w-full md:w-auto justify-between md:justify-start overflow-x-auto",
              isDark ? "bg-gray-800" : "bg-white border-gray-200"
            )}
            style={isDark ? { borderColor: '#454545' } : undefined}
          >
            {/* Week Button */}
            <button
              onClick={() => handleDashboardPeriodChange('weekly')}
              className={cn(
                "px-4 md:px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-1 md:flex-none",
                dashboardPeriod === 'weekly'
                  ? "bg-[#21DBA4]/20 text-[#21DBA4]"
                  : (isDark ? "text-gray-200 hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100")
              )}
            >
              {language === 'ko' ? '이번 주' : 'This Week'}
            </button>

            {/* Month Button */}
            <button
              onClick={() => handleDashboardPeriodChange('monthly')}
              className={cn(
                "px-4 md:px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex-1 md:flex-none",
                dashboardPeriod === 'monthly'
                  ? "bg-[#21DBA4]/20 text-[#21DBA4]"
                  : (isDark ? "text-gray-200 hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100")
              )}
            >
              {language === 'ko' ? '이번 달' : 'This Month'}
            </button>

            {/* Custom Date Picker Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "px-4 md:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-none",
                    dashboardPeriod === 'custom'
                      ? "bg-[#21DBA4]/20 text-[#21DBA4]"
                      : (isDark ? "text-gray-200 hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100")
                  )}
                  onClick={() => setDashboardPeriod('custom')}
                >
                  <CalendarIcon size={14} />
                  {language === 'ko' ? '기간 지정' : 'Custom'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range: DateRange | undefined) => {
                    setDateRange(range);
                    if (range?.from) setDashboardPeriod('custom');
                  }}
                  numberOfMonths={1}
                  pagedNavigation
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Row 1: Top Stats (Saved + Unread only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          label={statsData.stats[0].label}
          value={statsData.stats[0].value}
          unit={statsData.stats[0].unit}
          sub={statsData.stats[0].sub}
          trend={statsData.stats[0].trend}
          icon={statsData.stats[0].icon}
          isDark={isDark}
          theme={theme}
        />
        <div
          onClick={onNavigateToUnread}
          className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <StatCard
            label={statsData.stats[1].label}
            value={statsData.stats[1].value}
            unit={statsData.stats[1].unit}
            sub={statsData.stats[1].sub}
            trend={statsData.stats[1].trend}
            icon={statsData.stats[1].icon}
            onClick={onNavigateToUnread}
            isDark={isDark}
            theme={theme}
          />
        </div>
      </div>

      {/* Row 2: Tag Reading Rate */}
      <div className="mb-6">
        <TagReadingRateCard
          tagData={statsData.tagReadingData}
          language={language}
          isDark={isDark}
          theme={theme}
        />
      </div>

      {/* Row 3: Heatmap */}
      <div className="mb-6">
        <SavePatternHeatmapCard
          links={dashboardFilteredLinks}
          isDark={isDark}
          theme={theme}
          language={language}
          period={dashboardPeriod === 'custom' ? 'monthly' : dashboardPeriod} // Heatmap expects 'weekly' or 'monthly', passing 'monthly' for custom as fallback
        />
      </div>

      {/* Row 4: Interest Analysis, Keywords, Trends (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <InterestEvolutionCard
          links={dashboardFilteredLinks}
          allLinks={allActiveLinks}
          isDark={isDark}
          theme={theme}
          language={language}
          categories={categories}
        />
        <KeywordsCard
          links={dashboardFilteredLinks}
          isDark={isDark}
          categories={categories}
          theme={theme}
          language={language}
          period={dashboardPeriod === 'custom' ? 'weekly' : dashboardPeriod}
        />
        <TrendsCard
          links={dashboardFilteredLinks}
          isDark={isDark}
          categories={categories}
          theme={theme}
          language={language}
          period={dashboardPeriod === 'custom' ? 'weekly' : dashboardPeriod}
        />
      </div>
      <ContentStudio
        clips={filteredClips} selectedClips={selectedClips} onToggleClip={toggleClipSelection} onSelectAll={selectAllClips}
        contentTypes={contentTypes} selectedContentType={selectedContentType} onSelectContentType={(id: any) => setSelectedContentType(id as ContentType)}
        onGenerate={handleGenerate} isGenerating={generatingReport} searchQuery={searchQuery} onSearchChange={setSearchQuery}
        startDate={studioStartDate} endDate={studioEndDate} onStartDateChange={setStudioStartDate} onEndDateChange={setStudioEndDate}
        onLoadClips={handleLoadClips} loadClipsWithDates={loadClipsWithDates} onClearResults={clearResults} language={language} isDark={isDark} theme={theme}
        // 정렬 props
        clipSortOrder={clipSortOrder}
        onSortOrderChange={setClipSortOrder}
        // 필터 props
        availableSources={availableSources}
        selectedSources={selectedSources}
        onToggleSource={(domain: string) => setSelectedSources(prev => prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain])}
        onClearSources={() => setSelectedSources([])}
        allAvailableCategories={allAvailableCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={(catId: string) => setSelectedCategories(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId])}
        onClearCategories={() => setSelectedCategories([])}
        generatedContent={generatedContent}
        onClearContent={() => setGeneratedContent(null)}
      />

      {/* Creation History */}
      {
        creationHistory.length > 0 && (
          <div className={cn("col-span-12 border rounded-3xl p-6", theme.card, theme.cardBorder)} style={theme.cardBorderStyle}>
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
                    isDark ? "bg-gray-800/30 border-[#454545] hover:bg-gray-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
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
        )
      }

    </main >
  );
};

export default AIInsightsDashboard;
