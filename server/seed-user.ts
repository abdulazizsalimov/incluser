import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedUser() {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, 'Gomer98')).limit(1);
    
    if (existingUser.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('12345', 10);
    
    // Create admin user
    await db.insert(users).values({
      username: 'Gomer98',
      email: 'admin@incluser.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding user:', error);
  }
}