-- tasks 1.2 + 1.3 : contents 테이블 + 읽기전용 RLS
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.contents (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text,
  category    text,
  description text,
  cover_url   text
);

-- 참고: MVP 데이터(10~20건)에는 별도 인덱스가 필요 없다. ILIKE 풀스캔으로 충분.
-- 데이터가 커지면 pg_trgm + GIN 인덱스 도입을 검토한다 (design.md Risks 참고).

alter table public.contents enable row level security;

-- 읽기전용: 익명(anon) 및 인증 사용자에게 SELECT만 허용
drop policy if exists "Public read access" on public.contents;
create policy "Public read access"
  on public.contents
  for select
  to anon, authenticated
  using (true);
