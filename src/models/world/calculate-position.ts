import type { ElementRect, Position, WorldRect } from './world.types';

export function calculatePositionWithCollision(
  elementRect: ElementRect,
  dX: number,
  dY: number,
  collidableElements: HTMLElement[]
): Position {
  const newLeft = elementRect.left + dX;
  const newRight = elementRect.right + dX;
  const newTop = elementRect.top + dY;
  const newBottom = elementRect.bottom + dY;

  // Check if colliding with any collidable element
  const collidingElements = collidableElements.filter((collidableElement) => {
    const collidableElementRect = getElementRectWithScroll(
      collidableElement.getBoundingClientRect()
    );

    return !(
      newLeft > collidableElementRect.right ||
      newRight < collidableElementRect.left ||
      newTop > collidableElementRect.bottom ||
      newBottom < collidableElementRect.top
    );
  });

  if (collidingElements.length > 0) {
    // Check whether we will collide with any collidable element on the horizontal axis
    const willCollideHorizontally = collidingElements.some(
      (collidingElement) => {
        const collidingElementRect = getElementRectWithScroll(
          collidingElement.getBoundingClientRect()
        );
        // Ignore any element we don't collide with vertically
        const isOutsideVertically =
          elementRect.top >= collidingElementRect.bottom ||
          elementRect.bottom <= collidingElementRect.top;

        if (isOutsideVertically) return false;

        // Whether the new horizontal position will be outside of the collidable element
        return !(
          newLeft >= collidingElementRect.right ||
          newRight <= collidingElementRect.left
        );
      }
    );

    // Check whether we will collide with any collidable element on the vertical axis
    const willCollideVertically = collidingElements.some((collidingElement) => {
      const collidingElementRect = getElementRectWithScroll(
        collidingElement.getBoundingClientRect()
      );

      // Ignore any element we don't collide with horizontally
      const isOutsideHorizontally =
        elementRect.left >= collidingElementRect.right ||
        elementRect.right <= collidingElementRect.left;

      if (isOutsideHorizontally) return false;

      // Whether the new horizontal position will be outside of the collidable element
      return !(
        newTop >= collidingElementRect.bottom ||
        newBottom <= collidingElementRect.top
      );
    });

    // Return position outside the collidable element
    return {
      left: elementRect.left + (willCollideHorizontally ? 0 : dX),
      top: elementRect.top + (willCollideVertically ? 0 : dY),
    };
  }
  // Nothing blocking - allow new position
  return {
    left: elementRect.left + dX,
    top: elementRect.top + dY,
  };
}

export function calculatePositionWithWorldBoundary(
  worldRect: WorldRect,
  elementRect: ElementRect,
  position: Position
): Position {
  // Check if within world boundary
  const isOutsideWorldLeft = position.left < 0;
  const isOutsideWorldRight =
    position.left + elementRect.width > worldRect.right;
  const isOutsideWorldTop = position.top < 0;
  const isOutsideWorldBottom =
    position.top + elementRect.height > worldRect.bottom;

  // Correct to inside the world boundary
  if (
    isOutsideWorldLeft ||
    isOutsideWorldRight ||
    isOutsideWorldTop ||
    isOutsideWorldBottom
  ) {
    // Move back in if outside horizontally
    const left = isOutsideWorldLeft
      ? // Ouside of left boundary
        0
      : isOutsideWorldRight
      ? // Outside of right boundary
        worldRect.right - elementRect.width
      : // Not outside - allow movement
        position.left;

    // Move back in if outside vertically
    const top = isOutsideWorldTop
      ? // Ouside of top boundary
        0
      : isOutsideWorldBottom
      ? // Outside of bottom boundary
        worldRect.bottom - elementRect.height
      : // Not outside - allow movement
        position.top;

    return { left, top };
  }

  // Not outside world boundary
  return position;
}
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
