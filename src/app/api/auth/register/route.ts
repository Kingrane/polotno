import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import { User } from '../../../../models/User';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Заполните все поля (Имя, Email, Пароль)' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'База данных временно недоступна' },
        { status: 503 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким Email уже зарегистрирован' },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      isPro: false,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        isPro: newUser.isPro,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Ошибка при регистрации' },
      { status: 500 }
    );
  }
}
