import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GtiService } from 'src/app/services/gti.service';
import { RootGtiService } from 'src/app/services/root-gti.service';
import { Gti } from 'src/app/shared/model/gti.model';
import { Msn } from 'src/app/shared/model/msn.model';
import { Program } from 'src/app/shared/model/program.model';
import { RootGti } from 'src/app/shared/model/root-gti.model';
import { ProductionSite } from 'src/app/shared/model/site.model';
import { GTI_TO_DISPLAY } from '../../../shared/model/gti.model';

@Component({
    selector: 'tm-msn-card',
    templateUrl: './msn-card.component.html',
    styleUrls: ['./msn-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsnCardComponent implements OnInit, OnDestroy {
    // Selected MSN
    @Input()
    msn: Msn;

    // Current program
    @Input()
    selectedProgram: Program;

    @Input()
    currentSite: ProductionSite;

    @Input()
    rootGtis: RootGti[];

    @Output()
    showSpiner: EventEmitter<boolean> = new EventEmitter();

    @Input()
    set index(i: number) {
        this.isOddIndex = Math.abs(i % 2) === 1;
    }

    isOddIndex = false;
    responsable: string;
    currentResponsable: string;
    gtsiCount: number;
    rootGtiList: RootGti[] = [];
    newCommentValue: any;
    addCommentvalueModal: boolean;
    private _subs$: Subscription = new Subscription();
    get versionRank(): string {
        return this.msn && this.msn.version && this.msn.rank ? `${this.msn.version}-${this.msn.rank}` : 'XXX-1';
    }
    constructor(private router: Router, private activeRoute: ActivatedRoute, private gtiService: GtiService, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {}
    addResponsable() {
        this.currentResponsable = this.responsable;
        this.responsable = '';
    }

    goToGtiDetails() {
        const programName = this.currentSite.short_name?.split(' ')[0] === 'S/A' ? 'A320' : this.currentSite.short_name?.split(' ')[0];
        this.showSpiner.emit(true);
        const url = `${programName + '/' + this.currentSite.production_location_id + '/msn-list/' + this.msn.msn + '/gti-list'}`;
        this.router.navigateByUrl(url);
    }

    goToRootGtiDetails() {
        const programName = this.currentSite.short_name?.split(' ')[0] === 'S/A' ? 'A320' : this.currentSite.short_name?.split(' ')[0];

        const url = `${programName + '/' + this.currentSite.production_location_id + '/msn-list/' + this.msn.msn + '/root-gti-list'}`;
        this.router.navigateByUrl(url);
    }

    removeResponsable() {
        this.currentResponsable = '';
        this.responsable = '';
    }


    openedGti(gtis: Gti[]): number {
        return gtis.filter((gti) => GTI_TO_DISPLAY.includes(gti.status)).length;
    }
    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }
}