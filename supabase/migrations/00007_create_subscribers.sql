-- Subscribers table (fan email collection)
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  name text check (length(name) <= 100),
  source text default 'public_page',
  subscribed_at timestamptz default now(),
  is_active boolean default true
);

-- Indexes - unique email per artist
create unique index idx_subscribers_unique on public.subscribers (profile_id, email);
create index idx_subscribers_profile on public.subscribers (profile_id);

-- RLS
alter table public.subscribers enable row level security;

-- Only the profile owner can view subscribers
create policy "Users can view their own subscribers"
  on public.subscribers for select
  using (auth.uid() = profile_id);

-- Inserts happen via the admin/service-role client in the API route
-- so no public insert policy is needed. Owner can also insert.
create policy "Users can insert their own subscribers"
  on public.subscribers for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own subscribers"
  on public.subscribers for update
  using (auth.uid() = profile_id);

create policy "Users can delete their own subscribers"
  on public.subscribers for delete
  using (auth.uid() = profile_id);
