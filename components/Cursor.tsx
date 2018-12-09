import * as PIXI from "pixi.js";
import { Sprite } from "@inlet/react-pixi";

const TILE_SIZE = 16;

interface CursorProps {
  endX?: number;
  endY?: number;
  startX: number;
  startY: number;
}
export const Cursor: React.SFC<CursorProps> = ({
  startX,
  startY,
  endX,
  endY,
}) => {
  return (
    <Sprite
      alpha={0.5}
      height={endY ? (endY - startY + 1) * TILE_SIZE : TILE_SIZE}
      texture={PIXI.Texture.WHITE}
      width={endX ? (endX - startX + 1) * TILE_SIZE : TILE_SIZE}
      x={startX * TILE_SIZE}
      y={startY * TILE_SIZE}
    />
  );
};
