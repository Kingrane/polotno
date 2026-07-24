'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { renderScene } from '../../engine/renderer';
import {
  screenToCanvas,
  isPointInElement,
  isElementInBox,
  getHitResizeHandle,
  getElementBounds,
  getCombinedBounds,
} from '../../engine/math';
import {
  CanvasElement,
  Point,
  SelectionBox,
  ResizeHandle,
  ElementType,
} from '../../engine/types';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Store bindings
  const {
    elements,
    selectedElementIds,
    viewport,
    tool,
    theme,
    activeStyle,
    addElement,
    updateElement,
    setSelectedElementIds,
    deleteSelectedElements,
    pan,
    zoomAtPoint,
    setTool,
    loadFromLocalStorage,
    saveSnapshot,
  } = useCanvasStore();

  // Interaction State
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);

  const [currentElement, setCurrentElement] = useState<CanvasElement | null>(null);
  const [marqueeBox, setMarqueeBox] = useState<SelectionBox | null>(null);
  const [editingTextElement, setEditingTextElement] = useState<CanvasElement | null>(null);

  const dragStartPoint = useRef<Point>({ x: 0, y: 0 });
  const elementStartStates = useRef<Map<string, CanvasElement>>(new Map());
  const spaceKeyPressed = useRef(false);

  // Initial Load & Window Resize
  useEffect(() => {
    loadFromLocalStorage();

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        triggerRender();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Space key detection for Panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spaceKeyPressed.current && !editingTextElement) {
        spaceKeyPressed.current = true;
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceKeyPressed.current = false;
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editingTextElement]);

  // Native non-passive Wheel Event Listener to prevent Browser Page Zoom!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent native browser zoom or page scroll

      const screenPt = { x: e.clientX, y: e.clientY };

      if (e.ctrlKey || e.metaKey) {
        // Precise canvas zoom
        const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
        zoomAtPoint(zoomFactor, screenPt);
      } else {
        // Canvas panning
        pan(-e.deltaX, -e.deltaY);
      }
    };

    canvas.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleNativeWheel);
  }, [zoomAtPoint, pan]);

  // Native Multi-Touch Event Listener for Mobile Pinch-to-Zoom & 2-finger Panning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let initialDistance = 0;
    let initialCenter: Point = { x: 0, y: 0 };
    let isTouchScaling = false;

    const getDistance = (t1: Touch, t2: Touch) => {
      return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    };

    const getCenter = (t1: Touch, t2: Touch): Point => ({
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    });

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        isTouchScaling = true;
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        initialCenter = getCenter(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isTouchScaling) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const currentCenter = getCenter(e.touches[0], e.touches[1]);

        if (initialDistance > 0 && currentDistance > 0) {
          const zoomFactor = currentDistance / initialDistance;
          zoomAtPoint(zoomFactor, currentCenter);
          initialDistance = currentDistance;
        }

        const deltaX = currentCenter.x - initialCenter.x;
        const deltaY = currentCenter.y - initialCenter.y;
        if (Math.hypot(deltaX, deltaY) > 1) {
          pan(deltaX, deltaY);
          initialCenter = currentCenter;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isTouchScaling = false;
        initialDistance = 0;
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [zoomAtPoint, pan]);

  // Main Render Loop
  const triggerRender = useCallback(() => {
    if (!canvasRef.current) return;

    const allElements = currentElement ? [...elements, currentElement] : elements;

    renderScene(
      canvasRef.current,
      allElements,
      selectedElementIds,
      viewport,
      theme,
      marqueeBox
    );
  }, [elements, currentElement, selectedElementIds, viewport, theme, marqueeBox]);

  useEffect(() => {
    triggerRender();
  }, [triggerRender]);

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (editingTextElement) return;

    const screenPt = { x: e.clientX, y: e.clientY };
    const worldPt = screenToCanvas(screenPt, viewport);

    // Pan with Middle Mouse OR Space Key OR Hand tool
    if (e.button === 1 || spaceKeyPressed.current || tool === 'hand') {
      setIsPanning(true);
      dragStartPoint.current = screenPt;
      document.body.style.cursor = 'grabbing';
      return;
    }

    if (e.button !== 0) return; // Only left click

    // Check Handle Hits on current selection first
    if (selectedElementIds.length > 0 && tool === 'select') {
      const selectedEls = elements.filter((el) => selectedElementIds.includes(el.id));
      const box = getCombinedBounds(selectedEls);
      const hitHandle = getHitResizeHandle(worldPt, box, viewport.zoom);

      if (hitHandle) {
        saveSnapshot();
        dragStartPoint.current = worldPt;
        setActiveHandle(hitHandle);

        elementStartStates.current.clear();
        selectedEls.forEach((el) => elementStartStates.current.set(el.id, { ...el }));

        if (hitHandle === 'rot') {
          setIsRotating(true);
        } else {
          setIsResizing(true);
        }
        return;
      }
    }

    // Select Tool Behavior
    if (tool === 'select') {
      let hitEl: CanvasElement | null = null;
      for (let i = elements.length - 1; i >= 0; i--) {
        if (isPointInElement(worldPt, elements[i])) {
          hitEl = elements[i];
          break;
        }
      }

      if (hitEl) {
        let activeSelection: string[];
        if (e.shiftKey) {
          activeSelection = selectedElementIds.includes(hitEl.id)
            ? selectedElementIds.filter((id) => id !== hitEl!.id)
            : [...selectedElementIds, hitEl.id];
        } else {
          activeSelection = selectedElementIds.includes(hitEl.id)
            ? selectedElementIds
            : [hitEl.id];
        }

        setSelectedElementIds(activeSelection);

        saveSnapshot();
        setIsDraggingElement(true);
        dragStartPoint.current = worldPt;

        elementStartStates.current.clear();
        elements
          .filter((el) => activeSelection.includes(el.id))
          .forEach((el) => elementStartStates.current.set(el.id, { ...el }));
      } else {
        if (!e.shiftKey) {
          setSelectedElementIds([]);
        }
        setIsDrawing(true);
        dragStartPoint.current = worldPt;
        setMarqueeBox({ x: worldPt.x, y: worldPt.y, width: 0, height: 0 });
      }
      return;
    }

    // Eraser Tool
    if (tool === 'eraser') {
      setIsDrawing(true);
      eraseAtPoint(worldPt);
      return;
    }

    // Text Tool - Single click creates text & opens text editor cleanly
    if (tool === 'text') {
      const newTextEl: CanvasElement = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        x: worldPt.x,
        y: worldPt.y,
        width: 180,
        height: 40,
        text: '',
        fontSize: activeStyle.fontSize,
        fontFamily: activeStyle.fontFamily,
        strokeColor: activeStyle.strokeColor,
        fillColor: 'transparent',
        strokeWidth: activeStyle.strokeWidth,
        strokeStyle: activeStyle.strokeStyle,
        fillStyle: 'none',
        roughness: activeStyle.roughness,
        opacity: activeStyle.opacity,
        angle: 0,
        isHanddrawn: activeStyle.isHanddrawn,
        seed: Math.floor(Math.random() * 2 ** 31),
      };
      setEditingTextElement(newTextEl);
      return;
    }

    // Shape Creation
    setIsDrawing(true);
    dragStartPoint.current = worldPt;

    const newElement: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: tool as ElementType,
      x: worldPt.x,
      y: worldPt.y,
      width: 0,
      height: 0,
      points: tool === 'pencil' ? [worldPt] : undefined,
      strokeColor: activeStyle.strokeColor,
      fillColor: activeStyle.fillColor,
      strokeWidth: activeStyle.strokeWidth,
      strokeStyle: activeStyle.strokeStyle,
      fillStyle: activeStyle.fillStyle,
      roughness: activeStyle.roughness,
      opacity: activeStyle.opacity,
      angle: 0,
      isHanddrawn: activeStyle.isHanddrawn,
      seed: Math.floor(Math.random() * 2 ** 31),
    };

    setCurrentElement(newElement);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const screenPt = { x: e.clientX, y: e.clientY };
    const worldPt = screenToCanvas(screenPt, viewport);

    if (isPanning) {
      const deltaX = screenPt.x - dragStartPoint.current.x;
      const deltaY = screenPt.y - dragStartPoint.current.y;
      pan(deltaX, deltaY);
      dragStartPoint.current = screenPt;
      return;
    }

    if (isDraggingElement) {
      const dx = worldPt.x - dragStartPoint.current.x;
      const dy = worldPt.y - dragStartPoint.current.y;

      elementStartStates.current.forEach((initialEl, id) => {
        if (initialEl.type === 'pencil' && initialEl.points) {
          const shiftedPoints = initialEl.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          }));
          updateElement(id, {
            x: initialEl.x + dx,
            y: initialEl.y + dy,
            points: shiftedPoints,
          });
        } else {
          updateElement(id, {
            x: initialEl.x + dx,
            y: initialEl.y + dy,
          });
        }
      });
      return;
    }

    if (isResizing && activeHandle) {
      const dx = worldPt.x - dragStartPoint.current.x;
      const dy = worldPt.y - dragStartPoint.current.y;

      elementStartStates.current.forEach((initialEl, id) => {
        let newX = initialEl.x;
        let newY = initialEl.y;
        let newW = initialEl.width;
        let newH = initialEl.height;

        if (activeHandle.includes('r')) newW += dx;
        if (activeHandle.includes('l')) {
          newX += dx;
          newW -= dx;
        }
        if (activeHandle.includes('b')) newH += dy;
        if (activeHandle.includes('t')) {
          newY += dy;
          newH -= dy;
        }

        if ((initialEl.type === 'image' || e.shiftKey) && initialEl.aspectRatio) {
          newH = newW / initialEl.aspectRatio;
        }

        updateElement(id, {
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        });
      });
      return;
    }

    if (isRotating) {
      const selectedEls = elements.filter((el) => selectedElementIds.includes(el.id));
      const box = getCombinedBounds(selectedEls);
      const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

      const rad = Math.atan2(worldPt.y - center.y, worldPt.x - center.x);
      let deg = Math.round((rad * 180) / Math.PI) + 90;
      if (deg < 0) deg += 360;

      if (e.shiftKey) {
        deg = Math.round(deg / 15) * 15;
      }

      selectedElementIds.forEach((id) => {
        updateElement(id, { angle: deg });
      });
      return;
    }

    if (tool === 'eraser' && isDrawing) {
      eraseAtPoint(worldPt);
      return;
    }

    if (tool === 'select' && isDrawing && marqueeBox) {
      const w = worldPt.x - marqueeBox.x;
      const h = worldPt.y - marqueeBox.y;
      const newBox = { x: marqueeBox.x, y: marqueeBox.y, width: w, height: h };
      setMarqueeBox(newBox);

      const hitIds = elements
        .filter((el) => isElementInBox(el, newBox))
        .map((el) => el.id);

      setSelectedElementIds(hitIds);
      return;
    }

    if (isDrawing && currentElement) {
      if (currentElement.type === 'pencil') {
        setCurrentElement({
          ...currentElement,
          points: [...(currentElement.points || []), worldPt],
        });
      } else {
        let w = worldPt.x - currentElement.x;
        let h = worldPt.y - currentElement.y;

        if (e.shiftKey) {
          const maxDim = Math.max(Math.abs(w), Math.abs(h));
          w = w < 0 ? -maxDim : maxDim;
          h = h < 0 ? -maxDim : maxDim;
        }

        setCurrentElement({
          ...currentElement,
          width: w,
          height: h,
        });
      }
    }
  };

  // Pointer Up
  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
      if (!spaceKeyPressed.current) {
        document.body.style.cursor = 'default';
      }
      return;
    }

    if (isDraggingElement) {
      setIsDraggingElement(false);
      elementStartStates.current.clear();
      return;
    }

    if (isResizing || isRotating) {
      setIsResizing(false);
      setIsRotating(false);
      setActiveHandle(null);
      elementStartStates.current.clear();
      return;
    }

    if (marqueeBox) {
      setMarqueeBox(null);
    }

    if (isDrawing && currentElement) {
      const bounds = getElementBounds(currentElement);
      if (
        currentElement.type === 'pencil' ||
        bounds.width > 3 ||
        bounds.height > 3
      ) {
        addElement(currentElement);
      }
      setCurrentElement(null);
      setIsDrawing(false);

      if (tool !== 'pencil' && tool !== 'text') {
        setTool('select');
      }
    }

    setIsDrawing(false);
  };

  const eraseAtPoint = (worldPt: Point) => {
    const toDelete = elements.filter((el) => isPointInElement(worldPt, el));
    if (toDelete.length > 0) {
      const deleteIds = toDelete.map((el) => el.id);
      setSelectedElementIds(deleteIds);
      deleteSelectedElements();
    }
  };

  // Double Click to Edit Text
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPt = { x: e.clientX, y: e.clientY };
    const worldPt = screenToCanvas(screenPt, viewport);

    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].type === 'text' && isPointInElement(worldPt, elements[i])) {
        setEditingTextElement(elements[i]);
        return;
      }
    }

    const newTextEl: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      x: worldPt.x,
      y: worldPt.y,
      width: 180,
      height: 40,
      text: '',
      fontSize: activeStyle.fontSize,
      fontFamily: activeStyle.fontFamily,
      strokeColor: activeStyle.strokeColor,
      fillColor: 'transparent',
      strokeWidth: activeStyle.strokeWidth,
      strokeStyle: activeStyle.strokeStyle,
      fillStyle: 'none',
      roughness: activeStyle.roughness,
      opacity: activeStyle.opacity,
      angle: 0,
      isHanddrawn: activeStyle.isHanddrawn,
      seed: Math.floor(Math.random() * 2 ** 31),
    };
    setEditingTextElement(newTextEl);
  };

  const handleSaveText = (textValue: string) => {
    if (!editingTextElement) return;

    if (textValue.trim().length > 0) {
      const existing = elements.find((el) => el.id === editingTextElement.id);
      if (existing) {
        updateElement(existing.id, { text: textValue });
      } else {
        addElement({ ...editingTextElement, text: textValue });
      }
    }
    setEditingTextElement(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none touch-none bg-neutral-100">
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${
          tool === 'text'
            ? 'cursor-text'
            : tool === 'hand'
            ? 'cursor-grab'
            : 'cursor-crosshair'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Inline Floating Text Area Overlay */}
      {editingTextElement && (
        <InlineTextEditor
          element={editingTextElement}
          viewport={viewport}
          onSave={handleSaveText}
          onCancel={() => setEditingTextElement(null)}
        />
      )}
    </div>
  );
};

