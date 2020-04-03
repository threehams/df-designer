import { Container, Sprite, Stage } from "@inlet/react-pixi";
import { settings, utils, SCALE_MODES, Texture } from "pixi.js";
import React, { memo, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as coordinates from "../../lib/coordinates";
import { useHotKey } from "../../lib/useHotKey";
import { tilesActions } from "../../store/actions";
import {
  selectSelection,
  selectSelectionOffset,
  selectCurrentCommand,
} from "../../store/reducers/toolReducer";
import { selectChunks } from "../../store/selectors";
import { Chunk, Coords, SelectedCoords, TileSprite } from "../../store/types";
import { Cursor } from "../Cursor";
import { textures, TILE_SIZE } from "./textures";

settings.SCALE_MODE = SCALE_MODES.NEAREST;
utils.skipHello();

const LEFT_MOUSE_BUTTON = 1;

interface ArtboardProps {
  chunks: Chunk[];
}
const Artboard = ({ chunks }: ArtboardProps) => {
  const selection = useSelector(selectSelection);
  const selectionOffset = useSelector(selectSelectionOffset);
  const dispatch = useDispatch();
  const [cursorPosition, setCursorPosition] = useState<SelectedCoords>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const cursorSize = useSelector(state => {
    const command = selectCurrentCommand(state);
    if ("width" in command && "height" in command) {
      return { width: command.width, height: command.height };
    }
    return { width: 1, height: 1 };
  });
  const keysPressed = useHotKey();
  const webGlSupported = useMemo(() => {
    try {
      var canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }, []);

  return (
    <Stage
      width={2048}
      height={2048}
      data-test="stage"
      options={{ forceCanvas: !webGlSupported }}
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
        <Cursor
          startX={cursorPosition.startX}
          startY={cursorPosition.startY}
          endX={cursorPosition.startX + (cursorSize.width - 1)}
          endY={cursorPosition.startY + (cursorSize.height - 1)}
          {...cursorSize}
        />
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
const ChunkTiles = memo(({ tiles }: ChunkProps) => {
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
const ArtboardTiles = () => {
  const chunks = useSelector(selectChunks);
  return <Artboard chunks={chunks} />;
};

export default ArtboardTiles;
