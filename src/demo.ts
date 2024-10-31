import { Ninja } from './models/entites/Ninja';
import { World } from './models/World';

import './styles/index.scss';

const container = document.getElementById('main-container');
if (!container) throw new Error('Failed to find world container');

// Barrier
const barrier = document.createElement('div');
barrier.classList.add('collidable');
barrier.style.position = 'absolute';
barrier.style.height = '150px';
barrier.style.width = '150px';
barrier.style.top = '300px';
barrier.style.left = '600px';
barrier.style.background = 'white';
container?.appendChild(barrier);

// Main controllable entity
const ninja = new Ninja();

// The world model
const world = new World(ninja, container);
world.makeEntityDraggable(ninja);
world.start();
