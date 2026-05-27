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
        if (!credentials?.email || !credentials?.password) return null;

        const db = getDb();
        if (!db) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user?.hashedPassword) return null;

        // Reject unverified email accounts
        if (!user.emailVerified) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword,
        );
        if (!valid) return null;

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
