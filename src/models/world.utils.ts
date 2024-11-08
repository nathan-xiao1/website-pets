import type { ElementRect } from './world.types';

export function getElementRectWithScroll(elementRect: DOMRect): ElementRect {
  return {
    left: elementRect.left + scrollX,
    right: elementRect.right + scrollX,
    top: elementRect.top + scrollY,
    bottom: elementRect.bottom + scrollY,
    width: elementRect.width,
    height: elementRect.height,
  };
}
