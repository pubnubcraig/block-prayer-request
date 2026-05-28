import type { NextAuthConfig } from 'next-auth';

/**
 * Shared auth config used by both the full auth setup and the middleware.
 * Kept separate to avoid importing Node.js-only deps (bcryptjs) into Edge Runtime.
 */
export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    newUser: '/profile/setup',
    error: '/login',
  },
  providers: [], // Populated in lib/auth.ts (not here, to avoid Edge issues)
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      // When updateSession() is called, refresh image from DB
      if (trigger === 'update') {
        try {
          const { getDb } = await import('@/lib/db');
          const { users } = await import('@/lib/db/schema');
          const { eq } = await import('drizzle-orm');
          const db = getDb();
          if (db && token.id) {
            const dbUser = await db.query.users.findFirst({
              where: eq(users.id, token.id as string),
              columns: { image: true, name: true },
            });
            if (dbUser) {
              token.image = dbUser.image;
              token.name = dbUser.name;
            }
          }
        } catch {
          // Fail silently — image will update on next full refresh
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user && token.image) {
        session.user.image = token.image as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isProtected =
        nextUrl.pathname.startsWith('/profile') ||
        nextUrl.pathname.startsWith('/history');
      if (isProtected && !auth) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      return true;
    },
  },
};
