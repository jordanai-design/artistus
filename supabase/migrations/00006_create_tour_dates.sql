-- Tour dates table
create table public.tour_dates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_name text not null check (length(event_name) <= 200),
  venue text not null check (length(venue) <= 200),
  city text not null check (length(city) <= 100),
  country_code text check (length(country_code) = 2),
  event_date timestamptz not null,
  ticket_url text,
  is_sold_out boolean default false,
  is_cancelled boolean default false,
  sort_order integer not null default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Indexes
create index idx_tour_dates_profile on public.tour_dates (profile_id);
create index idx_tour_dates_date on public.tour_dates (profile_id, event_date);

-- RLS
alter table public.tour_dates enable row level security;

create policy "Public tour dates viewable"
  on public.tour_dates for select
  using (
    is_visible = true
    and exists (
      select 1 from public.profiles
      where profiles.id = tour_dates.profile_id
      and profiles.is_published = true
    )
  );

create policy "Users can view their own tour dates"
  on public.tour_dates for select
  using (auth.uid() = profile_id);

create policy "Users can insert their own tour dates"
  on public.tour_dates for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own tour dates"
  on public.tour_dates for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own tour dates"
  on public.tour_dates for delete
  using (auth.uid() = profile_id);
