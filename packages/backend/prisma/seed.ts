import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - uncomment if needed)
  // await prisma.refreshToken.deleteMany({});
  // await prisma.photo.deleteMany({});
  // await prisma.profile.deleteMany({});
  // await prisma.user.deleteMany({});

  console.log('📝 Creating test users...');

  // Password: Test1234 (meets validation requirements)
  const hashedPassword = await bcrypt.hash('Test1234', 10);

  // 1. Super Admin User
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@studioai.test' },
    update: {},
    create: {
      email: 'superadmin@studioai.test',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      authProvider: 'EMAIL',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      isActive: true,
      loginCount: 5,
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          displayName: 'Super Administrator',
          bio: 'System administrator with full access',
          preferredAPI: 'openai',
          defaultQuality: 'hd',
          notificationsEnabled: true,
          marketingEmails: false,
        },
      },
    },
  });

  // 2. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@studioai.test' },
    update: {},
    create: {
      email: 'admin@studioai.test',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      authProvider: 'EMAIL',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      isActive: true,
      loginCount: 12,
      lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          displayName: 'Admin',
          bio: 'Platform administrator',
          preferredAPI: 'openai',
          defaultQuality: 'standard',
          notificationsEnabled: true,
          marketingEmails: true,
        },
      },
    },
  });

  // 3. Regular Users
  const regularUsers = [
    {
      email: 'john.doe@studioai.test',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      bio: 'Photographer and AI enthusiast',
      preferredAPI: 'openai',
      loginCount: 25,
    },
    {
      email: 'jane.smith@studioai.test',
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      bio: 'Digital artist exploring AI-generated photos',
      preferredAPI: 'huggingface',
      loginCount: 18,
    },
    {
      email: 'mike.johnson@studioai.test',
      firstName: 'Mike',
      lastName: 'Johnson',
      displayName: 'Mike J',
      bio: 'Creative professional',
      preferredAPI: 'gemini',
      loginCount: 8,
    },
    {
      email: 'sarah.williams@studioai.test',
      firstName: 'Sarah',
      lastName: 'Williams',
      displayName: 'Sarah W',
      bio: 'Event planner using AI for photo enhancements',
      preferredAPI: 'openai',
      loginCount: 32,
    },
    {
      email: 'alex.brown@studioai.test',
      firstName: 'Alex',
      lastName: 'Brown',
      displayName: 'Alex Brown',
      bio: 'Tech enthusiast and early adopter',
      preferredAPI: 'huggingface',
      loginCount: 15,
    },
  ];

  for (const userData of regularUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        passwordHash: hashedPassword,
        role: 'USER',
        authProvider: 'EMAIL',
        emailVerified: true,
        emailVerifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        isActive: true,
        loginCount: userData.loginCount,
        lastLoginAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random within last 24h
        profile: {
          create: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            displayName: userData.displayName,
            bio: userData.bio,
            preferredAPI: userData.preferredAPI,
            defaultQuality: 'standard',
            notificationsEnabled: true,
            marketingEmails: Math.random() > 0.5,
          },
        },
      },
    });
  }

  // 4. Guest User (no password)
  await prisma.user.upsert({
    where: { email: 'guest@studioai.test' },
    update: {},
    create: {
      email: 'guest@studioai.test',
      passwordHash: null,
      role: 'GUEST',
      authProvider: 'EMAIL',
      emailVerified: false,
      isActive: true,
      loginCount: 0,
      profile: {
        create: {
          displayName: 'Guest User',
          preferredAPI: 'openai',
          defaultQuality: 'standard',
        },
      },
    },
  });

  // 5. Unverified User (registered but hasn't verified email)
  await prisma.user.upsert({
    where: { email: 'unverified@studioai.test' },
    update: {},
    create: {
      email: 'unverified@studioai.test',
      passwordHash: hashedPassword,
      role: 'USER',
      authProvider: 'EMAIL',
      emailVerified: false,
      isActive: true,
      loginCount: 0,
      profile: {
        create: {
          firstName: 'Unverified',
          lastName: 'User',
          displayName: 'Unverified User',
        },
      },
    },
  });

  // 6. Banned User
  await prisma.user.upsert({
    where: { email: 'banned@studioai.test' },
    update: {},
    create: {
      email: 'banned@studioai.test',
      passwordHash: hashedPassword,
      role: 'USER',
      authProvider: 'EMAIL',
      emailVerified: true,
      emailVerifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      isActive: false,
      isBanned: true,
      bannedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      bannedReason: 'Violation of terms of service',
      loginCount: 45,
      lastLoginAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      profile: {
        create: {
          firstName: 'Banned',
          lastName: 'User',
          displayName: 'Banned User',
        },
      },
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📋 Test User Credentials:');
  console.log('━'.repeat(60));
  console.log('Email                          | Password  | Role');
  console.log('━'.repeat(60));
  console.log('superadmin@studioai.test       | Test1234  | SUPER_ADMIN');
  console.log('admin@studioai.test            | Test1234  | ADMIN');
  console.log('john.doe@studioai.test         | Test1234  | USER');
  console.log('jane.smith@studioai.test       | Test1234  | USER');
  console.log('mike.johnson@studioai.test     | Test1234  | USER');
  console.log('sarah.williams@studioai.test   | Test1234  | USER');
  console.log('alex.brown@studioai.test       | Test1234  | USER');
  console.log('unverified@studioai.test       | Test1234  | USER (unverified)');
  console.log('banned@studioai.test           | Test1234  | USER (banned)');
  console.log('━'.repeat(60));
  console.log('\n💡 All passwords: Test1234');
  console.log('📧 Email format: *@studioai.test');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
