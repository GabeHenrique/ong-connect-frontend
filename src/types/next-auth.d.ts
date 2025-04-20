import "next-auth";

export const AUTH_PROVIDER = 'credentials';

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    name: string;
    role: "ONG" | "VOLUNTEER";
    accessToken: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}
