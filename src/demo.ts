import { Ninja } from './entites/ninja';
import { World } from './models/world';

import './styles/index.scss';

const container = document.getElementById('main-container');
if (!container) throw new Error('Failed to find world container');

// Barrier
const barrier1 = document.createElement('div');
barrier1.id = 'barrier1';
barrier1.classList.add('collidable');
barrier1.style.position = 'absolute';
barrier1.style.height = '150px';
barrier1.style.width = '150px';
barrier1.style.top = '300px';
barrier1.style.left = '600px';
barrier1.style.background = 'white';
container?.appendChild(barrier1);

const barrier2 = document.createElement('div');
barrier2.id = 'barrier2';
barrier2.classList.add('collidable');
barrier2.style.position = 'absolute';
barrier2.style.height = '150px';
barrier2.style.width = '150px';
barrier2.style.top = '130px';
barrier2.style.left = '500px';
barrier2.style.background = 'white';
container?.appendChild(barrier2);

const barrier3 = document.createElement('div');
barrier3.id = 'barrier3';
barrier3.classList.add('collidable');
barrier3.style.position = 'absolute';
barrier3.style.height = '150px';
barrier3.style.width = '150px';
barrier3.style.top = `${screen.height}px`;
barrier3.style.left = '500px';
barrier3.style.background = 'white';
container?.appendChild(barrier3);

// Main controllable entity
const ninja = new Ninja({
  height: 50,
  width: 50,
  speed: 5,
});

// The world model
const world = new World(ninja, container);
world.makeEntityDraggable(ninja);
world.start();
