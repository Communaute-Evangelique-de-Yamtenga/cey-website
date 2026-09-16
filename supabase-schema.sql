-- =============================================
-- CEY Website — Script SQL Supabase
-- À exécuter dans : Supabase > SQL Editor
-- =============================================

-- 1. Annonces
create table if not exists annonces (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  date text not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. Événements
create table if not exists evenements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  tag text,
  tag_accent text default 'blue',
  created_at timestamptz default now()
);

-- 3. Pasteurs
create table if not exists pasteurs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  description text,
  photo text,
  ordre integer default 0,
  created_at timestamptz default now()
);

-- 4. Construction
create table if not exists construction (
  id uuid primary key default gen_random_uuid(),
  raised bigint default 0,
  goal bigint default 45000000,
  currency text default 'FCFA',
  milestones jsonb default '[
    {"label":"Fondations","detail":"terminées et consacrées.","status":"done"},
    {"label":"Élévation des murs","detail":"en cours actuellement.","status":"current"},
    {"label":"Toiture & finitions","detail":"à venir.","status":"upcoming"}
  ]'::jsonb,
  photos jsonb default '[]'::jsonb
);

-- Insérer la ligne initiale construction
insert into construction (raised, goal) values (18500000, 45000000)
on conflict do nothing;

-- 5. Admins (profils avec rôles)
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'annonces',
  activation_completed_at timestamptz,
  created_at timestamptz default now()
);

alter table admin_users
  add column if not exists activation_completed_at timestamptz;

drop trigger if exists on_auth_user_password_changed on auth.users;
drop function if exists public.mark_admin_activation_completed();

-- =============================================
-- RLS (Row Level Security)
-- =============================================

alter table annonces enable row level security;
alter table evenements enable row level security;
alter table pasteurs enable row level security;
alter table construction enable row level security;
alter table admin_users enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role in ('lecteur', 'editeur', 'admin', 'super_admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

grant execute on function public.is_admin_user() to authenticated;
grant execute on function public.is_super_admin() to authenticated;

create or replace function public.can_manage_users()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

grant execute on function public.can_manage_users() to authenticated;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role in ('editeur', 'admin', 'super_admin')
  );
$$;

create or replace function public.can_delete_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

grant execute on function public.can_edit_content() to authenticated;
grant execute on function public.can_delete_content() to authenticated;

-- Lecture publique (pour le site)
create policy "lecture publique annonces" on annonces for select using (true);
create policy "lecture publique evenements" on evenements for select using (true);
create policy "lecture publique pasteurs" on pasteurs for select using (true);
create policy "lecture publique construction" on construction for select using (true);

-- Écriture selon le rôle administrateur
drop policy if exists "admin annonces" on annonces;
drop policy if exists "admin evenements" on evenements;
drop policy if exists "admin pasteurs" on pasteurs;
drop policy if exists "admin construction" on construction;
create policy "admin annonces insert" on annonces for insert with check (public.can_edit_content());
create policy "admin annonces update" on annonces for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin annonces delete" on annonces for delete using (public.can_delete_content());
create policy "admin evenements insert" on evenements for insert with check (public.can_edit_content());
create policy "admin evenements update" on evenements for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin evenements delete" on evenements for delete using (public.can_delete_content());
create policy "admin pasteurs insert" on pasteurs for insert with check (public.can_edit_content());
create policy "admin pasteurs update" on pasteurs for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin pasteurs delete" on pasteurs for delete using (public.can_delete_content());
create policy "admin construction insert" on construction for insert with check (public.can_edit_content());
create policy "admin construction update" on construction for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin construction delete" on construction for delete using (public.can_delete_content());
drop policy if exists "admin users" on admin_users;
drop policy if exists "admin users insert" on admin_users;
drop policy if exists "admin users update" on admin_users;
drop policy if exists "admin users delete" on admin_users;
create policy "admin users read" on admin_users
  for select using (public.is_admin_user());
create policy "admin users insert" on admin_users
  for insert
  with check (
    public.can_manage_users()
    and (public.is_super_admin() or role <> 'super_admin')
  );
create policy "admin users update" on admin_users
  for update
  using (
    public.can_manage_users()
    and (public.is_super_admin() or role <> 'super_admin')
  )
  with check (
    public.can_manage_users()
    and (public.is_super_admin() or role <> 'super_admin')
  );
create policy "admin users delete" on admin_users
  for delete using (public.is_super_admin());

-- 6. Programme hebdomadaire
create table if not exists programme (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  title text not null,
  hours text not null,
  ordre integer default 0
);

alter table programme enable row level security;
create policy "lecture publique programme" on programme for select using (true);
drop policy if exists "admin programme" on programme;
create policy "admin programme insert" on programme for insert with check (public.can_edit_content());
create policy "admin programme update" on programme for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin programme delete" on programme for delete using (public.can_delete_content());

-- 7. Image principale du temple (home)
create table if not exists temple_image (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  updated_at timestamptz default now()
);
alter table temple_image enable row level security;
create policy "lecture publique temple_image" on temple_image for select using (true);
drop policy if exists "admin temple_image" on temple_image;
create policy "admin temple_image insert" on temple_image for insert with check (public.can_edit_content());
create policy "admin temple_image update" on temple_image for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin temple_image delete" on temple_image for delete using (public.can_delete_content());

-- 8. Photos du chantier (page projet)
create table if not exists chantier_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  ordre integer default 0,
  created_at timestamptz default now()
);
alter table chantier_photos enable row level security;
create policy "lecture publique chantier_photos" on chantier_photos for select using (true);
drop policy if exists "admin chantier_photos" on chantier_photos;
create policy "admin chantier_photos insert" on chantier_photos for insert with check (public.can_edit_content());
create policy "admin chantier_photos update" on chantier_photos for update using (public.can_edit_content()) with check (public.can_edit_content());
create policy "admin chantier_photos delete" on chantier_photos for delete using (public.can_delete_content());

-- Données initiales
insert into programme (day, title, hours, ordre) values
  ('MARDI', 'Etude Biblique', '19h00 – 20h30', 1),
  ('Mercredi', 'Prière d''intercession et de délivrance', 'A partir de 9h30', 2),
  ('Jeudi', 'Prière d''édification et pour les besoins', '19h00-21h00', 3),
  ('Vendredi/Samedi', 'Répétitions des chorales & activités des groupes', '19h – 21h', 4),
  ('Dernier Vendredi du mois', 'Veillée de prière (dernier du mois)', '21h00', 5),
  ('Dimanche', 'Culte en français', '07h30 – 10h00', 6),
  ('Dimanche(mooré)', 'Culte en mooré', '10h15 – 12h15', 7),
  ('1ᵉʳ Dimanche de chaque mois', 'Culte en commun', '07h30 – 11h00', 8);
