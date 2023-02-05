import path from 'path';

// Map for mapping each Entity's animation sprite to a URL
const spriteMap = new Map<string, Map<string, string>>();

/**
 * Import all sprite from the asset directory and populate the sprite map
 */
export function importAllSprites(): void {
  const sprites = require.context(
    '../assets/sprites/',
    true,
    /\.(png|jpe?g|svg|gif)$/
  );
  sprites.keys().forEach((item) => {
    const normalizedPath = path.parse(path.normalize(item));
    const entityName = normalizedPath.dir;
    const spriteName = normalizedPath.name;

    let entitySpriteMap = spriteMap.get(entityName);
    if (!entitySpriteMap) {
      entitySpriteMap = new Map();
      spriteMap.set(entityName, entitySpriteMap);
    }

    entitySpriteMap.set(spriteName, sprites(item));
  });
}

importAllSprites();

export { spriteMap };
