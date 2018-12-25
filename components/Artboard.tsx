import * as PIXI from "pixi.js";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import { useState } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import { tilesActions, selectWalls } from "../store/tiles";
import { selectCommandMap, CommandMap } from "../store/tool";
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

const wallMap = {
  0b00000001: textures.smoothWallSE,
  0b00000010: textures.smoothWallWE,
  0b00000011: textures.smoothWallWE,
  0b00000100: textures.smoothWallSW,
  0b00000101: textures.smoothWallTNorth,
  0b00000110: textures.smoothWallWE,
  0b00000111: textures.smoothWallWE,
  0b00001000: textures.smoothWallNS,
  0b00001001: textures.smoothWallNS,
  0b00001010: textures.smoothWallNW,
  0b00001011: textures.smoothWallNW,
  0b00001100: textures.smoothWallTEast,
  0b00001101: textures.smoothWallTEast,
  0b00001110: textures.smoothWallNW,
  0b00001111: textures.smoothWallNW,
  0b00010000: textures.smoothWallNS,
  0b00010001: textures.smoothWallTWest,
  0b00010010: textures.smoothWallNE,
  0b00010011: textures.smoothWallNE,
  0b00010100: textures.smoothWallNS,
  0b00010101: textures.smoothWallTWest,
  0b00010110: textures.smoothWallNE,
  0b00010111: textures.smoothWallNE,
  0b00011000: textures.smoothWallNS,
  0b00011001: textures.smoothWallNS,
  0b00011010: textures.smoothWallCross,
  0b00011011: textures.smoothWallCross,
  0b00011100: textures.smoothWallNS,
  0b00011101: textures.smoothWallNS,
  0b00011110: textures.smoothWallCross,
  0b00011111: textures.smoothWallCross,
  0b00100000: textures.smoothWallNE,
  0b00100001: textures.smoothWallTWest,
  0b00100010: textures.smoothWallTSouth,
  0b00100011: textures.smoothWallTSouth,
  0b00100100: textures.smoothWallCross,
  0b00100101: textures.smoothWallCross,
  0b00100110: textures.smoothWallTSouth,
  0b00100111: textures.smoothWallTSouth,
  0b00101000: textures.smoothWallNS,
  0b00101001: textures.smoothWallNS,
  0b00101010: textures.smoothWallNW,
  0b00101011: textures.smoothWallNW,
  0b00101100: textures.smoothWallTEast,
  0b00101101: textures.smoothWallTEast,
  0b00101110: textures.smoothWallNW,
  0b00101111: textures.smoothWallNW,
  0b00110000: textures.smoothWallTWest,
  0b00110001: textures.smoothWallTWest,
  0b00110010: textures.smoothWallNE,
  0b00110011: textures.smoothWallNE,
  0b00110100: textures.smoothWallTWest,
  0b00110101: textures.smoothWallTWest,
  0b00110110: textures.smoothWallNE,
  0b00110111: textures.smoothWallNE,
  0b00111000: textures.smoothWallNS,
  0b00111001: textures.smoothWallNS,
  0b00111010: textures.smoothWallCross,
  0b00111011: textures.smoothWallCross,
  0b00111100: textures.smoothWallNS,
  0b00111101: textures.smoothWallNS,
  0b00111110: textures.smoothWallCross,
  0b00111111: textures.smoothWallCross,
  0b01000000: textures.smoothWallWE,
  0b01000001: textures.smoothWallTNorth,
  0b01000010: textures.smoothWallWE,
  0b01000011: textures.smoothWallWE,
  0b01000100: textures.smoothWallTNorth,
  0b01000101: textures.smoothWallTNorth,
  0b01000110: textures.smoothWallWE,
  0b01000111: textures.smoothWallWE,
  0b01001000: textures.smoothWallSW,
  0b01001001: textures.smoothWallSW,
  0b01001010: textures.smoothWallCross,
  0b01001011: textures.smoothWallCross,
  0b01001100: textures.smoothWallSW,
  0b01001101: textures.smoothWallSW,
  0b01001110: textures.smoothWallCross,
  0b01001111: textures.smoothWallCross,
  0b01010000: textures.smoothWallSE,
  0b01010001: textures.smoothWallSE,
  0b01010010: textures.smoothWallCross,
  0b01010011: textures.smoothWallCross,
  0b01010100: textures.smoothWallSE,
  0b01010101: textures.smoothWallSE,
  0b01010110: textures.smoothWallCross,
  0b01010111: textures.smoothWallCross,
  0b01011000: textures.smoothWallCross,
  0b01011001: textures.smoothWallCross,
  0b01011010: textures.smoothWallCross,
  0b01011011: textures.smoothWallCross,
  0b01011100: textures.smoothWallCross,
  0b01011101: textures.smoothWallCross,
  0b01011110: textures.smoothWallCross,
  0b01011111: textures.smoothWallCross,
  0b01100000: textures.smoothWallWE,
  0b01100001: textures.smoothWallTNorth,
  0b01100010: textures.smoothWallWE,
  0b01100011: textures.smoothWallWE,
  0b01100100: textures.smoothWallTNorth,
  0b01100101: textures.smoothWallTNorth,
  0b01100110: textures.smoothWallWE,
  0b01100111: textures.smoothWallWE,
  0b01101000: textures.smoothWallSW,
  0b01101001: textures.smoothWallSW,
  0b01101010: textures.smoothWallCross,
  0b01101011: textures.smoothWallCross,
  0b01101100: textures.smoothWallSW,
  0b01101101: textures.smoothWallSW,
  0b01101110: textures.smoothWallCross,
  0b01101111: textures.smoothWallCross,
  0b01110000: textures.smoothWallSE,
  0b01110001: textures.smoothWallSE,
  0b01110010: textures.smoothWallCross,
  0b01110011: textures.smoothWallCross,
  0b01110100: textures.smoothWallSE,
  0b01110101: textures.smoothWallSE,
  0b01110110: textures.smoothWallCross,
  0b01110111: textures.smoothWallCross,
  0b01111000: textures.smoothWallCross,
  0b01111001: textures.smoothWallCross,
  0b01111010: textures.smoothWallCross,
  0b01111011: textures.smoothWallCross,
  0b01111100: textures.smoothWallCross,
  0b01111101: textures.smoothWallCross,
  0b01111110: textures.smoothWallCross,
  0b01111111: textures.smoothWallCross,
  0b10000000: textures.smoothWallNW,
  0b10000001: textures.smoothWallCross,
  0b10000010: textures.smoothWallTSouth,
  0b10000011: textures.smoothWallTSouth,
  0b10000100: textures.smoothWallTEast,
  0b10000101: textures.smoothWallCross,
  0b10000110: textures.smoothWallTSouth,
  0b10000111: textures.smoothWallTSouth,
  0b10001000: textures.smoothWallTEast,
  0b10001001: textures.smoothWallTEast,
  0b10001010: textures.smoothWallNW,
  0b10001011: textures.smoothWallNW,
  0b10001100: textures.smoothWallTEast,
  0b10001101: textures.smoothWallTEast,
  0b10001110: textures.smoothWallNW,
  0b10001111: textures.smoothWallNW,
  0b10010000: textures.smoothWallNS,
  0b10010001: textures.smoothWallTWest,
  0b10010010: textures.smoothWallNE,
  0b10010011: textures.smoothWallNE,
  0b10010100: textures.smoothWallNS,
  0b10010101: textures.smoothWallTWest,
  0b10010110: textures.smoothWallNE,
  0b10010111: textures.smoothWallNE,
  0b10011000: textures.smoothWallNS,
  0b10011001: textures.smoothWallNS,
  0b10011010: textures.smoothWallCross,
  0b10011011: textures.smoothWallCross,
  0b10011100: textures.smoothWallNS,
  0b10011101: textures.smoothWallNS,
  0b10011110: textures.smoothWallCross,
  0b10011111: textures.smoothWallCross,
  0b10100000: textures.smoothWallTSouth,
  0b10100001: textures.smoothWallCross,
  0b10100010: textures.smoothWallTSouth,
  0b10100011: textures.smoothWallTSouth,
  0b10100100: textures.smoothWallCross,
  0b10100101: textures.smoothWallCross,
  0b10100110: textures.smoothWallTSouth,
  0b10100111: textures.smoothWallTSouth,
  0b10101000: textures.smoothWallTEast,
  0b10101001: textures.smoothWallTEast,
  0b10101010: textures.smoothWallNW,
  0b10101011: textures.smoothWallNW,
  0b10101100: textures.smoothWallTEast,
  0b10101101: textures.smoothWallTEast,
  0b10101110: textures.smoothWallNW,
  0b10101111: textures.smoothWallNW,
  0b10110000: textures.smoothWallTWest,
  0b10110001: textures.smoothWallTWest,
  0b10110010: textures.smoothWallNE,
  0b10110011: textures.smoothWallNE,
  0b10110100: textures.smoothWallTWest,
  0b10110101: textures.smoothWallTWest,
  0b10110110: textures.smoothWallNE,
  0b10110111: textures.smoothWallNE,
  0b10111000: textures.smoothWallNS,
  0b10111001: textures.smoothWallNS,
  0b10111010: textures.smoothWallCross,
  0b10111011: textures.smoothWallCross,
  0b10111100: textures.smoothWallNS,
  0b10111101: textures.smoothWallNS,
  0b10111110: textures.smoothWallCross,
  0b10111111: textures.smoothWallCross,
  0b11000000: textures.smoothWallWE,
  0b11000001: textures.smoothWallTNorth,
  0b11000010: textures.smoothWallWE,
  0b11000011: textures.smoothWallWE,
  0b11000100: textures.smoothWallTNorth,
  0b11000101: textures.smoothWallTNorth,
  0b11000110: textures.smoothWallWE,
  0b11000111: textures.smoothWallWE,
  0b11001000: textures.smoothWallSW,
  0b11001001: textures.smoothWallSW,
  0b11001010: textures.smoothWallCross,
  0b11001011: textures.smoothWallCross,
  0b11001100: textures.smoothWallSW,
  0b11001101: textures.smoothWallSW,
  0b11001110: textures.smoothWallCross,
  0b11001111: textures.smoothWallCross,
  0b11010000: textures.smoothWallSE,
  0b11010001: textures.smoothWallSE,
  0b11010010: textures.smoothWallCross,
  0b11010011: textures.smoothWallCross,
  0b11010100: textures.smoothWallSE,
  0b11010101: textures.smoothWallSE,
  0b11010110: textures.smoothWallCross,
  0b11010111: textures.smoothWallCross,
  0b11011000: textures.smoothWallCross,
  0b11011001: textures.smoothWallCross,
  0b11011010: textures.smoothWallCross,
  0b11011011: textures.smoothWallCross,
  0b11011100: textures.smoothWallCross,
  0b11011101: textures.smoothWallCross,
  0b11011110: textures.smoothWallCross,
  0b11011111: textures.smoothWallCross,
  0b11100000: textures.smoothWallWE,
  0b11100001: textures.smoothWallTNorth,
  0b11100010: textures.smoothWallWE,
  0b11100011: textures.smoothWallWE,
  0b11100100: textures.smoothWallTNorth,
  0b11100101: textures.smoothWallTNorth,
  0b11100110: textures.smoothWallWE,
  0b11100111: textures.smoothWallWE,
  0b11101000: textures.smoothWallSW,
  0b11101001: textures.smoothWallSW,
  0b11101010: textures.smoothWallCross,
  0b11101011: textures.smoothWallCross,
  0b11101100: textures.smoothWallSW,
  0b11101101: textures.smoothWallSW,
  0b11101110: textures.smoothWallCross,
  0b11101111: textures.smoothWallCross,
  0b11110000: textures.smoothWallSE,
  0b11110001: textures.smoothWallSE,
  0b11110010: textures.smoothWallCross,
  0b11110011: textures.smoothWallCross,
  0b11110100: textures.smoothWallSE,
  0b11110101: textures.smoothWallSE,
  0b11110110: textures.smoothWallCross,
  0b11110111: textures.smoothWallCross,
  0b11111000: textures.smoothWallCross,
  0b11111001: textures.smoothWallCross,
  0b11111010: textures.smoothWallCross,
  0b11111011: textures.smoothWallCross,
  0b11111100: textures.smoothWallCross,
  0b11111101: textures.smoothWallCross,
  0b11111110: textures.smoothWallCross,
  0b11111111: textures.smoothWallCross,
};

interface Props {
  clickTile: (x: number, y: number) => any;
  commandMap: CommandMap;
  endClickTile: (x: number, y: number) => any;
  selectionStart: { x: number; y: number } | null;
  tiles: State["tiles"]["data"];
  walls: { id: string; bits: number }[];
}

interface Coordinates {
  endX?: number;
  endY?: number;
  startX: number;
  startY: number;
}

const ArtboardBase: React.FunctionComponent<Props> = ({
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
        {walls.map(wall => {
          const { x, y } = coordinatesFromId(wall.id);
          return (
            <Sprite
              key={wall.id}
              width={TILE_SIZE}
              height={TILE_SIZE}
              x={x * TILE_SIZE}
              y={y * TILE_SIZE}
              texture={wallMap[wall.bits] || textures.rockWall2}
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
