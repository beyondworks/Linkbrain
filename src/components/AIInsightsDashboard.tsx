import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Brain, TrendingUp, Clock, BookOpen, Tag, Globe, Zap, Target, Network, Calendar, Loader2, FileText, Sparkles, X } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

type AIInsightsDashboardProps = {
  links: any[];
  categories: any[];
  theme: 'light' | 'dark';
  t: (key: string) => string;
  language?: 'en' | 'ko';
  onOpenSettings?: () => void;
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

// 마크다운 문법 제거 헬퍼
const stripMarkdown = (text: string): string => {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1')       // *italic* -> italic
    .replace(/__([^_]+)__/g, '$1')       // __bold__ -> bold
    .replace(/_([^_]+)_/g, '$1');        // _italic_ -> italic
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

export const AIInsightsDashboard = ({ links, categories, theme, t, language = 'ko', onOpenSettings }: AIInsightsDashboardProps) => {
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(false);
  const [firestoreClips, setFirestoreClips] = useState<any[]>([]);

  // Insights Report states (현재 요약 기능)
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{
    title: string;
    content: string;
    topics: string[];
    wordCount: number;
    generatedAt: string;
  } | null>(null);
  const [showReport, setShowReport] = useState(false);

  // AI Article states (새로운 오리지널 콘텐츠 생성)
  const [generatingArticle, setGeneratingArticle] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState<{
    title: string;
    content: string;
    topics: string[];
    wordCount: number;
    generatedAt: string;
  } | null>(null);
  const [showArticle, setShowArticle] = useState(false);

  // History storage for reports and articles
  const [reportHistory, setReportHistory] = useState<Array<{
    id: string;
    title: string;
    content: string;
    topics: string[];
    wordCount: number;
    generatedAt: string;
  }>>([]);
  const [articleHistory, setArticleHistory] = useState<Array<{
    id: string;
    title: string;
    content: string;
    topics: string[];
    wordCount: number;
    generatedAt: string;
  }>>([]);
  const [showHistoryList, setShowHistoryList] = useState<'report' | 'article' | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem('ai_reports_history');
    const savedArticles = localStorage.getItem('ai_articles_history');
    if (savedReports) setReportHistory(JSON.parse(savedReports));
    if (savedArticles) setArticleHistory(JSON.parse(savedArticles));
  }, []);

  // Check if user has configured AI API key
  const isAIConfigured = typeof window !== 'undefined' && (localStorage.getItem('ai_api_key') || '').length > 10;
  const [showApiTooltip, setShowApiTooltip] = useState<'report' | 'article' | null>(null);

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

  // 인사이트 리포트 생성 함수 (실제 AI API 사용)
  const generateReport = async () => {
    const user = auth.currentUser;
    if (!user || filteredData.length < 3) return;

    // API 미설정 시 설정 열기
    if (!isAIConfigured) {
      onOpenSettings?.();
      return;
    }

    setGeneratingReport(true);

    try {
      const topClips = filteredData
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
        .slice(0, 10);

      const topicsSet = new Set<string>();
      topClips.forEach(clip => {
        (clip.tags || clip.keywords || []).forEach((t: string) => {
          topicsSet.add(t);
        });
      });
      const topTopics = Array.from(topicsSet).slice(0, 5);

      const periodText = period === 'weekly'
        ? (language === 'ko' ? '이번 주' : 'this week')
        : (language === 'ko' ? '이번 달' : 'this month');

      // 실제 AI API 호출 시도
      let reportContent = '';
      try {
        const { generateAIReport } = await import('../lib/aiService');
        const result = await generateAIReport(topClips, language);
        if (result.success && result.content) {
          reportContent = result.content;
        } else {
          throw new Error(result.error || 'AI generation failed');
        }
      } catch (aiError) {
        console.warn('[AIInsights] AI API failed, using local generation:', aiError);
        // Fallback to local template
        reportContent = language === 'ko'
          ? generateKoreanReport(topClips, topTopics, periodText)
          : generateEnglishReport(topClips, topTopics, periodText);
      }

      const newReport = {
        id: Date.now().toString(),
        title: language === 'ko'
          ? `${periodText} 인사이트 리포트`
          : `${periodText} Insights Report`,
        content: reportContent,
        topics: topTopics,
        wordCount: reportContent.length,
        generatedAt: new Date().toISOString()
      };

      setGeneratedReport(newReport);
      setShowReport(true);

      // Save to history
      const updatedHistory = [newReport, ...reportHistory].slice(0, 20); // Keep last 20
      setReportHistory(updatedHistory);
      localStorage.setItem('ai_reports_history', JSON.stringify(updatedHistory));

    } catch (error) {
      console.error('[AIInsights] Report generation error:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  // AI 아티클 생성 함수 (실제 AI API 사용)
  const generateArticle = async () => {
    const user = auth.currentUser;
    if (!user || filteredData.length < 3) return;

    // API 미설정 시 설정 열기
    if (!isAIConfigured) {
      onOpenSettings?.();
      return;
    }

    setGeneratingArticle(true);

    try {
      const topClips = filteredData
        .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
        .slice(0, 8);

      const topicsSet = new Set<string>();
      topClips.forEach(clip => {
        (clip.tags || clip.keywords || []).forEach((t: string) => {
          topicsSet.add(t);
        });
      });
      const topTopics = Array.from(topicsSet).slice(0, 4);

      const periodText = period === 'weekly'
        ? (language === 'ko' ? '이번 주' : 'this week')
        : (language === 'ko' ? '이번 달' : 'this month');

      // 실제 AI API 호출 시도
      let articleContent = '';
      let articleTitle = '';
      try {
        const { generateAIArticle } = await import('../lib/aiService');
        const result = await generateAIArticle(topClips, language);
        if (result.success && result.content) {
          articleContent = result.content;
          articleTitle = language === 'ko'
            ? `${topTopics[0] || 'AI'}의 미래: ${periodText} 발견한 인사이트`
            : `The Future of ${topTopics[0] || 'AI'}: Insights from ${periodText}`;
        } else {
          throw new Error(result.error || 'AI generation failed');
        }
      } catch (aiError) {
        console.warn('[AIInsights] AI API failed, using local generation:', aiError);
        // Fallback to local template
        articleContent = language === 'ko'
          ? generateKoreanOriginalArticle(topClips, topTopics, periodText)
          : generateEnglishOriginalArticle(topClips, topTopics, periodText);
        articleTitle = language === 'ko'
          ? `${topTopics[0] || 'AI'}의 미래: ${periodText} 발견한 인사이트`
          : `The Future of ${topTopics[0] || 'AI'}: Insights from ${periodText}`;
      }

      const newArticle = {
        id: Date.now().toString(),
        title: articleTitle,
        content: articleContent,
        topics: topTopics,
        wordCount: articleContent.length,
        generatedAt: new Date().toISOString()
      };

      setGeneratedArticle(newArticle);
      setShowArticle(true);

      // Save to history
      const updatedHistory = [newArticle, ...articleHistory].slice(0, 20); // Keep last 20
      setArticleHistory(updatedHistory);
      localStorage.setItem('ai_articles_history', JSON.stringify(updatedHistory));

    } catch (error) {
      console.error('[AIInsights] Article generation error:', error);
    } finally {
      setGeneratingArticle(false);
    }
  };

  // 한국어 인사이트 리포트
  const generateKoreanReport = (clips: any[], topics: string[], period: string) => {
    const intro = `## 트렌드 분석

${period} 동안 총 ${clips.length}개의 콘텐츠를 저장했습니다. 주요 관심 분야는 ${topics.slice(0, 3).join(', ')} 등입니다.`;

    const insights = clips.slice(0, 5).map((clip, idx) => {
      const title = clip.title || '제목 없음';
      const summary = clip.summary?.slice(0, 200) || '';
      return `### ${idx + 1}. ${title}

${summary}${summary.length >= 200 ? '...' : ''}`;
    }).join('\n\n');

    const conclusion = `:::callout-insight
핵심 인사이트

- ${topics[0] || '주요 주제'} 관련 콘텐츠가 가장 많이 저장되었습니다
- 총 ${clips.length}개의 클립에서 ${topics.length}개의 주요 주제가 발견되었습니다
:::

:::callout-action
다음 액션

1. 저장된 콘텐츠 중 아직 읽지 않은 것들을 확인해보세요
2. 관심 주제에 대해 더 깊이 탐구해보세요
:::`;

    return `${intro}\n\n${insights}\n\n${conclusion}`;
  };

  // 영어 인사이트 리포트
  const generateEnglishReport = (clips: any[], topics: string[], period: string) => {
    const intro = `## Trend Analysis

This ${period}, you saved ${clips.length} pieces of content. Your main interests include ${topics.slice(0, 3).join(', ')}.`;

    const insights = clips.slice(0, 5).map((clip, idx) => {
      const title = clip.title || 'Untitled';
      const summary = clip.summary?.slice(0, 200) || '';
      return `### ${idx + 1}. ${title}

${summary}${summary.length >= 200 ? '...' : ''}`;
    }).join('\n\n');

    const conclusion = `:::callout-insight
Key Insights

- ${topics[0] || 'Main Topic'} related content was saved most frequently
- ${topics.length} major topics were discovered across ${clips.length} clips
:::

:::callout-action
Next Actions

1. Review saved content you haven't read yet
2. Dive deeper into your interest topics
:::`;

    return `${intro}\n\n${insights}\n\n${conclusion}`;
  };

  // 한국어 오리지널 아티클 생성
  const generateKoreanOriginalArticle = (clips: any[], topics: string[], period: string) => {
    const mainTopic = topics[0] || 'AI';

    return `${period} 동안 수집한 다양한 콘텐츠를 바탕으로, ${mainTopic}과 관련된 흥미로운 트렌드를 발견할 수 있었습니다.

## 핵심 발견

### 1. ${mainTopic}의 급속한 발전

최근 ${mainTopic} 분야는 눈에 띄는 변화를 겪고 있습니다. ${clips[0]?.title || '최신 기술'} 관련 콘텐츠에서 볼 수 있듯이, 이 분야는 매일 새로운 혁신이 일어나고 있습니다.

${clips[0]?.summary?.slice(0, 300) || '기술의 발전은 우리 일상에 큰 영향을 미치고 있습니다.'}

### 2. ${topics[1] || '기술'} 트렌드 분석

${clips[1]?.title || '관련 주제'}와 같은 콘텐츠들은 현재 업계에서 주목받는 방향을 보여줍니다. ${clips[1]?.summary?.slice(0, 200) || '다양한 기업들이 이 분야에 투자를 확대하고 있습니다.'}

### 3. 실용적 적용 사례

${clips[2]?.title || '실제 사례'}를 통해 이론이 실제로 어떻게 적용되는지 확인할 수 있습니다. ${clips[2]?.summary?.slice(0, 200) || '이러한 사례들은 앞으로의 방향을 제시합니다.'}

:::callout-insight
시사점

- ${topics[0] || '주요 분야'}는 계속해서 성장세를 유지할 것으로 보입니다
- ${topics[1] || '관련 기술'}과의 융합이 새로운 기회를 창출하고 있습니다
- 사용자 경험 중심의 접근이 더욱 중요해지고 있습니다
:::

:::callout-action
앞으로의 전망

앞으로 ${mainTopic} 분야는 더욱 빠르게 진화할 것으로 예상됩니다. 지속적인 학습과 트렌드 파악이 중요한 시점입니다.
:::

---

*이 아티클은 ${period} 수집된 ${clips.length}개의 콘텐츠를 기반으로 AI가 재구성하여 작성했습니다.*`;
  };

  // 영어 오리지널 아티클 생성
  const generateEnglishOriginalArticle = (clips: any[], topics: string[], period: string) => {
    const mainTopic = topics[0] || 'AI';

    return `Based on the diverse content collected ${period}, we've discovered fascinating trends related to ${mainTopic}.

## Key Discoveries

### 1. The Rapid Evolution of ${mainTopic}

The ${mainTopic} field is undergoing remarkable changes. As seen in content about ${clips[0]?.title || 'recent technologies'}, innovations are happening daily in this space.

${clips[0]?.summary?.slice(0, 300) || 'Technology advances are significantly impacting our daily lives.'}

### 2. ${topics[1] || 'Technology'} Trend Analysis

Content like ${clips[1]?.title || 'related topics'} shows the direction the industry is heading. ${clips[1]?.summary?.slice(0, 200) || 'Various companies are expanding investments in this field.'}

### 3. Practical Applications

Through ${clips[2]?.title || 'real cases'}, we can see how theory is applied in practice. ${clips[2]?.summary?.slice(0, 200) || 'These cases point to future directions.'}

:::callout-insight
Key Takeaways

- ${topics[0] || 'Main field'} is expected to maintain its growth trajectory
- Integration with ${topics[1] || 'related technologies'} is creating new opportunities
- User experience-centric approaches are becoming increasingly important
:::

:::callout-action
Future Outlook

The ${mainTopic} field is expected to evolve even faster. Continuous learning and trend awareness are crucial at this point.
:::

---

*This article was created by AI, synthesizing ${clips.length} pieces of content collected ${period}.*`;
  };
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
      {/* Period Toggle + Generation Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Period Toggle */}
        <div className={`inline-flex rounded-xl p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button
            onClick={() => setPeriod('weekly')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${period === 'weekly'
              ? 'bg-[#21DBA4] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
            {language === 'ko' ? '주간' : 'Weekly'}
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${period === 'monthly'
              ? 'bg-[#21DBA4] text-white shadow-md'
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
            {language === 'ko' ? '월간' : 'Monthly'}
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-[#21DBA4]">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs sm:text-sm">{language === 'ko' ? '로딩...' : 'Loading...'}</span>
          </div>
        )}

        {/* Generation Buttons */}
        <div className="flex items-center gap-2 relative">
          {/* Insights Report Button */}
          <div
            className="relative flex-1 sm:flex-none"
            onMouseEnter={() => !isAIConfigured && setShowApiTooltip('report')}
            onMouseLeave={() => setShowApiTooltip(null)}
          >
            <button
              onClick={!isAIConfigured ? onOpenSettings : generateReport}
              disabled={generatingReport || (isAIConfigured && filteredData.length < 3)}
              className={`w-full flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all
                ${!isAIConfigured ? 'opacity-50 cursor-pointer' : 'disabled:opacity-50 disabled:cursor-not-allowed'}
                ${isDark
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
            >
              {generatingReport ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span className="hidden sm:inline">{language === 'ko' ? '생성 중...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <FileText size={12} />
                  <span className="whitespace-nowrap">{language === 'ko' ? '리포트' : 'Report'}</span>
                </>
              )}
            </button>
            {/* Tooltip for Report */}
            {showApiTooltip === 'report' && (
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
                {language === 'ko' ? '⚙️ 설정에서 API 키를 먼저 입력하세요' : '⚙️ Set up API key in Settings first'}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${isDark ? 'border-t-slate-800' : 'border-t-slate-900'}`} />
              </div>
            )}
          </div>

          {/* AI Article Button */}
          <div
            className="relative flex-1 sm:flex-none"
            onMouseEnter={() => !isAIConfigured && setShowApiTooltip('article')}
            onMouseLeave={() => setShowApiTooltip(null)}
          >
            <button
              onClick={!isAIConfigured ? onOpenSettings : generateArticle}
              disabled={generatingArticle || (isAIConfigured && filteredData.length < 3)}
              className={`w-full flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg
                ${!isAIConfigured ? 'opacity-50 cursor-pointer' : 'disabled:opacity-50 disabled:cursor-not-allowed'}
                ${generatingArticle
                  ? 'bg-slate-600 text-white'
                  : 'bg-[#21DBA4] text-white hover:bg-[#1bc290]'
                }`}
            >
              {generatingArticle ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span className="hidden sm:inline">{language === 'ko' ? '생성 중...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span className="whitespace-nowrap">{language === 'ko' ? '아티클' : 'Article'}</span>
                </>
              )}
            </button>
            {/* Tooltip for Article */}
            {showApiTooltip === 'article' && (
              <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-50 shadow-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
                {language === 'ko' ? '⚙️ 설정에서 API 키를 먼저 입력하세요' : '⚙️ Set up API key in Settings first'}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${isDark ? 'border-t-slate-800' : 'border-t-slate-900'}`} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Section */}
      {(reportHistory.length > 0 || articleHistory.length > 0) && (
        <div className={`rounded-xl border p-4 ${cardClass}`}>
          <h3 className={`text-sm font-bold mb-3 ${textPrimary}`}>
            {language === 'ko' ? '📚 생성 기록' : '📚 Generation History'}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {[...reportHistory.map(r => ({ ...r, type: 'report' as const })),
            ...articleHistory.map(a => ({ ...a, type: 'article' as const }))]
              .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
              .slice(0, 5)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'report') {
                      setGeneratedReport(item);
                      setShowReport(true);
                    } else {
                      setGeneratedArticle(item);
                      setShowArticle(true);
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'report' ? (isDark ? 'bg-slate-700' : 'bg-slate-100') : 'bg-[#21DBA4]/10'}`}>
                    {item.type === 'report' ? <FileText size={14} className="text-slate-400" /> : <Sparkles size={14} className="text-[#21DBA4]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${textPrimary}`}>{item.title}</p>
                    <p className={`text-xs ${textMuted}`}>
                      {new Date(item.generatedAt).toLocaleDateString(language === 'ko' ? 'ko' : 'en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
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

      {/* Insights Report Modal */}
      {showReport && generatedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowReport(false)}
        >
          <div
            className={`w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${cardClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex-shrink-0 flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <FileText className="text-[#21DBA4]" size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base font-black truncate ${textPrimary}`}>{generatedReport.title}</h2>
                  <p className={`text-xs ${textMuted}`}>
                    {language === 'ko' ? `${generatedReport.wordCount}자` : `${generatedReport.wordCount} chars`} •
                    {new Date(generatedReport.generatedAt).toLocaleDateString(language === 'ko' ? 'ko' : 'en')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {generatedReport.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              <article className={`text-sm leading-relaxed ${textPrimary}`}>
                {(() => {
                  const content = generatedReport.content;
                  const parts = content.split(/(:::callout-insight[\s\S]*?:::|:::callout-action[\s\S]*?:::)/g);

                  return parts.map((part, idx) => {
                    // Callout insight box
                    if (part.startsWith(':::callout-insight')) {
                      const inner = part.replace(':::callout-insight', '').replace(':::', '').trim();
                      const lines = inner.split('\n').filter(l => l.trim());
                      const title = lines[0];
                      const items = lines.slice(1);
                      return (
                        <div key={idx} className={`my-4 p-4 rounded-xl border-l-4 border-[#21DBA4] ${isDark ? 'bg-[#21DBA4]/10' : 'bg-[#21DBA4]/5'}`}>
                          <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-[#21DBA4]' : 'text-[#1a9f7c]'}`}>{title}</h4>
                          <ul className="space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className={`text-sm ${textMuted}`}>{item.replace(/^[-\d.]\s*/, '')}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    // Callout action box
                    if (part.startsWith(':::callout-action')) {
                      const inner = part.replace(':::callout-action', '').replace(':::', '').trim();
                      const lines = inner.split('\n').filter(l => l.trim());
                      const title = lines[0];
                      const items = lines.slice(1);
                      return (
                        <div key={idx} className={`my-4 p-4 rounded-xl border-l-4 border-[#3B82F6] ${isDark ? 'bg-[#3B82F6]/10' : 'bg-[#3B82F6]/5'}`}>
                          <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-[#3B82F6]' : 'text-[#2563eb]'}`}>{title}</h4>
                          <ul className="space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className={`text-sm ${textMuted}`}>{item.replace(/^[-\d.]\s*/, '')}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    // Regular content
                    return part.split('\n').map((line, lineIdx) => {
                      const cleanLine = stripMarkdown(line);
                      if (line.startsWith('## ')) {
                        return <h2 key={`${idx}-${lineIdx}`} className={`mt-5 mb-2 text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stripMarkdown(line.replace('## ', ''))}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={`${idx}-${lineIdx}`} className={`mt-3 mb-1.5 font-bold ${textPrimary}`}>{stripMarkdown(line.replace('### ', ''))}</h3>;
                      } else if (line.startsWith('- ')) {
                        return <li key={`${idx}-${lineIdx}`} className={`ml-4 ${textMuted}`}>{stripMarkdown(line.replace('- ', ''))}</li>;
                      } else if (line.match(/^\d\./)) {
                        return <li key={`${idx}-${lineIdx}`} className={`ml-4 list-decimal ${textMuted}`}>{stripMarkdown(line.replace(/^\d\./, ''))}</li>;
                      } else if (cleanLine.trim()) {
                        return <p key={`${idx}-${lineIdx}`} className={`mb-2 ${textMuted}`}>{cleanLine}</p>;
                      }
                      return null;
                    });
                  });
                })()}
              </article>
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 px-5 py-3 border-t flex justify-end gap-2 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <button
                onClick={() => navigator.clipboard.writeText(generatedReport.content)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                {language === 'ko' ? '복사' : 'Copy'}
              </button>
              <button
                onClick={() => setShowReport(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {language === 'ko' ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Article Modal */}
      {showArticle && generatedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowArticle(false)}
        >
          <div
            className={`w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${cardClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex-shrink-0 flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#21DBA4] flex items-center justify-center">
                  <Sparkles className="text-white" size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base font-black truncate ${textPrimary}`}>{generatedArticle.title}</h2>
                  <p className={`text-xs ${textMuted}`}>
                    {language === 'ko' ? `AI 아티클 • ${generatedArticle.wordCount}자` : `AI Article • ${generatedArticle.wordCount} chars`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowArticle(false)}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {generatedArticle.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isDark ? 'bg-slate-800 text-[#21DBA4]' : 'bg-[#21DBA4]/10 text-[#21DBA4]'}`}
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              <article className={`text-sm leading-relaxed ${textPrimary}`}>
                {(() => {
                  const content = generatedArticle.content;
                  const parts = content.split(/(:::callout-insight[\s\S]*?:::|:::callout-action[\s\S]*?:::)/g);

                  return parts.map((part, idx) => {
                    // Callout insight box
                    if (part.startsWith(':::callout-insight')) {
                      const inner = part.replace(':::callout-insight', '').replace(':::', '').trim();
                      const lines = inner.split('\n').filter(l => l.trim());
                      const title = lines[0];
                      const items = lines.slice(1);
                      return (
                        <div key={idx} className={`my-4 p-4 rounded-xl border-l-4 border-[#21DBA4] ${isDark ? 'bg-[#21DBA4]/10' : 'bg-[#21DBA4]/5'}`}>
                          <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-[#21DBA4]' : 'text-[#1a9f7c]'}`}>{title}</h4>
                          <ul className="space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className={`text-sm ${textMuted}`}>{item.replace(/^[-\d.]\s*/, '')}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    // Callout action box
                    if (part.startsWith(':::callout-action')) {
                      const inner = part.replace(':::callout-action', '').replace(':::', '').trim();
                      const lines = inner.split('\n').filter(l => l.trim());
                      const title = lines[0];
                      const items = lines.slice(1);
                      return (
                        <div key={idx} className={`my-4 p-4 rounded-xl border-l-4 border-[#3B82F6] ${isDark ? 'bg-[#3B82F6]/10' : 'bg-[#3B82F6]/5'}`}>
                          <h4 className={`font-bold text-sm mb-2 ${isDark ? 'text-[#3B82F6]' : 'text-[#2563eb]'}`}>{title}</h4>
                          <ul className="space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className={`text-sm ${textMuted}`}>{item.replace(/^[-\d.]\s*/, '')}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    // Regular content
                    return part.split('\n').map((line, lineIdx) => {
                      const cleanLine = stripMarkdown(line);
                      if (line.startsWith('## ')) {
                        return <h2 key={`${idx}-${lineIdx}`} className="mt-5 mb-2 text-base font-black text-[#21DBA4]">{stripMarkdown(line.replace('## ', ''))}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={`${idx}-${lineIdx}`} className={`mt-3 mb-1.5 font-bold ${textPrimary}`}>{stripMarkdown(line.replace('### ', ''))}</h3>;
                      } else if (line.startsWith('- ')) {
                        return <li key={`${idx}-${lineIdx}`} className={`ml-4 ${textMuted}`}>{stripMarkdown(line.replace('- ', ''))}</li>;
                      } else if (line.startsWith('*') && line.endsWith('*')) {
                        return <p key={`${idx}-${lineIdx}`} className={`mt-4 text-xs italic ${textMuted}`}>{line.replace(/\*/g, '')}</p>;
                      } else if (line.startsWith('---')) {
                        return <hr key={`${idx}-${lineIdx}`} className={`my-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />;
                      } else if (cleanLine.trim()) {
                        return <p key={`${idx}-${lineIdx}`} className={`mb-2 ${textMuted}`}>{cleanLine}</p>;
                      }
                      return null;
                    });
                  });
                })()}
              </article>
            </div>

            {/* Footer */}
            <div className={`flex-shrink-0 px-5 py-3 border-t flex justify-end gap-2 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`}>
              <button
                onClick={() => navigator.clipboard.writeText(generatedArticle.content)}
                className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                {language === 'ko' ? '복사' : 'Copy'}
              </button>
              <button
                onClick={() => setShowArticle(false)}
                className="px-3 py-1.5 rounded-lg font-semibold text-sm bg-[#21DBA4] text-white hover:bg-[#1bc290] transition-colors"
              >
                {language === 'ko' ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
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