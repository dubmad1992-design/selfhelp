-- Nutrition: quick-add entries that sum into daily totals, plus water.
-- Deliberately simple: calories + three macros, no food database.

create table public.nutrition_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_on date not null,
  calories integer not null check (calories >= 0 and calories <= 10000),
  protein_g numeric(6, 1) not null default 0 check (protein_g >= 0),
  carbs_g numeric(6, 1) not null default 0 check (carbs_g >= 0),
  fat_g numeric(6, 1) not null default 0 check (fat_g >= 0),
  created_at timestamptz not null default now()
);

create index nutrition_entries_user_day on public.nutrition_entries (user_id, logged_on desc);

create table public.water_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_on date not null,
  amount_ml integer not null check (amount_ml > 0 and amount_ml <= 5000),
  created_at timestamptz not null default now()
);

create index water_entries_user_day on public.water_entries (user_id, logged_on desc);

alter table public.nutrition_entries enable row level security;
alter table public.water_entries enable row level security;

create policy "Users manage own nutrition" on public.nutrition_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own water" on public.water_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Daily targets live on the profile; sensible defaults, editable in the app.
alter table public.profiles
  add column calorie_target integer not null default 2000 check (calorie_target between 800 and 10000),
  add column protein_target_g integer not null default 120 check (protein_target_g between 0 and 500),
  add column carbs_target_g integer not null default 200 check (carbs_target_g between 0 and 1000),
  add column fat_target_g integer not null default 70 check (fat_target_g between 0 and 400),
  add column water_target_ml integer not null default 2000 check (water_target_ml between 0 and 10000);
