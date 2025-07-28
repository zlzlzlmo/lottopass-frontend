-- Supabase 데이터베이스 초기 설정 SQL

-- 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 기록 테이블 생성
CREATE TABLE IF NOT EXISTS public.records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_number INTEGER NOT NULL,
  numbers INTEGER[] NOT NULL CHECK (array_length(numbers, 1) = 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_winner BOOLEAN,
  matched_count INTEGER,
  CONSTRAINT numbers_valid CHECK (
    numbers[1] BETWEEN 1 AND 45 AND
    numbers[2] BETWEEN 1 AND 45 AND
    numbers[3] BETWEEN 1 AND 45 AND
    numbers[4] BETWEEN 1 AND 45 AND
    numbers[5] BETWEEN 1 AND 45 AND
    numbers[6] BETWEEN 1 AND 45
  )
);

-- 당첨매장 테이블 생성 (캐싱용)
CREATE TABLE IF NOT EXISTS public.winning_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_number INTEGER NOT NULL,
  rank INTEGER NOT NULL CHECK (rank IN (1, 2)),
  store_name TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(draw_number, rank, store_name)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_records_user_id ON public.records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_draw_number ON public.records(draw_number);
CREATE INDEX IF NOT EXISTS idx_winning_stores_draw_number ON public.winning_stores(draw_number);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winning_stores ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 기록 정책
CREATE POLICY "Users can view own records" ON public.records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON public.records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON public.records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON public.records
  FOR DELETE USING (auth.uid() = user_id);

-- 당첨매장 정책 (읽기 전용)
CREATE POLICY "Anyone can view winning stores" ON public.winning_stores
  FOR SELECT USING (true);

-- 트리거: 사용자 생성 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 트리거: 프로필 업데이트 시 updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();