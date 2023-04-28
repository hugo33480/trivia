import { GameBuilder } from "../src/GameBuilder";
import { ConsoleSpy } from "./ConsoleSpy";
import { GameRunner } from "../src/game-runner";
import { Player } from "../src/Player";

describe("The test environment", () => {
  describe("[BUG#1] A Game could have less than two players - make sure it always has at least two.", () => {
    it("should test one player stop game", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Seul")])
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "The game should contain 2 players minimum and 6 players maximum"
      );
    });
    it("should test two player and play game", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("Théo")])
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("now has 6 Gold Coins.");
    });
  });
  describe("[BUG#2] A Game could have 7 players, make it have at most 6.", () => {
    it("should test seven player stop game", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Théo"),
            new Player("Nicolas"),
            new Player("Florian"),
            new Player("Gauthier"),
            new Player("Hugo"),
            new Player("Intru"),
          ])
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "The game should contain 2 players minimum and 6 players maximum"
      );
    });
    it("should test six player and play game", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Théo"),
            new Player("Nicolas"),
            new Player("Florian"),
            new Player("Gauthier"),
            new Player("Hugo"),
          ])
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("now has 6 Gold Coins.");
    });
  });
  describe("[BUG#3] A player that gets into prison always stays there; he should be able to leave.", () => {
    it("should getting out of prison", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("blbal")])
          .withFirstPlayerWithOnlyFalseAnswer()
          .withNeverUseJoker()
          .withFirstPlayerAlwaysGettingOut()
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "[round 1] Rémi was sent to the penalty box"
      );
      expect(console.Content).toContain(
        "[round 2] Rémi is getting out of the penalty"
      );
    });
  });
  describe("[BUG#4] Questions distribution per category is not statistically fair for all players.", () => {
    it("should question proportion to be equal", function () {
      // THIS TEST TAKES A WHILE TO RUN. IT IS NOT AN INFINITE LOOP

      // ARRANGE
      const console = new ConsoleSpy();
      let res: { [key: string]: number } = {
        Pop: 0,
        Sports: 0,
        Rock: 0,
        Science: 0,
      };

      // ACT
      for (let i = 0; i < 3000; i++) {
        GameRunner.main(new GameBuilder().withCustomConsole(console).build());
        res.Pop += (console.Content.match(/The category is Pop/g) || []).length;
        res.Rock += (
          console.Content.match(/The category is Rock/g) || []
        ).length;
        res.Science += (
          console.Content.match(/The category is Science/g) || []
        ).length;
        res.Sports += (
          console.Content.match(/The category is Sports/g) || []
        ).length;
      }

      // ASSERT
      let total = res.Pop + res.Science + res.Sports + res.Rock;

      let resPop = (res.Pop / total) * 100;
      expect(resPop).toBeGreaterThan(24);
      expect(resPop).toBeLessThan(26);

      let resRock = (res.Rock / total) * 100;
      expect(resRock).toBeGreaterThan(24);
      expect(resRock).toBeLessThan(26);

      let resScience = (res.Science / total) * 100;
      expect(resScience).toBeGreaterThan(24);
      expect(resScience).toBeLessThan(26);

      let resSports = (res.Sports / total) * 100;
      expect(resSports).toBeGreaterThan(24);
      expect(resSports).toBeLessThan(26);
    });
  });
  describe("[BUG#5] The deck could run out of questions. Make it infinite.", () => {
    it("should deck category Pop being infinite", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Théo"),
            new Player("Nicolas"),
            new Player("Florian"),
            new Player("Gauthier"),
            new Player("Hugo"),
          ])
          .withCustomConsole(console)
          .withOneQuestions()
          .build()
      );

      // ASSERT
      expect(
        (console.Content.match(/Pop Question 0/g) || []).length
      ).not.toBeLessThan(1);
    });
    it("should deck category Sports being infinite", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Théo"),
            new Player("Nicolas"),
            new Player("Florian"),
            new Player("Gauthier"),
            new Player("Hugo"),
          ])
          .withCustomConsole(console)
          .withOneQuestions()
          .build()
      );

      // ASSERT
      expect(
        (console.Content.match(/Sports Question 0/g) || []).length
      ).not.toBeLessThan(1);
    });
    it("should deck category Science being infinite", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Théo"),
            new Player("Nicolas"),
            new Player("Florian"),
            new Player("Gauthier"),
            new Player("Hugo"),
          ])
          .withCustomConsole(console)
          .withOneQuestions()
          .build()
      );

      // ASSERT
      expect(
        (console.Content.match(/Science Question 0/g) || []).length
      ).not.toBeLessThan(1);
    });
  });
  describe("[FEATURE#1] Rock questions can be replaced by Techno questions before the game begins.", () => {
    it("should test techno question replaced rock questions", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ASSERT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Théo"),
            new Player("Nicolas"),
            new Player("Florian"),
            new Player("Gauthier"),
            new Player("Hugo"),
          ])
          .withTechnoQuestions()
          .withCustomConsole(console)
          .withCoinGoal(30)
          .build()
      );
      expect(console.Content).toContain("Techno Question");
      expect(console.Content).not.toContain("Rock Question");
    });
    it("should test rock question by default", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Florian"),
            new Player("Hugo"),
            new Player("Gauthier"),
            new Player("Nicolas"),
            new Player("Théo"),
          ])
          .withCustomConsole(console)
          .withCoinGoal(30)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("Rock Question");
      expect(console.Content).not.toContain("Techno Question");
    });
  });
  describe("[FEATURE#2] Every player can use one Joker per game instead of answering the question. No Gold earned.", () => {
    it("should a player can use a joker if he has one left", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Gauthier"),
            new Player("Florian"),
            new Player("Hugo"),
          ])
          .withCustomConsole(console)
          .withForceJoker()
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("[round 1] Rémi uses a joker");
    });
    it("should a player cannot use a joker", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder().withCustomConsole(console).withNeverUseJoker().build()
      );

      // ASSERT
      expect(console.Content).not.toContain("uses a joker");
    });
    it("should not earn a gold when player uses a joker", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([
            new Player("Rémi"),
            new Player("Gauthier"),
            new Player("Florian"),
            new Player("Hugo"),
          ])
          .withCustomConsole(console)
          .withForceJoker()
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "[round 1] Rémi is the current player. Has 0 gold"
      );
      expect(console.Content).toContain("[round 1] Rémi uses a joker");
      expect(console.Content).toContain(
        "[round 1] Rémi doesn't earn gold this turn. He has 0 gold"
      );
      expect(console.Content).toContain(
        "[round 2] Rémi is the current player. Has 0 gold"
      );
    });
  });
  describe("[FEATURE#3] A player can leave during the game if he doesn’t want to answer a question.", () => {
    it("should test two player and first quit game so game end", function () {
      // ARRANGE
      const console = new ConsoleSpy();
      const giveUpPlayer = new Player("Hugo");
      giveUpPlayer.giveUp = true;

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([giveUpPlayer, new Player("Nicolas")])
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("Hugo leaves the game");
      expect(console.Content).toContain("Nicolas wins");
      expect(console.Content.match(/Hugo is the current player/g).length).toBe(
        1
      );
    });
  });
  describe("[FEATURE#4] When giving X correct answers in a row, the player earns X Gold Points instead of 1.", () => {
    it("should increment streak", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("Théo")])
          .withFirstPlayerWithOnlyTrueAnswer()
          .withNeverUseJoker()
          .withCustomConsole(console)
          .withCoinGoal(15)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("[round 2] Rémi streak is now 2");
      expect(console.Content).toContain("[round 3] Rémi streak is now 3");
      expect(console.Content).toContain("[round 2] Rémi now has 3 Gold Coins.");
      expect(console.Content).toContain("[round 3] Rémi now has 6 Gold Coins.");
    });
    it("should reset streak", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("Théo")])
          .withFirstPlayerWithOnlyFalseAnswer()
          .withFirstPlayerAlwaysGettingOut()
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("Rémi answer streak was reset to 0");
    });
  });
  describe("[FEATURE#5] Before going to prison, a losing player decides which category the next one will answer.", () => {
    it("if the player who goes to jail chooses the following category which will be : Sports", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("Constantin")])
          .withFirstPlayerWithOnlyFalseAnswer()
          .withNeverUseJoker()
          .withNextCategoryIsSport()
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "[round 1] Rémi has chosen the next category which is : Sports"
      );
      expect(console.Content).toContain(
        "[round 1] Constantin is the current player."
      );
      expect(console.Content).toContain("[round 1] Sports Question");
    });
    it("if the player who goes to jail chooses the following category which will be : Science", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("Constantin")])
          .withFirstPlayerWithOnlyFalseAnswer()
          .withNeverUseJoker()
          .withNextCategoryIsScience()
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "[round 1] Rémi has chosen the next category which is : Science"
      );
      expect(console.Content).toContain(
        "[round 1] Constantin is the current player."
      );
      expect(console.Content).toContain("[round 1] Science Question");
    });
  });
  describe("[FEATURE#6] Number of Gold required to win can be parameterized before the game. Minimal value : 6.", () => {
    it("should set coin goal to 7", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("Constantin")])
          .withFirstPlayerWithOnlyTrueAnswer()
          .withNeverUseJoker()
          .withCoinGoal(7)
          .withCustomConsole(console)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("Rémi now has 7 Gold Coins.");
      expect(console.Content).toContain("Rémi wins and leaves the game");
    });
    it("should set coin goal to 5 then game not start", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder().withCoinGoal(5).withCustomConsole(console).build()
      );

      // ASSERT
      expect(console.Content).toContain("The coin goal must be 6 or higher");
    });
  });
  describe("[FEATURE#7] Chances that a player gets out of prison must be 1/X where X is the times he got in prison.", () => {
    it("should the player go to jail each turn and have less chance to get out each time", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("blbal")])
          .withFirstPlayerWithOnlyFalseAnswer()
          .withNeverUseJoker()
          .withCustomConsole(console)
          .withCoinGoal(15)
          .build()
      );

      // ASSERT
      expect(
        console.Content.match(
          /Rémi's visit to jail : 1, he has now 1 chance on 1 to get out next turn/g
        ).length
      ).toBe(1);
      expect(console.Content).toContain(
        "Rémi is getting out of the penalty box"
      );
      expect(
        console.Content.match(
          /Rémi's visit to jail : 2, he has now 1 chance on 2 to get out next turn/g
        ).length
      ).toBe(1);
    });
  });
  describe("[FEATURE#8] The winner doesn’t stop the game. It continues with remaining players until a leaderbord of three players is completed.", () => {
    it("should the first winner does not end the game. It takes 3 winners to finish the game", function () {
      // ARRANGE
      const console = new ConsoleSpy();
      const winners = ["Rémi", "Nicolas", "Florian"].map((name) => {
        const player = new Player(name);
        player.alwaysTrueAnswer = true;
        return player;
      });
      const losers = ["Pat", "Sue", "Chet"].map((name) => {
        const player = new Player(name);
        player.alwaysFalseAnswer = true;
        return player;
      });

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([...winners, ...losers])
          .withCustomConsole(console)
          .withNeverUseJoker()
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("Rémi wins and leaves the game.");
      expect(console.Content).toContain(
        "1 out of 3 winners. The game continues."
      );
      expect(console.Content).toContain("Nicolas wins and leaves the game.");
      expect(console.Content).toContain(
        "2 out of 3 winners. The game continues."
      );
      expect(console.Content).toContain("Florian wins and leaves the game.");
      expect(console.Content).toContain("3 players are wins. End of the game");
    });
  });
  describe("[FEATURE#9] Every turn spent in prison increases the chances that the player goes out by 10%.", () => {
    it("should the player go to jail each turn and have less chance to get out each time", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([new Player("Rémi"), new Player("blbal")])
          .withFirstPlayerAlwaysInJail()
          .withFirstPlayerWithOnlyFalseAnswer()
          .withNeverUseJoker()
          .withCustomConsole(console)
          .withCoinGoal(15)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "Rémi is not getting out of the penalty box, it's chance to get out are now 0.6 on 1"
      );
      expect(console.Content).toContain(
        "Rémi is not getting out of the penalty box, it's chance to get out are now 0.7 on 1"
      );
    });
  });
  describe("[FEATURE#10] Any game can be replayed with the same parameters and players.", () => {
    it("should game restart once", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withCustomConsole(console)
          .withCoinGoal(15)
          .withRestartForced(1)
          .build()
      );

      // ASSERT
      expect(
        (console.Content.match(/Une nouvelle partie commence/g) || []).length
      ).toBe(1);
    });
    it("should game restart two times", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withCustomConsole(console)
          .withCoinGoal(15)
          .withRestartForced(2)
          .build()
      );

      // ASSERT
      expect(
        (console.Content.match(/Une nouvelle partie commence/g) || []).length
      ).toBe(2);
    });
    it("should game restart three times", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withCustomConsole(console)
          .withCoinGoal(15)
          .withRestartForced(3)
          .build()
      );

      // ASSERT
      expect(
        (console.Content.match(/Une nouvelle partie commence/g) || []).length
      ).toBe(3);
    });
  });
  describe("[FEATURE#11] Number of cells in prison is now configurable. Zero means infinite cells. When no cells are left, the newest prisoner replaces the oldest, who is freed.", () => {
    it("check maximum size of penalty box (3)", function () {
      // ARRANGE
      const console = new ConsoleSpy();
      const players = ["Rémi", "Théo", "Nicolas", "Florian"].map((name) => {
        const player = new Player(name);
        player.alwaysInJail = true;
        player.alwaysFalseAnswer = true;
        return player;
      });
      const winner = new Player("winner");

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([winner, ...players])
          .withFirstPlayerWithOnlyTrueAnswer()
          .withCustomConsole(console)
          .withNeverUseJoker()
          .withPlacesInPrison(3)
          .withCustomWinner(1)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "[round 1] Rémi's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Théo's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Nicolas's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Florian's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Rémi is getting out of penalty box because penalty box is full"
      );
      expect(console.Content).not.toContain(
        "[round 2] Rémi is getting out of the penalty box"
      );
      expect(console.Content).not.toContain(
        "[round 2] Rémi is not getting out of the penalty box"
      );
    });
    it("check size of penalty box infinite", function () {
      // ARRANGE
      const console = new ConsoleSpy();
      const players = ["Rémi", "Théo", "Nicolas", "Florian", "Gauthier"].map(
        (name) => {
          const player = new Player(name);
          player.alwaysInJail = true;
          player.alwaysFalseAnswer = true;
          return player;
        }
      );
      const winner = new Player("winner");

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withPlayers([winner, ...players])
          .withFirstPlayerWithOnlyTrueAnswer()
          .withCustomConsole(console)
          .withNeverUseJoker()
          .withCustomWinner(1)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain(
        "[round 1] Rémi's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Théo's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Nicolas's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Florian's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).toContain(
        "[round 1] Gauthier's visit to jail : 1, he has now 1 chance on 1 to get out next turn"
      );
      expect(console.Content).not.toContain(
        "[round 1] Rémi is getting out of penalty box because penalty box is full"
      );
      expect(console.Content).toContain(
        "[round 2] Rémi is getting out of the penalty box"
      );
      expect(console.Content).toContain(
        "[round 2] Théo is getting out of the penalty box"
      );
      expect(console.Content).toContain(
        "[round 2] Nicolas is getting out of the penalty box"
      );
      expect(console.Content).toContain(
        "[round 2] Florian is getting out of the penalty box"
      );
      expect(console.Content).toContain(
        "[round 2] Gauthier is getting out of the penalty box"
      );
    });
  });
  describe("[FEATURE#12] Expansion pack. Subjects available are now : Rock, Pop, Rap, Techno, Science, Sports, Philosophy, Litterature, Geography and People.", () => {
    it("should check all category have an occurence", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder()
          .withCustomConsole(console)
          .withExtensionPack()
          .withCoinGoal(100)
          .build()
      );

      // ASSERT
      expect(console.Content).toContain("The category is Rock");
      expect(console.Content).toContain("The category is Pop");
      expect(console.Content).toContain("The category is Science");
      expect(console.Content).toContain("The category is Sports");
      expect(console.Content).toContain("The category is Techno");
      expect(console.Content).toContain("The category is Rap");
      expect(console.Content).toContain("The category is Philosophy");
      expect(console.Content).toContain("The category is Litterature");
      expect(console.Content).toContain("The category is Geography");
      expect(console.Content).toContain("The category is People");
    });
    it("should check there is no extension category question without extension pack", function () {
      // ARRANGE
      const console = new ConsoleSpy();

      // ACT
      GameRunner.main(
        new GameBuilder().withCustomConsole(console).withCoinGoal(100).build()
      );

      // ASSERT
      expect(console.Content).toContain("The category is Rock");
      expect(console.Content).toContain("The category is Pop");
      expect(console.Content).toContain("The category is Science");
      expect(console.Content).toContain("The category is Sports");
      expect(console.Content).not.toContain("The category is Rap");
      expect(console.Content).not.toContain("The category is Philosophy");
      expect(console.Content).not.toContain("The category is Litterature");
      expect(console.Content).not.toContain("The category is Geography");
      expect(console.Content).not.toContain("The category is People");
      expect(console.Content).not.toContain("The category is Techno");
    });
  });
});
