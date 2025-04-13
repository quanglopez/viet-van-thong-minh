
import { Database } from './types';

// Extend the Database type to include our custom tables
export interface CustomDatabase extends Database {
  public: {
    Tables: {
      profiles: Database['public']['Tables']['profiles'];
      user_content: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          prompt: string;
          tokens_used?: number;
          status?: 'draft' | 'published' | 'archived';
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          category?: string;
          template?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          prompt?: string;
          tokens_used?: number;
          status?: 'draft' | 'published' | 'archived';
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          category?: string;
          template?: string;
        };
      };
      tone_templates: {
        Row: {
          id: string;
          name: string;
          description?: string;
          settings: Record<string, any>;
          is_system: boolean;
          user_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          settings: Record<string, any>;
          is_system: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          settings?: Record<string, any>;
          is_system?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_templates: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          category: string;
          prompt_template: string;
          settings?: Record<string, any>;
          is_system: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          prompt_template?: string;
          settings?: Record<string, any>;
          is_system?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_statistics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          tokens_used: number;
          content_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          tokens_used: number;
          content_count: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          tokens_used?: number;
          content_count?: number;
        };
      };
      content_analytics: {
        Row: {
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
        };
        Insert: {
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
        };
        Update: {
          user_id?: string;
          email?: string;
          full_name?: string;
          subscription_tier?: string;
          monthly_token_limit?: number;
          tokens_used?: number;
          total_content_count?: number;
          total_tokens_used?: number;
          avg_tokens_per_content?: number;
          first_content_date?: string;
          last_content_date?: string;
        };
      };
    };
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'];
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  };
};
