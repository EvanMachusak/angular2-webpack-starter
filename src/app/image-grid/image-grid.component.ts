import { Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.css']
})

export class ImageGridComponent implements OnChanges {

  @Input() public imageSet: number;
  @Output() public rightAnswer: EventEmitter<void> = new EventEmitter<void>();
  @Output() public wrongAnswer: EventEmitter<void> = new EventEmitter<void>();

  // I wanted to use http to fetch images, but the CORS policy rejects ajax requests =/
  public urls: string[] = [];
  public correctImage: number = undefined;

  private majorityUrl: string = undefined;
  private minorityUrl: string = undefined;

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    let imageSetChange = changes.imageSet;
    let newImageSet = imageSetChange.currentValue;
    this.imageSetChanged(newImageSet);
  }

  public select(event: Event) {
    let img: any = event.srcElement;
    let src = img.src;
    if (src === this.minorityUrl) {
      this.rightAnswer.emit();
    }
    else {
      this.wrongAnswer.emit();
    }
  }

  private imageSetChanged(newImageSet: number) {
    let imageSetFormatted: string = this.pad(newImageSet, 2);
    let urlA = `https://s3-us-west-2.amazonaws.com/fugue-code-tests/fe-image-test/${imageSetFormatted}-a.jpg`;
    let urlB = `https://s3-us-west-2.amazonaws.com/fugue-code-tests/fe-image-test/${imageSetFormatted}-b.jpg`;

    if (Math.random() * 2 > 1) {
      this.majorityUrl = urlA;
      this.minorityUrl = urlB;
    }
    else {
      this.majorityUrl = urlB;
      this.minorityUrl = urlA;
    }
    this.urls = [];
    for (let i = 0; i < 4; ++i) {
      this.urls.push(this.majorityUrl);
    }
    let oddManOut = Math.floor(Math.random() * 4);
    this.correctImage = oddManOut + 1;
    this.urls[oddManOut] = this.minorityUrl;
  }

  private pad(value: number, fixed: number): string {
    let s = String(value);
    while (s.length < (fixed || 2)) { s = '0' + s; }
    return s;
  }
}
