import { Game } from "./game";
import { Player } from "./Player";
import { IConsole } from "./IConsole";
import { SystemConsole } from "./SystemConsole";

export class GameBuilder {
  private players: Player[] = [
    new Player("Suuuuuuue"),
    new Player("Chet"),
    new Player("Pat"),
  ];
  private console: IConsole = new SystemConsole();
  private coinGoal: number = 6;
  private forceJoker: boolean = false;
  private neverUseJoker: boolean = false;
  private nextCategoryIsSport: boolean = false;
  private nextCategoryIsScience: boolean = false;
  private technoQuestion: boolean = false;
  private placesInJail: number = 0;
  private nbQuestions: number = 50;
  private numberOfWinnerToEndTheGame: number;
  private enableRestart: boolean = false;
  private forceRestart: number = 0;
  private extensionPack: boolean = false;

  withTechnoQuestions(): GameBuilder {
    this.technoQuestion = true;
    return this;
  }

  withPlayers(players: Player[]): GameBuilder {
    this.players = players;
    return this;
  }

  withFirstPlayerWithOnlyFalseAnswer(): GameBuilder {
    this.players[0].alwaysFalseAnswer = true;
    return this;
  }

  withFirstPlayerWithOnlyTrueAnswer(): GameBuilder {
    this.players[0].alwaysTrueAnswer = true;
    return this;
  }

  withFirstPlayerAlwaysGettingOut(): GameBuilder {
    this.players[0].alwaysGetOutOfPenaltyBox = true;
    return this;
  }

  withFirstPlayerAlwaysInJail(): GameBuilder {
    this.players[0].alwaysInJail = true;
    return this;
  }

  withCustomConsole(console: IConsole): GameBuilder {
    this.console = console;
    return this;
  }

  withForceJoker(): GameBuilder {
    this.forceJoker = true;
    return this;
  }

  withNeverUseJoker(): GameBuilder {
    this.neverUseJoker = true;
    return this;
  }

  withNextCategoryIsSport(): GameBuilder {
    this.nextCategoryIsSport = true;
    return this;
  }

  withNextCategoryIsScience(): GameBuilder {
    this.nextCategoryIsScience = true;
    return this;
  }

  withCoinGoal(coinGoal: number): GameBuilder {
    this.coinGoal = coinGoal;
    return this;
  }

  withOneQuestions(): GameBuilder {
    this.nbQuestions = 1;
    return this;
  }

  withPlacesInPrison(nbr: number): GameBuilder {
    this.placesInJail = nbr;
    return this;
  }

  withCustomWinner(numberOfWinnerToEndTheGame: number): GameBuilder {
    this.numberOfWinnerToEndTheGame = numberOfWinnerToEndTheGame;
    return this;
  }

  // withTechnoQuestions() {
  //   this.technoQuestion = true;
  //   return this;
  // }

  withRestart(): GameBuilder {
    this.enableRestart = true;
    return this;
  }

  withRestartForced(nb: number): GameBuilder {
    this.forceRestart = nb - 1;
    return this;
  }

  withExtensionPack(): GameBuilder {
    this.extensionPack = true;
    return this;
  }

  build(): Game {
    return new Game(
      this.console,
      this.players,
      this.technoQuestion,
      this.forceJoker,
      this.neverUseJoker,
      this.coinGoal,
      this.nextCategoryIsSport,
      this.nextCategoryIsScience,
      this.nbQuestions,
      this.placesInJail,
      this.enableRestart,
      this.forceRestart,
      this.numberOfWinnerToEndTheGame,
      this.extensionPack
    );
  }
}
