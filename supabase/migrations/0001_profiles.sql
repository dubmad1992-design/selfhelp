-- Profiles: one row per auth user, created automatically on signup.
-- Holds onboarding data (goal, starting stats, unit preference).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  unit_preference text not null default 'metric' check (unit_preference in ('metric', 'imperial')),
  start_weight_kg numeric(5, 1) check (start_weight_kg > 0 and start_weight_kg <= 500),
  goal_weight_kg numeric(5, 1) check (goal_weight_kg > 0 and goal_weight_kg <= 500),
  height_cm numeric(4, 1) check (height_cm > 0 and height_cm <= 300),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No delete policy: profile lifecycle follows the auth user (cascade).

-- Keep updated_at fresh.
create or replace function public.set_updated_at()
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
  for each row execute function public.set_updated_at();

-- Create an empty profile row the moment a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
