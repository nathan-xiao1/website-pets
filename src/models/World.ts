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
          World.getWorldHeight() - elementRect.height
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

      if (!isOutsideHorizontally && !isOutsideVertically) {
        return {
          left: elementRect.left,
          top: collidingWithRect.top - elementRect.height,
        };
      }

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

  makeEntityDraggable(entity: Entity): void {
    const moveTo = (pageX: number, pageY: number): void => {
      entity.left = pageX - entity.element.offsetWidth / 2;
      entity.top = pageY - entity.element.offsetHeight / 2;
    };

    // Handle the mouse down event
    const mouseDownHandler = (event: MouseEvent): void => {
      event.preventDefault();

      // Disable gravity to prevent entity from dropping
      entity.toggleGravity(false);

      // Move element's center to mouse
      moveTo(event.pageX, event.pageY);
      // Handle mouse move
      document.addEventListener('mousemove', mouseMoveHandler);
    };

    // Handle the mouse move event
    const mouseMoveHandler = (event: MouseEvent): void => {
      // Update the entity's position on mouse move
      moveTo(event.pageX, event.pageY);
    };

    // Handle the mouse up event
    const mouseUpHandler = (_event: MouseEvent): void => {
      // Re-enable gravity to let the entity fall
      entity.toggleGravity(true);
      // Remove the handler to move entity
      document.removeEventListener('mousemove', mouseMoveHandler);
    };

    // Listen to mouse down on the entity element
    entity.element.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);
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
