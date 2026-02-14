-- Social links table
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null check (platform in (
    'instagram', 'tiktok', 'twitter', 'youtube', 'facebook',
    'snapchat', 'threads', 'discord', 'twitch', 'website', 'other'
  )),
  url text not null,
  label text check (length(label) <= 50),
  sort_order integer not null default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Indexes
create index idx_social_links_profile on public.social_links (profile_id);
create unique index idx_social_links_unique_platform on public.social_links (profile_id, platform);

-- RLS
alter table public.social_links enable row level security;

create policy "Public social links viewable"
  on public.social_links for select
  using (
    is_visible = true
    and exists (
      select 1 from public.profiles
      where profiles.id = social_links.profile_id
      and profiles.is_published = true
    )
  );

create policy "Users can view their own social links"
  on public.social_links for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own social links"
  on public.social_links for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own social links"
  on public.social_links for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own social links"
  on public.social_links for delete
  using (auth.uid() = profile_id);
