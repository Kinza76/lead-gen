import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

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
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: "Yahoo/Outlook",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;
        const domain = email.split("@").pop();
        if (domain !== "yahoo.com" && domain !== "outlook.com") return null;
        return {
          id: email,
          email,
          name: email.split("@")[0]
        };
      }
    })
  ],
  pages: { signIn: "/" },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      if (account?.provider === "facebook") return true;
      if (account?.provider === "credentials") return true;
      const domain = user.email.split("@").pop()?.toLowerCase();
      return domain ? allowedDomains.has(domain) : false;
    }
  }
};
