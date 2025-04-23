import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID || '',
        clientSecret: process.env.GITHUB_SECRET || '',
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials, req) {
          console.log('________ credentials', credentials, req);
  
          if ('1' === credentials?.username && '1' === credentials.password)
            return { id: '11111', name: 'J Smith', email: 'jsmith@example.com' };
          return null;
        }
      })
  
    ],
  
  }