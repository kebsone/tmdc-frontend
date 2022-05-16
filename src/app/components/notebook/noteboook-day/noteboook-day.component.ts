import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NoteBookEvent } from '../notebook.component';

@Component({
    selector: 'tm-noteboook-day',
    templateUrl: './noteboook-day.component.html',
    styleUrls: ['./noteboook-day.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteboookDayComponent implements OnInit {
    @Input()
    currentDay: any;

    @Input()
    currentNotebook: NoteBookEvent;
    constructor() {}

    ngOnInit(): void {
        console.log(this.currentNotebook);
    }
}
