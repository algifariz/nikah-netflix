# 🎬 Nikah Netflix - Wedding Invitation

Undangan digital pernikahan dengan style Netflix. Background hitam, aksen merah, foto fullscreen seperti poster film.

## Tech Stack

- **Next.js 15.5+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animasi)
- **Supabase** (database + storage)
- **NextAuth** (admin authentication)

## Fitur

### Undangan (Guest-facing)
- Opening page fullscreen + nama tamu
- Hero section (poster film style)
- Countdown timer
- Bride & Groom section
- Love Story timeline
- Jadwal acara
- Galeri foto (horizontal scroll Netflix row)
- RSVP
- Ucapan & doa tamu
- Amplop digital (bank + e-wallet)
- QR Code per tamu (REGULAR/VIP/VVIP)
- Background music player
- Responsive mobile-first

### Admin Panel (`/admin`)
- Login secure (NextAuth)
- Dashboard statistik
- CRUD tamu + copy link undangan
- Settings: mempelai, acara, amplop, media
- Upload foto ke Supabase Storage
- QR Scanner (kamera / manual input)

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Supabase Setup

1. Buat project di [supabase.com](https://supabase.com)
2. Jalankan SQL di `supabase/database.sql` via SQL Editor
3. Buat Storage bucket bernama `uploads` (set public)

### 3. Environment Variables

Copy `.env.example` ke `.env` dan isi:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXTAUTH_SECRET=random-secret-string
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

### 4. Run Development

```bash
npm run dev
```

### 5. Deploy ke Vercel

```bash
vercel deploy
```

Set environment variables di Vercel dashboard.

## URL Structure

- `/` → Redirect ke preview
- `/invitation/preview` → Preview undangan (tanpa data tamu)
- `/invitation/[code]` → Undangan per tamu
- `/admin/login` → Login admin
- `/admin` → Admin dashboard

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/PUT | `/api/settings` | Settings mempelai |
| GET/POST | `/api/guests` | Daftar tamu |
| PUT/DELETE | `/api/guests/[id]` | Edit/hapus tamu |
| GET/POST | `/api/events` | Jadwal acara |
| PUT/DELETE | `/api/events/[id]` | Edit/hapus acara |
| GET/POST | `/api/love-stories` | Love story |
| GET/POST | `/api/gallery` | Galeri foto |
| POST | `/api/upload` | Upload file |
| POST | `/api/rsvp` | Submit RSVP |
| GET/POST | `/api/wishes` | Ucapan tamu |
| POST | `/api/scan` | QR scan |
| GET | `/api/dashboard` | Statistik |
