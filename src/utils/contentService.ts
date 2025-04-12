import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

export type UserContent = Tables<'user_content'>;
export type ToneTemplate = Tables<'tone_templates'>;
export type ContentTemplate = Tables<'content_templates'>;
export type UserProfile = Tables<'profiles'>;

/**
 * Get user content items with pagination
 */
export async function getUserContent(options: {
  limit?: number;
  page?: number;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  category?: string;
}): Promise<{ data: UserContent[] | null; count: number; error: Error | null }> {
  const {
    limit = 10,
    page = 1,
    status,
    search,
    category
  } = options;

  try {
    // Build the query
    let query = supabase
      .from('user_content')
      .select('*', { count: 'exact' });

    // Add filters
    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    // Execute the query
    const { data, count, error } = await query;

    return {
      data,
      count: count || 0,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error fetching user content:', error);
    return {
      data: null,
      count: 0,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Get a single content item by ID
 */
export async function getContentById(id: string): Promise<{ data: UserContent | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('user_content')
      .select('*')
      .eq('id', id)
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Update a content item
 */
export async function updateContent(
  id: string, 
  updates: Partial<UserContent>
): Promise<{ data: UserContent | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('user_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error updating content:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Delete a content item
 */
export async function deleteContent(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('user_content')
      .delete()
      .eq('id', id);

    return {
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error deleting content:', error);
    return {
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Get all tone templates (system and user-created)
 */
export async function getToneTemplates(): Promise<{ data: ToneTemplate[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('tone_templates')
      .select('*')
      .order('name');

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error fetching tone templates:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Create a new tone template
 */
export async function createToneTemplate(
  template: Omit<ToneTemplate, 'id' | 'created_at' | 'updated_at' | 'is_system' | 'user_id'>
): Promise<{ data: ToneTemplate | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('tone_templates')
      .insert({
        ...template,
        is_system: false,
      })
      .select()
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error creating tone template:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Get content templates, optionally filtered by category
 */
export async function getContentTemplates(
  category?: string
): Promise<{ data: ContentTemplate[] | null; error: Error | null }> {
  try {
    let query = supabase.from('content_templates').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('name');

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error fetching content templates:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Get all available template categories
 */
export async function getTemplateCategories(): Promise<{ data: string[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('content_templates')
      .select('category')
      .order('category');

    if (error) {
      throw error;
    }

    // Extract unique categories with proper type assertions
    const categories = [...new Set(data.map(item => item.category as string))];

    return {
      data: categories,
      error: null
    };
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Create a new content template
 */
export async function createContentTemplate(
  template: Omit<ContentTemplate, 'id' | 'created_at' | 'updated_at' | 'is_system' | 'user_id'>
): Promise<{ data: ContentTemplate | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('content_templates')
      .insert({
        ...template,
        is_system: false,
      })
      .select()
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error creating content template:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Get the user's profile with subscription info
 */
export async function getUserProfile(): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Get user's usage statistics
 */
export async function getUserUsageStats(
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<{ 
  data: { date: string; tokens_used: number; content_count: number }[] | null; 
  error: Error | null 
}> {
  try {
    let query = supabase.from('usage_statistics').select('*');
    
    // Add date filter based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    
    query = query.gte('date', startDate.toISOString().split('T')[0]);
    
    const { data, error } = await query.order('date');

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    console.error('Error fetching usage statistics:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Check if a user can generate content (has enough tokens)
 */
export async function canGenerateContent(estimatedTokens: number): Promise<{ 
  canGenerate: boolean; 
  availableTokens: number;
  error: Error | null 
}> {
  try {
    const { data: profile, error } = await getUserProfile();
    
    if (error) {
      throw error;
    }
    
    if (!profile) {
      throw new Error('User profile not found');
    }
    
    const availableTokens = profile.monthly_token_limit - profile.tokens_used;
    const canGenerate = availableTokens >= estimatedTokens;
    
    return {
      canGenerate,
      availableTokens,
      error: null
    };
  } catch (error) {
    console.error('Error checking token allowance:', error);
    return {
      canGenerate: false,
      availableTokens: 0,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
} 