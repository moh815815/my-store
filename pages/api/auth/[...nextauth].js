import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("البريد وكلمة السر مطلوبين");
        const result = await query("SELECT * FROM users WHERE email = $1", [credentials.email]);
        const user = result.rows[0];
        if (!user) throw new Error("المستخدم مش موجود");
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("كلمة السر غلط");
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) { if (user) { token.role = user.role; token.id = user.id; } return token; },
    async session({ session, token }) { if (session?.user) { session.user.role = token.role; session.user.id = token.id; } return session; },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
