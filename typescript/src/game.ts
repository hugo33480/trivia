import { Player } from "./Player";
import { IConsole } from "./IConsole";

export class Game {
  private _players: Array<Player> = [];
  private _forceJoker: boolean = false;
  private _neverUseJoker: boolean = false;
  private _currentPlayer: number = 0;
  private _nbQuestions: number = 1;
  private _currentCategoryChoosed: string = "";
  private popQuestions: Array<string> = [];
  private scienceQuestions: Array<string> = [];
  private sportsQuestions: Array<string> = [];
  private rockOrTechnoQuestions: Array<string> = [];
  private _console: IConsole;
  private _coinGoal: number;
  private _nextCategoryIsSport: boolean;
  private _nextCategoryIsScience: boolean;
  private _penaltyBoxes: Array<Player> = [];
  private _placeInPenaltyBox: number;

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

  constructor(
    console: IConsole,
    players: Array<Player>,
    techno: boolean,
    forceJoker: boolean,
    neverUseJoker: boolean,
    coinGoal: number,
    nextCategoryIsSport: boolean,
    nextCategoryIsScience: boolean,
    nbQuestions: number,
    placeInPenaltyBox: number) {
    this._console = console;
    this._forceJoker = forceJoker;
    this._coinGoal = coinGoal;
    this._nbQuestions = nbQuestions;
    this._neverUseJoker = neverUseJoker;
    this._nextCategoryIsSport = nextCategoryIsSport;
    this._nextCategoryIsScience = nextCategoryIsScience;
    this._placeInPenaltyBox = placeInPenaltyBox
    for (const player of players) {
      this.add(player);
    }
    for (let i = 0; i < this._nbQuestions; i++) {
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
    if (this.howManyPlayers() >= 2 && this.howManyPlayers() <= 6) return true;
    this._console.WriteLine(
      "The game should contain 2 players minimum and 6 players maximum"
    );
    return false;
  }

  public isCoinGoalValid() {
    if (this._coinGoal > 5) return true;
    this._console.WriteLine(
      "The coin goal must be 6 or higher"
    );
    return false;
  }

  public nextPlayer(){
    this.currentPlayer += 1;
    if (this.currentPlayer == this.players.length) this.currentPlayer = 0;
  }

  private changePlayerPosition(roll: number, nb_round: number) {
    this.players[this.currentPlayer].place =
      this.players[this.currentPlayer].place + roll;
    if (this.players[this.currentPlayer].place > 11) {
      this.players[this.currentPlayer].place =
        this.players[this.currentPlayer].place - 12;
    }
    this._console.WriteLine(
      "[round " + nb_round + "] " + this.players[this.currentPlayer].name +
      "'s new location is " +
      this.players[this.currentPlayer].place
    );
  }
  public roll(roll: number, nb_round: number) {
    if (this.players[this.currentPlayer].alwaysGetOutOfPenaltyBox) {
      roll = 3;
    }

    this._console.WriteLine(" ");
    this._console.WriteLine("---------- New game round  ----------");
    this._console.WriteLine(
      "[round " + nb_round + "] " + this.players[this.currentPlayer].name + " is the current player. Has " + this.players[this.currentPlayer].gold + " gold"
    );
    this._console.WriteLine("[round " + nb_round + "] " + "They have rolled a " + roll);

    if (this.players[this.currentPlayer].inPenaltyBox) {
      if (
          this.players[this.currentPlayer].getOutOfJail()
      ) {
        this.players[this.currentPlayer].inPenaltyBox = false;
        this.players[this.currentPlayer].leaveJail();
        this._console.WriteLine(
          "[round " + nb_round + "] " + this.players[this.currentPlayer].name +
          " is getting out of the penalty box"
        );
        this.changePlayerPosition(roll, nb_round);


        this.pickCategory();
        this._console.WriteLine("[round " + nb_round + "] " + "The category is " + this._currentCategoryChoosed);
        if (this.isPlayerUseJoker(this.players[this.currentPlayer])) {
          this.useJoker(this.players[this.currentPlayer], nb_round);
        } else {
          this.askQuestion(nb_round);
        }
      } else {
        this.players[this.currentPlayer].stayInJail();
        this._console.WriteLine(
          "[round " + nb_round + "] " +
          this.players[this.currentPlayer].name +
            " is not getting out of the penalty box, it's chance to get out are now " + this.players[this.currentPlayer].chanceToGetOutOfJail + " on 1"
        );
        this.players[this.currentPlayer].inPenaltyBox = true;
      }
    } else {
      this.changePlayerPosition(roll, nb_round);
      this.pickCategory();
      this._console.WriteLine("[round " + nb_round + "] " + "The category is " + this._currentCategoryChoosed);
      if (this.isPlayerUseJoker(this.players[this.currentPlayer])) {
        this.useJoker(this.players[this.currentPlayer], nb_round);
      } else {
        this.askQuestion(nb_round);
      }
    }
  }

  private askQuestion(nb_round: number): void {
    if (this._currentCategoryChoosed == "Pop") {
      const question = this.popQuestions.shift();
      this._console.WriteLine("[round " + nb_round + "] " + question);
      this.popQuestions.push(question);
    }
    if (this._currentCategoryChoosed == "Science") {
      const question = this.scienceQuestions.shift();
      this._console.WriteLine("[round " + nb_round + "] " + question);
      this.scienceQuestions.push(question);
    }
    if (this._currentCategoryChoosed == "Sports") {
      const question = this.sportsQuestions.shift();
      this._console.WriteLine("[round " + nb_round + "] " + question);
      this.sportsQuestions.push(question);
    }
    if (this._currentCategoryChoosed == "Rock") {
      const question = this.rockOrTechnoQuestions.shift();
      this._console.WriteLine("[round " + nb_round + "] " + question);
      this.rockOrTechnoQuestions.push(question);
    }
    this._currentCategoryChoosed = "";
  }

  pickCategory(): void {
    const allCategory = ["Pop", "Sports", "Science", "Rock"]
    if (this._currentCategoryChoosed === "") {
      this._currentCategoryChoosed = allCategory[Math.floor(Math.random() * (allCategory.length))]
    }
  }

  public didPlayerWin(nb_round: number): boolean {
    if (
      this.players.length === 1 ||
      this.players[this.currentPlayer].gold >= this._coinGoal
    ) {
      this._console.WriteLine(
        "[round " + nb_round + "] " + this.players[this.currentPlayer].name + " wins the game"
      );
      return false;
    }
    return true;
  }

  public giveUp(nb_round: number): boolean {
    if (
      Math.floor(Math.random() * 6) == 6 ||
      this.players[this.currentPlayer].giveUp
    ) {
      this._console.WriteLine(
        "[round " + nb_round + "] " + this.players[this.currentPlayer].name + " leaves the game"
      );
      this.players.splice(this.currentPlayer, 1);
      if (this.currentPlayer == this.players.length) this.currentPlayer = 0;
      return true;
    }
    return false;
  }

  public wrongAnswer(nb_round: number): boolean {
    if (!this.players[this.currentPlayer].joker_is_use_now) {
      this._console.WriteLine("[round " + nb_round + "] " + "Question was incorrectly answered");
      this.chooseNextCategory();
      this._console.WriteLine(
        "[round " + nb_round + "] " + this.players[this.currentPlayer].name + " has chosen the next category which is : " + this._currentCategoryChoosed);
      this._console.WriteLine("[round " + nb_round + "] " + this.players[this._currentPlayer].name + " was sent to the penalty box");
      this._players[this._currentPlayer].inPenaltyBox = true;
      this._console.WriteLine("[round " + nb_round + "] " + this.players[this._currentPlayer].name + " answer streak was reset to 0");
      this.players[this._currentPlayer].streak = 0

      this.players[this.currentPlayer].goToJail();
      this._console.WriteLine("[round " + nb_round + "] " +
        this.players[this._currentPlayer].name +
          "'s visit to jail : " +
          this.players[this._currentPlayer].visitInJail +
          ", he has now 1 chance on " +
          this.players[this._currentPlayer].visitInJail +
          " to get out next turn"
      );
      this._console.WriteLine(
        `${this.players[this._currentPlayer].name} answer streak was reset to 0`
      );
      this.players[this._currentPlayer].streak = 0;
      this._penaltyBoxes.unshift(this.players[this._currentPlayer])

      if (this._placeInPenaltyBox != 0 && this._penaltyBoxes.length > this._placeInPenaltyBox){
        this._console.WriteLine("[round " + nb_round + "] " +
        this._penaltyBoxes[this._placeInPenaltyBox].name + " is getting out of penalty box because penalty box is full")
        this._penaltyBoxes[this._placeInPenaltyBox].inPenaltyBox = false;
        this._penaltyBoxes[this._placeInPenaltyBox].leaveJail();
        this._penaltyBoxes.pop();
      }
    } else {
      this.players[this.currentPlayer].joker_is_use_now = false;
    }

    this.nextPlayer();
    return true;
  }

  public chooseNextCategory() {
    if (this._nextCategoryIsSport) {
      this._currentCategoryChoosed = "Sports";
      return;
    }
    if (this._nextCategoryIsScience) {
      this._currentCategoryChoosed = "Science";
      return;
    }

    const randomRoll = Math.floor(Math.random() * 4);
    switch (randomRoll) {
      case 0:
        this._currentCategoryChoosed = "Pop";
        break;
      case 1:
        this._currentCategoryChoosed = "Science";
        break;
      case 2:
        this._currentCategoryChoosed = "Sports";
        break;
      case 3:
        this._currentCategoryChoosed = "Rock";
        break;
    }
  }

  public wasCorrectlyAnswered(nb_round: number): boolean {
    if (!this.players[this.currentPlayer].joker_is_use_now) {
      if (this.players[this.currentPlayer].inPenaltyBox) {
        this.nextPlayer();
        return true;
      } else {
        this._console.WriteLine("[round " + nb_round + "] " + "Answer was corrent!!!!");
        this.players[this._currentPlayer].streak += 1;
        this._console.WriteLine("[round " + nb_round + "] " + this.players[this._currentPlayer].name + " streak is now " + this.players[this._currentPlayer].streak);
        this._players[this._currentPlayer].gold = Math.min(this.players[this._currentPlayer].streak + this._players[this._currentPlayer].gold, this._coinGoal);

        this._console.WriteLine(
          "[round " + nb_round + "] " + this._players[this._currentPlayer].name +
          " now has " +
          this.players[this.currentPlayer].gold +
          " Gold Coins."
        );

        var winner = this.didPlayerWin(nb_round);

        this.nextPlayer();

        return winner;
      }
    } else {
      this.players[this.currentPlayer].joker_is_use_now = false;
      this.nextPlayer();
      return true;
    }
  }

  isPlayerUseJoker(player: Player): boolean {
    if (this._neverUseJoker) return false;

    if (this._forceJoker && player.joker) {
      return true;
    }

    if (player.joker) {
      const randomRoll = Math.floor(Math.random() * 3);
      return randomRoll === 1;
    }

    return false;
  }
  public useJoker(player: Player, nb_round: number): void {
    player.joker = false;
    player.joker_is_use_now = true;
    this._console.WriteLine("[round " + nb_round + "] " + this.players[this.currentPlayer].name + ' uses a joker');
    this._console.WriteLine("[round " + nb_round + "] " + this.players[this.currentPlayer].name + ' doesn\'t earn gold this turn. He has ' + this.players[this.currentPlayer].gold + " gold");
  }
}
