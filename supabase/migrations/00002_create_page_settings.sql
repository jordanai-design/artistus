-- Page settings table (1:1 with profiles)
create table public.page_settings (
  id uuid primary key references public.profiles(id) on delete cascade,
  theme_preset text default 'default',
  primary_color text default '#6366f1',
  secondary_color text default '#a855f7',
  background_color text default '#0f0f0f',
  text_color text default '#ffffff',
  background_type text default 'solid' check (background_type in ('solid', 'gradient', 'image')),
  background_gradient text,
  background_image_url text,
  font_family text default 'Inter',
  button_style text default 'rounded' check (button_style in ('rounded', 'pill', 'square', 'outline')),
  button_color text default '#6366f1',
  button_text_color text default '#ffffff',
  layout_style text default 'standard' check (layout_style in ('standard', 'compact', 'magazine')),
  show_powered_by boolean default true,
  custom_css text,
  updated_at timestamptz default now()
);

-- Updated_at trigger
create trigger page_settings_updated_at
  before update on public.page_settings
  for each row execute function public.update_updated_at();

-- RLS
alter table public.page_settings enable row level security;

create policy "Public page settings are viewable by everyone"
  on public.page_settings for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = page_settings.id
      and profiles.is_published = true
    )
  );

create policy "Users can view their own page settings"
  on public.page_settings for select
  using (auth.uid() = id);

create policy "Users can update their own page settings"
  on public.page_settings for update
  using (auth.uid() = id);

create policy "Users can insert their own page settings"
  on public.page_settings for insert
  with check (auth.uid() = id);
