-- Markup rules for SMM orders
create table if not exists public.smm_markup_rules (
  id uuid primary key default gen_random_uuid(),
  is_active boolean not null default true,
  -- optional: match specific provider service id (highest priority)
  service_id integer null,
  -- optional: match by category string / pattern (e.g. 'instagram')
  category_pattern text null,
  -- markup percent applied over provider cost (e.g. 30 = +30%)
  markup_percent numeric not null default 30,
  -- fixed fee in BRL added to final price
  fee_fixed_brl numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint smm_markup_rules_has_match check (
    service_id is not null or category_pattern is not null
  )
);

create index if not exists smm_markup_rules_active_idx on public.smm_markup_rules (is_active);
create index if not exists smm_markup_rules_service_idx on public.smm_markup_rules (service_id);

alter table public.smm_markup_rules enable row level security;

-- Everyone logged-in can read rules (needed to calculate prices client-side)
do $$ begin
  create policy "Authenticated can read markup rules"
  on public.smm_markup_rules
  for select
  using (auth.uid() is not null);
exception when duplicate_object then null; end $$;

-- Only admins can manage rules
-- relies on existing public.is_admin(uuid) function

do $$ begin
  create policy "Admins can manage markup rules"
  on public.smm_markup_rules
  for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
exception when duplicate_object then null; end $$;

-- updated_at trigger (reuse existing function if present)
do $$ begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'update_smm_markup_rules_updated_at'
  ) then
    create trigger update_smm_markup_rules_updated_at
    before update on public.smm_markup_rules
    for each row
    execute function public.update_updated_at_column();
  end if;
end $$;