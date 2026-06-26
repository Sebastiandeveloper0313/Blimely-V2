-- Profiles: one row per auth user, holding onboarding + workspace data.
-- Mirrors the client-side workspace store in
-- apps/web/src/features/workspace/store.ts. Applied to the hosted DB on merge
-- to main via the Supabase <-> GitHub integration.

create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text,
  name            text,
  company         text,
  logo_url        text,
  source_mode     text not null default 'website' check (source_mode in ('website', 'description')),
  website         text,
  description     text,
  team_size       text,
  revenue         text,
  role            text,
  business_model  text,
  categories      text[] not null default '{}',
  cadence         text not null default '1 / day',
  tiktok_handle   text,
  -- brand understanding extracted from the website (see functions/analyze-website)
  brand_summary     text,
  brand_audience    text,
  brand_pain_points text[] not null default '{}',
  brand_voice       text,
  analysis_source   text check (analysis_source in ('site', 'inputs')),
  onboarded       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.profiles is 'Per-user brand + onboarding workspace for Blimely.';

-- ---------------------------------------------------------------------------
-- Row level security: a user can only see and edit their own profile.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- auth.uid() is wrapped in a subquery so the planner evaluates it once.
-- The id column is the primary key, so it is already indexed for these policies.
create policy "Profiles are viewable by their owner"
  on public.profiles
  for select
  using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- Keep updated_at current on every write.
-- ---------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Create a profile row automatically when a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
