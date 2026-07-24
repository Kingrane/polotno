import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBoard extends Document {
  boardId: string;
  title: string;
  theme: string;
  elements: any[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  isPublic: boolean;
  passwordHash?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    boardId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Новая доска',
    },
    theme: {
      type: String,
      default: 'whiteboard',
    },
    elements: {
      type: Array,
      default: [],
    },
    viewport: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      zoom: { type: Number, default: 1 },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    passwordHash: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>('Board', BoardSchema);
