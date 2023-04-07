export class Player {
  get alwaysTrueAnswer(): boolean {
    return this._alwaysTrueAnswer;
  }

  set alwaysTrueAnswer(value: boolean) {
    this._alwaysTrueAnswer = value;
  }
  private _name: string;
  private _gold: number;
  private _joker: boolean;
  private _joker_is_use_now: boolean;
  private _place: number

  private _alwaysFalseAnswer: boolean;
  private _alwaysGetOutOfPenaltyBox: boolean;
  private _inPenaltyBox: boolean;
  // private _joker_is_use_now: boolean;
  private _giveUp: boolean;
  private _streak: number = 0
  private _alwaysTrueAnswer : boolean;
  private _visiteInJail: number = 0;

  constructor(name: string) {
    this._name = name;
    this._place = 0;
    this._joker = true;
    this._joker_is_use_now = false;
    this._gold = 0;
    this._giveUp = false;
    this._alwaysFalseAnswer = false;
  }

  get streak(): number {
    return this._streak;
  }

  set streak(value: number) {
    this._streak = value;
  }

  get name(): string {
    return this._name;
  }

  get alwaysFalseAnswer(): boolean {
    return this._alwaysFalseAnswer;
  }

  set alwaysFalseAnswer(value: boolean) {
    this._alwaysFalseAnswer = value;
  }

  get alwaysGetOutOfPenaltyBox(): boolean {
    return this._alwaysGetOutOfPenaltyBox;
  }

  set alwaysGetOutOfPenaltyBox(value: boolean) {
    this._alwaysGetOutOfPenaltyBox = value;
  }

  get inPenaltyBox(): boolean {
    return this._inPenaltyBox;
  }

  set inPenaltyBox(value: boolean) {
    this._inPenaltyBox = value;
  }

  set name(value: string) {
    this._name = value;
  }

  get place(): number {
    return this._place;
  }

  set place(value: number) {
    this._place = value;
  }

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

  get joker(): boolean {
    return this._joker;
  }

  set joker(value: boolean) {
    this._joker = value;
  }

  get joker_is_use_now(): boolean {
    return this._joker_is_use_now;
  }

  set joker_is_use_now(value: boolean) {
    this._joker_is_use_now = value;
  }

  get visitInJail(): number {
    return this._visiteInJail;
  }

  public goToJail() {
    this._visiteInJail++
  }
}
