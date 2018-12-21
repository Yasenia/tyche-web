import {setStoredLuckySheep} from "../../utils/storage";
import {GameProps} from "./index";

const SHEEP_WIDTH = 120;
const SHEEP_HEIGHT = 90;

interface Vector {
  x: number;
  y: number;
}

export interface Range {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const inBoundary = (range: Range, position: Vector) => {
  return position.x >= range.left && position.x <= range.right - SHEEP_WIDTH
    && position.y >= range.top && position.y <= range.bottom - SHEEP_HEIGHT;
};

const randomPosition = (range: Range) => ({
  x: Math.random() * (range.right - range.left - SHEEP_WIDTH) + range.left,
  y: Math.random() * (range.bottom - range.top - SHEEP_HEIGHT) + range.top,
});

class SheepModel {
  public id: string;
  public position: Vector;
  public speed: number;
  public picked: boolean;

  private originalPosition: Vector;
  private range: Range;

  constructor(id: string, range: Range) {
    this.id = id;
    this.range = range;
    const position = randomPosition(range);
    this.position = position;
    this.originalPosition = position;
    this.picked = false;
    this.changeSpeed();
  }

  public run = () => {
    const nextPosition = {x: this.position.x + this.speed, y: this.position.y};
    if (!inBoundary(this.range, nextPosition)) {
      this.speed = -this.speed;
    } else {
      this.position = nextPosition;
    }
  }

  public pickUp = (x: number, y: number) => {
    this.picked = true;
    this.originalPosition = {x, y};
  }

  public dragTo = (x: number, y: number) => {
    this.position = {
      x: this.position.x + x - this.originalPosition.x,
      y: this.position.y + y - this.originalPosition.y,
    };
    this.originalPosition = {x, y};
  }

  public putDown = (range: Range) => {
    this.picked = false;
    this.range = range;
    if (!inBoundary(this.range, this.position)) {
      let x = Math.min(this.position.x, this.range.right - SHEEP_WIDTH);
      x = Math.max(x, this.range.left);
      let y = Math.min(this.position.y, this.range.bottom - SHEEP_HEIGHT);
      y = Math.max(y, this.range.top);
      this.position = {x, y};
    }
  }

  public changeSpeed = () => {
    const sign = Math.random() > 0.5 ? 1 : -1;
    this.speed = sign * (Math.random() * 8 + 4);
  }

  public snapshot = () => ({
    x: this.position.x,
    y: this.position.y,
    z: Math.floor(this.position.y),
    reverse: this.speed > 0,
  })

}

export class GameModel {
  private prairie: {
    range: Range,
    flockModel: SheepModel[],
  };
  private barrier: {
    range: Range,
    flockModel: SheepModel[],
  };
  private caughtSheep?: SheepModel;
  private luckyTime: boolean;
  private luckyFlock: SheepModel[];

  constructor(props: GameProps) {
    const {flock, prairieRange, barrierRange} = props;
    const flockModel = flock.map((s) => new SheepModel(s.id, prairieRange));
    this.prairie = {
      range: prairieRange,
      flockModel,
    };
    this.barrier = {
      range: barrierRange,
      flockModel: [],
    };
    this.luckyFlock = [];
  }

  public run = () => {
    this.prairie.flockModel.forEach((s) => s.run());
  }

  public pickUp = (sheepId: string, pickX: number, pickY: number) => {
    const caughtSheep = [...this.prairie.flockModel, ...this.barrier.flockModel].find((s) => s.id === sheepId);
    this.prairie.flockModel = this.prairie.flockModel.filter((s) => s.id !== sheepId);
    this.barrier.flockModel = this.barrier.flockModel.filter((s) => s.id !== sheepId);
    if (caughtSheep) {
      this.caughtSheep = caughtSheep;
      this.caughtSheep.pickUp(pickX, pickY);
    }
  }

  public dragTo = (targetX: number, targetY: number) => {
    if (this.caughtSheep) {
      this.caughtSheep.dragTo(targetX, targetY);
    }
  }

  public putDown = () => {
    if (this.caughtSheep) {
      if (inBoundary(this.barrier.range, this.caughtSheep.position)) {
        this.caughtSheep.putDown(this.barrier.range);
        this.barrier.flockModel = [...this.barrier.flockModel, this.caughtSheep];
      } else {
        this.caughtSheep.putDown(this.prairie.range);
        this.prairie.flockModel = [...this.prairie.flockModel, this.caughtSheep];
      }
      this.caughtSheep = null;
    }
  }

  public kickOff = () => {
    this.luckyTime = true;
  }

  public nextRound = () => {
    this.luckyFlock = [...this.luckyFlock, ...this.barrier.flockModel];
    this.barrier.flockModel = [];
    this.prairie.flockModel.forEach((sheep) => sheep.changeSpeed());
    this.luckyTime = false;
    setStoredLuckySheep(this.luckyFlock.map((sheep) => sheep.id));
  }

  public isLuckyTime = () => this.luckyTime;

  public snapshot() {
    const sheepStateMap = {} as {
      [key: string]: {
        x: number;
        y: number;
        z: number;
        display: boolean;
        showSheepName: boolean;
        reverse: boolean;
        luckySheep: boolean;
      };
    };
    this.prairie.flockModel.forEach((sheepModel) => {
      sheepStateMap[sheepModel.id] = {
        ...sheepModel.snapshot(),
        display: !this.luckyTime,
        showSheepName: false,
        luckySheep: false,
      };
    });
    this.barrier.flockModel.forEach((sheepModel) => {
      sheepStateMap[sheepModel.id] = {
        ...sheepModel.snapshot(),
        display: true,
        showSheepName: this.luckyTime,
        luckySheep: false,
      };
    });
    this.luckyFlock.forEach((sheepModel) => {
      sheepStateMap[sheepModel.id] = {
        ...sheepModel.snapshot(),
        display: false,
        showSheepName: false,
        luckySheep: true,
      };
    });
    if (this.caughtSheep) {
      sheepStateMap[this.caughtSheep.id] = {
        ...this.caughtSheep.snapshot(),
        display: true,
        showSheepName: false,
        luckySheep: false,
      };
    }
    return {
      sheepStateMap,
    };
  }

}
