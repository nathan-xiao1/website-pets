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
  canMove: (element: HTMLElement, dX: number, dY: number) => boolean;
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
      canMove: this.canMove.bind(this),
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
      case 'Down':
      case 'ArrowDown':
        this.keyPressed.add(Key.DOWN);
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
      case 'Down':
      case 'ArrowDown':
        this.keyPressed.delete(Key.DOWN);
        break;
      default:
        return;
    }
  }

  canMove(element: HTMLElement, dX: number, dY: number): boolean {
    const collidableElements = this.getCollidableElements();
    const elementRect = element.getBoundingClientRect();

    // Check if within world boundary
    if (
      elementRect.left + dX < 0 ||
      elementRect.right + dX > World.getWorldWidth() ||
      elementRect.top + dY < 0 ||
      elementRect.bottom + dY > World.getWorldHeight()
    ) {
      return false;
    }

    // Check if colliding with any collidable element
    return !collidableElements.some((collidableElement) => {
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
