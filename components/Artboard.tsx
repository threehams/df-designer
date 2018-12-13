import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import { useState } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import { tilesActions, selectWalls, Tile } from "../store/tiles";
import { selectCommandMap, CommandMap, CommandKey } from "../store/tool";
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
  clickTile: typeof tilesActions.clickTile;
  commandMap: CommandMap;
  endClickTile: typeof tilesActions.endClickTile;
  selectionStart: { x: number; y: number } | null;
  tiles: State["tiles"]["data"];
  walls: Set<string>;
}

interface Coordinates {
  endX?: number;
  endY?: number;
  startX: number;
  startY: number;
}

const ArtboardBase: React.SFC<Props> = ({
  clickTile,
  commandMap,
  endClickTile,
  selectionStart,
  tiles,
  walls,
}) => {
  const [cursorPosition, setCursorPosition] = useState<Coordinates>({
    startX: 0,
    startY: 0,
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
              x !== cursorPosition.startX ||
              y !== cursorPosition.startY
            ) {
              setCursorPosition({ startX: x, startY: y });
            }
            if (event.data.buttons === 1) {
              if (selectionStart) {
                setCursorPosition({
                  startX: Math.min(selectionStart.x, x),
                  startY: Math.min(selectionStart.y, y),
                  endX: Math.max(selectionStart.x, x),
                  endY: Math.max(selectionStart.y, y),
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
        {Object.entries(tiles).map(([id, tile]) => {
          if (!tile) {
            return null;
          }
          const { x, y } = coordinatesFromId(id);
          const types: ["designation", "item"] = ["designation", "item"];
          return types.map(type => {
            const command = tile[type];
            if (!command) {
              return null;
            }
            return (
              <Sprite
                key={`${id}${command}`}
                width={TILE_SIZE}
                height={TILE_SIZE}
                x={x * TILE_SIZE}
                y={y * TILE_SIZE}
                texture={textures[commandMap[command].textures[0]]}
              />
            );
          });
        })}
        {Array.from(walls.values()).map(id => {
          const { x, y } = coordinatesFromId(id);
          return (
            <Sprite
              key={id}
              width={TILE_SIZE}
              height={TILE_SIZE}
              x={x * TILE_SIZE}
              y={y * TILE_SIZE}
              texture={textures.rockWall2}
            />
          );
        })}
        <Cursor {...cursorPosition} />
      </Container>
    </Stage>
  );
};

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
      tiles: state.tiles.data,
      walls: selectWalls(state),
    };
  },
  {
    clickTile: tilesActions.clickTile,
    endClickTile: tilesActions.endClickTile,
  },
)(ArtboardBase);

export default Artboard;
