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
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      // When updateSession({ image }) is called from the client
      if (trigger === 'update' && updateData) {
        if ('image' in updateData) {
          token.image = updateData.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user) {
        session.user.image = (token.image as string) ?? null;
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
