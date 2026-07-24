import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import { Board } from '../../../models/Board';

// Generate a random 8-character alphanumeric string for boardId
function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, theme, elements, viewport } = body;

    const db = await connectToDatabase();
    
    const boardId = generateShortId();

    if (db) {
      const newBoard = await Board.create({
        boardId,
        title: title || 'Новая доска',
        theme: theme || 'whiteboard',
        elements: elements || [],
        viewport: viewport || { x: 0, y: 0, zoom: 1 },
        isPublic: true,
      });

      return NextResponse.json({
        success: true,
        boardId: newBoard.boardId,
        board: newBoard,
      });
    } else {
      // Local fallback if database is not connected yet
      return NextResponse.json({
        success: true,
        boardId,
        fallback: true,
      });
    }
  } catch (error: any) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create board' },
      { status: 500 }
    );
  }
}
