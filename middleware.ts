import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Use the edge-compatible config (no bcryptjs, no DB adapter)
// Route protection logic is in authConfig.callbacks.authorized
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/profile/:path*', '/history/:path*'],
};
