import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import PocketBase from 'pocketbase';
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "PocketBase",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use environment variable for PocketBase URL
          const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
          
          // Authenticate with email instead of username
          const authData = await pb.collection('users').authWithPassword(
            credentials.email,
            credentials.password
          );
          
          if (authData && authData.record) {
            return {
              id: authData.record.id,
              name: authData.record.name || authData.record.email.split('@')[0],
              email: authData.record.email,
              image: authData.record.avatar ? `${process.env.POCKETBASE_URL}/api/files/users/${authData.record.id}/${authData.record.avatar}` : null,
            };
          }
          
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };