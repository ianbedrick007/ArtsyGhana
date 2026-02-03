import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Named export
export { prisma }

// Default export
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
