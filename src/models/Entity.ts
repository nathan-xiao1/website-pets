import { State, StateSprite } from './State';
import { Key } from './World';
import type { WorldInfo } from './World';

export function createEntity(): Entity {
  const element = document.createElement('img');
  element.style.position = 'absolute';

  return new Entity(element, 0, 150);
}

export class Entity {
  private _state: State = State.IDLE;

  private keyAction: Record<Key, State> = {
    [Key.UP]: State.MOVE_UP,
    [Key.DOWN]: State.MOVE_DOWN,
    [Key.LEFT]: State.MOVE_LEFT,
    [Key.RIGHT]: State.MOVE_RIGHT,
  };

  constructor(
    private _element: HTMLImageElement,
    private _left: number = 0,
    private _top: number = 0,
    private _height: number = 95,
    private _width: number = 135,
    private _speed: number = 6
  ) {
    this.setState(new Set([State.IDLE]));
    this.top = _top;
    this.left = _left;
    this.height = 100;
    this.width = 100;
  }

  // Prevent external modification of style
  public get element(): Readonly<HTMLImageElement> {
    return this._element;
  }

  public get left(): number {
    return this._left;
  }

  public set left(left: number) {
    this._left = left;
    this._element.style.left = `${left}px`;
  }

  public get top(): number {
    return this._top;
  }

  public set top(top: number) {
    this._top = top;
    this._element.style.top = `${top}px`;
  }

  public get height(): number {
    return this._height;
  }

  public set height(height: number) {
    this._height = height;
    this._element.height = height;
  }

  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    this._width = width;
    this._element.width = width;
  }

  /* ------------------------------------------------------ */
  /*                    Public functions                    */
  /* ------------------------------------------------------ */

  public tick(worldInfo: WorldInfo): void {
    const keyStates = new Set(
      [...worldInfo.keyPressed].map((key) => this.keyAction[key])
    );
    this.setState(keyStates);
    this.move(keyStates, worldInfo);
  }

  public setState(states: Set<State>): void {
    // Set state with priority
    const statePriority: State[] = [
      State.MOVE_UP,
      State.MOVE_DOWN,
      State.MOVE_LEFT,
      State.MOVE_RIGHT,
    ];

    // Set the state with the highest priority state if
    // one exists
    const notIdle = statePriority.some((state) => {
      if (states.has(state)) {
        // Only set the state if it is different to
        // the existing state
        if (this._state !== state) {
          this._state = state;
          this._setStateSprite(this._state);
        }
        return true;
      }
      return false;
    });

    // No state passed in, so default to idle state
    if (!notIdle) {
      this._state = State.IDLE;
      this._setStateSprite(this._state);
    }
  }

  public move(states: Set<State>, worldInfo: WorldInfo): void {
    let dX = 0;
    let dY = 0;

    // Calculate the new position delta
    states.forEach((state) => {
      switch (state) {
        case State.MOVE_LEFT:
          dX = -this._speed;
          break;
        case State.MOVE_RIGHT:
          dX = this._speed;
          break;
        case State.MOVE_UP:
          dY = -this._speed;
          break;
        case State.MOVE_DOWN:
          dY = this._speed;
          break;
        case State.IDLE:
        default:
          break;
      }
    });

    // Move if the new position is valid
    if (worldInfo.canMove(this._element, dX, dY)) {
      this.left = this.left + dX;
      this.top = this.top + dY;
    }
  }

  /* ------------------------------------------------------ */
  /*                    Private functions                   */
  /* ------------------------------------------------------ */

  private _setStateSprite(state: State): void {
    let stateSprite;
    switch (state) {
      case State.MOVE_LEFT:
        this._setDirection('left');
        stateSprite = StateSprite.MOVE_HORIZONTAL;
        break;
      case State.MOVE_RIGHT:
        this._setDirection('right');
        stateSprite = StateSprite.MOVE_HORIZONTAL;
        break;
      case State.MOVE_UP:
      case State.MOVE_DOWN:
        stateSprite = StateSprite.MOVE_VERTICAL;
        break;
      case State.IDLE:
      default:
        stateSprite = StateSprite.IDLE;
        break;
    }

    this._element.src = `sprites/ninja/${stateSprite}.gif`;
  }

  private _setDirection(direction: 'left' | 'right'): void {
    this._element.style.transform =
      direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  }
}
