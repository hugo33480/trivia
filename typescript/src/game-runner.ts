import {Game} from "./game";
import {GameBuilder} from "./GameBuilder";
import {Player} from "./Player";

export class GameRunner {
  public static main(game: Game): void {
    let notAWinner;
    let nb_round = 1;
    let nb_players = game.players.length
    let how_many_players_have_play_this_round = 0
    if (game.isNumberOfPlayerValid() && game.isCoinGoalValid()) {
      do {
        how_many_players_have_play_this_round += 1
        game.roll(Math.floor(Math.random() * 6) + 1, nb_round);
        if (game.giveUp()) {
          notAWinner = game.didPlayerWin();
        } else if (!game.players[game.currentPlayer].alwaysTrueAnswer && Math.floor(Math.random() * 10) == 7 || game.players[game.currentPlayer].alwaysFalseAnswer) {
          notAWinner = game.wrongAnswer();
        } else {
          notAWinner = game.wasCorrectlyAnswered();
        }
        if( how_many_players_have_play_this_round === nb_players) {
          how_many_players_have_play_this_round = 0
          nb_round += 1
        }
      } while (notAWinner);
    }
  }
}

GameRunner.main(new GameBuilder().build());
