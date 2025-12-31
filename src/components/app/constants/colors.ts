// Category color mapping
// Light mode colors with corresponding dark mode variants (with transparency)
// Each color has: light (original), dark (with transparency applied for dark backgrounds)

export interface CategoryColorSet {
    light: string;
    dark: string;
}

// New color palette as per design - dark mode has higher opacity for visibility
export const CATEGORY_COLOR_PALETTE: CategoryColorSet[] = [
    { light: '#F0EFED', dark: 'rgba(128, 128, 128, 0.55)' },      // Gray
    { light: '#E6E5E3', dark: 'rgba(108, 108, 105, 0.55)' },      // Warm Gray
    { light: '#E8DED9', dark: 'rgba(160, 130, 110, 0.55)' },      // Warm Beige
    { light: '#EFDBCF', dark: 'rgba(200, 140, 90, 0.55)' },       // Peach/Orange
    { light: '#EEE1BB', dark: 'rgba(180, 160, 60, 0.55)' },       // Yellow/Olive
    { light: '#DBE5DC', dark: 'rgba(80, 150, 100, 0.55)' },       // Mint/Green
    { light: '#D5E0F6', dark: 'rgba(90, 130, 200, 0.55)' },       // Light Blue
    { light: '#E7DBF1', dark: 'rgba(140, 100, 180, 0.55)' },      // Purple
    { light: '#F1D8E3', dark: 'rgba(180, 100, 140, 0.55)' },      // Pink
    { light: '#F4D8D8', dark: 'rgba(190, 110, 110, 0.55)' },      // Rose/Red
];

// Legacy mapping for backward compatibility (uses light mode colors by default)
// This keeps the old key-value structure working
export const CATEGORY_COLORS: Record<string, string> = {
    'bg-pink-100 text-pink-600': '#F1D8E3',        // Pink
    'bg-blue-100 text-blue-600': '#D5E0F6',        // Blue
    'bg-emerald-100 text-emerald-600': '#DBE5DC',  // Green
    'bg-orange-100 text-orange-600': '#EFDBCF',    // Orange
    'bg-purple-100 text-purple-600': '#E7DBF1',    // Purple
    'bg-green-200 text-green-700': '#DBE5DC',      // Green (duplicate for legacy)
    'bg-indigo-200 text-indigo-700': '#D5E0F6',    // Blue (duplicate for legacy)
    'bg-red-200 text-red-700': '#F4D8D8',          // Red
    'bg-slate-100 text-slate-600': '#F0EFED',      // Gray (legacy default)
    // New indexed colors (for color picker)
    'color-0': '#F0EFED',
    'color-1': '#E6E5E3',
    'color-2': '#E8DED9',
    'color-3': '#EFDBCF',
    'color-4': '#EEE1BB',
    'color-5': '#DBE5DC',
    'color-6': '#D5E0F6',
    'color-7': '#E7DBF1',
    'color-8': '#F1D8E3',
    'color-9': '#F4D8D8',
};

// Dark mode color mapping - increased opacity for better visibility
export const CATEGORY_COLORS_DARK: Record<string, string> = {
    'bg-pink-100 text-pink-600': 'rgba(180, 100, 140, 0.55)',
    'bg-blue-100 text-blue-600': 'rgba(90, 130, 200, 0.55)',
    'bg-emerald-100 text-emerald-600': 'rgba(80, 150, 100, 0.55)',
    'bg-orange-100 text-orange-600': 'rgba(200, 140, 90, 0.55)',
    'bg-purple-100 text-purple-600': 'rgba(140, 100, 180, 0.55)',
    'bg-green-200 text-green-700': 'rgba(80, 150, 100, 0.55)',
    'bg-indigo-200 text-indigo-700': 'rgba(90, 130, 200, 0.55)',
    'bg-red-200 text-red-700': 'rgba(190, 110, 110, 0.55)',
    'bg-slate-100 text-slate-600': 'rgba(128, 128, 128, 0.55)',
    // New indexed colors (for color picker)
    'color-0': 'rgba(128, 128, 128, 0.55)',
    'color-1': 'rgba(108, 108, 105, 0.55)',
    'color-2': 'rgba(160, 130, 110, 0.55)',
    'color-3': 'rgba(200, 140, 90, 0.55)',
    'color-4': 'rgba(180, 160, 60, 0.55)',
    'color-5': 'rgba(80, 150, 100, 0.55)',
    'color-6': 'rgba(90, 130, 200, 0.55)',
    'color-7': 'rgba(140, 100, 180, 0.55)',
    'color-8': 'rgba(180, 100, 140, 0.55)',
    'color-9': 'rgba(190, 110, 110, 0.55)',
};

// Helper function to get category color based on theme
export function getCategoryColor(colorKey: string, isDark: boolean): string {
    if (isDark) {
        return CATEGORY_COLORS_DARK[colorKey] || 'rgba(128, 128, 128, 0.55)';
    }
    return CATEGORY_COLORS[colorKey] || '#F0EFED';
}
