import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import { Board } from '../../../../models/Board';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 503 }
      );
    }

    const board = await Board.findOne({ boardId: id });
    if (!board) {
      return NextResponse.json(
        { success: false, error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      board: {
        boardId: board.boardId,
        title: board.title,
        theme: board.theme,
        elements: board.elements,
        viewport: board.viewport,
        updatedAt: board.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, theme, elements, viewport } = body;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 503 }
      );
    }

    const updatedBoard = await Board.findOneAndUpdate(
      { boardId: id },
      {
        $set: {
          ...(title && { title }),
          ...(theme && { theme }),
          ...(elements && { elements }),
          ...(viewport && { viewport }),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      board: {
        boardId: updatedBoard.boardId,
        title: updatedBoard.title,
        theme: updatedBoard.theme,
        elements: updatedBoard.elements,
        viewport: updatedBoard.viewport,
        updatedAt: updatedBoard.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating board:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update board' },
      { status: 500 }
    );
  }
}
