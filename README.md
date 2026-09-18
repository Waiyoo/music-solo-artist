# Solo Musician Professional Platform

Official professional promotional website and manager portal for a solo musician, built under the Global Development Contract.

## Technology Stack
- **Framework:** Next.js 15+ (App Router, Server Components, TypeScript)
- **Styling:** Tailwind CSS (Modern African × Coastal × Nubian × Music Editorial aesthetic)
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Authentication:** Secure session cookies (jose, bcryptjs, middleware protection)
- **Deployment:** Vercel

---

## Environment Variables
Create a `.env` file in the root directory based on the following required production variables:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
JWT_SECRET="your_secure_random_jwt_secret_key"
NEXT_PUBLIC_SITE_URL="[https://yourdomain.com](https://yourdomain.com)"