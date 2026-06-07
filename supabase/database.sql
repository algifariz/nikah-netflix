-- =============================================
-- NIKAH NETFLIX - Database Setup (Fresh Install)
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing tables (CASCADE will also drop policies)
DROP TABLE IF EXISTS gift_accounts CASCADE;
DROP TABLE IF EXISTS wishes CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS love_stories CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS guests CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- =============================================
-- CREATE TABLES
-- =============================================

-- Settings table
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  groom_name VARCHAR(100) NOT NULL DEFAULT 'Ahmad',
  groom_full_name VARCHAR(200) NOT NULL DEFAULT 'Ahmad Fauzan bin H. Muhammad Rizal',
  groom_father VARCHAR(200) NOT NULL DEFAULT 'H. Muhammad Rizal',
  groom_mother VARCHAR(200) NOT NULL DEFAULT 'Hj. Siti Aminah',
  groom_photo TEXT,
  bride_name VARCHAR(100) NOT NULL DEFAULT 'Aisyah',
  bride_full_name VARCHAR(200) NOT NULL DEFAULT 'Aisyah Putri binti H. Abdul Rahman',
  bride_father VARCHAR(200) NOT NULL DEFAULT 'H. Abdul Rahman',
  bride_mother VARCHAR(200) NOT NULL DEFAULT 'Hj. Nur Hasanah',
  bride_photo TEXT,
  hero_image TEXT,
  opening_text TEXT DEFAULT 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami',
  hashtag VARCHAR(200) DEFAULT '#AhmadAisyah2024',
  wedding_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  music_url TEXT,
  intro_sound_url TEXT,
  og_image TEXT,
  og_title TEXT,
  og_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guests table
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(200),
  category VARCHAR(10) NOT NULL DEFAULT 'REGULAR' CHECK (category IN ('REGULAR', 'VIP', 'VVIP')),
  invitation_code VARCHAR(20) UNIQUE NOT NULL,
  invitation_url TEXT,
  rsvp_status VARCHAR(20) DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'not_attending')),
  number_of_guests INTEGER DEFAULT 1,
  has_scanned BOOLEAN DEFAULT FALSE,
  scanned_at TIMESTAMP WITH TIME ZONE,
  wishes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  timezone VARCHAR(20) DEFAULT 'WITA',
  location VARCHAR(300) NOT NULL,
  address TEXT,
  map_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Love Stories table
CREATE TABLE love_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption VARCHAR(300),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishes table
CREATE TABLE wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gift Accounts table (multiple amplop digital)
CREATE TABLE gift_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL DEFAULT 'bank' CHECK (type IN ('bank', 'ewallet')),
  provider_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  account_holder VARCHAR(200) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_accounts ENABLE ROW LEVEL SECURITY;

-- Public read policies (for invitation pages)
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read love_stories" ON love_stories FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read wishes" ON wishes FOR SELECT USING (true);
CREATE POLICY "Public read gift_accounts" ON gift_accounts FOR SELECT USING (true);

-- Public write policies (for guest interactions)
CREATE POLICY "Public insert wishes" ON wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read guest by code" ON guests FOR SELECT USING (true);
CREATE POLICY "Public update guest rsvp" ON guests FOR UPDATE USING (true) WITH CHECK (true);

-- Full access policies (for service role / admin)
CREATE POLICY "Service full access settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access guests" ON guests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access love_stories" ON love_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access wishes" ON wishes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access gift_accounts" ON gift_accounts FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- DUMMY DATA
-- =============================================

-- Settings
INSERT INTO settings (
  groom_name, groom_full_name, groom_father, groom_mother, groom_photo,
  bride_name, bride_full_name, bride_father, bride_mother, bride_photo,
  hero_image, opening_text, hashtag, wedding_date
) VALUES (
  'Ahmad',
  'Ahmad Fauzan bin H. Muhammad Rizal',
  'H. Muhammad Rizal',
  'Hj. Siti Aminah',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'Aisyah',
  'Aisyah Putri binti H. Abdul Rahman',
  'H. Abdul Rahman',
  'Hj. Nur Hasanah',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan kami',
  '#AhmadAisyah2024',
  '2024-12-14T08:00:00+08:00'
);

-- Events
INSERT INTO events (title, date, time_start, time_end, timezone, location, address, map_url, image_url, order_index) VALUES
(
  'Akad Nikah',
  '2024-12-14',
  '08:00',
  '10:00',
  'WITA',
  'Kediaman Mempelai Wanita',
  'Jl. Sultan Adam Komplek Family Permai Kota Banjarmasin Kalimantan Selatan',
  'https://maps.google.com/?q=-3.3194,114.5900',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop',
  0
),
(
  'Resepsi',
  '2024-12-14',
  '12:00',
  '16:00',
  'WITA',
  'Kediaman Mempelai Wanita',
  'Jl. Sultan Adam Komplek Family Permai Kota Banjarmasin Kalimantan Selatan',
  'https://maps.google.com/?q=-3.3194,114.5900',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=300&fit=crop',
  1
);

