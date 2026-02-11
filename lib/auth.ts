import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedDomains = new Set([
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "proton.me"
]);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  pages: { signIn: "/" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const domain = user.email.split("@").pop()?.toLowerCase();
      return domain ? allowedDomains.has(domain) : false;
    }
  }
};
