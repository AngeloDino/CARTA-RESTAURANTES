import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { loginSchema } from "@/lib/validations";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
        demo: { label: "Demo", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.demo === "true") {
          const { resetDemoBusiness } = await import("./services/demo");
          await resetDemoBusiness(prisma);
          const demoUser = await prisma.user.findUnique({
            where: { email: "demo@carta.co" },
            include: { business: true },
          });
          if (!demoUser?.business.isDemo) return null;
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            businessId: demoUser.businessId,
            role: demoUser.role,
            isDemo: true,
          };
        }

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { business: true },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          businessId: user.businessId,
          role: user.role,
          isDemo: user.business.isDemo,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.businessId = user.businessId;
        token.role = user.role;
        token.isDemo = user.isDemo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.businessId = token.businessId;
      session.user.role = token.role;
      session.user.isDemo = token.isDemo;
      return session;
    },
  },
};

export interface SessionContext {
  userId: string;
  businessId: string;
  role: string;
  isDemo: boolean;
}

export async function requireSession(): Promise<SessionContext> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.businessId) redirect("/login");
  return {
    userId: session.user.id,
    businessId: session.user.businessId,
    role: session.user.role,
    isDemo: session.user.isDemo,
  };
}
