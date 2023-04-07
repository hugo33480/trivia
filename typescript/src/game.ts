import {Player} from "./Player";
import {IConsole} from "./IConsole";

export class Game {
  private _players: Array<Player> = [];
  private _forceJoker: boolean = false;
  private purses: Array<number> = [];
  private _currentPlayer: number = 0;

  private popQuestions: Array<string> = [];
  private scienceQuestions: Array<string> = [];
  private sportsQuestions: Array<string> = [];
  private rockOrTechnoQuestions: Array<string> = [];
  private _console: IConsole;
  private _coinGoal: number;

  get console(): IConsole {
    return this._console;
  }


  get players(): Array<Player> {
    return this._players;
  }

  get currentPlayer(): number {
    return this._currentPlayer;
  }

  set currentPlayer(value: number) {
    this._currentPlayer = value;
  }

  constructor(console: IConsole, players: Array<Player>, techno: boolean, forceJoker: boolean, coinGoal: number) {
    this._console = console;
    this._forceJoker = forceJoker;
    this._coinGoal = coinGoal;
    for (const player of players) {
      this.add(player);
    }
    for (let i = 0; i < 50; i++) {
      this.popQuestions.push("Pop Question " + i);
      this.scienceQuestions.push("Science Question " + i);
      this.sportsQuestions.push("Sports Question " + i);
      this.rockOrTechnoQuestions.push(
        this.createRockOrTechnoQuestion(i, techno)
      );
    }
  }

  private createRockOrTechnoQuestion(index: number, techno: boolean): string {
    return (techno ? "Techno Question " : "Rock Question ") + index;
  }

  public add(player: Player): boolean {
    this.players.push(player);
    this.purses[this.howManyPlayers()] = 0;

    this._console.WriteLine("---------- Adding Player ----------");
    this._console.WriteLine(player.name + " was added");
    this._console.WriteLine("They are player number " + this.players.length);
    this._console.WriteLine(" ");

    return true;
  }

  private howManyPlayers(): number {
    return this.players.length;
  }

  public isNumberOfPlayerValid() {
    if (this.howManyPlayers() >= 2 && this.howManyPlayers() <= 6) return true
    this._console.WriteLine(
        "The game should contain 2 players minimum and 6 players maximum"
    );
    return false;  }

  public isCoinGoalValid() {
    if (this._coinGoal > 5) return true;
    this._console.WriteLine(
        "The coin goal must be 6 or higher"
    );
    return false;
  }

  public roll(roll: number) {

    if (this.players[this.currentPlayer].alwaysGetOutOfPenaltyBox) {
      roll = 3
    }

    this._console.WriteLine(" ");
    this._console.WriteLine("---------- New game round ----------");
    this._console.WriteLine(
      this.players[this.currentPlayer].name + " is the current player"
    );
    this._console.WriteLine("They have rolled a " + roll);

    if (this.players[this.currentPlayer].inPenaltyBox) {
      if (roll % 2 != 0) {
        this.players[this.currentPlayer].inPenaltyBox = false;
        this._console.WriteLine(
          this.players[this.currentPlayer].name +
          " is getting out of the penalty box"
        );
        this.players[this.currentPlayer].place =
          this.players[this.currentPlayer].place + roll;
        if (this.players[this.currentPlayer].place > 11) {
          this.players[this.currentPlayer].place =
            this.players[this.currentPlayer].place - 12;
        }

        this._console.WriteLine(
          this.players[this.currentPlayer].name +
          "'s new location is " +
          this.players[this.currentPlayer].place
        );
        this._console.WriteLine("The category is " + this.currentCategory());
        if (!this.useJoker(this.players[this.currentPlayer])) {
          this.askQuestion();
        } else {
          this._console.WriteLine(this.players[this.currentPlayer].name + ' uses a joker');
          this._console.WriteLine(this.players[this.currentPlayer].name + ' doesn\'t earn gold this turn');
        }
      } else {
        this._console.WriteLine(
          this.players[this.currentPlayer].name +
          " is not getting out of the penalty box"
        );
        this.players[this.currentPlayer].inPenaltyBox = true
      }
    } else {
      this.players[this.currentPlayer].place = this.players[this.currentPlayer].place + roll;
      if (this.players[this.currentPlayer].place > 11) {
        this.players[this.currentPlayer].place = this.players[this.currentPlayer].place - 12;
      }

      this._console.WriteLine(
        this.players[this.currentPlayer].name +
        "'s new location is " +
        this.players[this.currentPlayer].place
      );
      this._console.WriteLine("The category is " + this.currentCategory());
      if (!this.useJoker(this.players[this.currentPlayer])) {
        this.askQuestion();
      } else {
        this._console.WriteLine(this.players[this.currentPlayer].name + ' uses a joker');
        this._console.WriteLine(this.players[this.currentPlayer].name + ' doesn\'t earn gold this turn');
      }
    }
  }

