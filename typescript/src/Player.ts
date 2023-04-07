export class Player {
  private _name: string;
  // private _joker: boolean;
  private _gold: number;
  // private _joker_is_use_now: boolean;
  private _giveUp: boolean;
  constructor(name: string) {
    this._name = name;
    // this._joker = true;
    // this._joker_is_use_now = false;
    this._gold = 0;
    this._giveUp = false;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  // get joker(): boolean {
  //   return this._joker;
  // }
  //
  // set joker(value: boolean) {
  //   this._joker = value;
  // }

  get gold(): number {
    return this._gold;
  }

  set gold(value: number) {
    this._gold = value;
  }

  get giveUp(): boolean {
    return this._giveUp;
  }

  set giveUp(value: boolean) {
    this._giveUp = value;
  }

  // get joker_is_use_now(): boolean {
  //   return this._joker_is_use_now;
  // }
  //
  // set joker_is_use_now(value: boolean) {
  //   this._joker_is_use_now = value;
  // }
}
