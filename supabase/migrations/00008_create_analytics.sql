-- Page views table
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  visitor_id text,
  referrer text,
  country text,
  city text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop')),
  browser text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  viewed_at timestamptz default now()
);

-- Indexes
create index idx_page_views_profile on public.page_views (profile_id);
create index idx_page_views_time on public.page_views (profile_id, viewed_at);

-- RLS
alter table public.page_views enable row level security;

-- Only owner can view analytics
create policy "Users can view their own page views"
  on public.page_views for select
  using (auth.uid() = profile_id);

-- Inserts happen via admin client in the API route

-- Link clicks table
create table public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  link_type text not null check (link_type in ('music', 'social', 'merch', 'tour', 'subscribe')),
  link_id uuid,
  platform text,
  url text not null,
  referrer text,
  country text,
  device_type text check (device_type in ('mobile', 'tablet', 'desktop')),
  clicked_at timestamptz default now()
);

-- Indexes
create index idx_link_clicks_profile on public.link_clicks (profile_id);
create index idx_link_clicks_time on public.link_clicks (profile_id, clicked_at);
create index idx_link_clicks_type on public.link_clicks (profile_id, link_type);

-- RLS
alter table public.link_clicks enable row level security;

create policy "Users can view their own link clicks"
  on public.link_clicks for select
  using (auth.uid() = profile_id);

-- Inserts happen via admin client in the API route
