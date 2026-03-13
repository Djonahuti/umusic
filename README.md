# 🎵 UT Music

**UT Music** is a modern full-stack music streaming platform inspired by **iTunes** and **Spotify**. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **ShadCN UI**, and **Supabase PostgreSQL**, it delivers a seamless, visually appealing, and responsive music experience for both users and administrators.

---

## 🚀 Features

### 👤 Authentication
- User signup and login using **Supabase Auth**.
- Supports **Google Authentication** for quick access.
- Protected routes for authenticated users only.

### 🎶 User Features
- Stream and play music instantly.
- Create, edit, and manage playlists.
- Like and save favorite songs.
- Follow artists and view their profiles.
- Responsive and smooth UI with **dark mode support**.

### 🧑‍💼 Admin Features
- Full admin dashboard for managing:
  - Users
  - Artists
  - Albums
  - Genres
  - Songs (Upload, Edit, Delete)
- Role-based access control (only admins can manage content).

### 🌗 UI & UX
- Built with **ShadCN UI** and **Tailwind CSS** for a clean, elegant design.
- Fully **responsive** and **dark-mode** supported.
- Smooth animations and transitions.

---

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | Next.js (TypeScript) |
| Styling | Tailwind CSS + ShadCN UI |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth + Google Auth |
| Hosting | Vercel (recommended) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Djonahuti/ut-music.git
cd ut-music
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Create an Environment File
Create a `.env.local` file in the project root and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 Folder Structure
```
ut-music/
├── components/       # UI Components (Buttons, Cards, etc.)
├── pages/            # Next.js pages and routes
├── lib/              # Supabase client, helpers
├── styles/           # Tailwind global styles
├── public/           # Static files and assets
├── prisma/           # Database schema (if used)
└── README.md
```

---

## 🧠 Future Improvements
- AI-powered music recommendation system.
- Real-time lyrics integration.
- Collaborative playlists.
- Artist analytics dashboard.
- Mobile PWA support.

---

## 👨‍💻 Creator
**Developed by [David Jonah](https://github.com/Djonahuti)**  
Building clean, scalable, and high-performance full-stack apps.

---

## 🪪 License
This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute with proper credit.

---

### 💫 “Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.” – Plato
