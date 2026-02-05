import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

const isProduction = process.env.NODE_ENV === 'production'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Normalize email
          const email = credentials.email.toLowerCase().trim()

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
            },
          })

          if (!user || !user.password) {
            // Return null instead of throwing to prevent user enumeration
            return null
          }

          // Timing-safe password comparison
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Only allow ADMIN role to log into admin dashboard
          if (user.role !== 'ADMIN') {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        console.log('🔵 JWT callback - user login:', {
          id: user.id,
          email: user.email,
          role: user.role
        })
        token.id = user.id
        token.role = user.role
        token.email = user.email
      }

      console.log('🔵 JWT token:', {
        id: token.id,
        role: token.role,
        email: token.email
      })

      // Rotate session on update
      if (trigger === 'update') {
        token.iat = Math.floor(Date.now() / 1000)
      }

      return token
    },
    async session({ session, token }) {
      console.log('🔵 Session callback - token:', {
        id: token.id,
        role: token.role
      })

      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
      }

      console.log('🔵 Session created:', {
        userId: session.user?.id,
        userRole: session.user?.role
      })

      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  cookies: {
    sessionToken: {
      name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: isProduction,
}
