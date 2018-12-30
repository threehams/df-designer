import React, { memo, useEffect } from "react";
import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import { useState } from "react";
import { connect } from "react-redux";
import keycode from "keycode";

import { State } from "../store";
import { tilesActions, TileSprite, selectChunks, Chunk } from "../store/tiles";
import {
  selectCommandMap,
  selectSelectionOffset,
  Coordinates,
} from "../store/tool";
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
    const x = (num % TILE_SIZE) * TILE_SIZE;
    const y = Math.floor(num / TILE_SIZE) * TILE_SIZE;
    result[name] = new PIXI.Texture(
      spriteSheet,
      new PIXI.Rectangle(x, y, TILE_SIZE, TILE_SIZE),
    );
    return result;
  },
  {} as TilesetMap,
);

interface Props {
  chunks: Chunk[];
  clickTile: (x: number, y: number) => any;
  endClickTile: (
    x: number,
    y: number,
    keyPressed: keyof typeof keycode.codes | null,
  ) => any;
  selectionEnd: Coordinates | null;
  selectionOffset: Coordinates;
  selectionStart: Coordinates | null;
}

interface SelectionArea {
  maxX?: number;
  maxY?: number;
  minX: number;
  minY: number;
}

const useHotKey = () => {
  const [key, setKey] = useState<keyof typeof keycode.codes | null>(null);

  useEffect(() => {
    const set = (event: KeyboardEvent) => {
      if (event.keyCode) {
        setKey(keycode(event) as keyof typeof keycode.codes);
      }
    };
    const reset = () => {
      setKey(null);
    };
    window.addEventListener("keydown", set);
    window.addEventListener("keyup", reset);
    return () => {
      window.removeEventListener("keydown", set);
      window.removeEventListener("keyup", reset);
    };
  });
  return key;
};

const ArtboardBase: React.FunctionComponent<Props> = ({
  clickTile,
  endClickTile,
  selectionEnd,
  selectionOffset,
  selectionStart,
  chunks,
}) => {
  const [cursorPosition, setCursorPosition] = useState<SelectionArea>({
    minX: 0,
    minY: 0,
  });
  const keyboardKey = useHotKey();
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
            endClickTile(x, y, keyboardKey);
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
            // show "X" if something goes wrong instead of crashing
            texture={textures[tile.textureName] || textures.X}
          />
        );
      })}
    </React.Fragment>
  );
});

const tilePosition = ({ x, y }: Coordinates) => {
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
