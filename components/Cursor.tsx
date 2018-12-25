import * as PIXI from "pixi.js";
import { Sprite } from "@inlet/react-pixi";

const TILE_SIZE = 16;

interface CursorProps {
  maxX?: number;
  maxY?: number;
  minX: number;
  minY: number;
}
export const Cursor: React.FunctionComponent<CursorProps> = ({
  minX,
  minY,
  maxX,
  maxY,
}) => {
  return (
    <Sprite
      alpha={0.5}
      height={maxY ? (maxY - minY + 1) * TILE_SIZE : TILE_SIZE}
      texture={PIXI.Texture.WHITE}
      width={maxX ? (maxX - minX + 1) * TILE_SIZE : TILE_SIZE}
      x={minX * TILE_SIZE}
      y={minY * TILE_SIZE}
    />
  );
};
