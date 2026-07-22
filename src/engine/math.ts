import { CanvasElement, Point, Viewport, ResizeHandle } from './types';
import { getStroke } from 'perfect-freehand';

/**
 * Converts screen pixel coordinates to canvas world coordinates.
 */
export function screenToCanvas(screenPoint: Point, viewport: Viewport): Point {
  return {
    x: (screenPoint.x - viewport.x) / viewport.zoom,
    y: (screenPoint.y - viewport.y) / viewport.zoom,
  };
}

/**
 * Converts canvas world coordinates to screen pixel coordinates.
 */
export function canvasToScreen(canvasPoint: Point, viewport: Viewport): Point {
  return {
    x: canvasPoint.x * viewport.zoom + viewport.x,
    y: canvasPoint.y * viewport.zoom + viewport.y,
  };
}

/**
 * Rotates a point around a center point by a given angle in radians.
 */
export function rotatePoint(point: Point, center: Point, angleRad: number): Point {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

/**
 * Calculates the bounding box of a single element (unrotated world coordinates).
 */
export function getElementBounds(element: CanvasElement): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (element.type === 'pencil' && element.points && element.points.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const p of element.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }

    const padding = (element.strokeWidth || 4) / 2;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(10, maxX - minX),
      height: Math.max(10, maxY - minY),
    };
  }

  const minX = Math.min(element.x, element.x + element.width);
  const minY = Math.min(element.y, element.y + element.height);
  const maxX = Math.max(element.x, element.x + element.width);
  const maxY = Math.max(element.y, element.y + element.height);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(10, Math.abs(element.width)),
    height: Math.max(10, Math.abs(element.height)),
  };
}

/**
 * Calculates a unified bounding box for a group of elements.
 */
export function getCombinedBounds(elements: CanvasElement[]) {
  if (elements.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    const bounds = getElementBounds(el);
    if (bounds.minX < minX) minX = bounds.minX;
    if (bounds.minY < minY) minY = bounds.minY;
    if (bounds.maxX > maxX) maxX = bounds.maxX;
    if (bounds.maxY > maxY) maxY = bounds.maxY;
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Generates SVG path string for perfect-freehand pencil strokes.
 */
export function getFreehandPathData(points: Point[], strokeWidth: number = 4): string {
  if (points.length === 0) return '';

  const strokePoints = getStroke(
    points.map((p) => [p.x, p.y]),
    {
      size: strokeWidth,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      start: {
        taper: 0,
        easing: (t) => t,
        cap: true,
      },
      end: {
        taper: 0,
        easing: (t) => t,
        cap: true,
      },
    }
  );

  if (!strokePoints || strokePoints.length === 0) return '';

  const d: string[] = [];
  const [first, ...rest] = strokePoints;
  d.push(`M ${first[0]} ${first[1]}`);

  for (const point of rest) {
    d.push(`L ${point[0]} ${point[1]}`);
  }

  d.push('Z');
  return d.join(' ');
}

/**
 * Checks if a point hits an element (considering rotation).
 */
export function isPointInElement(point: Point, element: CanvasElement): boolean {
  const bounds = getElementBounds(element);
  const center = {
    x: bounds.minX + bounds.width / 2,
    y: bounds.minY + bounds.height / 2,
  };

  // Un-rotate hit point around element center
  const angleRad = -((element.angle || 0) * Math.PI) / 180;
  const localPoint = rotatePoint(point, center, angleRad);

  const padding = Math.max(10, (element.strokeWidth || 4) + 4);

  if (element.type === 'pencil' && element.points) {
    for (let i = 0; i < element.points.length - 1; i++) {
      const p1 = element.points[i];
      const p2 = element.points[i + 1];
      const dist = distanceToSegment(localPoint, p1, p2);
      if (dist <= padding) return true;
    }
    return false;
  }

  if (element.type === 'line' || element.type === 'arrow') {
    const p1 = { x: element.x, y: element.y };
    const p2 = { x: element.x + element.width, y: element.y + element.height };
    const dist = distanceToSegment(localPoint, p1, p2);
    return dist <= padding;
  }

  // Image, Text, or filled/unfilled shape bounding check
  return (
    localPoint.x >= bounds.minX - 6 &&
    localPoint.x <= bounds.maxX + 6 &&
    localPoint.y >= bounds.minY - 6 &&
    localPoint.y <= bounds.maxY + 6
  );
}

/**
 * Helper to compute distance from a point to a line segment.
 */
function distanceToSegment(p: Point, a: Point, b: Point): number {
  const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * (b.x - a.x);
  const projY = a.y + t * (b.y - a.y);
  return Math.hypot(p.x - projX, p.y - projY);
}

/**
 * Checks if an element intersects with a drag marquee selection rectangle.
 */
export function isElementInBox(
  element: CanvasElement,
  box: { x: number; y: number; width: number; height: number }
): boolean {
  const bounds = getElementBounds(element);
  const boxMinX = Math.min(box.x, box.x + box.width);
  const boxMaxX = Math.max(box.x, box.x + box.width);
  const boxMinY = Math.min(box.y, box.y + box.height);
  const boxMaxY = Math.max(box.y, box.y + box.height);

  return (
    bounds.minX <= boxMaxX &&
    bounds.maxX >= boxMinX &&
    bounds.minY <= boxMaxY &&
    bounds.maxY >= boxMinY
  );
}

/**
 * Get hit resize handle for selected element box (matching renderer padding).
 */
export function getHitResizeHandle(
  point: Point,
  box: { x: number; y: number; width: number; height: number },
  zoom: number
): ResizeHandle | null {
  const padding = 6 / zoom;
  const x = box.x - padding;
  const y = box.y - padding;
  const w = box.width + padding * 2;
  const h = box.height + padding * 2;

  const handleHitRadius = Math.max(14, 18 / zoom);

  const handles: { handle: ResizeHandle; x: number; y: number }[] = [
    { handle: 'tl', x: x, y: y },
    { handle: 'tr', x: x + w, y: y },
    { handle: 'bl', x: x, y: y + h },
    { handle: 'br', x: x + w, y: y + h },
    { handle: 't', x: x + w / 2, y: y },
    { handle: 'b', x: x + w / 2, y: y + h },
    { handle: 'l', x: x, y: y + h / 2 },
    { handle: 'r', x: x + w, y: y + h / 2 },
    { handle: 'rot', x: x + w / 2, y: y - 20 / zoom },
  ];

  for (const hPos of handles) {
    if (Math.hypot(point.x - hPos.x, point.y - hPos.y) <= handleHitRadius) {
      return hPos.handle;
    }
  }

  return null;
}
