import { Container, Sprite, Stage } from "@inlet/react-pixi";
import { useActions, useSelector } from "react-redux";
import * as PIXI from "pixi.js";
import React, { memo, useState } from "react";
import * as coordinates from "../../lib/coordinates";
import { useHotKey } from "../../lib/useHotKey";
import {
  selectSelection,
  selectSelectionOffset,
} from "../../store/reducers/toolReducer";
import { selectChunks } from "../../store/selectors";
import { Coords, SelectedCoords, TileSprite, Chunk } from "../../store/types";
import { Cursor } from "../Cursor";
import { textures, TILE_SIZE } from "./textures";
import { tilesActions } from "../../store/actions";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();

const LEFT_MOUSE_BUTTON = 1;

interface ArtboardProps {
  chunks: Chunk[];
}
const Artboard: React.FC<ArtboardProps> = ({ chunks }) => {
  const { selection, selectionOffset } = useSelector(state => {
    return {
      selection: selectSelection(state),
      selectionOffset: selectSelectionOffset(state),
    };
  });
  const { clickTile, endClickTile } = useActions(tilesActions);
  const [cursorPosition, setCursorPosition] = useState<SelectedCoords>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const keysPressed = useHotKey();
  return (
    <Stage width={2048} height={2048} data-test="stage">
      <Container>
        <Sprite
          height={2048}
          interactive
          pointerdown={event => {
            if (event.data.buttons === LEFT_MOUSE_BUTTON) {
              const { x, y } = tilePosition(event.data.global);
              clickTile(x, y);
            }
          }}
          pointermove={event => {
            const { x, y } = tilePosition(event.data.global);
            if (x !== cursorPosition.startX || y !== cursorPosition.startY) {
              setCursorPosition({ startX: x, startY: y, endX: x, endY: y });
            }
            if (event.data.buttons === LEFT_MOUSE_BUTTON) {
              clickTile(x, y);
            }
          }}
          pointerup={() => {
            endClickTile(keysPressed);
          }}
          texture={PIXI.Texture.EMPTY}
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

const ArtboardTiles: React.FC = () => {
  const { chunks } = useSelector(state => {
    return {
      chunks: selectChunks(state),
    };
  });
  return <Artboard chunks={chunks} />;
};

export default ArtboardTiles;
