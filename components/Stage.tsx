import { Patch } from "immer";
import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import { tilesActions } from "../store/tiles";
import { selectCommandMap, CommandMap, Command } from "../store/tool";
import { tilesetNames } from "../lib/tilesetNames";
import seedRandom from "seedrandom";
import { keys } from "../lib/keys";
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

interface Props {
  tiles: State["tiles"]["data"];
  patches: Patch[];
  clickTile: typeof tilesActions.clickTile;
  endClickTile: typeof tilesActions.endClickTile;
  commandMap: CommandMap;
}
interface SpriteMap {
  [key: string]: { [Key in Command]?: PIXI.Sprite };
}
type TilesetMap = { [key in keyof typeof tilesetNames]: PIXI.Texture };
const spriteSheet = PIXI.BaseTexture.fromImage("/static/phoebus.png");
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

const moveCursor = (x: number, y: number, cursor: PIXI.Sprite) => {
  cursor.visible = true;
  cursor.x = x * 20;
  cursor.y = y * 20;
};

const createCursor = () => {
  const cursor = new PIXI.Sprite(PIXI.Texture.WHITE);
  cursor.height = 20;
  cursor.width = 20;
  cursor.visible = false;
  cursor.alpha = 0.5;
  return cursor;
};

const tilePosition = ({ x, y }: { x: number; y: number }) => {
  return {
    x: Math.floor(x / 20),
    y: Math.floor(y / 20),
  };
};

const StageBase: React.SFC<Props> = ({
  tiles,
  patches,
  clickTile,
  endClickTile,
  commandMap,
}) => {
  const stageElement = useRef<HTMLDivElement>(null);
  const app = useRef<PIXI.Application | null>(null);
  const cursor = useRef<PIXI.Sprite>(createCursor());
  const sprites = useRef<SpriteMap>({});
  useEffect(() => {
    app.current = new PIXI.Application({ width: 2048, height: 2048 });
    stageElement.current!.appendChild(app.current.view);
    const background = new PIXI.Sprite();
    background.interactive = true;
    background.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {
      const { x, y } = tilePosition(event.data.global);
      clickTile(x, y);
    });
    background.on("pointermove", (event: PIXI.interaction.InteractionEvent) => {
      const { x, y } = tilePosition(event.data.global);
      moveCursor(x, y, cursor.current);
      if (event.data.buttons === 1) {
        clickTile(x, y);
      }
    });
    background.on("pointerup", (event: PIXI.interaction.InteractionEvent) => {
      const { x, y } = tilePosition(event.data.global);
      endClickTile(x, y);
    });
    background.hitArea = new PIXI.Rectangle(0, 0, 2048, 2048);
    app.current.stage.addChild(background);
    app.current.stage.addChild(cursor.current);

    return () => {
      if (app.current) {
        app.current.destroy();
      }
    };
  }, []);
  useEffect(
    () => {
      for (const patch of patches) {
        const key = patch.path[0].toString();
        if (patch.op === "add") {
          addSprite(
            key,
            patch.value,
            app.current!,
            sprites.current,
            commandMap,
          );
        } else if (patch.op === "remove") {
          removeSprite(key, sprites.current);
        } else if (patch.op === "replace") {
          updateSprite(
            key,
            patch.value,
            app.current!,
            sprites.current,
            commandMap,
          );
        }
      }
    },
    [patches],
  );

  return <div ref={stageElement} />;
};

const newTile = (
  key: string,
  app: PIXI.Application,
  command: Command,
  commandMap: CommandMap,
) => {
  const textureSet = commandMap[command].textures;
  const textureName =
    textureSet[Math.floor(seedRandom(key)() * textureSet.length)];
  const texture = textures[textureName];
  const [x, y] = key.split(",");
  const sprite = new PIXI.Sprite(texture);
  sprite.width = 20;
  sprite.height = 20;
  sprite.x = parseInt(x) * 20;
  sprite.y = parseInt(y) * 20;
  app.stage.addChild(sprite);
  return sprite;
};

const addSprite = (
  key: string,
  commands: Command[],
  app: PIXI.Application,
  sprites: SpriteMap,
  commandMap: CommandMap,
) => {
  sprites[key] = {};
  for (const command of commands) {
    sprites[key][command] = newTile(key, app, command, commandMap);
  }
};

const updateSprite = (
  key: string,
  commands: Command[],
  app: PIXI.Application,
  sprites: SpriteMap,
  commandMap: CommandMap,
) => {
  const existing = keys(sprites[key]);
  for (const command of commands) {
    if (existing.includes(command)) {
      continue;
    }
    sprites[key][command] = newTile(key, app, command, commandMap);
  }
  existing
    .filter(command => !commands.includes(command))
    .forEach(command => {
      sprites[key][command]!.destroy();
      delete sprites[key][command];
    });
};

const removeSprite = (key: string, sprites: SpriteMap) => {
  if (sprites[key]) {
    Object.values(sprites[key]).forEach(sprite => {
      if (sprite) {
        sprite.destroy();
      }
    });
    delete sprites[key];
  }
};

const Stage = connect(
  (state: State) => {
    return {
      tiles: state.tiles.data,
      patches: state.tiles.patches,
      commandMap: selectCommandMap(),
    };
  },
  {
    clickTile: tilesActions.clickTile,
    endClickTile: tilesActions.endClickTile,
  },
)(StageBase);

export default Stage;
