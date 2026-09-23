-- Crema database schema for Supabase
-- Run once in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run

-- ============ Tables ============

-- Public profile for every auth user (auth.users itself is private)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  created_at timestamptz not null default now()
);

create table public.posts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) >= 20),
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index posts_created_at_idx on public.posts (created_at desc);
create index posts_user_id_idx on public.posts (user_id);

-- ============ Row Level Security ============
-- Anyone can read; only the owner can write.

alter table public.profiles enable row level security;
alter table public.posts enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Users can create their own posts"
  on public.posts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own posts"
  on public.posts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ============ Auto-create a profile on sign up ============

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ Storage (avatars + post covers) ============
-- Files are stored as <bucket>/<user id>/<file name>

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('covers', 'covers', true)
on conflict (id) do nothing;

create policy "Images are publicly readable"
  on storage.objects for select
  using (bucket_id in ('avatars', 'covers'));

create policy "Users can upload into their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('avatars', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can update their own files"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('avatars', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own files"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('avatars', 'covers')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
