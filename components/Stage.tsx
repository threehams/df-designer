import { Patch } from "immer";
import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { State } from "../store";
import * as actions from "../store/tiles/actions";

interface Props {
  tiles: State["tiles"]["data"];
  patches: Patch[];
  clickTile: typeof actions.clickTile;
}
interface SpriteMap {
  [key: string]: PIXI.Sprite;
}

const StageBase: React.SFC<Props> = ({ tiles, patches, clickTile }) => {
  const stageElement = useRef<HTMLDivElement>(null);
  const app = useRef<PIXI.Application>(null);
  const sprites = useRef<SpriteMap>({});
  useEffect(() => {
    app.current = new PIXI.Application({ width: 2048, height: 2048 });
    if (stageElement.current) {
      stageElement.current.appendChild(app.current.view);
    }
    const background = new PIXI.Sprite();
    background.interactive = true;
    background.on("pointerdown", (event: PIXI.interaction.InteractionEvent) => {
      const { x, y } = event.data.global;
      const tileX = Math.floor(x / 20);
      const tileY = Math.floor(y / 20);
      clickTile(tileX, tileY);
    });
    background.on("pointermove", (event: PIXI.interaction.InteractionEvent) => {
      const { x, y } = event.data.global;
      if (event.data.buttons === 1) {
        const tileX = Math.floor(x / 20);
        const tileY = Math.floor(y / 20);
        clickTile(tileX, tileY);
      }
    });
    background.hitArea = new PIXI.Rectangle(0, 0, 2048, 2048);
    app.current.stage.addChild(background);

    return () => {
      if (app.current) {
        app.current.destroy();
      }
    };
  }, []);
  useEffect(
    () => {
      if (!app.current) {
        return;
      }
      patches.forEach(patch => {
        const key = patch.path[0].toString();
        if (patch.op === "add") {
          addSprite(key, app.current, sprites.current);
        } else if (patch.op === "remove") {
          removeSprite(key, sprites.current);
        }
      });
    },
    [patches],
  );

  return <div ref={stageElement} />;
};

const addSprite = (key: string, app: PIXI.Application, sprites: SpriteMap) => {
  if (sprites[key]) {
    return;
  }
  const [x, y] = key.split(",");
  const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  sprite.width = 20;
  sprite.height = 20;
  sprite.x = parseInt(x) * 20;
  sprite.y = parseInt(y) * 20;
  sprites[key] = sprite;
  app.stage.addChild(sprite);
};

const removeSprite = (key: string, sprites: SpriteMap) => {
  if (sprites[key]) {
    sprites[key].destroy();
    delete sprites[key];
  }
};

const Stage = connect(
  (state: State) => {
    return {
      tiles: state.tiles.data,
      patches: state.tiles.patches,
    };
  },
  {
    clickTile: actions.clickTile,
  },
)(StageBase);

export default Stage;