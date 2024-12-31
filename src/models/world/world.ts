import { isSmallScreenSize } from '../../utils/screen';
import {
  calculatePositionWithCollision,
  calculatePositionWithWorldBoundary,
  getElementRectWithScroll,
} from './calculate-position';
import { getColliableClassName } from './collidable';
import { Key } from './world.types';
import type { WorldInfo, Position, WorldRect } from './world.types';
import type { Entity } from '../entity/entity';

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

    if (isSmallScreenSize()) {
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
    if (isSmallScreenSize()) {
      this.stop();
    } else {
      this.start();
    }
  }

  private tick(): number {
    if (!this.isRunning) return -1;

    const worldInfo: WorldInfo = {
      keyPressed: this.keyPressed,
      worldHeight: this.getWorldHeight(),
      worldWidth: this.getWorldWidth(),
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
    const elementClientRect = element.getBoundingClientRect();

    const elementRect = getElementRectWithScroll(elementClientRect);

    let newPosition = calculatePositionWithCollision(
      elementRect,
      dX,
      dY,
      collidableElements
    );

    const worldRect: WorldRect = {
      left: 0,
      right: this.getWorldWidth(),
      top: 0,
      bottom: this.getWorldHeight(),
    };

    newPosition = calculatePositionWithWorldBoundary(
      worldRect,
      elementRect,
      newPosition
    );

    return newPosition;
  }

  private getCollidableElements(): HTMLElement[] {
    return Array.from(document.querySelectorAll(`.${getColliableClassName()}`));
  }

  private getWorldWidth(): number {
    return document.documentElement.clientWidth + scrollX;
  }

  private getWorldHeight(): number {
    return document.documentElement.clientHeight + scrollY;
  }
}
