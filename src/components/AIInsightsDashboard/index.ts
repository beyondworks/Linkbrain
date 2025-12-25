// ═══════════════════════════════════════════════════
// AI Insights Dashboard Components
// Redesigned with Linear/Notion/Stripe/Supabase aesthetics
// ═══════════════════════════════════════════════════

// Main dashboard component (includes most UI internally)
export { AIInsightsDashboard } from '../AIInsightsDashboard';

// Legacy sub-components (kept for backwards compatibility)
// These are now integrated into the main AIInsightsDashboard component
// Consider removing if not used elsewhere in the codebase
export { SavePatternHeatmap } from './SavePatternHeatmap';
export { TrendCards } from './TrendCards';
export { KeywordSection } from './KeywordSection';
export { InterestTimeline } from './InterestTimeline';
export { ActionBar } from './ActionBar';
export { UnreadInbox } from './UnreadInbox';
