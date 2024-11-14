import climbSprite from '../assets/sprites/ninja/climb.gif';
import fallSprite from '../assets/sprites/ninja/fall.gif';
import idleSprite from '../assets/sprites/ninja/idle.gif';
import runSprite from '../assets/sprites/ninja/run.gif';
import sitSprite from '../assets/sprites/ninja/sit.gif';
import wallGrabSprite from '../assets/sprites/ninja/wallgrab.gif';
import { Entity } from '../models/entity';
import { SpriteState } from '../models/entity/state';
import type { EntityConfig } from '../models/entity';

export class Ninja extends Entity {
  constructor(entityConfig?: Partial<EntityConfig>) {
    super(
      {
        [SpriteState.CLIMB]: climbSprite,
        [SpriteState.FALL]: fallSprite,
        [SpriteState.IDLE]: idleSprite,
        [SpriteState.RUN]: runSprite,
        [SpriteState.SIT]: sitSprite,
        [SpriteState.WALLGRAB]: wallGrabSprite,
      },
      entityConfig
    );
  }
}
