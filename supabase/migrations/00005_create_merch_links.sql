-- Merch links table
create table public.merch_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (length(title) <= 200),
  url text not null,
  platform text check (platform in ('shopify', 'bigcartel', 'bandcamp', 'etsy', 'custom')),
  image_url text,
  price text check (length(price) <= 20),
  sort_order integer not null default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Indexes
create index idx_merch_links_profile on public.merch_links (profile_id);

-- RLS
alter table public.merch_links enable row level security;

create policy "Public merch links viewable"
  on public.merch_links for select
  using (
    is_visible = true
    and exists (
      select 1 from public.profiles
      where profiles.id = merch_links.profile_id
      and profiles.is_published = true
    )
  );

create policy "Users can view their own merch links"
  on public.merch_links for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own merch links"
  on public.merch_links for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own merch links"
  on public.merch_links for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own merch links"
  on public.merch_links for delete
  using (auth.uid() = profile_id);
