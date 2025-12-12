import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Brain, TrendingUp, Clock, BookOpen, Tag, Globe, Zap, Target, Network } from 'lucide-react';

type LinkItem = {
  id: number;
  title: string;
  url: string;
  tags: string[];
  timestamp: number;
  readTime: string;
  aiScore: number;
  categoryId: string;
  isArchived?: boolean;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

type AIInsightsDashboardProps = {
  links: LinkItem[];
  categories: Category[];
  theme: 'light' | 'dark';
  t: (key: string) => string;
};

export const AIInsightsDashboard = ({ links, categories, theme, t }: AIInsightsDashboardProps) => {
  const isDark = theme === 'dark';
  
  // Calculate insights
  const thisWeekTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekLinks = links.filter(l => l.timestamp >= thisWeekTimestamp && !l.isArchived);
  const totalLinks = links.filter(l => !l.isArchived).length;
  
  // Top Keywords
  const keywordCounts: Record<string, number> = {};
  links.forEach(link => {
    link.tags.forEach(tag => {
      keywordCounts[tag] = (keywordCounts[tag] || 0) + 1;
    });
  });
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));
  
  // Main Sources
  const sourceCounts: Record<string, number> = {};
  links.forEach(link => {
    const domain = link.url.split('/')[0];
    sourceCounts[domain] = (sourceCounts[domain] || 0) + 1;
  });
  const mainSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
  
  // Category Distribution
  const categoryCounts: Record<string, number> = {};
  links.forEach(link => {
    const cat = categories.find(c => c.id === link.categoryId);
    if (cat) {
      categoryCounts[cat.name] = (categoryCounts[cat.name] || 0) + 1;
    }
  });
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  
  // Reading Patterns (Last 7 days)
  const readingPatterns = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayName = date.toLocaleDateString('en', { weekday: 'short' });
    const dayStart = new Date(date).setHours(0, 0, 0, 0);
    const dayEnd = new Date(date).setHours(23, 59, 59, 999);
    const count = links.filter(l => l.timestamp >= dayStart && l.timestamp <= dayEnd).length;
    readingPatterns.push({ day: dayName, links: count });
  }
  
  // Quality Analysis (AI Score Distribution)
  const qualityRanges = {
    'Excellent (90+)': 0,
    'Great (80-89)': 0,
    'Good (70-79)': 0,
    'Fair (60-69)': 0,
    'Low (<60)': 0
  };
  links.forEach(link => {
    if (link.aiScore >= 90) qualityRanges['Excellent (90+)']++;
    else if (link.aiScore >= 80) qualityRanges['Great (80-89)']++;
    else if (link.aiScore >= 70) qualityRanges['Good (70-79)']++;
    else if (link.aiScore >= 60) qualityRanges['Fair (60-69)']++;
    else qualityRanges['Low (<60)']++;
  });
  const qualityData = Object.entries(qualityRanges).map(([name, value]) => ({ name, value }));
  
  // Topic Connections (Radar Chart)
  const topicData = [
    { subject: 'Design', value: links.filter(l => l.tags.some(t => t.toLowerCase().includes('design') || t.toLowerCase().includes('ui'))).length },
    { subject: 'AI/ML', value: links.filter(l => l.tags.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('ml'))).length },
    { subject: 'Dev', value: links.filter(l => l.tags.some(t => t.toLowerCase().includes('dev') || t.toLowerCase().includes('code'))).length },
    { subject: 'Business', value: links.filter(l => l.tags.some(t => t.toLowerCase().includes('business') || t.toLowerCase().includes('marketing'))).length },
    { subject: 'Trends', value: links.filter(l => l.tags.some(t => t.toLowerCase().includes('trend') || t.toLowerCase().includes('future'))).length },
  ];
  
  // Avg Read Time
  const avgReadTime = links.reduce((acc, link) => {
    const mins = parseInt(link.readTime.split(' ')[0]) || 0;
    return acc + mins;
  }, 0) / links.length || 0;
  
  const COLORS = ['#21DBA4', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  const cardClass = isDark 
    ? 'bg-slate-900 border-slate-800' 
    : 'bg-white border-slate-100';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const textPrimary = isDark ? 'text-slate-100' : 'text-slate-900';
  
  return (
    <div className="space-y-8">
      {/* Hero Summary Card */}
      <div className={`rounded-2xl border p-8 shadow-lg ${cardClass}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#21DBA4] to-[#1bc290] flex items-center justify-center shadow-lg">
            <Brain className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h2 className={`text-xl font-black mb-2 ${textPrimary}`}>{t('weeklyInsights')}</h2>
            <p className={textMuted}>
              {t('insightsSummary').replace('{count}', String(thisWeekLinks.length))}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            icon={<BookOpen size={20} />}
            label={t('totalLinks')}
            value={totalLinks}
            trend="+12%"
            theme={theme}
          />
          <StatCard 
            icon={<TrendingUp size={20} />}
            label={t('thisWeek')}
            value={thisWeekLinks.length}
            trend={t('trend')}
            theme={theme}
          />
          <StatCard 
            icon={<Clock size={20} />}
            label={t('avgReadTime')}
            value={`${Math.round(avgReadTime)} min`}
            trend="-8%"
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
        </ChartCard>
        
        {/* Main Sources */}
        <ChartCard 
          title={t('mainSources')}
          icon={<Globe size={18} />}
          theme={theme}
        >
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
                {mainSources.map((entry, index) => (
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
        </ChartCard>
        
        {/* Reading Patterns */}
        <ChartCard 
          title={t('readingPatterns')}
          icon={<TrendingUp size={18} />}
          theme={theme}
        >
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
          items={[
            'Generative AI Tools',
            'Design Systems 2.0',
            'Web Performance',
            'Sustainability Tech'
          ]}
        />
        <InsightCard 
          title={t('contentGaps')}
          icon={<BookOpen size={18} />}
          theme={theme}
          items={[
            'Mobile Development',
            'Data Visualization',
            'Product Strategy',
            'Team Management'
          ]}
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
      <div className="text-xs text-[#21DBA4] font-bold mt-1">{trend}</div>
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