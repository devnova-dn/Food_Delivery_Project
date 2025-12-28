'use server';

import { hash } from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: data.email.toLowerCase() });

    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const hashedPassword = await hash(data.password, 12);

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; address?: any }
): Promise<AuthResponse> {
  try {
    await connectDB();

    await User.findByIdAndUpdate(userId, data);

    revalidatePath('/account');

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
