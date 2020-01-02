import { Sprite } from "@inlet/react-pixi";
import { Texture } from "pixi.js";
import React from "react";

const TILE_SIZE = 16;

interface CursorProps {
  endX: number | undefined;
  endY: number | undefined;
  startX: number;
  startY: number;
}
export const Cursor = ({ startX, startY, endX, endY }: CursorProps) => {
  return (
    <Sprite
      alpha={0.5}
      height={endY ? (endY - startY + 1) * TILE_SIZE : TILE_SIZE}
      texture={Texture.WHITE}
      width={endX ? (endX - startX + 1) * TILE_SIZE : TILE_SIZE}
      x={startX * TILE_SIZE}
      y={startY * TILE_SIZE}
    />
  );
};
