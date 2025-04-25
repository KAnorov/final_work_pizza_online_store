import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/prisma-client";
import { compare, hashSync } from "bcrypt";
import { AuthOptions } from "next-auth";
import { UserRole } from "@prisma/client";

export const authOptions: AuthOptions = {  
    providers: [
      GitHubProvider({
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
        },
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
         
          try  {if (!credentials?.email || !credentials?.password) {
            throw new Error('Поля email и пароль обязательны');
          }

          const findUser = await prisma.user.findFirst({
            where: { email: credentials.email },
          });
        
          if (!findUser) {
            throw new Error('Пользователь не найден');
          }

          const isPasswordValid = await compare(credentials.password, findUser.password); // проверяем пароль
  
          if (!isPasswordValid) { // если нет, то возвращаем null
            return null;
          }
  
          if (!findUser.verified) { // если нет, то возвращаем null 
            return null;
          }
          return { // возвращаем пользователя с данными пользователя и ролью 
            id: findUser.id,
            email: findUser.email,
            name: findUser.fullName,
            role: findUser.role,
          };

        }catch (error){
          console.error(error);
          if (error instanceof Error) {
            throw error; // Это важно!
          }
          throw new Error('Ошибка авторизации');
        } },
      }),
  
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    callbacks: {

      async signIn({ user, account }) { // функция авторизации пользователя по провайдеру 
        try {
          if (account?.provider === 'credentials') { // если провайдер авторизации это credentials, то возвращаем true
            return true;
          }
  
          if (!user.email) { // если нет email, то возвращаем false
            return false;
          }
  
          const findUser = await prisma.user.findFirst({ // ищем пользователя в базе данных
            where: {
              OR: [
                { provider: account?.provider, providerId: account?.providerAccountId }, // если есть, то проверяем данные пользователя
                { email: user.email }, // если нет, то создаем пользователя
              ],
            },
          });
  
          if (findUser) {
            await prisma.user.update({ // если есть, то обновляем данные пользователя
              where: { // если есть, то обновляем данные пользователя
                id: findUser.id,  // если есть, то обновляем данные пользователя
              },
              data: {   
                provider: account?.provider,
                providerId: account?.providerAccountId,
              },
            });
  
            return true;
          }
  
          await prisma.user.create({ // если нет, то создаем пользователя
            data: {
              email: user.email,
              fullName: user.name || 'User #' + user.id,
              password: hashSync(user.id.toString(), 10),
              verified: new Date(),
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          });
  
          return true; 
        } catch (error) {
          console.error('Error [SIGNIN]', error);
          return false;
        }
      },
      async jwt({ token }) { // ищем пользователя в базе данных
        const findUser = await prisma.user.findFirst({ 
          where: { email: token.email }, // если есть, то возвращаем пользователя с данными пользователя и ролью пользователя
    })

    if (findUser) {
      token.id = String(findUser.id);
        token.email = findUser.email;
        token.fullName = findUser.fullName;
        token.role = findUser.role;
    }
    return token;
  },
  async session({ session, token }) { // ищем пользователя в базе данных
    if (session?.user) {
      session.user.id = token.id;
      session.user.role = token.role;
    }
    return session;

  },
  
}};