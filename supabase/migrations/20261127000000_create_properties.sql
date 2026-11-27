-- =========================================================
-- 物件テーブル（properties）の作成
-- Supabase ダッシュボードの「SQL Editor」に貼り付けて実行する
-- =========================================================

create table if not exists public.properties (
  -- 物件ID（自動採番）
  id bigint generated always as identity primary key,
  -- 登録したユーザー（未指定の場合はログイン中のユーザーIDが入る）
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- 物件名
  name text not null check (char_length(name) > 0),
  -- 家賃（円）
  rent integer not null check (rent >= 0),
  -- エリア名
  area text not null check (char_length(area) > 0),
  -- 間取り（例：1LDK）
  layout text not null check (char_length(layout) > 0),
  -- 作成日時・更新日時
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの検索を速くするためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- ---------------------------------------------------------
-- 更新日時（updated_at）を自動で更新するトリガー
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- RLS（行レベルセキュリティ）の有効化
-- 有効にすると、ポリシーで許可した操作以外はすべて拒否される
-- ---------------------------------------------------------
alter table public.properties enable row level security;

-- 自分が登録した物件のみ表示できる
drop policy if exists "自分の物件のみ表示" on public.properties;
create policy "自分の物件のみ表示"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 自分のユーザーIDでのみ物件を登録できる（他人名義での登録を防ぐ）
drop policy if exists "自分の物件のみ登録" on public.properties;
create policy "自分の物件のみ登録"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 自分が登録した物件のみ編集できる（所有者を他人に変更することも防ぐ）
drop policy if exists "自分の物件のみ編集" on public.properties;
create policy "自分の物件のみ編集"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 自分が登録した物件のみ削除できる
drop policy if exists "自分の物件のみ削除" on public.properties;
create policy "自分の物件のみ削除"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
