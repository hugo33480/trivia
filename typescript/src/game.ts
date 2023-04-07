import {IConsole} from "./IConsole";

export class Game {
    private players: Array<string> = [];
    private places: Array<number> = [];
    private purses: Array<number> = [];
    private inPenaltyBox: Array<boolean> = [];
    private currentPlayer: number = 0;
    private isGettingOutOfPenaltyBox: boolean = false;
    private _console: IConsole;

    private popQuestions: Array<string> = [];
    private scienceQuestions: Array<string> = [];
    private sportsQuestions: Array<string> = [];
    private rockOrTechnoQuestions: Array<string> = [];


    constructor(console: IConsole, techno: boolean) {
        this._console = console;
        for (let i = 0; i < 50; i++) {
            this.popQuestions.push("Pop Question " + i);
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockOrTechnoQuestions.push(this.createRockOrTechnoQuestion(i, techno));
          }
    }

    private createRockOrTechnoQuestion(index: number, techno: boolean): string {
        return(techno ?  "Techno Question " : "Rock Question ") + index ;
    }

    public add(name: string): boolean {
        this.players.push(name);
        this.places[this.howManyPlayers()] = 0;
        this.purses[this.howManyPlayers()] = 0;
        this.inPenaltyBox[this.howManyPlayers()] = false;

        this._console.WriteLine(name + " was added");
        this._console.WriteLine("They are player number " + this.players.length);

        return true;
    }

    private howManyPlayers(): number {
        return this.players.length;
    }

    public roll(roll: number) {
        this._console.WriteLine(this.players[this.currentPlayer] + " is the current player");
        this._console.WriteLine("They have rolled a " + roll);
    
        if (this.inPenaltyBox[this.currentPlayer]) {
          if (roll % 2 != 0) {
            this.isGettingOutOfPenaltyBox = true;
    
            this._console.WriteLine(this.players[this.currentPlayer] + " is getting out of the penalty box");
            this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
            if (this.places[this.currentPlayer] > 11) {
              this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
            }
    
            this._console.WriteLine(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
            this._console.WriteLine("The category is " + this.currentCategory());
            this.askQuestion();
          } else {
            this._console.WriteLine(this.players[this.currentPlayer] + " is not getting out of the penalty box");
            this.isGettingOutOfPenaltyBox = false;
          }
        } else {
    
          this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
          if (this.places[this.currentPlayer] > 11) {
            this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
          }
    
          this._console.WriteLine(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
          this._console.WriteLine("The category is " + this.currentCategory());
          this.askQuestion();
        }
    }

    private askQuestion(): void {
        if (this.currentCategory() == 'Pop')
            this._console.WriteLine(this.popQuestions.shift());
        if (this.currentCategory() == 'Science')
            this._console.WriteLine(this.scienceQuestions.shift());
        if (this.currentCategory() == 'Sports')
            this._console.WriteLine(this.sportsQuestions.shift());
        if (this.currentCategory() == 'Rock')
            this._console.WriteLine(this.rockOrTechnoQuestions.shift());
    }

    private currentCategory(): string {
        if (this.places[this.currentPlayer] == 0)
            return 'Pop';
        if (this.places[this.currentPlayer] == 4)
            return 'Pop';
        if (this.places[this.currentPlayer] == 8)
            return 'Pop';
        if (this.places[this.currentPlayer] == 1)
            return 'Science';
        if (this.places[this.currentPlayer] == 5)
            return 'Science';
        if (this.places[this.currentPlayer] == 9)
            return 'Science';
        if (this.places[this.currentPlayer] == 2)
            return 'Sports';
        if (this.places[this.currentPlayer] == 6)
            return 'Sports';
        if (this.places[this.currentPlayer] == 10)
            return 'Sports';
        return 'Rock';
    }

    private didPlayerWin(): boolean {
        return !(this.purses[this.currentPlayer] == 6)
    }

    public wrongAnswer(): boolean {
        this._console.WriteLine('Question was incorrectly answered');
        this._console.WriteLine(this.players[this.currentPlayer] + " was sent to the penalty box");
        this.inPenaltyBox[this.currentPlayer] = true;
    
        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
        return true;
    }

    public wasCorrectlyAnswered(): boolean {
        if (this.inPenaltyBox[this.currentPlayer]) {
            if (this.isGettingOutOfPenaltyBox) {
              this._console.WriteLine('Answer was correct!!!!');
              this.purses[this.currentPlayer] += 1;
              this._console.WriteLine(this.players[this.currentPlayer] + " now has " +
              this.purses[this.currentPlayer] + " Gold Coins.");
      
              var winner = this.didPlayerWin();
              this.currentPlayer += 1;
              if (this.currentPlayer == this.players.length)
                this.currentPlayer = 0;
      
              return winner;
            } else {
              this.currentPlayer += 1;
              if (this.currentPlayer == this.players.length)
                this.currentPlayer = 0;
              return true;
            }
      
      
          } else {
      
            this._console.WriteLine("Answer was corrent!!!!");
      
            this.purses[this.currentPlayer] += 1;
            this._console.WriteLine(this.players[this.currentPlayer] + " now has " +
                this.purses[this.currentPlayer] + " Gold Coins.");
      
            var winner = this.didPlayerWin();
      
            this.currentPlayer += 1;
            if (this.currentPlayer == this.players.length)
                this.currentPlayer = 0;
      
            return winner;
          }
    }

}
