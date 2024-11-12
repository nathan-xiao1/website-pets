export const enum Key {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface WorldInfo {
  keyPressed: Set<Key>;
  worldHeight: number;
  worldWidth: number;
  calculatePosition: (element: HTMLElement, dX: number, dY: number) => Position;
}

export interface Position {
  left: number;
  top: number;
}

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ElementRect extends Rect {
  width: number;
  height: number;
}

export type WorldRect = Rect;
