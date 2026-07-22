import { create } from 'zustand';
import {
  CanvasElement,
  ToolType,
  Viewport,
  BoardTheme,
  StyleOptions,
  Point,
} from '../engine/types';

const STORAGE_KEY = 'polotno_guest_canvas_data';

const DEFAULT_STYLE: StyleOptions = {
  strokeColor: '#1d1d1f',
  fillColor: 'transparent',
  strokeWidth: 2,
  strokeStyle: 'solid',
  fillStyle: 'none',
  roughness: 1,
  opacity: 1,
  fontSize: 20,
  fontFamily: 'Inter, sans-serif',
  isHanddrawn: true,
};

interface CanvasStoreState {
  elements: CanvasElement[];
  selectedElementIds: string[];
  viewport: Viewport;
  tool: ToolType;
  theme: BoardTheme;
  activeStyle: StyleOptions;
  history: {
    past: CanvasElement[][];
    future: CanvasElement[][];
  };

  // Actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  updateSelectedElements: (updates: Partial<CanvasElement>) => void;
  deleteSelectedElements: () => void;
  setSelectedElementIds: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  duplicateSelected: () => void;

  // Layer Ordering
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;

  // Viewport & Pan/Zoom
  setViewport: (viewport: Viewport | ((prev: Viewport) => Viewport)) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoomAtPoint: (zoomFactor: number, centerPoint: Point) => void;
  resetZoom: () => void;

  // Tool & Theme
  setTool: (tool: ToolType) => void;
  setTheme: (theme: BoardTheme) => void;
  setActiveStyle: (styleUpdates: Partial<StyleOptions>) => void;

  // History Undo/Redo
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;

