import { Sprite } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

const TILE_SIZE = 16;
const DEFAULT_OFFSET = { x: 0, y: 0 };

interface CursorProps {
  endX?: number;
  endY?: number;
  startX: number;
  startY: number;
  offset?: { x: number; y: number };
}
export const Cursor: React.FunctionComponent<CursorProps> = ({
  startX,
  startY,
  endX,
  endY,
  offset = DEFAULT_OFFSET,
}) => {
  return (
    <Sprite
      alpha={0.5}
      height={endY ? (endY - startY + 1) * TILE_SIZE : TILE_SIZE}
      texture={PIXI.Texture.WHITE}
      width={endX ? (endX - startX + 1) * TILE_SIZE : TILE_SIZE}
      x={(startX + offset.x) * TILE_SIZE}
      y={(startY + offset.y) * TILE_SIZE}
    />
  );
};
