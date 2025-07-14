# NextAuth Template – Local + Google + GitHub + Facebook (Next.js 15 + Prisma)

A robust authentication starter kit using **Next.js 15 (App Router)**, **NextAuth v5**, **Prisma**, and support for **local credentials**, **Google**, **GitHub**, and **Facebook OAuth**.

---

## 🧱 Stack

* **Framework**: Next.js 15 (App Router, TypeScript, no-src-dir)
* **Auth**: NextAuth.js (Credentials + Google + GitHub + Facebook)
* **Database ORM**: Prisma
* **Database**: PostgreSQL (or change to any supported by Prisma)
* **Styling**: Tailwind CSS (optional)

---

## 🚀 Getting Started

### 1. Clone & Create Project

```bash
npx create-next-app@latest next-prisma-OAuth-local-oauth-template --ts --no-src-dir --app
cd next-prisma-OAuth-local-oauth-template
# Copy or replace project files with this template
npm install
```

### 2. Configure `.env`

Copy the example:

```bash
cp .env.example .env.local
```

Fill in the environment variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nextauth"
NEXTAUTH_SECRET="yourVerySecretString"

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

GITHUB_ID=...
GITHUB_SECRET=...

FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```

### 3. Set Up Prisma

```bash
npx prisma migrate dev --name init
```

To open Prisma Studio:

```bash
npx prisma studio
```

### 4. Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

You can now:

* Register a user via `POST /api/register`
* Sign in at `/login` via credentials or social logins

---

## 🔐 Authentication

* **Local credentials login** (`email`, `password`)
* **Google**, **GitHub**, and **Facebook** sign-in
* Passwords are hashed with bcrypt
* JWT sessions via NextAuth
* Fully working protected route example (`/dashboard`)

---

## 📁 Project Structure

.
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts       # NextAuth config and API handler
│   │   └── register/route.ts                 # User registration API route
│   ├── dashboard/page.tsx                    # Protected dashboard page
│   ├── login/page.tsx                        # Login page UI
│   └── register/page.tsx                     # Registration page UI
│
├── components/
│   ├── AuthForm.tsx                         # Shared login/register form component
│   └── Providers.tsx                        # NextAuth SessionProvider wrapper
│
├── lib/
│   └── prisma.ts                           # Prisma client singleton instance
│
├── prisma/
│   └── schema.prisma                       # Prisma schema and data models
│
├── public/                                # Static assets (images, favicon, etc.)
├── styles/                                # Global styles (optional)
│
├── .env.example                           # Sample environment variables file
├── README.md                             # This documentation file
├── package.json                          # Project dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
└── next.config.js                        # Next.js configuration (if present)


## ✅ Features

* App Router support (Next.js 15)
* Local credentials registration/login
* Social OAuth login with Google, GitHub, Facebook
* Secure password hashing with bcrypt
* Prisma + PostgreSQL integration
* JWT session with custom callbacks
* Minimal, clean, and extendable architecture

---

## 🛠️ Customization

* Add more providers in `route.ts` under `providers[]`
* Add user roles/permissions in the `User` model
* Customize login/register UI in `AuthForm.tsx`
* Add Tailwind, Shadcn/ui, or other UI kits as needed

---

## 🤝 Contributing

Feel free to fork, clone, or submit pull requests to improve this template.

---

## 📄 License

MIT — use this template freely for personal or commercial projects.
