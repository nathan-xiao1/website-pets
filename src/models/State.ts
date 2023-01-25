export const enum State {
  IDLE = 'idle',
  FALL = 'fall',
  MOVE_LEFT = 'move-left',
  MOVE_RIGHT = 'move-right',
  MOVE_UP = 'move-up',
  MOVE_DOWN = 'move-down',
}

export const StateSprite: Record<State, string> = {
  [State.IDLE]: 'idle',
  [State.FALL]: 'fall',
  [State.MOVE_LEFT]: 'run',
  [State.MOVE_RIGHT]: 'run',
  [State.MOVE_UP]: 'climb',
  [State.MOVE_DOWN]: 'climb',
};