interface InlineTextEditorProps {
  element: CanvasElement;
  viewport: { x: number; y: number; zoom: number };
  onSave: (val: string) => void;
  onCancel: () => void;
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  element,
  viewport,
  onSave,
  onCancel,
}) => {
  const [text, setText] = useState(element.text || '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    mountTimeRef.current = Date.now();
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [element.id]);

  const screenX = element.x * viewport.zoom + viewport.x;
  const screenY = element.y * viewport.zoom + viewport.y;
  const scaledFontSize = (element.fontSize || 20) * viewport.zoom;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave(text);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    // Ignore initial blur within 350ms caused by canvas pointerup focus steal!
    if (Date.now() - mountTimeRef.current < 350) {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      return;
    }
    onSave(text);
  };

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      placeholder="Введите текст..."
      style={{
        position: 'absolute',
        left: `${screenX}px`,
        top: `${screenY}px`,
        fontSize: `${scaledFontSize}px`,
        fontFamily: element.fontFamily || 'Inter, sans-serif',
        color: element.strokeColor,
        background: 'rgba(255,255,255,0.98)',
        border: '2px solid #0071E3',
        borderRadius: '12px',
        outline: 'none',
        resize: 'both',
        padding: '6px 10px',
        lineHeight: 1.2,
        minWidth: '160px',
        minHeight: '44px',
        zIndex: 50,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      }}
    />
  );
};
