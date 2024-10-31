import { Entity } from '../Entity';
import { SpriteState } from '../State';

import climbSprite from '../../assets/sprites/ninja/climb.gif';
import fallSprite from '../../assets/sprites/ninja/fall.gif';
import idleSprite from '../../assets/sprites/ninja/idle.gif';
import runSprite from '../../assets/sprites/ninja/run.gif';
import sitSprite from '../../assets/sprites/ninja/sit.gif';
import wallGrabSprite from '../../assets/sprites/ninja/wallgrab.gif';

export class Ninja extends Entity {
  spriteMap: Record<SpriteState, string> = {
    [SpriteState.CLIMB]: climbSprite,
    [SpriteState.FALL]: fallSprite,
    [SpriteState.IDLE]: idleSprite,
    [SpriteState.RUN]: runSprite,
    [SpriteState.SIT]: sitSprite,
    [SpriteState.WALLGRAB]: wallGrabSprite,
  };
}
