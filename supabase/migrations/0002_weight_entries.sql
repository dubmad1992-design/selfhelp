-- Weight entries: one per user per local day (logged_on), latest write wins.

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_on date not null,
  weight_kg numeric(5, 1) not null check (weight_kg > 0 and weight_kg <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create index weight_entries_user_logged_on on public.weight_entries (user_id, logged_on desc);

alter table public.weight_entries enable row level security;

create policy "Users can read own weight entries"
  on public.weight_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own weight entries"
  on public.weight_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own weight entries"
  on public.weight_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own weight entries"
  on public.weight_entries for delete
  using (auth.uid() = user_id);

create trigger weight_entries_set_updated_at
  before update on public.weight_entries
  for each row execute function public.set_updated_at();
