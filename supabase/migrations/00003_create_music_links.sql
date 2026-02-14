-- Music links table
create table public.music_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(title) <= 200),
  type text not null check (type in ('track', 'album', 'ep', 'playlist')),
  cover_art_url text,
  release_date date,
  spotify_url text,
  apple_music_url text,
  youtube_music_url text,
  soundcloud_url text,
  tidal_url text,
  amazon_music_url text,
  deezer_url text,
  custom_url text,
  custom_url_label text check (length(custom_url_label) <= 50),
  embed_url text,
  embed_platform text check (embed_platform in ('spotify', 'apple_music', 'soundcloud')),
  sort_order integer not null default 0,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_music_links_profile on public.music_links (profile_id);
create index idx_music_links_sort on public.music_links (profile_id, sort_order);

-- Updated_at trigger
create trigger music_links_updated_at
  before update on public.music_links
  for each row execute function public.update_updated_at();

-- RLS
alter table public.music_links enable row level security;

create policy "Public music links viewable"
  on public.music_links for select
  using (
    is_visible = true
    and exists (
      select 1 from public.profiles
      where profiles.id = music_links.profile_id
      and profiles.is_published = true
    )
  );

create policy "Users can view their own music links"
  on public.music_links for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own music links"
  on public.music_links for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own music links"
  on public.music_links for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own music links"
  on public.music_links for delete
  using (auth.uid() = profile_id);
