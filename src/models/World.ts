import { State } from './State';
import type { Entity } from './Entity';

export const enum Key {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export const KeyAction: Record<Key, State> = {
  [Key.UP]: State.IDLE,
  [Key.DOWN]: State.IDLE,
  [Key.LEFT]: State.MOVE_LEFT,
  [Key.RIGHT]: State.MOVE_RIGHT,
};

export class World {
  private keyPressed: Set<Key>;

  constructor(private _mainEntity: Entity, private _framerate: number = 30) {
    this.keyPressed = new Set();
  }

  start(): ReturnType<typeof setInterval> {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    return setInterval(this.tick.bind(this), 1000 / this._framerate);
  }

  tick(): void {
    if (this.keyPressed.size === 0) {
      return this._mainEntity.setState(State.IDLE);
    }

    this.keyPressed.forEach((key) => {
      const keyAction = KeyAction[key];
      this._mainEntity.setState(keyAction);
      this._mainEntity.performStateAction(keyAction);
    });
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
      default:
        return;
    }
  }
}
