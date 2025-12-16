// --- Types ---
export type LinkItem = {
    id: string;  // Changed from number to string for Firebase compatibility
    title: string;
    url: string;
    image: string;
    images?: string[];  // Multiple images for carousel
    summary: string;
    tags: string[];
    date: string;
    timestamp: number;
    readTime: string;
    aiScore: number;
    categoryId: string;
    collectionIds: string[];
    isFavorite: boolean;
    isReadLater: boolean;
    isArchived: boolean;
    notes?: string;
    keyTakeaways?: string[];
    content?: string;  // Full article content (markdown or plain text)
    platform?: 'youtube' | 'instagram' | 'threads' | 'web';  // Platform type
    author?: string;  // Author name
    authorHandle?: string;  // Author handle (@username)
    authorAvatar?: string;  // Author profile image
    chatHistory?: Array<{ role: 'user' | 'ai'; content: string; timestamp?: number }>;  // AI Chat history
};

export type Category = {
    id: string;
    name: string;
    color: string;
};

export type Collection = {
    id: string;
    name: string;
    color: string;
};
