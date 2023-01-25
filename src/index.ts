import { createEntity } from './models/Entity';
import { World } from './models/World';

import './styles/index.scss';

const container = document.getElementById('main-container');

// div.id = 'moveable';
// div.style.height = '100px';
// div.style.width = '120px';
// div.style.position = 'absolute';
// div.src = sprite_idle;
// container?.appendChild(div);

const entity = createEntity();
container?.appendChild(entity.element);

const barrier = document.createElement('div');
barrier.classList.add('collidable');
barrier.style.position = 'absolute';
barrier.style.height = '150px';
barrier.style.width = '150px';
barrier.style.top = '300px';
barrier.style.left = '600px';
barrier.style.background = 'white';
container?.appendChild(barrier);

const world = new World(entity);

world.start();
