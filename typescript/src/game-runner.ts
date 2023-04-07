import {Game} from "./game";
import {GameBuilder} from "./GameBuilder";
import {Player} from "./Player";

export class GameRunner {
  public static main(game: Game): void {
    let notAWinner;
    if (game.isNumberOfPlayerValid()) {
      do {
        game.roll(Math.floor(Math.random() * 6) + 1);
        if (game.giveUp()) {
          notAWinner = game.didPlayerWin();
        } else if (!game.players[game.currentPlayer].alwaysTrueAnswer && Math.floor(Math.random() * 10) == 7 || game.players[game.currentPlayer].alwaysFalseAnswer) {
          notAWinner = game.wrongAnswer();
        } else {
          notAWinner = game.wasCorrectlyAnswered();
        }
      } while (notAWinner);
    } else {
      game.console.WriteLine(
        "The game should contain 2 players minimum and 6 players maximum"
      );
    }
  }
}

GameRunner.main(new GameBuilder().build());
