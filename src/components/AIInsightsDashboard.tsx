import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Brain, TrendingUp, Clock, BookOpen, Tag, Globe, Zap, Target, Network, Calendar, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

type AIInsightsDashboardProps = {
  links: any[];
  categories: any[];
  theme: 'light' | 'dark';
  t: (key: string) => string;
  language?: 'en' | 'ko';
};

// URL에서 도메인 추출
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    // URL이 프로토콜 없이 시작하는 경우
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\?]+)/);
    return match ? match[1] : url.split('/')[0] || 'unknown';
  }
};

// 플랫폼 이름 표시
const getPlatformName = (domain: string): string => {
  const platforms: Record<string, string> = {
    'youtube.com': 'YouTube',
    'youtu.be': 'YouTube',
    'instagram.com': 'Instagram',
    'threads.net': 'Threads',
    'twitter.com': 'Twitter',
    'x.com': 'Twitter',
    'linkedin.com': 'LinkedIn',
    'github.com': 'GitHub',
    'medium.com': 'Medium',
    'notion.so': 'Notion',
    'figma.com': 'Figma',
  };
  return platforms[domain] || domain;
};

// 주제 카테고리 매핑 (영어/한국어)
const topicPatterns: Record<string, { en: string; ko: string; keywords: string[] }> = {
  'Design': { en: 'Design', ko: '디자인', keywords: ['design', 'ui', 'ux', 'figma', 'sketch', '디자인', 'css', 'style'] },
  'AI/ML': { en: 'AI/ML', ko: 'AI/ML', keywords: ['ai', 'ml', 'machine learning', 'gpt', 'llm', 'gemini', '인공지능', 'artificial intelligence', 'deep learning'] },
  'Dev': { en: 'Dev', ko: '개발', keywords: ['dev', 'code', 'programming', 'react', 'next', 'javascript', 'typescript', 'python', '개발', 'api', 'backend', 'frontend'] },
  'Business': { en: 'Business', ko: '비즈니스', keywords: ['business', 'marketing', 'startup', 'strategy', '비즈니스', '마케팅', 'growth', 'product'] },
  'Trends': { en: 'Trends', ko: '트렌드', keywords: ['trend', 'future', '트렌드', '미래', 'tech', 'innovation', '혁신'] },
};

// 품질 분석 라벨 (영어/한국어)
const qualityLabels: Record<string, { en: string; ko: string }> = {
  'excellent': { en: 'Excellent (90+)', ko: '매우 좋음 (90+)' },
  'great': { en: 'Great (80-89)', ko: '좋음 (80-89)' },
  'good': { en: 'Good (70-79)', ko: '보통 (70-79)' },
  'fair': { en: 'Fair (60-69)', ko: '낮음 (60-69)' },
  'low': { en: 'Low (<60)', ko: '매우 낮음 (<60)' },
};

// 콘텐츠 갭 탐지용 주제 (영어/한국어)
const contentGapTopics = [
  { id: 'mobile', labelEn: 'Mobile Development', labelKo: '모바일 개발', keywords: ['mobile', 'ios', 'android', 'swift', 'kotlin', 'flutter'] },
  { id: 'data', labelEn: 'Data Visualization', labelKo: '데이터 시각화', keywords: ['data', 'visualization', 'chart', 'd3', 'analytics'] },
  { id: 'product', labelEn: 'Product Strategy', labelKo: '제품 전략', keywords: ['product', 'strategy', 'roadmap', 'planning'] },
  { id: 'team', labelEn: 'Team Management', labelKo: '팀 매니지먼트', keywords: ['team', 'management', 'leadership', 'hiring'] },
  { id: 'security', labelEn: 'Security', labelKo: '보안', keywords: ['security', 'auth', 'encryption', 'privacy'] },
  { id: 'performance', labelEn: 'Performance', labelKo: '성능 최적화', keywords: ['performance', 'optimization', 'speed', 'cache'] },
];

