import { Key } from './world.types';
import type { Entity } from './entity';
import type { WorldInfo, Position } from './world.types';

export class World {
  private isRunning = false;
  private keyPressed: Set<Key>;

  constructor(private mainEntity: Entity, private worldContainer: HTMLElement) {
    if (!worldContainer) {
      throw new Error('Failed to find world container');
    }

    this.keyPressed = new Set();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('resize', this.onScreenSizeChange.bind(this));
  }

  start(): ReturnType<typeof requestAnimationFrame> {
    if (this.isRunning) {
      console.warn('World is already running.');
      return -1;
    }

    if (World.isSmallScreenSize()) {
      console.warn('World cannot be run on a small screen');
      return -1;
    }

    this.isRunning = true;

    // Add the main entity to the world container
    this.worldContainer.appendChild(this.mainEntity.getElement());

    // Key input listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    return window.requestAnimationFrame(this.tick.bind(this));
  }

  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    // Remove the main entity from the world container
    this.worldContainer.removeChild(this.mainEntity.getElement());

    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  makeEntityDraggable(entity: Entity): void {
    const moveTo = (pageX: number, pageY: number): void => {
      entity.setLeft(pageX - entity.getElement().offsetWidth / 2);
      entity.setTop(pageY - entity.getElement().offsetHeight / 2);
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
    entity.getElement().addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  private onScreenSizeChange(): void {
    // Disable on small screens
    if (World.isSmallScreenSize()) {
      this.stop();
    } else {
      this.start();
    }
  }

  private tick(): number {
    if (!this.isRunning) return -1;

    const worldInfo: WorldInfo = {
      keyPressed: this.keyPressed,
      worldHeight: World.getWorldHeight(),
      worldWidth: World.getWorldWidth(),
      calculatePosition: this.calculatePosition.bind(this),
    };

    this.mainEntity.tick(worldInfo);

    return window.requestAnimationFrame(this.tick.bind(this));
  }

  private handleKeyDown(ev: KeyboardEvent): void {
    switch (ev.key) {
      case 'a':
      case 'Left':
      case 'ArrowLeft':
        this.keyPressed.add(Key.LEFT);
        break;
      case 'd':
      case 'Right':
      case 'ArrowRight':
        this.keyPressed.add(Key.RIGHT);
        break;
      case 'w':
      case 'Up':
      case 'ArrowUp':
        this.keyPressed.add(Key.UP);
        break;
      default:
        return;
    }
  }

  private handleKeyUp(ev: KeyboardEvent): void {
    switch (ev.key) {
      case 'a':
      case 'Left':
      case 'ArrowLeft':
        this.keyPressed.delete(Key.LEFT);
        break;
      case 'd':
      case 'Right':
      case 'ArrowRight':
        this.keyPressed.delete(Key.RIGHT);
        break;
      case 'w':
      case 'Up':
      case 'ArrowUp':
        this.keyPressed.delete(Key.UP);
        break;
      default:
        return;
    }
  }

  private calculatePosition(
    element: HTMLElement,
    dX: number,
    dY: number
  ): Position {
    const collidableElements = this.getCollidableElements();
    const elementRect = element.getBoundingClientRect();

    let newPosition = this.calculatePositionWithCollision(
      elementRect,
      dX,
      dY,
      collidableElements
    );

    newPosition = this.calculatePositionWithWorldBoundary(
      elementRect,
      newPosition
    );

    return newPosition;
  }

  private calculatePositionWithCollision(
    elementRect: DOMRect,
    dX: number,
    dY: number,
    collidableElements: HTMLElement[]
  ): Position {
    // Check if colliding with any collidable element
    const collidingElements = collidableElements.filter((collidableElement) => {
      const collidableElementRect = collidableElement.getBoundingClientRect();
      const newLeft = elementRect.left + dX;
      const newRight = elementRect.right + dX;
      const newTop = elementRect.top + dY;
      const newBottom = elementRect.bottom + dY;

      return !(
        newLeft > collidableElementRect.right ||
        newRight < collidableElementRect.left ||
        newTop > collidableElementRect.bottom ||
        newBottom < collidableElementRect.top
      );
    });

    if (collidingElements.length > 0) {
      // Check whether we will collide with any collidable element on the horizontal axis
      const willCollideHorizontally = collidingElements.some(
        (collidingElement) => {
          const collidingElementRect = collidingElement.getBoundingClientRect();
          const newLeft = elementRect.left + dX;
          const newRight = elementRect.right + dX;

          // Ignore any element we don't collide with vertically
          const isOutsideVertically =
            elementRect.top >= collidingElementRect.bottom ||
            elementRect.bottom <= collidingElementRect.top;

          if (isOutsideVertically) return false;

          // Whether the new horizontal position will be outside of the collidable element
          return !(
            newLeft >= collidingElementRect.right ||
            newRight <= collidingElementRect.left
          );
        }
      );

      // Check whether we will collide with any collidable element on the vertical axis
      const willCollideVertically = collidingElements.some(
        (collidingElement) => {
          const collidingElementRect = collidingElement.getBoundingClientRect();
          const newTop = elementRect.top + dY;
          const newBottom = elementRect.bottom + dY;

          // Ignore any element we don't collide with horizontally
          const isOutsideHorizontally =
            elementRect.left >= collidingElementRect.right ||
            elementRect.right <= collidingElementRect.left;

          if (isOutsideHorizontally) return false;

          // Whether the new horizontal position will be outside of the collidable element
          return !(
            newTop >= collidingElementRect.bottom ||
            newBottom <= collidingElementRect.top
          );
        }
      );

      // Return position outside the collidable element
      return {
        left: elementRect.left + (willCollideHorizontally ? 0 : dX),
        top: elementRect.top + (willCollideVertically ? 0 : dY),
      };
    }
    // Nothing blocking - allow new position
    return {
      left: elementRect.left + dX,
      top: elementRect.top + dY,
    };
  }

  private calculatePositionWithWorldBoundary(
    elementRect: DOMRect,
    position: Position
  ): Position {
    // Check if within world boundary
    const isOutsideWorldLeft = position.left < 0;
    const isOutsideWorldRight =
      position.left + elementRect.width > World.getWorldWidth();
    const isOutsideWorldTop = position.top < 0;
    const isOutsideWorldBottom =
      position.top + elementRect.height > World.getWorldHeight();

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
          position.left;

      // Move back in if outside vertically
      const top = isOutsideWorldTop
        ? // Ouside of top boundary
          0
        : isOutsideWorldBottom
        ? // Outside of bottom boundary
          World.getWorldHeight() - elementRect.height
        : // Not outside - allow movement
          position.top;

      return { left, top };
    }

    // Not outside world boundary
    return position;
  }

  private getCollidableElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.collidable'));
  }

  private static getWorldWidth(): number {
    return document.documentElement.clientWidth;
  }

  private static getWorldHeight(): number {
    return document.documentElement.clientHeight;
  }

  private static isSmallScreenSize(): boolean {
    return Math.min(World.getWorldHeight(), World.getWorldWidth()) < 768;
  }
}
