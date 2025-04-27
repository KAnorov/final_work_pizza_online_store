import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { UserRole } from "@prisma/client";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'USER' as UserRole,
        };
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const values = { email: credentials.email };
          const findUser = await prisma.user.findFirst({ where: values });
          if (!findUser) return null;
          const isValidPassword = await compare(credentials.password, findUser.password);
          if (!isValidPassword) return null;
          if (!findUser.verified) return null;
          return {
            id: findUser.id,
            email: findUser.email,
            name: findUser.fullName,
            role: findUser.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  
  callbacks: {

    async signIn({ user, account }) {
      try {
        if (account?.provider == 'credentials') return true;

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              { provider: account?.provider, providerId: account?.providerAccountId },
              { email: user.email || ''}
            ]
          }
        });
        if (findUser) {
          await prisma.user.update({
            where: { id: findUser.id },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            }
          });

          return true;
        }
        await prisma.user.create({
          data: {
            email: user.email || '',
            fullName: user.name || 'User #' + user.id,
            password: hashSync(user.id.toString(), 10),
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
          }
        });
        return true;
      } catch (err) {
        console.error('err signIn', err);
        return false;
      }
    },


    async jwt({ token }) {
      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
        
      });
      console.log('JWT callback', { token, findUser });
      if (findUser) {
        token.id = String(findUser.id);
        token.email = findUser.email;
        token.fullName = findUser.fullName;
        token.role = findUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      console.log('Session callback', { session, token });
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

