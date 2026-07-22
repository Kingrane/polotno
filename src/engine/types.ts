export type ToolType =
  | 'select'
  | 'hand'
  | 'pencil'
  | 'rectangle'
  | 'ellipse'
  | 'rhombus'
  | 'line'
  | 'arrow'
  | 'text'
  | 'eraser'
  | 'image';

export type ElementType =
  | 'pencil'
  | 'rectangle'
  | 'ellipse'
  | 'rhombus'
  | 'line'
  | 'arrow'
  | 'text'
  | 'image';

export interface Point {
  x: number;
  y: number;
}

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type FillStyle = 'none' | 'solid' | 'hachure' | 'cross-hatch';
export type Sloppiness = 0 | 1 | 2; // 0 = clean, 1 = sketch, 2 = rough

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: Point[]; // For freehand pencil, lines, arrows
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fillStyle: FillStyle;
  roughness: number;
  opacity: number;
  angle: number; // In degrees
  isHanddrawn: boolean;
  seed: number; // For consistent rough.js rendering
  src?: string; // For images (data URL or object URL)
  aspectRatio?: number;
  groupId?: string;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export type BoardTheme = 'whiteboard' | 'grid' | 'dots' | 'ruled' | 'chalkboard' | 'paper';

export interface StyleOptions {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fillStyle: FillStyle;
  roughness: number;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  isHanddrawn: boolean;
}

export interface SelectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r' | 'rot';