-- Love Stories
INSERT INTO love_stories (title, date, description, image_url, order_index) VALUES
(
  'Pertama Bertemu',
  'Januari 2020',
  'Kami pertama kali bertemu di sebuah acara kampus. Saat itu pandangan kami bertemu dan ada sesuatu yang berbeda.',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=250&fit=crop',
  0
),
(
  'Mulai Dekat',
  'Maret 2020',
  'Setelah beberapa kali bertemu di berbagai kesempatan, kami mulai sering berkomunikasi dan saling mengenal lebih dalam.',
  'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=250&fit=crop',
  1
),
(
  'Menjalin Hubungan',
  'Juni 2020',
  'Dengan bismillah, kami memutuskan untuk menjalin hubungan yang lebih serius dengan tujuan menuju pernikahan.',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&h=250&fit=crop',
  2
),
(
  'Lamaran',
  'September 2024',
  'Alhamdulillah, dengan restu kedua orang tua, kami melaksanakan prosesi lamaran dan menetapkan tanggal pernikahan.',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=250&fit=crop',
  3
);

-- Gallery
INSERT INTO gallery (image_url, caption, order_index) VALUES
('https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop', 'Pre-wedding Photo 1', 0),
('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=600&fit=crop', 'Pre-wedding Photo 2', 1),
('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=600&fit=crop', 'Pre-wedding Photo 3', 2),
('https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=600&fit=crop', 'Pre-wedding Photo 4', 3),
('https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=400&h=600&fit=crop', 'Pre-wedding Photo 5', 4),
('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=600&fit=crop', 'Pre-wedding Photo 6', 5),
('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=600&fit=crop', 'Pre-wedding Photo 7', 6),
('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=600&fit=crop', 'Pre-wedding Photo 8', 7);

-- Guests
INSERT INTO guests (name, phone, category, invitation_code, invitation_url, rsvp_status, number_of_guests) VALUES
('Budi Santoso', '081234567891', 'VVIP', 'VVIP001A', '/invitation/VVIP001A', 'attending', 2),
('Siti Rahayu', '081234567892', 'VIP', 'VIP0001A', '/invitation/VIP0001A', 'attending', 3),
('Andi Pratama', '081234567893', 'REGULAR', 'REG0001A', '/invitation/REG0001A', 'pending', 1),
('Dewi Lestari', '081234567894', 'VIP', 'VIP0002A', '/invitation/VIP0002A', 'not_attending', 1),
('Rizky Ramadhan', '081234567895', 'REGULAR', 'REG0002A', '/invitation/REG0002A', 'attending', 2),
('Nur Fadilah', '081234567896', 'REGULAR', 'REG0003A', '/invitation/REG0003A', 'pending', 1),
('Hendra Wijaya', '081234567897', 'VVIP', 'VVIP002A', '/invitation/VVIP002A', 'attending', 4),
('Putri Amelia', '081234567898', 'REGULAR', 'REG0004A', '/invitation/REG0004A', 'pending', 2);

-- Wishes
INSERT INTO wishes (guest_name, message, created_at) VALUES
('Budi Santoso', 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.', NOW() - INTERVAL '2 hours'),
('Siti Rahayu', 'Barakallahu lakuma wa baraka alaikuma wa jamaah bainakuma fi khair. Semoga selalu bahagia!', NOW() - INTERVAL '1 hour'),
('Rizky Ramadhan', 'Happy wedding! Semoga langgeng sampai Jannah. Aamiin ya rabbal alamin.', NOW() - INTERVAL '30 minutes'),
('Hendra Wijaya', 'Selamat ya bro! Akhirnya nikah juga. Semoga jadi keluarga yang berkah dan bahagia selalu.', NOW() - INTERVAL '15 minutes');

-- Gift Accounts (Amplop Digital)
INSERT INTO gift_accounts (type, provider_name, account_number, account_holder, order_index) VALUES
('bank', 'Bank BSI', '7182930456', 'Ahmad Fauzan', 0),
('bank', 'Bank BCA', '8901234567', 'Ahmad Fauzan', 1),
('ewallet', 'Dana', '081234567890', 'Ahmad Fauzan', 2),
('ewallet', 'GoPay', '081234567890', 'Ahmad Fauzan', 3);

-- =============================================
-- STORAGE SETUP
-- Run this to create bucket and allow uploads
-- =============================================

-- Create the uploads bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Allow public read uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;

-- Allow anyone to view uploaded files
CREATE POLICY "Allow public read uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

-- Allow anyone to upload files (needed for service role key usage)
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads');

-- Allow anyone to update files
CREATE POLICY "Allow authenticated update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads');

-- Allow anyone to delete files
CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads');
