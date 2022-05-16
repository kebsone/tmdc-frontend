import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedService } from 'src/app/shared/shared.service';
import { Interval, Msn, Poste } from '../shared/msn.model';
import { Resource } from '../shared/resource.model';
import * as PlannerUtils from '../shared/planner.utils';
import { TmdcGti, TmdcLine, TmdcPoste, TmdcMsn } from '../../../shared/model/tmdc-model/tmdc-msn.model';
import { DataSharingService } from '../../../services/dataSharing.service';
import { ProductionSite } from '../../../shared/model/site.model';
import { Program } from '../../../shared/model/program.model';
import { TmdcMsnSerivice } from '../../../services/tmdc-msn-service';
import * as TmdcUtils from '../../../shared/tmdc-utils';
import { TmdcUser } from '../../../shared/model/tmdc-model/tmdc-user.model';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
interface Size {
    name: string;
    value: any;
}

@Component({
    selector: 'tm-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrincipalComponent implements OnInit, OnDestroy {
    currentMsn: TmdcMsn;
    resources: TmdcLine[];
    gtis: TmdcGti[] = [];
    itemsBreadCrumb: MenuItem[];
    itemsActions: MenuItem[];
    sizes: Size[];
    selectedSize: Size;
    intervals: Interval[];
    stateOptions: any;
    modeValue: string;
    gtisView: TmdcGti[];
    currentSite: ProductionSite;
    currentProgram: Program;
    postes: TmdcPoste[];
    selectedPoste: TmdcPoste;
    showSpinner = false;
    startEndDate: any[];
    currentPoste: string;
    disabledApply = true;
    tmdcUser: TmdcUser;
    hourOrder: number;
    tmdcMsns$: Observable<TmdcMsn[]>;
    selectedTmdcMsn: TmdcMsn;
    TmdcUtils = TmdcUtils;
    private _subs$: Subscription = new Subscription();
    constructor(
        private route: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private tmdcMsnSerivice: TmdcMsnSerivice,
        private dataSharingService: DataSharingService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._subs$.add(
            this.dataSharingService.getCurrentTmdcUser().subscribe((usr) => {
                this.tmdcUser = usr;
            })
        );
        this.stateOptions = [
            { label: 'Edit', value: 'edit', inactive: !this.tmdcUser?.isManager },
            { label: 'View', value: 'view', inactive: !this.tmdcUser?.isManager }
        ];

        this.modeValue = this.tmdcUser.isManager ? 'edit' : 'view';
        this.selectedSize = { name: 'size1', value: 40 };
        this.currentMsn = this.activatedRoute.snapshot.data?.plannerData;
        this.currentMsn = { ...this.currentMsn, selectedPoste: TmdcUtils.sortLogicalStation(this.currentMsn?.postes)[0]?.name };
        this.postes = this.currentMsn.postes;
        console.log('PRINCIPAL DATA', this.activatedRoute, this.currentMsn);
        this.hourOrder = 1;
        this.intervals = PlannerUtils.splitMsn(this.currentMsn, this.selectedSize.value);
        this.sizes = [
            { name: 'size1', value: 40 },
            { name: 'size2', value: 60 },
            { name: 'size3', value: 100 },
            { name: 'size3', value: 'All' }
        ];
        this.gtisView = this.gtis;
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
        this.tmdcMsns$ = this.tmdcMsnSerivice.allTmdcMsns(this.currentProgram.code, this.currentSite.production_location_id);

        this.changeDetectorRef.markForCheck();
    }

    formatName(name: string) {
        return name && name === 'Single Aisle' ? 'A320' : name;
    }

    onModeChanged(event: any) {
        if (event.option.value === 'edit') {
            this.changeDetectorRef.markForCheck();
        }
    }

    onCurrentPosteChanged(poste: string) {
        this.currentMsn.selectedPoste = poste;
        this.disabledApply = true;
        this.changeDetectorRef.markForCheck();
    }
    getGtsis(gtis: TmdcGti[]) {
        console.log('LES GTIS A SAVER', gtis);
        this.disabledApply = false;
        this.gtisView = gtis;
        this.changeDetectorRef.markForCheck();
    }

    onSave() {
        this.showSpinner = true;
        this.tmdcMsnSerivice.updateTmdcGtis(this.gtisView, this.currentMsn.msnNumber, this.currentProgram.code, this.currentSite.production_location_id).subscribe((val) => {
            this.showSpinner = false;
            const selectedPoste = this.currentMsn.selectedPoste;
            this.currentMsn = { ...val, selectedPoste };
            this.gtisView = [];
            this.disabledApply = true;
            this.changeDetectorRef.markForCheck();
        });
    }

    deleteGtis(gtis: TmdcGti[]) {
        console.log('LES GTIS A DELETE', gtis);
        this.showSpinner = true;
        this.tmdcMsnSerivice.updateTmdcGtis(gtis, this.currentMsn.msnNumber, this.currentProgram.code, this.currentSite.production_location_id).subscribe((val) => {
            this.showSpinner = false;
            const selectedPoste = this.currentMsn.selectedPoste;
            this.currentMsn = { ...val, selectedPoste };
            this.changeDetectorRef.markForCheck();
        });
    }

    editGtis(gtis: TmdcGti[]) {
        console.log('LES GTIS A DUPLIQUER EDITER', gtis);
        this.showSpinner = true;
        this.tmdcMsnSerivice.updateTmdcGtis(gtis, this.currentMsn.msnNumber, this.currentProgram.code, this.currentSite.production_location_id).subscribe((val) => {
            this.showSpinner = false;
            const selectedPoste = this.currentMsn.selectedPoste;
            this.currentMsn = { ...val, selectedPoste };
            this.disabledApply = true;
            this.changeDetectorRef.markForCheck();
        });
    }

    sizeChanged() {
        this.intervals = PlannerUtils.splitMsn(this.currentMsn, this.selectedSize.value);
        this.changeDetectorRef.markForCheck();
    }

    // savePlannerState() {
    //     this.showSpinner = true;
    //     this.tmdcMsnSerivice.updateTmdcGtis(this.gtisView, this.currentMsn.msnNumber, this.currentProgram.code, this.currentSite.production_location_id).subscribe((val) => {
    //         this.showSpinner = false;
    //         const selectedPoste = this.currentMsn.selectedPoste;
    //         this.currentMsn = { ...val, selectedPoste };
    //         this.gtisView = [];
    //         this.disabledApply = true;
    //         this.changeDetectorRef.markForCheck();
    //     });
    // }

    backToProgramListPage() {
        this.showSpinner = true;
        this.route.navigateByUrl('/program-list');
    }

    backToSiteListPage() {
        this.showSpinner = true;
        const programName = TmdcUtils.formatName(this.currentProgram.name);
        this.route.navigateByUrl(`${programName}/site_list`);
    }

    backToMsnsListPage() {
        this.showSpinner = true;
        const programName = TmdcUtils.formatName(this.currentProgram.name);
        const siteName = this.currentSite.production_location_id;
        this.route.navigateByUrl(`${programName}/${siteName}/msn-list`);
    }

    onPosteChanged(poste: string): void {
        this.currentMsn = { ...this.currentMsn, selectedPoste: poste };
        this.disabledApply = true;
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }

    applyPlannerOf() {
        console.log('hehehehe', this.selectedTmdcMsn);
        this.confirmationService.confirm({
            message: `Are you sure to apply MSN ${this.selectedTmdcMsn.msnNumber} bicycle on MSN ${this.currentMsn.msnNumber} on station ${this.currentMsn.selectedPoste}?
            This operation isn't reversible.`,
            accept: () => {
                this.showSpinner = true;
                //guard
                if (!this.selectedTmdcMsn || !this.selectedTmdcMsn.postes || this.selectedTmdcMsn.postes.length === 0) {
                    console.log('jejjjez');
                    this.showSpinner = false;
                    return;
                }

                //guard
                if (!this.currentMsn || !this.currentMsn.selectedPoste) {
                    this.showSpinner = false;
                    console.log('jejjjez');

                    return;
                }

                console.log(this.selectedTmdcMsn, this.currentPoste, this.currentMsn);
                let gtisToEdit = [];
                let toUpdates = [];
                let lastGtis = [];
                this.currentMsn.postes
                    .find((poste) => poste.name === this.currentMsn.selectedPoste)
                    .lines.forEach((lin) => {
                        gtisToEdit = [...gtisToEdit, ...lin.gtis];
                    });
                const lines = this.selectedTmdcMsn.postes.find((poste) => poste.name === this.currentMsn.selectedPoste).lines;
                for (let i = 0; i < lines.length; i++) {
                    const gtis = lines[i].gtis;
                    if (gtis && gtis.length > 0) {
                        const lineToUpdate = this.currentMsn.postes.find((poste) => poste.name === this.currentMsn.selectedPoste).lines.find((ln) => ln.title === lines[i].title);
                        let gtisToUpdate = PlannerUtils.applyGtiOf(this.currentMsn.start, this.selectedTmdcMsn.start, gtis, gtisToEdit);
                        console.log(gtisToUpdate);
                        gtisToUpdate = gtisToUpdate.map((gt) => ({ ...gt, line: lineToUpdate }));
                        toUpdates = [...toUpdates, ...gtisToUpdate];
                    }
                }

                console.log('line to update', toUpdates);

                this.tmdcMsnSerivice.updateTmdcGtis(toUpdates, this.currentMsn.msnNumber, this.currentProgram.code, this.currentSite.production_location_id).subscribe((result) => {
                    console.log(result);
                    this.showSpinner = false;
                    const selectedPoste = this.currentMsn.selectedPoste;
                    this.currentMsn = { ...result, selectedPoste };
                    this.messageService.add({ severity: 'success', summary: `MSN ${this.selectedTmdcMsn.msnNumber} bycicle was successfully applied` });
                    this.selectedTmdcMsn = null;
                    this.changeDetectorRef.markForCheck();
                });
            },
            reject: () => {
                this.selectedTmdcMsn = null;
                this.changeDetectorRef.markForCheck();
            }
        });
    }
}
