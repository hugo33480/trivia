import { Game } from "./game";
import { GameBuilder } from "./GameBuilder";
import { Player } from "./Player";
import {IConsole} from "./IConsole";
import {SystemConsole} from "./SystemConsole";
import {IReturnsTheObjectOfTheGame} from "./IReturnsTheObjectOfTheGame";

export class GameRunner {
  public static main(game: Game): void {
    let gameReturns: IReturnsTheObjectOfTheGame;
    let nb_round = 1;
    let nb_players = game.players.length
    let how_many_players_have_play_this_round = 0
    let winners: string[] = [];
    const _console: IConsole = new SystemConsole();
    if (game.isNumberOfPlayerValid() && game.isCoinGoalValid()) {
      do {
        how_many_players_have_play_this_round += 1
        game.roll(Math.floor(Math.random() * 6) + 1, nb_round);
        if (game.giveUp(nb_round)) {
          gameReturns = game.didPlayerWin(nb_round);
          if (gameReturns.winnerName) {
            winners.push(gameReturns.winnerName);
          }
        } else if (game.players[game.currentPlayer].inPenaltyBox) {
          game.nextPlayer();
          gameReturns.isGameEnd = false;
        } else if (
          (!game.players[game.currentPlayer].alwaysTrueAnswer &&
            Math.floor(Math.random() * 10) == 7) ||
          game.players[game.currentPlayer].alwaysFalseAnswer
        ) {
          gameReturns = game.wrongAnswer(nb_round);
        } else {
          gameReturns = game.wasCorrectlyAnswered(nb_round);
          if (gameReturns.winnerName) {
            winners.push(gameReturns.winnerName);
          }
        }
        if( how_many_players_have_play_this_round === nb_players) {
          how_many_players_have_play_this_round = 0
          nb_round += 1
        }
      } while (!gameReturns.isGameEnd);
      _console.WriteLine("Endgame. Winners : " + winners.join(" "));
    }
  }
}

GameRunner.main(new GameBuilder().withCoinGoal(15).build());
