import {Game} from "./game";
import {GameBuilder} from "./GameBuilder";
import {Player} from "./Player";

export class GameRunner {
  public static main(game: Game): void {
    let notAWinner;
    if (game.isNumberOfPlayerValid() && game.isCoinGoalValid()) {
      do {
        game.roll(Math.floor(Math.random() * 6) + 1);

        if (game.giveUp()) {
          notAWinner = game.didPlayerWin();
        } else if (Math.floor(Math.random() * 10) == 7 || game.players[game.currentPlayer].alwaysFalseAnswer) {
          notAWinner = game.wrongAnswer();
        } else {
          notAWinner = game.wasCorrectlyAnswered();
        }
      } while (notAWinner);
    }
  }
}

GameRunner.main(new GameBuilder().build());
