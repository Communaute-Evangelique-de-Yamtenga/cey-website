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
  created_at timestamptz default now()
);

-- =============================================
-- RLS (Row Level Security)
-- =============================================

alter table annonces enable row level security;
alter table evenements enable row level security;
alter table pasteurs enable row level security;
alter table construction enable row level security;
alter table admin_users enable row level security;

-- Lecture publique (pour le site)
create policy "lecture publique annonces" on annonces for select using (true);
create policy "lecture publique evenements" on evenements for select using (true);
create policy "lecture publique pasteurs" on pasteurs for select using (true);
create policy "lecture publique construction" on construction for select using (true);

-- Écriture uniquement pour les admins connectés
create policy "admin annonces" on annonces for all using (auth.role() = 'authenticated');
create policy "admin evenements" on evenements for all using (auth.role() = 'authenticated');
create policy "admin pasteurs" on pasteurs for all using (auth.role() = 'authenticated');
create policy "admin construction" on construction for all using (auth.role() = 'authenticated');
create policy "admin users" on admin_users for all using (auth.role() = 'authenticated');

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
create policy "admin programme" on programme for all using (auth.role() = 'authenticated');

-- 7. Image principale du temple (home)
create table if not exists temple_image (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  updated_at timestamptz default now()
);
alter table temple_image enable row level security;
create policy "lecture publique temple_image" on temple_image for select using (true);
create policy "admin temple_image" on temple_image for all using (auth.role() = 'authenticated');

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
create policy "admin chantier_photos" on chantier_photos for all using (auth.role() = 'authenticated');

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
