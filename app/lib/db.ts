import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// Next.js carga .env solo; fuera de su runtime (tests, scripts sueltos vía
// tsx) no hay nadie que lo haga — sin esto, DATABASE_URL llega undefined ahí.
// No-op dentro de Next: dotenv nunca pisa una variable ya definida.
import "dotenv/config";

// Prisma 7: el schema no trae `url` embebido, así que el driver adapter es
// obligatorio (no opcional) para que el cliente sepa a qué base conectarse.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
