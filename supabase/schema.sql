create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  place_id text unique not null,
  name text,
  category text,
  rating numeric,
  reviews integer,
  address text,
  city text,
  phone text,
  whatsapp_phone text,
  phone_type text,
  website_uri text,
  digital_status text not null check (digital_status in ('NO_WEBSITE', 'SOCIAL_ONLY', 'HAS_WEBSITE')),
  maps_uri text,
  search_query text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Interested', 'Closed', 'Not Interested')),
  notes text default '',
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_digital_status_idx on public.leads (digital_status);
create index if not exists leads_city_idx on public.leads (city);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute procedure public.set_updated_at();

alter table public.leads enable row level security;
