import { State, StateSprite } from './State';

export class Entity {
  private _state: State = State.IDLE;

  constructor(
    private _element: HTMLImageElement,
    private _left: number = 0,
    private _top: number = 0,
    private _height: number = 100,
    private _width: number = 120,
    private _speed: number = 10
  ) {
    this.setState(State.IDLE);
    this.top = _top;
    this.left = _left;
  }

  public get element(): HTMLImageElement {
    return this._element;
  }

  public get left(): number {
    return this._left;
  }

  public set left(left: number) {
    console.log('Set left:', `${left}px`);
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
    return this._element.height;
  }

  public get width(): number {
    return this._element.width;
  }

  public get state(): State {
    return this._state;
  }

  public setState(state: State): void {
    if (this.state === State.IDLE || this.state !== state) {
      this._state = state;
      this.setStateSprite(state);
    }
  }

  public performStateAction(state: State): void {
    console.log(this.left - this._speed);
    switch (state) {
      case State.MOVE_LEFT:
        this.left = this.left - this._speed;
        break;
      case State.MOVE_RIGHT:
        this.left = this.left + this._speed;
        break;
      case State.IDLE:
      default:
        break;
    }
  }

  private setDirection(direction: 'left' | 'right'): void {
    this._element.style.transform =
      direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  }

  private setStateSprite(state: State): void {
    let stateSprite;
    switch (state) {
      case State.MOVE_LEFT:
        this.setDirection('left');
        stateSprite = StateSprite.MOVE_HORIZONTAL;
        break;
      case State.MOVE_RIGHT:
        this.setDirection('right');
        stateSprite = StateSprite.MOVE_HORIZONTAL;
        break;
      case State.IDLE:
      default:
        stateSprite = StateSprite.IDLE;
        break;
    }

    stateSprite;
    this._element.src = `sprites/brown_${stateSprite}_8fps.gif`;
  }
}
