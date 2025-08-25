import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize Prisma Client
let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({
    log: ['error'],
  });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  db = globalForPrisma.prisma;
}

// Ensure the connection is established when the module loads
const connectDB = async () => {
  try {
    await db.$connect();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Connect to the database when the module loads
connectDB();

// Handle process termination
process.on('beforeExit', async () => {
  await db.$disconnect();});

// Export the Prisma Client
export { db };

// Add a function to close the PrismaClient
export const disconnect = async () => {
  try {
    await db.$disconnect();
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    throw error;
  }
};

// Add a function to connect to the database
export const connect = async () => {
  try {
    if (!db) {
      db = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    await db.$connect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};
