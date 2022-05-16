import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import * as TmdcUtils from '../../shared/tmdc-utils';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { Program } from 'src/app/shared/model/program.model';
import { ProductionSite } from 'src/app/shared/model/site.model';
import { elementMatches } from '@fullcalendar/core';
export interface NoteBookEvent {
    position: string;
    weekNumber: number;
    from: string;
    to: string;
    msn: any;
    poste: string;
    selected: boolean;
}

@Component({
    selector: 'tm-notebook',
    templateUrl: './notebook.component.html',
    styleUrls: ['./notebook.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotebookComponent implements OnInit {
    id: Observable<string>;
    index: number = 0;
    currentMsn: any;
    notebook: NoteBookEvent[];
    TmdcUtils = TmdcUtils;
    currentSite: ProductionSite;
    currentProgram: Program;
    alldays: any;
    selectedNotebook: NoteBookEvent;
    private _subs$: Subscription = new Subscription();
    constructor(private route: ActivatedRoute, private dataSharingService: DataSharingService, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        console.log(this.route.snapshot.data.notebookData);
        this.currentMsn = this.route.snapshot.data.notebookData;
        this._subs$.add(
            this.dataSharingService.getCurrentSite().subscribe((val) => {
                this.currentSite = val;
            })
        );
        this._subs$.add(
            this.dataSharingService.getCureentProgram().subscribe((val) => {
                this.currentProgram = val;
            })
        );
        this.id = this.route.params.pipe(map((r) => r.id));
        this.notebook = this._buildNotebookEvents();
        this.selectedNotebook = this.notebook && this.notebook.length > 0 ? this.notebook.find((ele) => ele.position === '1st week') : null;
        this.alldays = this.allDaysOfWeek();
    }

    getCurrentIndex(index: number) {
        this.index = index;
    }

    backToProgramListPage() {}
    backToSiteListPage() {}
    backToMsnsListPage() {}

    _buildNotebookEvents(): NoteBookEvent[] {
        let start = moment(this.currentMsn.start).format('YYYY-MM-DD');
        const end = moment(this.currentMsn.end).format('YYYY-MM-DD');
        const day = moment(start).day();
        let result = [];
        let to = moment(start)
            .add(7 - day, 'day')
            .format('YYYY-MM-DD');
        console.log(to, end);
        let i = 1;
        let selected = true;
        while (moment(to).isBefore(moment(end))) {
            const note = {
                position: `${i}st week`,
                weekNumber: moment(start).isoWeek(),
                from: start,
                selected,
                to,
                msn: this.currentMsn
            };
            result.push(note);
            i = i + 1;
            selected = false;
            start = moment(to).add(1, 'day').format('YYYY-MM-DD');
            to = moment(start).add(6, 'day').format('YYYY-MM-DD');
        }
        if (moment(to).isSameOrAfter(moment(end))) {
            const note = {
                position: `${i}st week`,
                weekNumber: moment(start).isoWeek(),
                from: start,
                to: end,
                msn: this.currentMsn
            };
            result.push(note);
        }

        console.log(result, start, to, end);

        return result;
    }
    onWeekChanged(note: NoteBookEvent, index: number) {
        this.notebook.forEach((noteTmp) => (noteTmp.selected = false));
        note.selected = true;
        this.selectedNotebook = note;
        this.alldays = this.allDaysOfWeek();
        this.index = index;
        this.changeDetectorRef.markForCheck();
    }

    allDaysOfWeek(): any[] {
        let result = [];
        let test = [];
        console.log(this.selectedNotebook);
        let from = this.selectedNotebook.from;
        console.log(from);

        while (moment(from).isSameOrBefore(moment(this.selectedNotebook.to))) {
            const elem = { date: from, name: moment(from).format('dddd') };
            //   result.push({ date: from, name: moment(from).format('dddd') });

            result.push(from);
            test = [...test, elem];
            if (moment(from).day() == 5) {
                const finalElem = { date: moment(from).add(1, 'day').format('YYYY-MM-DD') + ' to ' + moment(from).add(2, 'day').format('YYYY-MM-DD'), name: 'Weekend' };
                test = [...test, finalElem];
                from = moment(from).add(2, 'day').format('YYYY-MM-DD');
            } else {
                from = moment(from).add(1, 'day').format('YYYY-MM-DD');
            }
            console.log(test, from);
        }
        console.log(result, test);
        return test;
    }

    getNameFromDate(date: string): string {
        return moment(date).format('dddd');
    }
}
