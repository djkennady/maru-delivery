create table if not exists public.app_state (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null,
  name text not null,
  phone text not null,
  address text not null,
  comment text,
  items jsonb not null,
  subtotal integer not null,
  delivery_fee integer not null,
  gift_discount integer,
  applied_gift jsonb,
  total integer not null,
  status text not null,
  payment_status text not null,
  payment_method text not null,
  card_last4 text not null,
  card_brand text not null,
  payment_id text not null
);

create index if not exists orders_phone_idx on public.orders (phone);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.sbp_payment_sessions (
  id text primary key,
  amount integer not null,
  phone text not null,
  status text not null,
  qr_payload text not null,
  created_at timestamptz not null,
  expires_at timestamptz not null,
  paid_at timestamptz
);

create index if not exists sbp_sessions_phone_idx on public.sbp_payment_sessions (phone);
insert into storage.buckets (id, name, public)
values ('menu', 'menu', true)
on conflict (id) do update set public = true;

