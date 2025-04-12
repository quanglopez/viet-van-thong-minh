-- Create enum for subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- Create enum for content status
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Update existing profiles table to include subscription information
ALTER TABLE profiles
ADD COLUMN subscription_tier subscription_tier DEFAULT 'free',
ADD COLUMN subscription_start timestamp with time zone,
ADD COLUMN subscription_end timestamp with time zone,
ADD COLUMN monthly_token_limit integer DEFAULT 10000,
ADD COLUMN tokens_used integer DEFAULT 0,
ADD COLUMN last_token_reset timestamp with time zone DEFAULT now();

-- Create table for user content
CREATE TABLE user_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  prompt text NOT NULL,
  tokens_used integer,
  status content_status DEFAULT 'draft',
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  category text,
  template text
);

-- Create table for tone templates
CREATE TABLE tone_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  settings jsonb NOT NULL,
  is_system boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for content templates
CREATE TABLE content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  prompt_template text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  is_system boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for usage statistics
CREATE TABLE usage_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  tokens_used integer DEFAULT 0,
  content_count integer DEFAULT 0
);

-- Insert initial system tone templates
INSERT INTO tone_templates (name, description, settings, is_system) VALUES
('Chuyên nghiệp', 'Giọng điệu trang trọng, chuyên nghiệp cho doanh nghiệp', '{"tone": "professional", "dialect": "neutral", "voiceStyle": "written", "temperature": 0.7}'::jsonb, true),
('Thân thiện', 'Giọng điệu thân thiện, gần gũi', '{"tone": "friendly", "dialect": "neutral", "voiceStyle": "conversational", "temperature": 0.8}'::jsonb, true),
('Học thuật', 'Giọng điệu học thuật, nghiêm túc', '{"tone": "formal", "dialect": "neutral", "voiceStyle": "written", "temperature": 0.5}'::jsonb, true),
('Thuyết phục', 'Giọng điệu thuyết phục, hấp dẫn', '{"tone": "persuasive", "dialect": "neutral", "voiceStyle": "written", "temperature": 0.7}'::jsonb, true);

-- Insert initial system content templates
INSERT INTO content_templates (name, description, category, prompt_template, settings, is_system) VALUES
('Bài blog', 'Mẫu cho bài viết blog', 'Blog', 'Viết một bài blog về chủ đề: {{chủ_đề}}. Bài viết nên bao gồm phần giới thiệu, ít nhất 3 điểm chính, và phần kết luận.', '{"contentType": "blog", "targetLength": "medium"}'::jsonb, true),
('Email Marketing', 'Mẫu cho email marketing', 'Email', 'Viết một email marketing giới thiệu {{sản_phẩm/dịch_vụ}} đến khách hàng tiềm năng. Email nên có lời chào, giới thiệu đặc điểm nổi bật, lợi ích và lời kêu gọi hành động.', '{"contentType": "email", "targetLength": "short"}'::jsonb, true),
('Mô tả sản phẩm', 'Mẫu cho mô tả sản phẩm', 'Marketing', 'Viết mô tả sản phẩm cho {{tên_sản_phẩm}} với các đặc điểm sau: {{đặc_điểm}}. Mô tả nên nhấn mạnh lợi ích, cách sử dụng và lý do nên mua sản phẩm.', '{"contentType": "product", "targetLength": "short"}'::jsonb, true),
('Bài đăng mạng xã hội', 'Mẫu cho bài đăng mạng xã hội', 'Social Media', 'Viết một bài đăng trên mạng xã hội về {{chủ_đề}} để thu hút sự tương tác của người dùng. Nên bao gồm hashtag và emoji phù hợp.', '{"contentType": "social", "targetLength": "short"}'::jsonb, true);

-- Create RLS (Row Level Security) policies
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own content" 
  ON user_content FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content" 
  ON user_content FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content" 
  ON user_content FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content" 
  ON user_content FOR DELETE 
  USING (auth.uid() = user_id);

