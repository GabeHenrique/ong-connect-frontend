import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const AUTH_PROVIDER = 'credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: AUTH_PROVIDER,
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          const data = await res.json();

          if (res.ok && data) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              accessToken: data.access_token,
              role: data.user.role,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.role = token.role as "ONG" | "VOLUNTEER";
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  events: {
    async signOut() {
      // Você pode adicionar lógica adicional aqui se necessário
      // Por exemplo, invalidar tokens no backend
      try {
        await fetch(`${process.env.API_URL}/auth/signout`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error during signout:", error);
      }
    },
  },
});
