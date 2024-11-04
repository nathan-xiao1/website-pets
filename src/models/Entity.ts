import { SpriteState, State, StateToSpriteMap } from './State';
import { Key } from './World';
import type { WorldInfo } from './World';

const KEY_ACTION_MAP: Record<Key, State> = {
  [Key.UP]: State.MOVE_UP,
  [Key.DOWN]: State.IDLE,
  [Key.LEFT]: State.MOVE_LEFT,
  [Key.RIGHT]: State.MOVE_RIGHT,
};

export interface EntityConfig {
  left: number;
  top: number;
  height: number;
  width: number;
  speed: number;
}

export abstract class Entity {
  private static DEFAULT_CONFIG: EntityConfig = {
    left: 0,
    top: 0,
    height: 100,
    width: 100,
    speed: 5,
  };

  private yAcc = 0;
  private yAccDisabled = false;

  private element: HTMLImageElement;
  private state: State = State.IDLE;

  private left = 0;
  private top = 0;
  private speed = 0;

  constructor(
    private spriteMap: Record<SpriteState, string>,
    entityConfig?: Partial<EntityConfig>
  ) {
    const element = document.createElement('img');
    element.style.position = 'absolute';
    element.style.zIndex = '1000';

    const config: EntityConfig = {
      ...Entity.DEFAULT_CONFIG,
      ...entityConfig,
    };

    this.element = element;
    this.element.height = config.height;
    this.element.width = config.width;

    this.speed = config.speed;

    this.setTop(config.top);
    this.setLeft(config.left);

    this.setState(new Set([State.IDLE]));
    this.setStateSprite(State.IDLE);
  }

  /* ------------------------------------------------------ */
  /*                   Getters and Setters                  */
  /* ------------------------------------------------------ */

  // Prevent external modification of style
  public getElement(): Readonly<HTMLImageElement> {
    return this.element;
  }

  public getLeft(): number {
    return this.left;
  }

  public setLeft(left: number) {
    this.left = left;
    this.element.style.left = `${left}px`;
  }

  public getTop(): number {
    return this.top;
  }

  public setTop(top: number) {
    this.top = top;
    this.element.style.top = `${top}px`;
  }

  /* ------------------------------------------------------ */
  /*                    Public functions                    */
  /* ------------------------------------------------------ */

  public tick(worldInfo: WorldInfo): void {
    const keyStates = new Set(
      [...worldInfo.keyPressed].map((key) => KEY_ACTION_MAP[key])
    );
    this.setState(keyStates);
    this.move(keyStates, worldInfo);
  }

  public toggleGravity(on: boolean): void {
    this.yAccDisabled = !on;
  }

  /* ------------------------------------------------------ */
  /*                    Private functions                   */
  /* ------------------------------------------------------ */

  /**
   * Sets the state of the current Entity.
   */
  private setState(states: Set<State>): void {
    // Set state with priority
    const statePriority: State[] = [
      State.MOVE_UP,
      State.FALL,
      State.MOVE_LEFT,
      State.MOVE_RIGHT,
      State.IDLE,
    ];

    let newState = State.IDLE;

    // Use falling state if falling
    if (this.yAcc !== 0 && !states.has(State.MOVE_UP)) {
      newState = State.FALL;
    }
    // Idle if not falling and no key press
    else if (states.size == 0) {
      newState = State.IDLE;
    }
    // Set the current state to be the state with the highest priority
    else {
      statePriority.some((state) => {
        if (states.has(state)) {
          newState = state;
          return true;
        }
        return false;
      });
    }

    // Only set the state if it is different to
    // the existing state
    if (this.state !== newState) {
      this.state = newState;
      this.setStateSprite(newState);
    }
  }

  /**
   * Moves the Entity to a position based on the action state.
   */
  private move(states: Set<State>, worldInfo: WorldInfo): void {
    this.yAcc = !this.yAccDisabled ? Math.max(this.yAcc - 0.2, -10) : 0;

    let dX = 0;
    let dY = -this.yAcc;

    // Calculate the new position delta
    states.forEach((state) => {
      switch (state) {
        case State.MOVE_LEFT:
          dX = -this.speed;
          break;
        case State.MOVE_RIGHT:
          dX = this.speed;
          break;
        case State.MOVE_UP:
          dY = -this.speed;
          // Reset downward acceleration
          this.yAcc = 0;
          break;
        case State.IDLE:
        default:
          break;
      }
    });

    // Move if the new positioFn is valid
    const { left, top } = worldInfo.getAdjustedPosition(this.element, dX, dY);

    // Didn't move vertically, so can reset y-acceleration
    if (this.top === top) {
      this.yAcc = 0;
    }

    // Set the new position
    this.setLeft(left);
    this.setTop(top);
  }

  private setStateSprite(state: State): void {
    const stateSprite = StateToSpriteMap[state];

    // Set the sprite direction since we use the same sprite
    if (state === State.MOVE_LEFT) {
      this.setDirection('left');
    } else if (state === State.MOVE_RIGHT) {
      this.setDirection('right');
    }

    this.element.src = this.spriteMap[stateSprite] ?? '';
  }

  private setDirection(direction: 'left' | 'right'): void {
    this.element.style.transform =
      direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  }
}
