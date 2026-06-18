-- hakjicon-content-search Must-have 마이그레이션 (Part A: 인기추천 + 북마크)
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행하세요. (schema.sql / seed.sql 실행 이후)

-- 1) tasks 1.2 : 인기 점수 컬럼 + 초기값 시드 (결정적, 재실행 안전)
alter table public.contents
  add column if not exists view_count integer not null default 0;

update public.contents
  set view_count = (char_length(title) * 13 + coalesce(char_length(description), 0)) % 100
  where view_count = 0;

-- 2) tasks 1.3 : 북마크 테이블 (익명 client_id 기준, 중복 방지)
create table if not exists public.bookmarks (
  id         uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete cascade,
  client_id  uuid not null,
  created_at timestamptz not null default now(),
  unique (content_id, client_id)
);

-- 3) tasks 1.4 : RLS 확장 — bookmarks anon CRUD 허용 (contents는 읽기전용 유지)
alter table public.bookmarks enable row level security;

drop policy if exists "anon bookmarks read"   on public.bookmarks;
drop policy if exists "anon bookmarks insert" on public.bookmarks;
drop policy if exists "anon bookmarks delete" on public.bookmarks;

create policy "anon bookmarks read"
  on public.bookmarks for select to anon, authenticated using (true);
create policy "anon bookmarks insert"
  on public.bookmarks for insert to anon, authenticated with check (true);
create policy "anon bookmarks delete"
  on public.bookmarks for delete to anon, authenticated using (true);

-- 4) tasks 1.5 : 조회수 증가 RPC
--    security definer 로 실행해 contents 읽기전용 RLS를 우회하여 +1 (직접 update는 차단 유지)
create or replace function public.increment_view_count(content_id uuid)
  returns void
  language sql
  security definer
  set search_path = public
as $$
  update public.contents set view_count = view_count + 1 where id = content_id;
$$;

grant execute on function public.increment_view_count(uuid) to anon, authenticated;
