/**
 * States of an Entity
 */
export const enum State {
  IDLE = 'idle',
  FALL = 'fall',
  MOVE_LEFT = 'move-left',
  MOVE_RIGHT = 'move-right',
  MOVE_UP = 'move-up',
  MOVE_DOWN = 'move-down',
}

/**
 * States of a sprite
 */
export const enum SpriteState {
  CLIMB = 'climb',
  FALL = 'fall',
  IDLE = 'idle',
  RUN = 'run',
  SIT = 'sit',
  WALLGRAB = 'wallgrab',
}

/**
 * Maps an Entity's state to a sprite
 */
export const StateToSpriteMap: Record<State, SpriteState> = {
  [State.IDLE]: SpriteState.IDLE,
  [State.FALL]: SpriteState.FALL,
  [State.MOVE_LEFT]: SpriteState.RUN,
  [State.MOVE_RIGHT]: SpriteState.RUN,
  [State.MOVE_UP]: SpriteState.CLIMB,
  [State.MOVE_DOWN]: SpriteState.CLIMB,
};
