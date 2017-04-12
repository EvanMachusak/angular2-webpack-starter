import {
  Component,
  Output,
  OnInit,
  ViewChild
} from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { AppState } from '../app.service';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public get timeAllowed(): number { return 30; }
  public get highScore(): number { return this._highScore; }
  public get isHighScore(): boolean { return this.totalScore > this.highScore; }
  public get totalScore(): number { return this._totalScore; }
  public get round(): number { return this._round + 1; }
  public get gameOver(): boolean { return this._round >= this._totalRounds }

  @Output() public get imageSet(): number {
    return this._imagesChosen[this._round];
  }
  @ViewChild(TimerComponent) public timer: TimerComponent;


  private readonly _totalRounds = 5;
  private readonly _numberOfImageSets = 10;

  private _totalScore = 0;
  private _highScore = 0;
  
  private _round = 0;
  private readonly _imagesChosen: number[] = [];

  public ngOnInit(): void {
    // These are constants but it protects against an inevitable infinite do while
    if (this._totalRounds > this._numberOfImageSets) {
      throw new Error(`There are more rounds (${this._totalRounds})` +
        ` than image sets available (${this._numberOfImageSets}).  This is not allowed.`);
    }
    let randomCeiling = this._numberOfImageSets;
    let imagesChosen = this._imagesChosen;
    let index: number = -1;
    for (let i = 0; i < this._totalRounds; ++i) {
      do {
        index = Math.floor(Math.random() * randomCeiling)
      }
      while (imagesChosen.indexOf(index) >= 0)
      imagesChosen.push(index);
    }
  }

  public rightAnswer(): void {
    this.newRound(Math.floor(this.timeAllowed - this.timer.elapsed));
  }
  public wrongAnswer(): void {
    this.newRound(0);
  }

  public newGame(): void {
    this._round = 0;
    this._totalScore = 0;
    this.timer.start();
  }

  private newRound(score: number): void {
    this._totalScore += score;
    this._round += 1;
    if (!this.gameOver) {
      this.timer.start();
    }
    else if (this._totalScore > this._highScore) {
      this._highScore = this._totalScore;
    }
  }

  

}
