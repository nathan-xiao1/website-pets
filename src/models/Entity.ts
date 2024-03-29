import { State, StateSprite } from './State';
import { spriteMap } from '../utils/sprites';
import { Key } from './World';
import type { WorldInfo } from './World';

export class Entity {
  private _yAcc = 0;
  private _yAccDisabled = false;

  private _element: HTMLImageElement;
  private _state: State = State.IDLE;

  private _spriteMap: Map<string, string>;

  private keyAction: Record<Key, State> = {
    [Key.UP]: State.MOVE_UP,
    [Key.DOWN]: State.IDLE,
    [Key.LEFT]: State.MOVE_LEFT,
    [Key.RIGHT]: State.MOVE_RIGHT,
  };

  constructor(
    private _spriteName: string,
    private _left: number = 0,
    private _top: number = 0,
    private _height: number = 100,
    private _width: number = 100,
    private _speed: number = 6
  ) {
    const _spriteMap = spriteMap.get(_spriteName);
    if (!_spriteMap) {
      throw new Error(`Failed to find sprite for ${_spriteName}`);
    }
    this._spriteMap = _spriteMap;

    const element = document.createElement('img');
    element.style.position = 'absolute';
    element.style.zIndex = '1000';

    this._element = element;
    this.top = _top;
    this.left = _left;
    this.height = _height;
    this.width = _width;

    this.setState(new Set([State.IDLE]));
  }

  /* ------------------------------------------------------ */
  /*                   Getters and Setters                  */
  /* ------------------------------------------------------ */

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
      State.MOVE_LEFT,
      State.MOVE_RIGHT,
    ];

    // Set the state with the highest priority state if
    // one exists
    const idle = !statePriority.some((state) => {
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
    if (idle) {
      let newState = State.IDLE;

      // Use falling state if falling
      if (this._yAcc !== 0) {
        newState = State.FALL;
      }

      // Only set the state if it is different to
      // the existing state
      if (this._state !== newState) {
        this._state = newState;
        this._setStateSprite(newState);
      }
    }
  }

  public move(states: Set<State>, worldInfo: WorldInfo): void {
    this._yAcc = !this._yAccDisabled ? Math.max(this._yAcc - 0.5, -10) : 0;

    let dX = 0;
    let dY = -this._yAcc;

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
        case State.IDLE:
        default:
          break;
      }
    });

    // Move if the new positioFn is valid
    const { left, top } = worldInfo.getAdjustedPosition(this._element, dX, dY);

    // Didn't move vertically, so can reset y-acceleration
    if (this.top === top) {
      this._yAcc = 0;
    }

    // Set the new position
    this.left = left;
    this.top = top;
  }

  public toggleGravity(on: boolean): void {
    this._yAccDisabled = !on;
  }

  /* ------------------------------------------------------ */
  /*                    Private functions                   */
  /* ------------------------------------------------------ */

  private _setStateSprite(state: State): void {
    const stateSprite = StateSprite[state];

    // Set the sprite direction since we use the same sprite
    if (state === State.MOVE_LEFT) {
      this._setDirection('left');
    } else if (state === State.MOVE_RIGHT) {
      this._setDirection('right');
    }

    this._element.src = this._spriteMap.get(stateSprite) ?? '';
  }

  private _setDirection(direction: 'left' | 'right'): void {
    this._element.style.transform =
      direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  }
}
