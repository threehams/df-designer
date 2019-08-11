import { keys } from "../../lib/keys";
import { tilesetNames } from "../../static";
import { BaseTexture, Texture, Rectangle } from "pixi.js";

export const TILE_SIZE = 16;

const spriteSheet = BaseTexture.from("/static/phoebus.png");
export type TilesetMap = { [key in keyof typeof tilesetNames]: Texture };
export const textures = keys(tilesetNames).reduce(
  (result: TilesetMap, name) => {
    const num = tilesetNames[name];
    const x = (num % TILE_SIZE) * TILE_SIZE;
    const y = Math.floor(num / TILE_SIZE) * TILE_SIZE;
    result[name] = new Texture(
      spriteSheet,
      new Rectangle(x, y, TILE_SIZE, TILE_SIZE),
    );
    return result;
  },
  {} as TilesetMap,
);
