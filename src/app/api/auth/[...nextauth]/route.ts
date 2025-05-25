import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find the user by email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            // If no user is found, check if there's a member with admin/pastor/leader role
            // This is for backward compatibility with existing members
            const member = await prisma.member.findUnique({
              where: {
                email: credentials.email,
                role: {
                  in: ['admin', 'pastor', 'leader'] // Only allow staff to login
                }
              },
            });

            if (!member) {
              return null;
            }

            // For demo purposes, we'll create a user account for this member
            // In a real implementation, you would require proper registration
            const newUser = await prisma.user.create({
              data: {
                name: member.name,
                email: member.email,
                // Use a default hashed password (this is just for demo)
                // In production, you would generate a random password and send a reset link
                password: "$2b$10$8OxDlUUu9jQKdHMBmS4.0.Uy7BQPwVd5r8HUiQpJGBjlG9X.Jsxk2", // "password123"
                role: member.role,
                memberId: member.id,
              },
            });

            return {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              memberId: newUser.memberId,
            };
          }

          // Check the password
          const passwordMatch = await compare(credentials.password, user.password);
          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            memberId: user.memberId,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.memberId = user.memberId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.memberId = token.memberId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
    newUser: "/auth/new-user",
  },
});

export { handler as GET, handler as POST };