  private askQuestion(): void {
    if (this.currentCategory() == "Pop")
      this._console.WriteLine(this.popQuestions.shift()!);
    if (this.currentCategory() == "Science")
      this._console.WriteLine(this.scienceQuestions.shift()!);
    if (this.currentCategory() == "Sports")
      this._console.WriteLine(this.sportsQuestions.shift()!);
    if (this.currentCategory() == "Rock")
      this._console.WriteLine(this.rockOrTechnoQuestions.shift()!);
  }

  private currentCategory(): string {
    if (this.players[this.currentPlayer].place == 0) return "Pop";
    if (this.players[this.currentPlayer].place == 4) return "Pop";
    if (this.players[this.currentPlayer].place == 8) return "Pop";
    if (this.players[this.currentPlayer].place == 1) return "Science";
    if (this.players[this.currentPlayer].place == 5) return "Science";
    if (this.players[this.currentPlayer].place == 9) return "Science";
    if (this.players[this.currentPlayer].place == 2) return "Sports";
    if (this.players[this.currentPlayer].place == 6) return "Sports";
    if (this.players[this.currentPlayer].place == 10) return "Sports";
    return "Rock";
  }

  public didPlayerWin(): boolean {
    if (
      this.players.length === 1 ||
      this.players[this.currentPlayer].gold >= this._coinGoal
    ) {
      this._console.WriteLine(
        this.players[this.currentPlayer].name + " wins the game"
      );
      return false;
    }
    return true;
  }

  public giveUp(): boolean {
    if (
      Math.floor(Math.random() * 6) == 6 ||
      this.players[this.currentPlayer].giveUp
    ) {
      this._console.WriteLine(
        this.players[this.currentPlayer].name + " leaves the game"
      );
      this.players.splice(this.currentPlayer, 1);
      if (this.currentPlayer == this.players.length) this.currentPlayer = 0;
      return true;
    }
    return false;
  }

  public wrongAnswer(): boolean {
    if (!this.players[this.currentPlayer].joker_is_use_now) {
      this._console.WriteLine('Question was incorrectly answered');
      this._console.WriteLine(this.players[this._currentPlayer].name + " was sent to the penalty box");
      this._players[this._currentPlayer].inPenaltyBox = true;
      this._console.WriteLine(`${this.players[this._currentPlayer].name} answer streak was reset to 0`);
      this.players[this._currentPlayer].streak = 0

    } else {
      this.players[this.currentPlayer].joker_is_use_now = false;
    }

    this.currentPlayer += 1;
    if (this.currentPlayer == this.players.length)
      this.currentPlayer = 0;
    return true;
  }

  public wasCorrectlyAnswered(): boolean {
    if (!this.players[this.currentPlayer].joker_is_use_now) {
      if (this.players[this.currentPlayer].inPenaltyBox) {
        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length) this.currentPlayer = 0;
        return true;
      } else {
        this._console.WriteLine("Answer was corrent!!!!");
      this.players[this._currentPlayer].streak += 1
      this._console.WriteLine(`${this.players[this._currentPlayer].name} streak is now ${this.players[this._currentPlayer].streak}`);
      this._players[this._currentPlayer].gold = Math.min(this.players[this._currentPlayer].streak + this._players[this._currentPlayer].gold, this._coinGoal);

      this._console.WriteLine(
        this._players[this._currentPlayer].name +
          " now has " +
          this.players[this.currentPlayer].gold +
          " Gold Coins."
        );

        var winner = this.didPlayerWin();

        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length) this.currentPlayer = 0;

        return winner;
      }
    } else {
      this.players[this.currentPlayer].joker_is_use_now = false;
      this.currentPlayer += 1;
      if (this.currentPlayer == this.players.length)
        this.currentPlayer = 0;
      return true;
    }
  }

  public useJoker(player: Player) {
    if (this._forceJoker && player.joker) {
      player.joker = false;
      player.joker_is_use_now = true
      return true;
    }

    if (player.joker) {
      const randomRoll = Math.floor(Math.random() * 3);
      if (randomRoll === 1) {
        player.joker = false;
        player.joker_is_use_now = true
        return true;
      }
    }
    return false;
  }
}
