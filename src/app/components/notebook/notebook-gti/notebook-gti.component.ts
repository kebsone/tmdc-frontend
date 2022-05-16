import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { NoteBookEvent } from '../notebook.component';
import * as moment from 'moment';
import { Msn } from '../../planner/shared/msn.model';
import { map } from 'rxjs/operators';
export interface NotebookGti {
    line: string;
    ata: number;
    test;
}

export interface DailyCommunication {
    date?: string;
    dayTime?: string;
    type?: string;
    msn?: string;
    competenceLine?: string;
    ataNumber?: string;
    gtiRti?: string;
    cdo?: string;
    status?: string;
    information?: string;
    repairStatus?: string;
    attachedFiles?: any;
}
@Component({
    selector: 'tm-notebook-gti',
    templateUrl: './notebook-gti.html',
    styleUrls: ['./notebook-gti.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotebookGtiComponent implements OnInit {
    @Input()
    index: number;
    @Input()
    disablePrev: boolean;
    @Input()
    disableNext: boolean;
    @Input()
    currentNotebook: NoteBookEvent;

    @Input()
    dayTime: string;
    uploadedFiles: any[] = [];
    @Input()
    currentDay: any;
    @Output() currentIndex: EventEmitter<number> = new EventEmitter();
    addDailyCommunication: boolean;
    dailyCommunication: DailyCommunication;
    selectedFiles: File[];
    submitted: boolean;
    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        console.log(this.currentNotebook);
    }

    openNext() {
        this.index++;
        this.currentIndex.emit(this.index);
        this.dailyCommunication = {};
    }

    openPrev() {
        this.index--;
        this.currentIndex.emit(this.index);
    }
    onFileSelected(event: any) {
        this.selectedFiles = [...event.target.files];
        this.dailyCommunication = { ...this.dailyCommunication, attachedFiles: [...(this.dailyCommunication.attachedFiles || []), ...this.selectedFiles] };
        console.log(this.dailyCommunication, event, 'dans le upload');
    }

    addDailyCom() {
        this.addDailyCommunication = true;
        this.dailyCommunication = {
            date: moment(new Date()).format('YYYY-DD-MM'),
            msn: this.currentNotebook.msn.msnNumber,
            dayTime: this.dayTime,
            type: 'gti',
            status: 'ec',
            repairStatus: 'N/A',
            attachedFiles: [{ name: 'mon-image.jpg', type: 'image/jpeg', size: 122225 }]
        };
    }

    onSaveDailyCom() {
        console.log('herer');
        this.submitted = true;
    }

    onCancelDailyCom() {
        this.addDailyCommunication = false;
    }
}
