import { Entity } from '../Entity';

export function Ninja(): Entity {
  const element = document.createElement('img');
  element.style.position = 'absolute';
  return new Entity(element, 'sprites/ninja/', 0, 150);
}