ALTER TABLE tone_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view system templates and their own templates" 
  ON tone_templates FOR SELECT 
  USING (is_system OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates" 
  ON tone_templates FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND NOT is_system);

CREATE POLICY "Users can update their own templates" 
  ON tone_templates FOR UPDATE 
  USING (auth.uid() = user_id AND NOT is_system);

CREATE POLICY "Users can delete their own templates" 
  ON tone_templates FOR DELETE 
  USING (auth.uid() = user_id AND NOT is_system);

ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view system templates and their own templates" 
  ON content_templates FOR SELECT 
  USING (is_system OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates" 
  ON content_templates FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND NOT is_system);

CREATE POLICY "Users can update their own templates" 
  ON content_templates FOR UPDATE 
  USING (auth.uid() = user_id AND NOT is_system);

CREATE POLICY "Users can delete their own templates" 
  ON content_templates FOR DELETE 
  USING (auth.uid() = user_id AND NOT is_system);

ALTER TABLE usage_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own usage statistics" 
  ON usage_statistics FOR SELECT 
  USING (auth.uid() = user_id);

-- Create functions for token usage management
CREATE OR REPLACE FUNCTION check_token_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the user's subscription details
  DECLARE
    user_profile RECORD;
    tokens_available INTEGER;
  BEGIN
    SELECT * INTO user_profile FROM profiles WHERE id = NEW.user_id;
    
    -- Check if monthly reset is needed
    IF user_profile.last_token_reset < date_trunc('month', CURRENT_DATE) THEN
      -- Reset tokens used at the beginning of each month
      UPDATE profiles 
      SET tokens_used = 0, 
          last_token_reset = date_trunc('month', CURRENT_DATE)
      WHERE id = NEW.user_id;
      
      -- Get updated profile
      SELECT * INTO user_profile FROM profiles WHERE id = NEW.user_id;
    END IF;
    
    tokens_available := user_profile.monthly_token_limit - user_profile.tokens_used;
    
    -- Check if user has enough tokens
    IF NEW.tokens_used > tokens_available THEN
      RAISE EXCEPTION 'Token limit exceeded. Available: %, Requested: %', 
                      tokens_available, NEW.tokens_used;
    END IF;
    
    -- Update user's token usage
    UPDATE profiles 
    SET tokens_used = tokens_used + NEW.tokens_used
    WHERE id = NEW.user_id;
    
    -- Update usage statistics
    INSERT INTO usage_statistics (user_id, tokens_used, content_count)
    VALUES (NEW.user_id, NEW.tokens_used, 1)
    ON CONFLICT (user_id, date) 
    DO UPDATE SET 
      tokens_used = usage_statistics.tokens_used + NEW.tokens_used,
      content_count = usage_statistics.content_count + 1;
      
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_token_limit_trigger
BEFORE INSERT ON user_content
FOR EACH ROW
EXECUTE FUNCTION check_token_limit();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, username)
  VALUES (new.id, 
          coalesce(new.raw_user_meta_data->>'full_name', 'User'), 
          coalesce(new.email, 'user-' || new.id));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create analytics view
CREATE VIEW content_analytics AS
SELECT 
  u.id as user_id,
  u.email,
  p.full_name,
  p.subscription_tier,
  p.monthly_token_limit,
  p.tokens_used,
  COUNT(uc.id) as total_content_count,
  SUM(uc.tokens_used) as total_tokens_used,
  AVG(uc.tokens_used) as avg_tokens_per_content,
  MIN(uc.created_at) as first_content_date,
  MAX(uc.created_at) as last_content_date
FROM 
  auth.users u
  JOIN profiles p ON u.id = p.id
  LEFT JOIN user_content uc ON u.id = uc.user_id
GROUP BY 
  u.id, u.email, p.full_name, p.subscription_tier, p.monthly_token_limit, p.tokens_used; 