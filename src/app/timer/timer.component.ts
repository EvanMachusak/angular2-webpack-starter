import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  @Input() public timeout: number = 0;
  @Output() public timesUp: EventEmitter<number> = new EventEmitter();

  public get elapsed() { return this._elapsed; }
  public get started() { return this._started; }

  private _elapsed: number = 0;
  private _started = false;
  private _timerId: any = undefined;

  public ngOnInit(): void {
    this.start();
  }

  public start(): void {
    this.stop();
    this._elapsed = 0;
    this._started = true;
    this.tick();
  }
  public stop(): void {
    let started = this._started;
    let timerId = this._timerId;
    if (started && timerId) {
      window.clearTimeout(timerId);
      this._started = false;
      this._timerId = undefined;
    }
  }
  private tick: ()=>void = () => {
    this._timerId = window.setTimeout(() => {
      if (this._started) {
        this._elapsed += 1;
        if (this._elapsed >= this.timeout) {
          this.timesUp.emit(this._elapsed);
        }
        else {
        this.tick();
        }
      }
    }, 1000);
  }


}
