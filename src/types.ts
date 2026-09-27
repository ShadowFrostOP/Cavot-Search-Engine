export type SearchCategory = 'web' | 'images' | 'videos' | 'news' | 'maps' | 'shopping' | 'books';

export interface QuickAnswer {
  direct: string;
  explanation: string;
  source?: string;
  type?: 'calc' | 'factual' | 'definition' | 'weather';
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  category: SearchCategory;
  date?: string;
  author?: string;
  imageUrl?: string;
  videoDuration?: string;
  views?: string;
  price?: string;
  rating?: number;
  location?: string;
  snippet?: string;
  tags?: string[];
}

export interface QuickShortcut {
  id: string;
  name: string;
  shortcut: string;
  url: string;
  searchUrl?: string;
  custom?: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  category: SearchCategory;
}

export interface FavoriteItem {
  id: string;
  resultId: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  category: SearchCategory;
  dateAdded: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  safeSearch: 'strict' | 'moderate' | 'off';
  resultsPerPage: number;
  openInNewTab: boolean;
  autoSuggest: boolean;
  historyTracking: boolean;
  screenTimeGoalMin: number;
  region: string;
  language: string;
}

export interface ScreenTimeState {
  totalActiveSecondsToday: number;
  dateString: string;
  sessionsToday: number;
}