  // Storage & Export/Import
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportJSON: () => string;
  importJSON: (jsonString: string) => boolean;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasStoreState>((set, get) => ({
  elements: [],
  selectedElementIds: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  tool: 'pencil',
  theme: 'whiteboard',
  activeStyle: DEFAULT_STYLE,
  history: {
    past: [],
    future: [],
  },

  setElements: (elements) => {
    set({ elements });
    get().saveToLocalStorage();
  },

  addElement: (element) => {
    get().saveSnapshot();
    set((state) => ({
      elements: [...state.elements, element],
    }));
    get().saveToLocalStorage();
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
    get().saveToLocalStorage();
  },

  updateSelectedElements: (updates) => {
    const { selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    set((state) => ({
      elements: state.elements.map((el) =>
        selectedElementIds.includes(el.id) ? { ...el, ...updates } : el
      ),
      activeStyle: { ...state.activeStyle, ...updates },
    }));
    get().saveToLocalStorage();
  },

  deleteSelectedElements: () => {
    const { selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    set((state) => ({
      elements: state.elements.filter((el) => !selectedElementIds.includes(el.id)),
      selectedElementIds: [],
    }));
    get().saveToLocalStorage();
  },

  setSelectedElementIds: (ids) => set({ selectedElementIds: ids }),
  clearSelection: () => set({ selectedElementIds: [] }),

  selectAll: () => {
    set((state) => ({
      selectedElementIds: state.elements.map((el) => el.id),
    }));
  },

  duplicateSelected: () => {
    const { elements, selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    const selectedEls = elements.filter((el) => selectedElementIds.includes(el.id));
    const newEls: CanvasElement[] = selectedEls.map((el) => ({
      ...el,
      id: Math.random().toString(36).substr(2, 9),
      x: el.x + 20,
      y: el.y + 20,
      seed: Math.floor(Math.random() * 2 ** 31),
    }));

    set((state) => ({
      elements: [...state.elements, ...newEls],
      selectedElementIds: newEls.map((el) => el.id),
    }));
    get().saveToLocalStorage();
  },

  bringForward: () => {
    const { elements, selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    const newElements = [...elements];
    for (let i = newElements.length - 2; i >= 0; i--) {
      if (selectedElementIds.includes(newElements[i].id)) {
        const temp = newElements[i];
        newElements[i] = newElements[i + 1];
        newElements[i + 1] = temp;
      }
    }
    set({ elements: newElements });
    get().saveToLocalStorage();
  },

  sendBackward: () => {
    const { elements, selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    const newElements = [...elements];
    for (let i = 1; i < newElements.length; i++) {
      if (selectedElementIds.includes(newElements[i].id)) {
        const temp = newElements[i];
        newElements[i] = newElements[i - 1];
        newElements[i - 1] = temp;
      }
    }
    set({ elements: newElements });
    get().saveToLocalStorage();
  },

  bringToFront: () => {
    const { elements, selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    const selected = elements.filter((el) => selectedElementIds.includes(el.id));
    const unselected = elements.filter((el) => !selectedElementIds.includes(el.id));
    set({ elements: [...unselected, ...selected] });
    get().saveToLocalStorage();
  },

  sendToBack: () => {
    const { elements, selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    get().saveSnapshot();

    const selected = elements.filter((el) => selectedElementIds.includes(el.id));
    const unselected = elements.filter((el) => !selectedElementIds.includes(el.id));
    set({ elements: [...selected, ...unselected] });
    get().saveToLocalStorage();
  },

  setViewport: (viewport) => {
    if (typeof viewport === 'function') {
      set((state) => ({ viewport: viewport(state.viewport) }));
    } else {
      set({ viewport });
    }
  },

  pan: (deltaX, deltaY) => {
    set((state) => ({
      viewport: {
        ...state.viewport,
        x: state.viewport.x + deltaX,
        y: state.viewport.y + deltaY,
      },
    }));
  },

  zoomAtPoint: (zoomFactor, centerPoint) => {
    set((state) => {
      const oldZoom = state.viewport.zoom;
      const newZoom = Math.max(0.1, Math.min(5, oldZoom * zoomFactor));

      const mouseWorldX = (centerPoint.x - state.viewport.x) / oldZoom;
      const mouseWorldY = (centerPoint.y - state.viewport.y) / oldZoom;

      const newViewportX = centerPoint.x - mouseWorldX * newZoom;
      const newViewportY = centerPoint.y - mouseWorldY * newZoom;

      return {
        viewport: {
          x: newViewportX,
          y: newViewportY,
          zoom: newZoom,
        },
      };
    });
  },

  resetZoom: () => {
    set((state) => ({
      viewport: { ...state.viewport, zoom: 1 },
    }));
  },

  setTool: (tool) => {
    set({ tool });
    if (tool !== 'select') {
      set({ selectedElementIds: [] });
    }
  },

  setTheme: (theme) => set({ theme }),

  setActiveStyle: (styleUpdates) => {
    set((state) => ({
      activeStyle: { ...state.activeStyle, ...styleUpdates },
    }));
    get().updateSelectedElements(styleUpdates);
  },

  saveSnapshot: () => {
    set((state) => ({
      history: {
        past: [...state.history.past, state.elements],
        future: [],
      },
    }));
  },

  undo: () => {
    const { history, elements } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      elements: previous,
      history: {
        past: newPast,
        future: [elements, ...history.future],
      },
      selectedElementIds: [],
    });
    get().saveToLocalStorage();
  },

  redo: () => {
    const { history, elements } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      elements: next,
      history: {
        past: [...history.past, elements],
        future: newFuture,
      },
      selectedElementIds: [],
    });
    get().saveToLocalStorage();
  },

  saveToLocalStorage: () => {
    try {
      const { elements, theme } = get();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ elements, theme, updatedAt: new Date().toISOString() })
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed.elements)) {
          set({ elements: parsed.elements });
        }
        if (parsed.theme) {
          set({ theme: parsed.theme });
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  },

  exportJSON: () => {
    const { elements, theme } = get();
    return JSON.stringify(
      {
        type: 'polotno-scene',
        version: 1,
        createdAt: new Date().toISOString(),
        theme,
        elements,
      },
      null,
      2
    );
  },

  importJSON: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.type === 'polotno-scene' && Array.isArray(data.elements)) {
        get().saveSnapshot();
        set({
          elements: data.elements,
          theme: data.theme || 'whiteboard',
          selectedElementIds: [],
        });
        get().saveToLocalStorage();
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file:', e);
    }
    return false;
  },

  clearCanvas: () => {
    get().saveSnapshot();
    set({ elements: [], selectedElementIds: [] });
    get().saveToLocalStorage();
  },
}));
