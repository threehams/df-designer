import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import { useState } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import { tilesActions } from "../store/tiles";
import { selectCommandMap, CommandMap, Command } from "../store/tool";
import { tilesetNames } from "../lib/tilesetNames";
import seedRandom from "seedrandom";
import { keys } from "../lib/keys";
import { coordinatesFromId, idFromCoordinates } from "../lib/coordinatesFromId";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.utils.skipHello();

type TilesMap = State["tiles"]["data"];

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
  tiles: TilesMap;
  clickTile: typeof tilesActions.clickTile;
  endClickTile: typeof tilesActions.endClickTile;
  commandMap: CommandMap;
  selectionStart: { x: number; y: number } | null;
}

interface Coordinates {
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
}

const ArtboardBase: React.SFC<Props> = ({
  tiles,
  clickTile,
  endClickTile,
  commandMap,
  selectionStart,
}) => {
  const [cursorPosition, setCursorPosition] = useState<Coordinates>({
    startX: 0,
    startY: 0,
  });

  return (
    <Stage width={2048} height={2048}>
      <Container>
        <Sprite
          width={2048}
          height={2048}
          texture={PIXI.Texture.EMPTY}
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
                  startX: selectionStart.x,
                  startY: selectionStart.y,
                  endX: x,
                  endY: y,
                });
              } else {
                clickTile(x, y);
              }
            }
          }}
          pointerup={event => {
            const { x, y } = tilePosition(event.data.global);
            // moveCursor(x, y, cursor.current);
            endClickTile(x, y);
          }}
        />
        {Object.entries(tiles).map(([id, commands]) => {
          const { x, y } = coordinatesFromId(id);
          return commands.map(command => {
            return (
              <Sprite
                key={`${id}${command}`}
                width={20}
                height={20}
                x={x * 20}
                y={y * 20}
                texture={textures[commandMap[command].textures[0]]}
              />
            );
          });
        })}
        <Cursor {...cursorPosition} />
      </Container>
    </Stage>
  );
};

const tilePosition = ({ x, y }: { x: number; y: number }) => {
  return {
    x: Math.floor(x / 20),
    y: Math.floor(y / 20),
  };
};

interface CursorProps {
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
}
const Cursor: React.SFC<CursorProps> = ({ startX, startY, endX, endY }) => {
  return (
    <Sprite
      texture={PIXI.Texture.WHITE}
      height={endY ? (endY - startY + 1) * 20 : 20}
      width={endX ? (endX - startX + 1) * 20 : 20}
      alpha={0.5}
      x={startX * 20}
      y={startY * 20}
    />
  );
};

interface WallMap {
  [key: string]: PIXI.Sprite;
}
// matrix or something, never had to deal with this
const neighborIds = (x: number, y: number) => {
  return [
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y },
    { x, y },
    { x: x + 1, y },
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
  ];
};

// very naive but may be fast enough for now
const updateWalls = (
  centerX: number,
  centerY: number,
  app: PIXI.Application,
  tiles: TilesMap,
  walls: WallMap,
  commandMap: CommandMap,
) => {
  for (const { x, y } of neighborIds(centerX, centerY)) {
    updateWall(x, y, tiles, app, walls, commandMap);
  }
};

const exposed = (commands: Command[] | null, commandMap: CommandMap) => {
  if (!commands) {
    return false;
  }
  return commands.filter(command => commandMap[command].phase === "dig").length;
};

const updateWall = (
  centerX: number,
  centerY: number,
  tiles: TilesMap,
  app: PIXI.Application,
  walls: WallMap,
  commandMap: CommandMap,
) => {
  const centerId = idFromCoordinates(centerX, centerY);
  if (exposed(tiles[centerId], commandMap)) {
    if (walls[centerId]) {
      walls[centerId].destroy();
      delete walls[centerId];
    }
    return;
  }
  let textureId = 0;
  for (const [index, { x, y }] of neighborIds(centerX, centerY).entries()) {
    const id = idFromCoordinates(x, y);
    // bitmask
    if (exposed(tiles[id], commandMap)) {
      textureId += index + 1;
    }
  }
  if (textureId && !walls[centerId]) {
    walls[centerId] = newTile(centerId, app, ["rockWall2"]);
  } else if (!textureId && walls[centerId]) {
    walls[centerId].destroy();
    delete walls[centerId];
  }
};

const newTile = (
  key: string,
  app: PIXI.Application,
  textureSet: (keyof typeof tilesetNames)[],
) => {
  const textureName =
    textureSet[Math.floor(seedRandom(key)() * textureSet.length)];
  const texture = textures[textureName];
  const { x, y } = coordinatesFromId(key);
  const sprite = new PIXI.Sprite(texture);
  sprite.width = 20;
  sprite.height = 20;
  sprite.x = x * 20;
  sprite.y = y * 20;
  app.stage.addChild(sprite);
  return sprite;
};

const Artboard = connect(
  (state: State) => {
    return {
      tiles: state.tiles.data,
      commandMap: selectCommandMap(),
      selectionStart: state.tool.selectionStart,
    };
  },
  {
    clickTile: tilesActions.clickTile,
    endClickTile: tilesActions.endClickTile,
  },
)(ArtboardBase);

export default Artboard;
