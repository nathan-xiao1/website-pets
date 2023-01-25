import type { Entity } from './Entity';

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
  getAdjustedPosition: (
    element: HTMLElement,
    dX: number,
    dY: number
  ) => Position;
}

export interface Position {
  left: number;
  top: number;
}

export class World {
  private isRunning = false;
  private keyPressed: Set<Key>;

  constructor(private _mainEntity: Entity) {
    this.keyPressed = new Set();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  start(): ReturnType<typeof requestAnimationFrame> {
    this.isRunning = true;
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    return window.requestAnimationFrame(this.tick.bind(this));
  }

  stop(): void {
    this.isRunning = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  tick(): number {
    if (!this.isRunning) return -1;

    const worldInfo: WorldInfo = {
      keyPressed: this.keyPressed,
      worldHeight: World.getWorldHeight(),
      worldWidth: World.getWorldWidth(),
      getAdjustedPosition: this.getAdjustedPosition.bind(this),
    };

    this._mainEntity.tick(worldInfo);

    return window.requestAnimationFrame(this.tick.bind(this));
  }

  handleKeyDown(ev: KeyboardEvent): void {
    switch (ev.key) {
      case 'Left':
      case 'ArrowLeft':
        this.keyPressed.add(Key.LEFT);
        break;
      case 'Right':
      case 'ArrowRight':
        this.keyPressed.add(Key.RIGHT);
        break;
      case 'Up':
      case 'ArrowUp':
        this.keyPressed.add(Key.UP);
        break;
      default:
        return;
    }
  }

  handleKeyUp(ev: KeyboardEvent): void {
    switch (ev.key) {
      case 'Left':
      case 'ArrowLeft':
        this.keyPressed.delete(Key.LEFT);
        break;
      case 'Right':
      case 'ArrowRight':
        this.keyPressed.delete(Key.RIGHT);
        break;
      case 'Up':
      case 'ArrowUp':
        this.keyPressed.delete(Key.UP);
        break;
      default:
        return;
    }
  }

  getAdjustedPosition(element: HTMLElement, dX: number, dY: number): Position {
    const collidableElements = this.getCollidableElements();
    const elementRect = element.getBoundingClientRect();

    // Check if within world boundary
    const isOutsideWorldLeft = elementRect.left + dX < 0;
    const isOutsideWorldRight = elementRect.right + dX > World.getWorldWidth();
    const isOutsideWorldTop = elementRect.top + dY < 0;
    const isOutsideWorldBottom =
      elementRect.bottom + dY > World.getWorldHeight();

    // Correct to inside the world boundary
    if (
      isOutsideWorldLeft ||
      isOutsideWorldRight ||
      isOutsideWorldTop ||
      isOutsideWorldBottom
    ) {
      // Move back in if outside horizontally
      const left = isOutsideWorldLeft
        ? // Ouside of left boundary
          0
        : isOutsideWorldRight
        ? // Outside of right boundary
          World.getWorldWidth() - elementRect.width
        : // Not outside - allow movement
          elementRect.left + dX;

      // Move back in if outside vertically
      const top = isOutsideWorldTop
        ? // Ouside of top boundary
          0
        : isOutsideWorldBottom
        ? // Outside of bottom boundary
          World.getWorldHeight() - elementRect.height - 1
        : // Not outside - allow movement
          elementRect.top + dY;

      return { left, top };
    }

    // Check if colliding with any collidable element
    const collidingWith = collidableElements.find((collidableElement) => {
      const collidableElementRect = collidableElement.getBoundingClientRect();
      return !(
        // Not intersecting horizontally
        (
          elementRect.left + dX >= collidableElementRect.right ||
          elementRect.right + dX <= collidableElementRect.left ||
          // Not intersecting vertically
          elementRect.top + dY >= collidableElementRect.bottom ||
          elementRect.bottom + dY <= collidableElementRect.top
        )
      );
    });

    // Don't allow moving inside the collidable element
    if (collidingWith) {
      const collidingWithRect = collidingWith.getBoundingClientRect();

      // Check which part is inside
      const isOutsideHorizontally =
        elementRect.left >= collidingWithRect.right ||
        elementRect.right <= collidingWithRect.left;
      const isOutsideVertically =
        elementRect.top >= collidingWithRect.bottom ||
        elementRect.bottom <= collidingWithRect.top;

      // Return position outside the collidable element
      return {
        left: elementRect.left + (isOutsideVertically ? dX : 0),
        top: elementRect.top + (isOutsideHorizontally ? dY : 0),
      };
    }

    // Nothing blocking - allow new position
    return {
      left: elementRect.left + dX,
      top: elementRect.top + dY,
    };
  }

  private getCollidableElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.collidable'));
  }

  static getWorldWidth(): number {
    return document.documentElement.clientWidth;
  }

  static getWorldHeight(): number {
    return document.documentElement.clientHeight;
  }
}
