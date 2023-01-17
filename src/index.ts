import { Cat } from './models/characters/Cat';
import { World } from './models/World';

import './styles/index.scss';

const container = document.getElementById('main-container');

// div.id = 'moveable';
// div.style.height = '100px';
// div.style.width = '120px';
// div.style.position = 'absolute';
// div.src = sprite_idle;
// container?.appendChild(div);

const catSprite = document.createElement('img');
catSprite.style.position = 'absolute';

const cat = new Cat(catSprite, 0, 150);
container?.appendChild(cat.element);

const world = new World(cat);

world.start();

// let leftPressed = false;
// let rightPressed = false;

// function keyDownHandler(e: Event): void {
//   if (leftPressed || rightPressed) return;
//   if (e instanceof KeyboardEvent) {
//     console.log('keyDown');
//     div.src = sprite_walk;

//     if (e.key === 'Left' || e.key === 'ArrowLeft') {
//       div.style.transform = 'scaleX(-1)';
//       leftPressed = true;
//     } else if (e.key === 'Right' || e.key === 'ArrowRight') {
//       div.style.transform = 'scaleX(1)';
//       rightPressed = true;
//     }
//   }
// }

// function keyUpHandler(e: Event): void {
//   if (e instanceof KeyboardEvent) {
//     console.log('keyUp');
//     div.src = sprite_idle;

//     if (e.key === 'Left' || e.key === 'ArrowLeft') {
//       leftPressed = false;
//     } else if (e.key === 'Right' || e.key === 'ArrowRight') {
//       rightPressed = false;
//     }
//   }
// }

// document.addEventListener('keydown', keyDownHandler, false);
// document.addEventListener('keyup', keyUpHandler, false);

// function gameLoop(): void {
//   const computedDiv = getComputedStyle(div);
//   if (leftPressed) {
//     div.style.left = parseFloat(computedDiv.left) - 5 + 'px';
//   }
//   if (rightPressed) {
//     div.style.left = parseFloat(computedDiv.left) + 5 + 'px';
//   }
// }

// console.log('sprite_walk:', sprite_walk);
// setInterval(gameLoop, 1000 / 60);
