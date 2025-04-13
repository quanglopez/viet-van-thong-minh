
// This file contains TypeScript definitions for our custom database tables

export interface UserContent {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prompt: string;
  tokens_used?: number;
  status?: 'draft' | 'published' | 'archived';
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
  category?: string;
  template?: string;
}

export interface ToneTemplate {
  id: string;
  name: string;
  description?: string;
  settings: Record<string, any>;
  is_system: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  prompt_template: string;
  settings?: Record<string, any>;
  is_system: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_start?: string;
  subscription_end?: string;
  monthly_token_limit: number;
  tokens_used: number;
  last_token_reset?: string;
}

export interface UsageStatistics {
  id: string;
  user_id: string;
  date: string;
  tokens_used: number;
  content_count: number;
}

export interface ContentAnalytics {
  user_id: string;
  email?: string;
  full_name?: string;
  subscription_tier?: string;
  monthly_token_limit: number;
  tokens_used: number;
  total_content_count: number;
  total_tokens_used: number;
  avg_tokens_per_content: number;
  first_content_date?: string;
  last_content_date?: string;
}
