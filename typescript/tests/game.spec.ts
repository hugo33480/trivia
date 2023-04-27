import {GameBuilder} from "../src/GameBuilder";
import {ConsoleSpy} from "./ConsoleSpy";
import {GameRunner} from "../src/game-runner";
import {Player} from "../src/Player";

describe("The test environment", () => {
  it("should test techno question", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
        new GameBuilder()
            .withPlayers([
              new Player("Rémi"),
              new Player("Théo"),
              new Player("Nicolas"),
              new Player("Florian"),
              new Player("Gauthier"),
              new Player("Hugo")
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
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder().withCustomConsole(console).withCoinGoal(15).build()
    );
    expect(console.Content).toContain("Rock Question");
    expect(console.Content).not.toContain("Techno Question");
  });

  it("should test one player stop game", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder()
        .withPlayers([new Player("Seul")])
        .withCustomConsole(console)
        .build()
    );
    expect(console.Content).toContain(
      "The game should contain 2 players minimum and 6 players maximum"
    );
  });

  it("should test seven player stop game", function () {
    const console = new ConsoleSpy();
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
    expect(console.Content).toContain(
      "The game should contain 2 players minimum and 6 players maximum"
    );
  });

  it("should test two player and play game", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder()
        .withPlayers([new Player("Rémi"), new Player("Théo")])
        .withCustomConsole(console)
        .build()
    );
    expect(console.Content).toContain("now has 6 Gold Coins.");
  });

  it("should test six player and play game", function () {
    const console = new ConsoleSpy();
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
    expect(console.Content).toContain("now has 6 Gold Coins.");
  });

  it("should getting out of prison", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder()
        .withPlayers([new Player("Rémi"), new Player("blbal")])
        .withFirstPlayerWithOnlyFalseAnswer()
        .withFirstPlayerAlwaysGettingOut()
        .withCustomConsole(console)
        .build()
    );
    expect(console.Content).toContain("is getting out of the penalty");
  });

  it("should test two player and first quit game so game end", function () {
    const console = new ConsoleSpy();
    const giveUpPlayer = new Player("Hugo");
    giveUpPlayer.giveUp = true;
    GameRunner.main(
      new GameBuilder()
        .withPlayers([giveUpPlayer, new Player("Nicolas")])
        .withCustomConsole(console)
        .build()
    );
    expect(console.Content).toContain("Hugo leaves the game");
    expect(console.Content).toContain("Nicolas wins");
    expect(console.Content.match(/Hugo is the current player/g).length).toBe(1);
  });

  it("should a player can use a joker if he has one left", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder().withCustomConsole(console).withForceJoker().build()
    );
    expect(console.Content).toContain("uses a joker");
  });

  it("should a player cannot use a joker", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder().withCustomConsole(console).withNeverUseJoker().build()
    );
    expect(console.Content).not.toContain("uses a joker");
  });

  it("should not earn a gold when player uses a joker", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder().withCustomConsole(console).withForceJoker().build()
    );
    expect(console.Content).toContain("[round 1] Pat is the current player. Has 0 gold");
    expect(console.Content).toContain("[round 1] Pat uses a joker");
    expect(console.Content).toContain(
      "[round 1] Pat doesn't earn gold this turn. He has 0 gold"
    );
  });

  it("if the player who goes to jail chooses the following category which will be : Sports", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder()
        .withPlayers([new Player("Rémi"), new Player("Constantin")])
        .withFirstPlayerWithOnlyFalseAnswer()
        .withNeverUseJoker()
        .withNextCategoryIsSport()
        .withCustomConsole(console)
        .build()
    );
    expect(console.Content).toContain(
      "[round 1] Rémi has chosen the next category which is : Sports"
    );
    expect(console.Content).toContain(
      "[round 1] Constantin is the current player."
    );
    expect(console.Content).toContain("[round 1] Sports Question");
  });

  it("if the player who goes to jail chooses the following category which will be : Science", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player("Constantin")]).withFirstPlayerWithOnlyFalseAnswer().withNeverUseJoker().withNextCategoryIsScience().withCustomConsole(console).build());
    expect(console.Content).toContain("[round 1] Rémi has chosen the next category which is : Science");
    expect(console.Content).toContain("[round 1] Constantin is the current player.");
    expect(console.Content).toContain("[round 1] Science Question");
  });

  it("should increment streak", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder()
        .withPlayers([new Player("Rémi"), new Player("Théo")])
        .withFirstPlayerWithOnlyTrueAnswer()
        .withCustomConsole(console)
        .withCoinGoal(7)
        .build()
    );
    expect(console.Content).toContain("Rémi streak is now 2");
    expect(console.Content).toContain("Rémi streak is now 3");
    expect(console.Content).toContain("Rémi now has 3 Gold Coins.");
    expect(console.Content).toContain("Rémi now has 6 Gold Coins.");
  });

  it("should reset streak", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder()
        .withPlayers([new Player("Rémi"), new Player("Théo")])
        .withFirstPlayerWithOnlyFalseAnswer()
        .withFirstPlayerAlwaysGettingOut()
        .withCustomConsole(console)
        .build()
    );
    expect(console.Content).toContain("Rémi answer streak was reset to 0");
  });

  it("should set coin goal to 7", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder().withCoinGoal(7).withCustomConsole(console).build()
    );
    expect(console.Content).toContain("now has 7 Gold Coins.");
    expect(console.Content).toContain("wins and leaves the game");
  });

  it("should set coin goal to 5 then game not start", function () {
    const console = new ConsoleSpy();
    GameRunner.main(
      new GameBuilder().withCoinGoal(5).withCustomConsole(console).build()
    );
    expect(console.Content).toContain("The coin goal must be 6 or higher");
  });

  it("should deck category Pop being infinite", function () {
    const console = new ConsoleSpy();
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
    expect(
      (console.Content.match(/Pop Question 0/g) || []).length
    ).not.toBeLessThan(1);
  });

  it("should deck category Sports being infinite", function () {
    const console = new ConsoleSpy();
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
    expect(
      (console.Content.match(/Sports Question 0/g) || []).length
    ).not.toBeLessThan(1);
  });

  it("should deck category Science being infinite", function () {
    const console = new ConsoleSpy();
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
    expect(
      (console.Content.match(/Science Question 0/g) || []).length
    ).not.toBeLessThan(1);
  });

  it("should the player go to jail each turn and have less chance to get out each time", function () {
    const console = new ConsoleSpy();
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
    expect(console.Content).toContain(
      "Rémi is not getting out of the penalty box, it's chance to get out are now 0.6 on 1"
    );
    expect(console.Content).toContain(
      "Rémi is not getting out of the penalty box, it's chance to get out are now 0.7 on 1"
    );
  });

  it("should the player go to jail each turn and have less chance to get out each time", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player("blbal")]).withFirstPlayerWithOnlyFalseAnswer().withNeverUseJoker().withCustomConsole(console).withCoinGoal(15).build());
    expect(console.Content.match(/Rémi's visit to jail : 1, he has now 1 chance on 1 to get out next turn/g).length).toBe(1)
    expect(console.Content).toContain("Rémi is getting out of the penalty box");
    expect(console.Content.match(/Rémi's visit to jail : 2, he has now 1 chance on 2 to get out next turn/g).length).toBe(1)


  });

  it("check maximum size of penalty box (3)", function () {
    const console = new ConsoleSpy();
    const players = ["Rémi","Théo","Nicolas", "Florian"].map((name)=>
        {
          const player =  new Player(name);
          player.alwaysInJail = true;
          player.alwaysFalseAnswer = true;
          return player
        }
    )
    const winner = new Player("winner");

    GameRunner.main(new GameBuilder().withPlayers([winner, ...players]).withFirstPlayerWithOnlyTrueAnswer().withCustomConsole(console).withNeverUseJoker().withPlacesInPrison(3).withCustomWinner(1).build());
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
    const console = new ConsoleSpy();
    const players = ["Rémi","Théo","Nicolas", "Florian", "Gauthier"].map((name)=>
        {
          const player =  new Player(name);
          player.alwaysInJail = true;
          player.alwaysFalseAnswer = true;
          return player
        }
    )

    const winner = new Player("winner");

    GameRunner.main(new GameBuilder().withPlayers([winner, ...players]).withFirstPlayerWithOnlyTrueAnswer().withCustomConsole(console).withNeverUseJoker().withCustomWinner(1).build());
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

  it("should the first winner does not end the game. It takes 3 winners to finish the game", function () {
    const console = new ConsoleSpy();

    const winners = ["Rémi", "Nicolas", "Florian"].map((name)=>
      {
        const player = new Player(name);
        player.alwaysTrueAnswer = true;
        return player
      }
    );

    const losers = ["Pat", "Sue", "Chet"].map((name)=>
      {
        const player = new Player(name);
        player.alwaysFalseAnswer = true;
        return player
      }
    )

    GameRunner.main(new GameBuilder().withPlayers([...winners, ...losers]).withCustomConsole(console).withNeverUseJoker().build());

    expect(console.Content).toContain(
        "Rémi wins and leaves the game."
    );
    expect(console.Content).toContain(
        "1 out of 3 winners. The game continues."
    );
    expect(console.Content).toContain(
        "Nicolas wins and leaves the game."
    );
    expect(console.Content).toContain(
      "2 out of 3 winners. The game continues."
    );
    expect(console.Content).toContain(
        "Florian wins and leaves the game."
    );
    expect(console.Content).toContain(
      "3 players are wins. End of the game"
    );
  });
});
