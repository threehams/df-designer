import { Container, Sprite, Stage } from "@inlet/react-pixi";
import keycode from "keycode";
import * as PIXI from "pixi.js";
import React, { memo } from "react";
import { useState } from "react";
import { connect } from "react-redux";

import * as coordinates from "../../lib/coordinates";
import { useHotKey } from "../../lib/useHotKey";
import { State } from "../../store";
import {
  Chunk,
  selectChunks,
  tilesActions,
  TileSprite,
} from "../../store/tiles";
import {
  Coords,
  selectCommandMap,
  SelectedCoords,
  selectSelection,
  selectSelectionOffset,
} from "../../store/tool";
import { Cursor } from "../Cursor";
import { Hotkeys } from "./Hotkeys";
import { textures, TILE_SIZE } from "./textures";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();

const LEFT_MOUSE_BUTTON = 1;

interface Props {
  chunks: Chunk[];
  clickTile: (x: number, y: number) => any;
  endClickTile: (keyPressed: Array<keyof typeof keycode.codes>) => any;
  selection: SelectedCoords | null;
  selectionOffset: Coords;
}

const ArtboardBase: React.FunctionComponent<Props> = ({
  chunks,
  clickTile,
  endClickTile,
  selection,
  selectionOffset,
}) => {
  const [cursorPosition, setCursorPosition] = useState<SelectedCoords>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const keysPressed = useHotKey();
  return (
    <>
      <Hotkeys />
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
    </>
  );
};

interface ChunkProps {
  tiles: TileSprite[];
}
const ChunkTiles: React.FunctionComponent<ChunkProps> = memo(({ tiles }) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});

const tilePosition = ({ x, y }: Coords) => {
  return {
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE),
  };
};

const Artboard = connect(
  (state: State) => {
    return {
      chunks: selectChunks(state),
      commandMap: selectCommandMap(),
      selection: selectSelection(state),
      selectionOffset: selectSelectionOffset(state),
    };
  },
  {
    clickTile: tilesActions.clickTile,
    endClickTile: tilesActions.endClickTile,
  },
)(ArtboardBase);

export default Artboard;
