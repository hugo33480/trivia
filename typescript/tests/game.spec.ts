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
            .build()
    );
    expect(console.Content).toContain("Techno Question");
    expect(console.Content).not.toContain("Rock Question");
  });

  it("should test rock question by default", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withCustomConsole(console).build());
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
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player('Théo'), new Player('Nicolas'), new Player('Florian'), new Player('Gauthier'), new Player('Hugo')]).withCustomConsole(console).build());
    expect(console.Content).toContain("now has 6 Gold Coins.");
  });

  it("should getting out of prison", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player("blbal")]).withFirstPlayerWithOnlyFalseAnswer().withFirstPlayerAlwaysGettingOut().withCustomConsole(console).build());
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
    expect(console.Content).toContain("Nicolas wins the game");
  });


  it("should a player can use a joker if he has one left", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withCustomConsole(console).withForceJoker().build());
    expect(console.Content).toContain("uses a joker");
  });

  it("should a player cannot use a joker", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withCustomConsole(console).withNeverUseJoker().build());
    expect(console.Content).not.toContain("uses a joker");
  })

  it("should not earn a gold when player uses a joker", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withCustomConsole(console).withForceJoker().build());
    expect(console.Content).toContain("uses a joker");
    expect(console.Content).toContain("doesn't earn gold this turn");
  })

  it("should the player who goes to jail chooses the following category", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player("blbal")]).withFirstPlayerWithOnlyFalseAnswer().withNeverUseJoker().withCustomConsole(console).build());
    expect(console.Content).toContain("has chosen the next category");
  });

  it("should increment streak", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player("Théo")]).withFirstPlayerWithOnlyTrueAnswer().withCustomConsole(console).build());
    expect(console.Content).toContain("Rémi streak is now 2");
    expect(console.Content).toContain("Rémi streak is now 3");
    expect(console.Content).toContain("Rémi now has 3 Gold Coins.");
    expect(console.Content).toContain("Rémi now has 6 Gold Coins.");
  });

  it("should reset streak", function () {
    const console = new ConsoleSpy();
    GameRunner.main(new GameBuilder().withPlayers([new Player('Rémi'), new Player("Théo")]).withFirstPlayerWithOnlyFalseAnswer().withFirstPlayerAlwaysGettingOut().withCustomConsole(console).build());
    expect(console.Content).toContain("Rémi answer streak was reset to 0");
  });

  it("should set coin goal to 7", function () {
      const console = new ConsoleSpy();
      GameRunner.main(new GameBuilder().withCoinGoal(7).withCustomConsole(console).build());
      expect(console.Content).toContain("now has 7 Gold Coins.");
      expect(console.Content).toContain("wins the game");
  });

  it("should set coin goal to 5 then game not start", function () {
      const console = new ConsoleSpy();
      GameRunner.main(new GameBuilder().withCoinGoal(5).withCustomConsole(console).build());
      expect(console.Content).toContain("The coin goal must be 6 or higher");
  });
});
