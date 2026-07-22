import rough from 'roughjs';
import { CanvasElement, Viewport, BoardTheme, SelectionBox } from './types';
import {
  getElementBounds,
  getCombinedBounds,
  getFreehandPathData,
} from './math';

/**
 * Main renderer for drawing the entire canvas scene.
 */
export function renderScene(
  canvas: HTMLCanvasElement,
  elements: CanvasElement[],
  selectedIds: string[],
  viewport: Viewport,
  theme: BoardTheme,
  marqueeBox: SelectionBox | null
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear screen
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 1. Draw Background according to Theme
  renderBackground(ctx, width, height, viewport, theme);

  // 2. Apply Viewport Transform (Zoom and Pan)
  ctx.translate(viewport.x, viewport.y);
  ctx.scale(viewport.zoom, viewport.zoom);

  // Initialize Rough.js canvas instance
  const rc = rough.canvas(canvas);

  // 3. Render Canvas Elements
  for (const element of elements) {
    renderElement(ctx, rc, element, theme);
  }

  // 4. Render Selection Box & Handles
  if (selectedIds.length > 0) {
    const selectedElements = elements.filter((el) => selectedIds.includes(el.id));
    renderSelectionUI(ctx, selectedElements, viewport.zoom);
  }

  // 5. Render Drag Marquee Selection Box
  if (marqueeBox) {
    renderMarquee(ctx, marqueeBox);
  }

  ctx.restore();
}

/**
 * Draws theme background (whiteboard, grid, dots, ruled, chalkboard, paper).
 */
function renderBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  viewport: Viewport,
  theme: BoardTheme
) {
  if (theme === 'chalkboard') {
    // Deep slate green chalkboard
    ctx.fillStyle = '#1b2a24';
    ctx.fillRect(0, 0, width, height);

    // Chalk dust texture / noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 200; i++) {
      const rx = (Math.sin(i * 999) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 333) * 0.5 + 0.5) * height;
      ctx.fillRect(rx, ry, 3, 3);
    }
  } else if (theme === 'paper') {
    // Warm beige paper background
    ctx.fillStyle = '#f5f0eb';
    ctx.fillRect(0, 0, width, height);

    // Subtle paper grain dots
    ctx.fillStyle = 'rgba(120, 100, 80, 0.03)';
    for (let i = 0; i < 150; i++) {
      const rx = (Math.sin(i * 777) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 444) * 0.5 + 0.5) * height;
      ctx.fillRect(rx, ry, 2, 2);
    }
  } else {
    // Clean off-white background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
  }

  if (theme === 'grid' || theme === 'dots' || theme === 'ruled' || theme === 'paper') {
    ctx.save();
    const gridSize = 32 * viewport.zoom;
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;

    if (theme === 'paper') {
      ctx.strokeStyle = 'rgba(140, 110, 80, 0.08)';
      ctx.fillStyle = 'rgba(140, 110, 80, 0.12)';
    } else {
      ctx.strokeStyle = theme === 'chalkboard' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
      ctx.fillStyle = theme === 'chalkboard' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
    }
    ctx.lineWidth = 1;

    if (theme === 'grid' || theme === 'paper') {
      ctx.beginPath();
      for (let x = offsetX; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    } else if (theme === 'dots') {
      for (let x = offsetX; x < width; x += gridSize) {
        for (let y = offsetY; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (theme === 'ruled') {
      ctx.beginPath();
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}

/**
 * Draws a single element using Rough.js or Canvas 2D.
 */
function renderElement(
  ctx: CanvasRenderingContext2D,
  rc: ReturnType<typeof rough.canvas>,
  element: CanvasElement,
  theme: BoardTheme
) {
  ctx.save();
  ctx.globalAlpha = element.opacity;

  let strokeColor = element.strokeColor;
  let fillColor = element.fillColor;

  if (theme === 'chalkboard' && (strokeColor === '#1d1d1f' || strokeColor === '#000000')) {
    strokeColor = '#ffffff';
  }

  // Handle Rotation
  const bounds = getElementBounds(element);
  const center = {
    x: bounds.minX + bounds.width / 2,
    y: bounds.minY + bounds.height / 2,
  };

  if (element.angle) {
    ctx.translate(center.x, center.y);
    ctx.rotate((element.angle * Math.PI) / 180);
    ctx.translate(-center.x, -center.y);
  }

  const roughOptions = {
    stroke: strokeColor,
    fill: fillColor !== 'transparent' ? fillColor : undefined,
    strokeWidth: element.strokeWidth,
    roughness: element.isHanddrawn ? element.roughness : 0,
    bowing: element.isHanddrawn ? 1.5 : 0,
    seed: element.seed,
    fillStyle: element.fillStyle === 'none' ? undefined : element.fillStyle,
    strokeLineDash:
      element.strokeStyle === 'dashed'
        ? [8, 8]
        : element.strokeStyle === 'dotted'
        ? [3, 5]
        : undefined,
  };

  const x = element.x;
  const y = element.y;
  const w = element.width;
  const h = element.height;

  switch (element.type) {
    case 'rectangle':
      rc.rectangle(x, y, w, h, roughOptions);
      break;

    case 'ellipse':
      rc.ellipse(x + w / 2, y + h / 2, Math.abs(w), Math.abs(h), roughOptions);
      break;

    case 'rhombus':
      rc.polygon(
        [
          [x + w / 2, y],
          [x + w, y + h / 2],
          [x + w / 2, y + h],
          [x, y + h / 2],
        ],
        roughOptions
      );
      break;

    case 'line':
      rc.line(x, y, x + w, y + h, roughOptions);
      break;

    case 'arrow':
      rc.line(x, y, x + w, y + h, roughOptions);
      const angle = Math.atan2(h, w);
      const headLength = Math.max(12, element.strokeWidth * 4);
      const p1 = {
        x: x + w - headLength * Math.cos(angle - Math.PI / 6),
        y: y + h - headLength * Math.sin(angle - Math.PI / 6),
      };
      const p2 = {
        x: x + w - headLength * Math.cos(angle + Math.PI / 6),
        y: y + h - headLength * Math.sin(angle + Math.PI / 6),
      };
      rc.polygon([[x + w, y + h], [p1.x, p1.y], [p2.x, p2.y]], {
        ...roughOptions,
        fill: strokeColor,
        fillStyle: 'solid',
      });
      break;

    case 'pencil':
      if (element.points && element.points.length > 0) {
        const pathData = getFreehandPathData(element.points, element.strokeWidth);
        if (pathData) {
          ctx.fillStyle = strokeColor;
          ctx.beginPath();
          const p = new Path2D(pathData);
          ctx.fill(p);
        }
      }
      break;

    case 'text':
      ctx.font = `${element.fontSize || 20}px ${element.fontFamily || 'Inter, sans-serif'}`;
      ctx.fillStyle = strokeColor;
      ctx.textBaseline = 'top';
      const lines = (element.text || '').split('\n');
      const lineHeight = (element.fontSize || 20) * 1.2;
      lines.forEach((lineText, idx) => {
        ctx.fillText(lineText, x, y + idx * lineHeight);
      });
      break;

    case 'image':
      if (element.src) {
        const img = getImageFromCache(element.src);
        if (img && img.complete) {
          ctx.drawImage(img, x, y, w, h);
        }
      }
      break;
  }

  ctx.restore();
}

/**
 * Image Cache
 */
const imageCache: Map<string, HTMLImageElement> = new Map();

function getImageFromCache(src: string): HTMLImageElement | null {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }
  const img = new Image();
  img.src = src;
  imageCache.set(src, img);
  return img;
}

/**
 * Renders bounding box and handles.
 */
function renderSelectionUI(
  ctx: CanvasRenderingContext2D,
  selectedElements: CanvasElement[],
  zoom: number
) {
  ctx.save();

  const bounds = getCombinedBounds(selectedElements);
  const handleSize = 8 / zoom;
  const padding = 6 / zoom;

  const x = bounds.x - padding;
  const y = bounds.y - padding;
  const w = bounds.width + padding * 2;
  const h = bounds.height + padding * 2;

  // Bounding box border
  ctx.strokeStyle = '#0071E3';
  ctx.lineWidth = 1.5 / zoom;
  ctx.setLineDash([4 / zoom, 4 / zoom]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);

  // Handles positions
  const handles = [
    { x: x, y: y },
    { x: x + w, y: y },
    { x: x, y: y + h },
    { x: x + w, y: y + h },
    { x: x + w / 2, y: y },
    { x: x + w / 2, y: y + h },
    { x: x, y: y + h / 2 },
    { x: x + w, y: y + h / 2 },
  ];

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0071E3';
  ctx.lineWidth = 1.5 / zoom;

  for (const hPos of handles) {
    ctx.beginPath();
    ctx.rect(
      hPos.x - handleSize / 2,
      hPos.y - handleSize / 2,
      handleSize,
      handleSize
    );
    ctx.fill();
    ctx.stroke();
  }

  // Rotation Handle
  const rotX = x + w / 2;
  const rotY = y - 20 / zoom;

  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(rotX, rotY);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(rotX, rotY, handleSize / 2 + 1 / zoom, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Marquee selection box
 */
function renderMarquee(ctx: CanvasRenderingContext2D, box: SelectionBox) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 113, 227, 0.08)';
  ctx.strokeStyle = 'rgba(0, 113, 227, 0.6)';
  ctx.lineWidth = 1;
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  ctx.restore();
}
