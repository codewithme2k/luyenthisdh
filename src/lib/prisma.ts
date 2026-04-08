import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export const db = globalForPrisma.prisma || prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
