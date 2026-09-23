-- Crema migration 002: drafts, tags, full-text search, comments, likes, bookmarks
-- Run once AFTER 001_schema.sql, in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run

-- ============ Posts: content column, drafts, tags, search ============

alter table public.posts rename column description to content;
alter table public.posts drop constraint if exists posts_description_check;

alter table public.posts
  add column status text not null default 'published' check (status in ('draft', 'published'));

-- Drafts may be short; published posts need real content
alter table public.posts
  add constraint posts_content_check check (status = 'draft' or char_length(content) >= 20);

alter table public.posts
  add column tags text[] not null default '{}' check (cardinality(tags) <= 5);

alter table public.posts
  add column search tsvector generated always as (
    setweight(to_tsvector('simple'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(content, '')), 'B')
  ) stored;

create index posts_search_idx on public.posts using gin (search);
create index posts_tags_idx on public.posts using gin (tags);
create index posts_status_created_idx on public.posts (status, created_at desc);

-- Drafts are only visible to their author
drop policy "Posts are viewable by everyone" on public.posts;
create policy "Published posts are public, drafts are private"
  on public.posts for select
  using (status = 'published' or (select auth.uid()) = user_id);

-- ============ Comments ============

create table public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index comments_post_id_idx on public.comments (post_id, created_at);
create index comments_user_id_idx on public.comments (user_id);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Users can comment on published posts"
  on public.comments for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published')
  );

-- Commenters can delete their own comments; post authors can moderate their posts
create policy "Authors and post owners can delete comments"
  on public.comments for delete to authenticated
  using (
    (select auth.uid()) = user_id
    or (select auth.uid()) = (select p.user_id from public.posts p where p.id = post_id)
  );

-- Live comments
alter publication supabase_realtime add table public.comments;

-- ============ Likes ============

create table public.likes (
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index likes_user_id_idx on public.likes (user_id);

alter table public.likes enable row level security;

create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Users can like as themselves"
  on public.likes for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own likes"
  on public.likes for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ============ Bookmarks (private) ============

create table public.bookmarks (
  post_id bigint not null references public.posts (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index bookmarks_user_id_idx on public.bookmarks (user_id, created_at desc);

alter table public.bookmarks enable row level security;

create policy "Users can see their own bookmarks"
  on public.bookmarks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can bookmark as themselves"
  on public.bookmarks for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own bookmarks"
  on public.bookmarks for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ============ Popular tags ============

create function public.popular_tags(max_count int default 12)
returns table (tag text, uses bigint)
language sql
stable
set search_path = ''
as $$
  select t, count(*)
  from public.posts p, unnest(p.tags) as t
  where p.status = 'published'
  group by t
  order by count(*) desc, t
  limit max_count;
$$;
