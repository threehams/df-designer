import { Container, Sprite, Stage } from "@inlet/react-pixi";
import { settings, utils, SCALE_MODES, Texture } from "pixi.js";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as coordinates from "../../lib/coordinates";
import { useHotKey } from "../../lib/useHotKey";
import { tilesActions } from "../../store/actions";
import {
  selectSelection,
  selectSelectionOffset,
} from "../../store/reducers/toolReducer";
import { selectChunks } from "../../store/selectors";
import { Chunk, Coords, SelectedCoords, TileSprite } from "../../store/types";
import { Cursor } from "../Cursor";
import { textures, TILE_SIZE } from "./textures";

settings.SCALE_MODE = SCALE_MODES.NEAREST;
utils.skipHello();

const LEFT_MOUSE_BUTTON = 1;

const webGlSupported = () => {
  try {
    var canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
};

interface ArtboardProps {
  chunks: Chunk[];
}
const Artboard: React.FC<ArtboardProps> = ({ chunks }) => {
  const selection = useSelector(selectSelection);
  const selectionOffset = useSelector(selectSelectionOffset);
  const dispatch = useDispatch();
  const [cursorPosition, setCursorPosition] = useState<SelectedCoords>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const keysPressed = useHotKey();

  return (
    <Stage
      width={2048}
      height={2048}
      data-test="stage"
      options={{ forceCanvas: !webGlSupported() }}
    >
      <Container>
        <Sprite
          height={2048}
          interactive
          pointerdown={event => {
            if (event.data.buttons === LEFT_MOUSE_BUTTON) {
              const coords = tilePosition(event.data.global);
              dispatch(tilesActions.clickTile(coords));
            }
          }}
          pointermove={event => {
            const { x, y } = tilePosition(event.data.global);
            if (x !== cursorPosition.startX || y !== cursorPosition.startY) {
              setCursorPosition({ startX: x, startY: y, endX: x, endY: y });
            }
            if (event.data.buttons === LEFT_MOUSE_BUTTON) {
              dispatch(tilesActions.clickTile({ x, y }));
            }
          }}
          pointerup={() => {
            dispatch(tilesActions.endClickTile(keysPressed));
          }}
          texture={Texture.EMPTY}
          width={2048}
        />
        {chunks.map(chunk => {
          const key = `${chunk.startX},${chunk.endY}`;
          return <ChunkTiles key={key} tiles={chunk.tiles} />;
        })}
        <Cursor {...cursorPosition} />
        {selection && (
          <Cursor {...coordinates.offset(selection, selectionOffset)} />
        )}
      </Container>
    </Stage>
  );
};

interface ChunkProps {
  tiles: TileSprite[];
}
const ChunkTiles: React.FunctionComponent<ChunkProps> = memo(({ tiles }) => {
  return (
    <>
      {tiles.map(tile => {
        const { x, y } = coordinates.fromId(tile.id);

        return (
          <Sprite
            key={`${tile.id}${tile.textureName}`}
            width={TILE_SIZE}
            height={TILE_SIZE}
            x={x * TILE_SIZE}
            y={y * TILE_SIZE}
            // show "X" if something goes wrong instead of crashing
            texture={textures[tile.textureName] || textures.X}
          />
        );
      })}
    </>
  );
});

const tilePosition = ({ x, y }: Coords) => {
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE),
  };
};

// separated to avoid per-frame recalculations
const ArtboardTiles: React.FC = () => {
  const chunks = useSelector(selectChunks);
  return <Artboard chunks={chunks} />;
};

export default ArtboardTiles;
