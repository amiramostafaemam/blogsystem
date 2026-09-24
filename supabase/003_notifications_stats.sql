-- Crema migration 003: notifications, story views + writer stats, OAuth-friendly profiles
-- Run once AFTER 002, in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
--
-- Note: notifications.comment_id and post_views have no foreign key to comments/profiles
-- on purpose. Extra FKs create new many-to-many paths between posts, comments and profiles,
-- which makes PostgREST embeds like comments(count) ambiguous.

-- ============ Profiles from Google / GitHub sign-in ============

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    left(coalesce(
      nullif(meta ->> 'name', ''),
      nullif(meta ->> 'full_name', ''),
      nullif(meta ->> 'user_name', ''),
      split_part(new.email, '@', 1)
    ), 60),
    coalesce(meta ->> 'avatar_url', meta ->> 'picture')
  );
  return new;
end;
$$;

-- ============ Notifications ============

create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,  -- who receives it
  actor_id uuid not null references public.profiles (id) on delete cascade, -- who did it
  type text not null check (type in ('like', 'comment')),
  post_id bigint not null references public.posts (id) on delete cascade,
  comment_id bigint,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can read their own notifications"
  on public.notifications for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can mark their own notifications as read"
  on public.notifications for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Rows are only ever created by the triggers below
create function public.notify_post_owner()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  owner uuid;
begin
  select user_id into owner from public.posts where id = new.post_id;
  if owner is null or owner = new.user_id then
    return new;
  end if;

  if tg_table_name = 'likes' then
    insert into public.notifications (user_id, actor_id, type, post_id, created_at)
    values (owner, new.user_id, 'like', new.post_id, new.created_at);
  else
    insert into public.notifications (user_id, actor_id, type, post_id, comment_id, created_at)
    values (owner, new.user_id, 'comment', new.post_id, new.id, new.created_at);
  end if;
  return new;
end;
$$;

create function public.clear_post_owner_notification()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if tg_table_name = 'likes' then
    delete from public.notifications
    where type = 'like' and post_id = old.post_id and actor_id = old.user_id;
  else
    delete from public.notifications where type = 'comment' and comment_id = old.id;
  end if;
  return old;
end;
$$;

create trigger likes_notify after insert on public.likes
  for each row execute function public.notify_post_owner();
create trigger likes_unnotify after delete on public.likes
  for each row execute function public.clear_post_owner_notification();
create trigger comments_notify after insert on public.comments
  for each row execute function public.notify_post_owner();
create trigger comments_unnotify after delete on public.comments
  for each row execute function public.clear_post_owner_notification();

-- Live bell updates
alter publication supabase_realtime add table public.notifications;

-- ============ Story views ============

create table public.post_views (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  viewer_id uuid, -- null for signed-out readers
  created_at timestamptz not null default now()
);

create index post_views_post_idx on public.post_views (post_id, created_at);
create index post_views_viewer_idx on public.post_views (viewer_id, post_id, created_at);

alter table public.post_views enable row level security;

-- Writers can see the views of their own stories; nobody inserts directly
create policy "Authors can see views of their stories"
  on public.post_views for select to authenticated
  using (exists (
    select 1 from public.posts p where p.id = post_id and p.user_id = (select auth.uid())
  ));

-- Counts a view of a published story. Authors viewing their own story don't count,
-- and a signed-in reader counts at most once per 30 minutes per story.
create function public.record_view(target_post bigint)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
  viewer uuid := auth.uid();
begin
  if not exists (
    select 1 from public.posts p
    where p.id = target_post and p.status = 'published' and p.user_id is distinct from viewer
  ) then
    return;
  end if;

  if viewer is not null and exists (
    select 1 from public.post_views v
    where v.post_id = target_post and v.viewer_id = viewer and v.created_at > now() - interval '30 minutes'
  ) then
    return;
  end if;

  insert into public.post_views (post_id, viewer_id) values (target_post, viewer);
end;
$$;

grant execute on function public.record_view(bigint) to anon, authenticated;

-- ============ Writer stats (for the signed-in author only) ============

-- One row per day for the last `days` days: views, likes and responses on your stories
create function public.author_daily_stats(days int default 30)
returns table (day date, views bigint, likes bigint, comments bigint)
language sql
stable
set search_path = ''
as $$
  with mine as (
    select id from public.posts where user_id = (select auth.uid())
  ),
  series as (
    select generate_series(current_date - (greatest(days, 1) - 1), current_date, interval '1 day')::date as day
  )
  select
    s.day,
    (select count(*) from public.post_views v where v.post_id in (select id from mine) and v.created_at::date = s.day),
    (select count(*) from public.likes l where l.post_id in (select id from mine) and l.created_at::date = s.day),
    (select count(*) from public.comments c where c.post_id in (select id from mine) and c.created_at::date = s.day)
  from series s
  order by s.day;
$$;

-- Your best stories in the same window
create function public.author_top_posts(days int default 30, max_count int default 5)
returns table (id bigint, title text, views bigint, likes bigint, comments bigint)
language sql
stable
set search_path = ''
as $$
  select
    p.id,
    p.title,
    (select count(*) from public.post_views v where v.post_id = p.id and v.created_at >= current_date - (greatest(days, 1) - 1)),
    (select count(*) from public.likes l where l.post_id = p.id and l.created_at >= current_date - (greatest(days, 1) - 1)),
    (select count(*) from public.comments c where c.post_id = p.id and c.created_at >= current_date - (greatest(days, 1) - 1))
  from public.posts p
  where p.user_id = (select auth.uid()) and p.status = 'published'
  order by 3 desc, 4 desc, p.created_at desc
  limit max_count;
$$;
