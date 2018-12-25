import React, { memo } from "react";
import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import { useState } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import { tilesActions, TileSprite, selectChunks, Chunk } from "../store/tiles";
import { selectCommandMap } from "../store/tool";
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
  clickTile: (x: number, y: number) => any;
  endClickTile: (x: number, y: number) => any;
  selectionStart: { x: number; y: number } | null;
  chunks: Chunk[];
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
            if (
              !cursorPosition ||
              x !== cursorPosition.minX ||
              y !== cursorPosition.minY
            ) {
              setCursorPosition({ minX: x, minY: y });
            }
            if (event.data.buttons === 1) {
              if (selectionStart) {
                setCursorPosition({
                  minX: Math.min(selectionStart.x, x),
                  minY: Math.min(selectionStart.y, y),
                  maxX: Math.max(selectionStart.x, x),
                  maxY: Math.max(selectionStart.y, y),
                });
              } else {
                clickTile(x, y);
              }
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
            texture={textures[tile.textureName]}
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
      commandMap: selectCommandMap(),
      selectionStart: state.tool.selectionStart,
      chunks: selectChunks(state),
    };
  },
  {
    clickTile: tilesActions.clickTile,
    endClickTile: tilesActions.endClickTile,
  },
)(ArtboardBase);

export default Artboard;