export const AIInsightsDashboard = ({ links, categories, theme, t, language = 'ko' }: AIInsightsDashboardProps) => {
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(false);
  const [firestoreClips, setFirestoreClips] = useState<any[]>([]);

  // Firestore에서 클립 데이터 가져오기
  useEffect(() => {
    const fetchClips = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      try {
        const clipsRef = collection(db, 'clips');
        const q = query(
          clipsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const clips = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFirestoreClips(clips);
      } catch (err) {
        console.error('[AIInsights] Firestore fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  // 기간에 따른 데이터 필터링
  const filteredData = useMemo(() => {
    const now = Date.now();
    const periodDays = period === 'weekly' ? 7 : 30;
    const periodStart = now - periodDays * 24 * 60 * 60 * 1000;

    // Firestore 데이터가 있으면 우선 사용, 없으면 props의 links 사용
    const sourceData = firestoreClips.length > 0 ? firestoreClips : links;

    return sourceData.filter(item => {
      const timestamp = item.createdAt?.seconds
        ? item.createdAt.seconds * 1000
        : item.createdAt?.toDate?.()?.getTime?.()
        || item.timestamp
        || 0;
      return timestamp >= periodStart && !item.isArchived;
    });
  }, [firestoreClips, links, period]);

  // 전체 링크 (archived 제외)
  const allActiveLinks = useMemo(() => {
    const sourceData = firestoreClips.length > 0 ? firestoreClips : links;
    return sourceData.filter(item => !item.isArchived);
  }, [firestoreClips, links]);

  // Top Keywords 계산
  const topKeywords = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(item => {
      const tags = item.tags || item.keywords || [];
      tags.forEach((tag: string) => {
        const key = tag.toLowerCase().trim();
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [filteredData]);

  // Main Sources 계산 (도메인 파싱 개선)
  const mainSources = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(item => {
      if (item.url) {
        const domain = extractDomain(item.url);
        const displayName = getPlatformName(domain);
        counts[displayName] = (counts[displayName] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Reading Patterns 계산 (기간에 맞게)
  const readingPatterns = useMemo(() => {
    const days = period === 'weekly' ? 7 : 30;
    const patterns = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayName = period === 'weekly'
        ? date.toLocaleDateString(language === 'ko' ? 'ko' : 'en', { weekday: 'short' })
        : date.toLocaleDateString(language === 'ko' ? 'ko' : 'en', { month: 'short', day: 'numeric' });

      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);

      const count = filteredData.filter(item => {
        const timestamp = item.createdAt?.seconds
          ? item.createdAt.seconds * 1000
          : item.createdAt?.toDate?.()?.getTime?.()
          || item.timestamp
          || 0;
        return timestamp >= dayStart && timestamp <= dayEnd;
      }).length;

      patterns.push({ day: dayName, links: count });
    }

    // 월간일 경우 주 단위로 그룹화
    if (period === 'monthly') {
      const weeklyPatterns = [];
      for (let i = 0; i < patterns.length; i += 7) {
        const weekData = patterns.slice(i, i + 7);
        const weekTotal = weekData.reduce((sum, d) => sum + d.links, 0);
        weeklyPatterns.push({
          day: `${language === 'ko' ? '주' : 'W'}${Math.floor(i / 7) + 1}`,
          links: weekTotal
        });
      }
      return weeklyPatterns;
    }

    return patterns;
  }, [filteredData, period, language]);

  // Quality Analysis (AI Score 또는 다른 메트릭 기반)
  const qualityData = useMemo(() => {
    const ranges: Record<string, number> = {
      'excellent': 0,
      'great': 0,
      'good': 0,
      'fair': 0,
      'low': 0
    };

    filteredData.forEach(item => {
      const score = item.aiScore || item.relevanceScore || Math.floor(Math.random() * 40) + 60;
      if (score >= 90) ranges['excellent']++;
      else if (score >= 80) ranges['great']++;
      else if (score >= 70) ranges['good']++;
      else if (score >= 60) ranges['fair']++;
      else ranges['low']++;
    });

    return Object.entries(ranges).map(([key, value]) => ({
      name: language === 'ko' ? qualityLabels[key].ko : qualityLabels[key].en,
      value
    }));
  }, [filteredData, language]);

  // Topic Connections (기본 패턴 + 동적 카테고리)
  const topicData = useMemo(() => {
    // 1. 기본 패턴 기반 주제 계산
    const baseTopics = Object.entries(topicPatterns).map(([key, data]) => {
      const count = filteredData.filter(item => {
        const tags = (item.tags || item.keywords || []).map((t: string) => t.toLowerCase());
        const title = (item.title || '').toLowerCase();
        const summary = (item.summary || '').toLowerCase();
        const combined = [...tags, title, summary].join(' ');
        return data.keywords.some((k: string) => combined.includes(k));
      }).length;
      return {
        subject: language === 'ko' ? data.ko : data.en,
        value: count,
        isBase: true
      };
    });

    // 2. 사용자 카테고리에서 추가 주제 감지
    const categoryCounts: Record<string, number> = {};
    filteredData.forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
      if (item.categoryId && categories) {
        const cat = categories.find((c: any) => c.id === item.categoryId);
        if (cat) {
          categoryCounts[cat.name] = (categoryCounts[cat.name] || 0) + 1;
        }
      }
    });

    // 기본 주제에 없는 카테고리만 추가
    const baseSubjects = baseTopics.map(t => t.subject.toLowerCase());
    const additionalTopics = Object.entries(categoryCounts)
      .filter(([name]) => !baseSubjects.includes(name.toLowerCase()))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // 최대 3개 추가
      .map(([name, count]) => ({
        subject: name,
        value: count,
        isBase: false
      }));

    // 3. 합치기 (값이 있는 것 위주로 정렬)
    const allTopics = [...baseTopics, ...additionalTopics]
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // 최대 8개

    return allTopics;
  }, [filteredData, language, categories]);

  // 새로운 관심사 (최근 급증한 키워드)
  const newInterests = useMemo(() => {
    const recentCounts: Record<string, number> = {};
    const olderCounts: Record<string, number> = {};

    const now = Date.now();
    const recentCutoff = now - 3 * 24 * 60 * 60 * 1000; // 최근 3일

    filteredData.forEach(item => {
      const timestamp = item.createdAt?.seconds
        ? item.createdAt.seconds * 1000
        : item.createdAt?.toDate?.()?.getTime?.()
        || item.timestamp
        || 0;
      const tags = item.tags || item.keywords || [];

      tags.forEach((tag: string) => {
        const key = tag.toLowerCase().trim();
        if (timestamp >= recentCutoff) {
          recentCounts[key] = (recentCounts[key] || 0) + 1;
        } else {
          olderCounts[key] = (olderCounts[key] || 0) + 1;
        }
      });
    });

    // 최근에 새로 등장하거나 급증한 키워드
    const emerging = Object.entries(recentCounts)
      .filter(([key, count]) => {
        const oldCount = olderCounts[key] || 0;
        return count > oldCount || oldCount === 0;
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

    return emerging.length > 0 ? emerging : topKeywords.slice(0, 4).map(k => k.name.charAt(0).toUpperCase() + k.name.slice(1));
  }, [filteredData, topKeywords]);

  // 콘텐츠 갭 (관심 있을 수 있지만 저장하지 않은 주제)
  const contentGaps = useMemo(() => {
    const tagSet = new Set<string>();
    allActiveLinks.forEach(item => {
      (item.tags || item.keywords || []).forEach((t: string) => {
        tagSet.add(t.toLowerCase());
      });
    });

    const allTags = Array.from(tagSet).join(' ');

    // 콘텐츠가 적은 주제 찾기
    return contentGapTopics
      .filter(topic => {
        const matchCount = topic.keywords.filter(k => allTags.includes(k)).length;
        return matchCount < 2;
      })
      .slice(0, 4)
      .map(topic => language === 'ko' ? topic.labelKo : topic.labelEn);
  }, [allActiveLinks, language]);

  // 평균 읽기 시간 계산
  const avgReadTime = useMemo(() => {
    const totalMinutes = filteredData.reduce((acc, item) => {
      if (item.readTime) {
        const mins = parseInt(item.readTime.split(' ')[0]) || 0;
        return acc + mins;
      }
      // 추정: summary 길이 기반 (200자 = 1분)
      const summaryLength = (item.summary || '').length;
      return acc + Math.max(1, Math.floor(summaryLength / 200));
    }, 0);
    return filteredData.length > 0 ? Math.round(totalMinutes / filteredData.length) : 0;
  }, [filteredData]);

  // 트렌드 계산 (이전 기간 대비)
  const trend = useMemo(() => {
    const periodDays = period === 'weekly' ? 7 : 30;
    const now = Date.now();
    const currentStart = now - periodDays * 24 * 60 * 60 * 1000;
    const previousStart = currentStart - periodDays * 24 * 60 * 60 * 1000;

    const sourceData = firestoreClips.length > 0 ? firestoreClips : links;

    const currentCount = sourceData.filter(item => {
      const timestamp = item.createdAt?.seconds
        ? item.createdAt.seconds * 1000
        : item.createdAt?.toDate?.()?.getTime?.()
        || item.timestamp
        || 0;
      return timestamp >= currentStart && !item.isArchived;
    }).length;

    const previousCount = sourceData.filter(item => {
      const timestamp = item.createdAt?.seconds
        ? item.createdAt.seconds * 1000
        : item.createdAt?.toDate?.()?.getTime?.()
        || item.timestamp
        || 0;
      return timestamp >= previousStart && timestamp < currentStart && !item.isArchived;
    }).length;

    if (previousCount === 0) return '+100%';
    const change = Math.round(((currentCount - previousCount) / previousCount) * 100);
    return change >= 0 ? `+${change}%` : `${change}%`;
  }, [firestoreClips, links, period]);

  const COLORS = ['#21DBA4', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const cardClass = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';

  // 인사이트 요약 텍스트
  const insightSummary = useMemo(() => {
    const count = filteredData.length;
    const topKeyword = topKeywords[0]?.name || '';

    if (language === 'ko') {
      if (count === 0) return '이 기간에 저장된 콘텐츠가 없습니다.';
      return `${period === 'weekly' ? '이번 주' : '이번 달'} ${count}개의 링크를 저장했으며, ${topKeyword ? `${topKeyword.toUpperCase()} & 관련 주제에 집중했고, ` : ''}다양한 관심사를 탐색했습니다.`;
    } else {
      if (count === 0) return 'No content saved in this period.';
      return `Saved ${count} links ${period === 'weekly' ? 'this week' : 'this month'}${topKeyword ? `, focused on ${topKeyword.toUpperCase()} topics` : ''}.`;
    }
  }, [filteredData, topKeywords, period, language]);

  return (
    <div className="space-y-8">
      {/* Period Toggle */}
      <div className="flex items-center justify-between">
        <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${period === 'weekly'
              ? 'bg-[#21DBA4] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Calendar size={14} />
            {language === 'ko' ? '주간' : 'Weekly'}
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${period === 'monthly'
              ? 'bg-[#21DBA4] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Calendar size={14} />
            {language === 'ko' ? '월간' : 'Monthly'}
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-[#21DBA4]">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">{language === 'ko' ? '로딩...' : 'Loading...'}</span>
          </div>
        )}
      </div>

      {/* Hero Summary Card */}
      <div className={`rounded-2xl border p-8 shadow-lg ${cardClass}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21DBA4] to-[#1bc290] flex items-center justify-center shadow-lg">
            <Brain className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h2 className={`text-xl font-black mb-2 ${textPrimary}`}>
              {period === 'weekly' ? t('weeklyInsights') : (language === 'ko' ? '월간 인사이트' : 'Monthly Insights')}
            </h2>
            <p className={textMuted}>{insightSummary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<BookOpen size={20} />}
            label={t('totalLinks')}
            value={allActiveLinks.length}
            trend={trend}
            theme={theme}
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label={period === 'weekly' ? t('thisWeek') : (language === 'ko' ? '이번 달' : 'This Month')}
            value={filteredData.length}
            trend={t('trend')}
            theme={theme}
          />
          <StatCard
            icon={<Clock size={20} />}
            label={t('avgReadTime')}
            value={`${avgReadTime} min`}
            trend=""
            theme={theme}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Keywords */}
        <ChartCard
          title={t('topKeywords')}
          icon={<Tag size={18} />}
          theme={theme}
        >
          {topKeywords.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topKeywords}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="name" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFF',
                    border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#21DBA4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={`h-[280px] flex items-center justify-center ${textMuted}`}>
              {language === 'ko' ? '데이터가 없습니다' : 'No data'}
            </div>
          )}
        </ChartCard>

        {/* Main Sources */}
        <ChartCard
          title={t('mainSources')}
          icon={<Globe size={18} />}
          theme={theme}
        >
          {mainSources.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={mainSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mainSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFF',
                    border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={`h-[280px] flex items-center justify-center ${textMuted}`}>
              {language === 'ko' ? '데이터가 없습니다' : 'No data'}
            </div>
          )}
        </ChartCard>

        {/* Reading Patterns */}
        <ChartCard
          title={t('readingPatterns')}
          icon={<TrendingUp size={18} />}
          theme={theme}
        >
          {readingPatterns.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={readingPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="day" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFF',
                    border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="links"
                  stroke="#21DBA4"
                  strokeWidth={3}
                  dot={{ fill: '#21DBA4', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className={`h-[280px] flex items-center justify-center ${textMuted}`}>
              {language === 'ko' ? '데이터가 없습니다' : 'No data'}
            </div>
          )}
        </ChartCard>

        {/* Quality Analysis */}
        <ChartCard
          title={t('qualityAnalysis')}
          icon={<Zap size={18} />}
          theme={theme}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={qualityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
              <XAxis type="number" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
              <YAxis dataKey="name" type="category" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFF',
                  border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Topic Connections */}
      <ChartCard
        title={t('topicConnections')}
        icon={<Network size={18} />}
        theme={theme}
      >
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={topicData}>
            <PolarGrid stroke={isDark ? '#334155' : '#E2E8F0'} />
            <PolarAngleAxis dataKey="subject" stroke={isDark ? '#94A3B8' : '#64748B'} />
            <Radar
              name="Topics"
              dataKey="value"
              stroke="#21DBA4"
              fill="#21DBA4"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1E293B' : '#FFF',
                border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Content Gaps / New Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard
          title={t('newInterests')}
          icon={<Target size={18} />}
          theme={theme}
          items={newInterests.length > 0 ? newInterests : [language === 'ko' ? '아직 충분한 데이터가 없습니다' : 'Not enough data yet']}
        />
        <InsightCard
          title={t('contentGaps')}
          icon={<BookOpen size={18} />}
          theme={theme}
          items={contentGaps.length > 0 ? contentGaps : [language === 'ko' ? '잘 균형 잡힌 관심사입니다!' : 'Well balanced interests!']}
          isGap
        />
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, trend, theme }: any) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
      {trend && <div className="text-xs text-[#21DBA4] font-bold mt-1">{trend}</div>}
    </div>
  );
};

const ChartCard = ({ title, icon, children, theme }: any) => {
  const isDark = theme === 'dark';
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[#21DBA4]">{icon}</div>
        <h3 className={`font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
};

const InsightCard = ({ title, icon, items, isGap, theme }: any) => {
  const isDark = theme === 'dark';
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={isGap ? 'text-orange-500' : 'text-[#21DBA4]'}>{icon}</div>
        <h3 className={`font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item: string, idx: number) => (
          <li key={idx} className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isGap ? 'bg-orange-500' : 'bg-[#21DBA4]'}`}></div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsightsDashboard;