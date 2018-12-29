import React, { memo } from "react";
import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import { useState } from "react";
import { connect } from "react-redux";

import { State } from "../store";
import { tilesActions, TileSprite, selectChunks, Chunk } from "../store/tiles";
import { selectCommandMap, selectSelectionOffset } from "../store/tool";
import { tilesetNames } from "../lib/tilesetNames";
import { keys } from "../lib/keys";
import { coordinatesFromId } from "../lib/coordinatesFromId";
import { Cursor } from "./Cursor";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();

const TILE_SIZE = 16;
const spriteSheet = PIXI.BaseTexture.fromImage("/static/phoebus.png");
type TilesetMap = { [key in keyof typeof tilesetNames]: PIXI.Texture };
const textures = keys(tilesetNames).reduce(
  (result, name) => {
    const num = tilesetNames[name];
    const x = (num % 16) * 16;
    const y = Math.floor(num / 16) * 16;
    result[name] = new PIXI.Texture(
      spriteSheet,
      new PIXI.Rectangle(x, y, 16, 16),
    );
    return result;
  },
  {} as TilesetMap,
);

interface Props {
  chunks: Chunk[];
  clickTile: (x: number, y: number) => any;
  endClickTile: (x: number, y: number) => any;
  selectionEnd: { x: number; y: number } | null;
  selectionOffset: { x: number; y: number };
  selectionStart: { x: number; y: number } | null;
}

interface Coordinates {
  maxX?: number;
  maxY?: number;
  minX: number;
  minY: number;
}

const ArtboardBase: React.FunctionComponent<Props> = ({
  clickTile,
  endClickTile,
  selectionEnd,
  selectionOffset,
  selectionStart,
  chunks,
}) => {
  const [cursorPosition, setCursorPosition] = useState<Coordinates>({
    minX: 0,
    minY: 0,
  });

  return (
    <Stage width={2048} height={2048}>
      <Container>
        <Sprite
          height={2048}
          interactive
          pointerdown={event => {
            if (event.data.buttons === 1) {
              const { x, y } = tilePosition(event.data.global);
              clickTile(x, y);
            }
          }}
          pointermove={event => {
            const { x, y } = tilePosition(event.data.global);
            if (x !== cursorPosition.minX || y !== cursorPosition.minY) {
              setCursorPosition({ minX: x, minY: y });
            }
            if (event.data.buttons === 1) {
              clickTile(x, y);
            }
          }}
          pointerup={event => {
            const { x, y } = tilePosition(event.data.global);
            endClickTile(x, y);
          }}
          texture={PIXI.Texture.EMPTY}
          width={2048}
        />
        {chunks.map(chunk => {
          const key = `${chunk.minX},${chunk.maxY}`;
          return <ChunkTiles key={key} tiles={chunk.tiles} />;
        })}
        <Cursor {...cursorPosition} />
        {selectionStart && selectionEnd && (
          <Cursor
            minX={Math.min(selectionStart.x, selectionEnd.x)}
            minY={Math.min(selectionStart.y, selectionEnd.y)}
            maxX={Math.max(selectionStart.x, selectionEnd.x)}
            maxY={Math.max(selectionStart.y, selectionEnd.y)}
            offset={selectionOffset}
          />
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
    <React.Fragment>
      {tiles.map(tile => {
        const { x, y } = coordinatesFromId(tile.id);

        return (
          <Sprite
            key={`${tile.id}${tile.textureName}`}
            width={TILE_SIZE}
            height={TILE_SIZE}
            x={x * TILE_SIZE}
            y={y * TILE_SIZE}
            // show "X" in case of something going wrong
            texture={textures[tile.textureName] || textures.X}
          />
        );
      })}
    </React.Fragment>
  );
});

const tilePosition = ({ x, y }: { x: number; y: number }) => {
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
      selectionEnd: state.tool.selectionEnd,
      selectionOffset: selectSelectionOffset(state),
      selectionStart: state.tool.selectionStart,
    };
  },
  {
    clickTile: tilesActions.clickTile,
    endClickTile: tilesActions.endClickTile,
  },
)(ArtboardBase);

export default Artboard;
