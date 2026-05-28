import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { authConfig } from '@/lib/auth.config';

const db = getDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(db ? { adapter: DrizzleAdapter(db) } : {}),
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.toLowerCase?.();
        const password = credentials?.password as string;

        if (!email || !password) {
          console.error('[auth] Missing email or password');
          return null;
        }

        const db = getDb();
        if (!db) {
          console.error('[auth] No database connection');
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user) {
          console.error('[auth] No user found for email:', email);
          return null;
        }

        if (!user.hashedPassword) {
          console.error('[auth] User has no hashed password:', email);
          return null;
        }

        if (!user.emailVerified) {
          console.error('[auth] Email not verified:', email, '- emailVerified:', user.emailVerified);
          return null;
        }

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) {
          console.error('[auth] Invalid password for:', email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
});
