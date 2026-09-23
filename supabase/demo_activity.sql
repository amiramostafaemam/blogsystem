-- Demo only: gives the seeded writers realistic history for the stats page and bell.
-- Run in the SQL Editor after 003 and after every `npm run seed:demo`.
-- Only touches stories written by the three demo accounts.

with demo_posts as (
  select p.id, p.created_at
  from public.posts p
  join auth.users u on u.id = p.user_id
  where u.email in ('demo@crema.app', 'omar.writer@crema.app', 'lina.writer@crema.app')
    and p.status = 'published'
)

-- 1. Spread likes and responses between each story's publish date and now
, moved_likes as (
  update public.likes l
  set created_at = d.created_at + random() * (now() - d.created_at)
  from demo_posts d
  where l.post_id = d.id
  returning l.post_id
)
, moved_comments as (
  update public.comments c
  set created_at = d.created_at + random() * (now() - d.created_at)
  from demo_posts d
  where c.post_id = d.id
  returning c.post_id
)
select count(*) from moved_likes, moved_comments;

-- 2. Rebuild views: a few readers a day since each story went live, busier on launch days
delete from public.post_views
where post_id in (
  select p.id from public.posts p join auth.users u on u.id = p.user_id
  where u.email in ('demo@crema.app', 'omar.writer@crema.app', 'lina.writer@crema.app')
);

insert into public.post_views (post_id, created_at)
-- clamp each view between the publish time and now
select d.id, least(now(), greatest(d.created_at, day + random() * interval '23 hours'))
from (
  select p.id, p.created_at
  from public.posts p join auth.users u on u.id = p.user_id
  where u.email in ('demo@crema.app', 'omar.writer@crema.app', 'lina.writer@crema.app')
    and p.status = 'published'
) d
cross join lateral generate_series(date_trunc('day', d.created_at), date_trunc('day', now()), interval '1 day') as day
cross join lateral generate_series(
  1,
  -- 2-9 views a day, plus a launch bump that fades over the first week
  (2 + floor(random() * 8) + greatest(0, 25 - 4 * extract(day from day - date_trunc('day', d.created_at))))::int
) as n
where day + interval '23 hours' > d.created_at;

-- 3. Rebuild notifications from the (re-dated) likes and responses
delete from public.notifications
where user_id in (
  select id from auth.users
  where email in ('demo@crema.app', 'omar.writer@crema.app', 'lina.writer@crema.app')
);

insert into public.notifications (user_id, actor_id, type, post_id, created_at, read_at)
select p.user_id, l.user_id, 'like', l.post_id, l.created_at,
       case when l.created_at < now() - interval '3 days' then l.created_at + interval '1 hour' end
from public.likes l join public.posts p on p.id = l.post_id
where p.user_id <> l.user_id
  and p.user_id in (select id from auth.users where email in ('demo@crema.app', 'omar.writer@crema.app', 'lina.writer@crema.app'));

insert into public.notifications (user_id, actor_id, type, post_id, comment_id, created_at, read_at)
select p.user_id, c.user_id, 'comment', c.post_id, c.id, c.created_at,
       case when c.created_at < now() - interval '3 days' then c.created_at + interval '1 hour' end
from public.comments c join public.posts p on p.id = c.post_id
where p.user_id <> c.user_id
  and p.user_id in (select id from auth.users where email in ('demo@crema.app', 'omar.writer@crema.app', 'lina.writer@crema.app'));
