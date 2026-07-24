import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import { User } from '../../../../models/User';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Заполните Email и Пароль' },
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

    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Неверный Email или Пароль' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isPro: user.isPro,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Ошибка при входе' },
      { status: 500 }
    );
  }
}
