import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of, forkJoin } from 'rxjs';
import { Fal, Poste } from '../planner/shared/msn.model';
import { MenuItem, TreeNode } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { Program } from 'src/app/shared/model/program.model';
import { LogicalStation, PhysicalStation, ProductionLine, ProductionSite } from 'src/app/shared/model/site.model';
import { RootGti } from 'src/app/shared/model/root-gti.model';
import { Msn } from 'src/app/shared/model/msn.model';
import { TmdcPoste, TmdcMsn, TmdcGti, TmdcLine } from '../../shared/model/tmdc-model/tmdc-msn.model';
import { Gti } from 'src/app/shared/model/gti.model';
import { TmdcMsnSerivice } from '../../services/tmdc-msn-service';
import * as PlannerUtils from '../planner/shared/planner.utils';
import * as TmdcUtils from '../../shared/tmdc-utils';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { GtiService } from '../../services/gti.service';
interface Line {
    value: number;
    label: string;
}

interface Status {
    status: string;
    label: string;
}

interface Station {
    station: string;
    place: string;
}

interface FilterOptions {
    msn?: string;
    line?: string;
    status?: string;
    stations?: string[];
}

@Component({
    selector: 'tm-msn-list',
    templateUrl: './msn-list.component.html',
    styleUrls: ['./msn-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsnListComponent implements OnInit, OnDestroy {
    selected: Msn;
    fal$: Observable<Fal | undefined>;
    postes$: Observable<Poste[]>;
    fal: Fal;
    navigation: MenuItem[];
    home: MenuItem;
    displayBasic: boolean;
    files: TreeNode[];
    cols: any[];
    colsHeader: any[];
    msnLineSelected: Line;
    currentValInputName: string;
    selectedLine: ProductionLine;
    selectedStatus: string;
    selectedStations: LogicalStation[];
    selectedMsn: Msn;
    msnSuggestions: Msn[];
    filterOptions: FilterOptions;
    currentProgram: Program;
    currentSite: ProductionSite;
    msnList: Msn[] = [];
    productionLines: string[];
    _filteredMsns: Msn[];
    filterMode = false;
    showSpinner = false;
    logicalStations: string[];
    selectedSite: string;
    physicalStations: PhysicalStation[];
    selectedPhysicalStations: PhysicalStation[];
    rootGtiList: RootGti[];
    linesRef: any;
    lineref$: Observable<any>;
    TmdcUtils = TmdcUtils;
    private _subs$: Subscription = new Subscription();
    get filteredMsns(): Msn[] {
        return this._getFilteredMsnList();
    }

    get msnStatus(): string[] {
        return this._getMsnStatus();
    }

    get hasFilter(): boolean {
        return !!this.filterOptions;
    }

    get isFalHambourg(): boolean {
        return this.currentSite.id === 'sa_fal_hambourg';
    }

    get isFalTianjin(): boolean {
        return this.currentSite.id === 'sa_fal_tianjin';
    }

    get isFalMob(): boolean {
        return this.currentSite.id === 'sa_fal_mobile';
    }

    constructor(
        private route: Router,
        private activeRoute: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private primengConfig: PrimeNGConfig,
        private dataSharingService: DataSharingService,
        private _tmdcMsnService: TmdcMsnSerivice,
        private gtiService: GtiService
    ) {}

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this._subs$.add(
            this.dataSharingService.getCureentProgram().subscribe((program: Program) => {
                this.currentProgram = program;
                this.changeDetectorRef.markForCheck();
            })
        );
        this._subs$.add(
            this.dataSharingService.getCurrentSite().subscribe((site: ProductionSite) => {
                this.currentSite = site;
                this.changeDetectorRef.markForCheck();
            })
        );

        console.log(this.activeRoute);
        this._subs$.add(
            this.activeRoute.data.subscribe((data: { msns: Msn[] }) => {
                console.log(data);
                this.msnList = data.msns;
            })
        );
    }

    detectChanges() {
        this.changeDetectorRef.markForCheck();
    }

    showBasicDialog() {
        this.displayBasic = true;
    }

    getValInputName(val: any) {
        this.currentValInputName = val;
    }

    filterLine() {
        if (this.selectedLine) {
            this.filterOptions = { ...this.filterOptions, line: this.selectedLine.short_name };
            this.physicalStations = this.selectedLine.physical_stations;
            this.changeDetectorRef.markForCheck();
        }
    }

    clearLine() {
        this.filterOptions = { ...this.filterOptions, line: null };
        this._getFilteredMsnList();
    }
    filterStatus() {
        if (this.selectedStatus) {
            this.filterOptions = { ...this.filterOptions, status: this.selectedStatus };
        }
    }

    clearStatus() {
        this.filterOptions = { ...this.filterOptions, status: null };
    }

    filterStation() {
        console.log(this.selectedStations);
        let stations = [];
        if (this.selectedStations && this.selectedStations.length > 0) {
            this.selectedStations.forEach((station: LogicalStation) => {
                stations = station.physical_stations && station.physical_stations.length > 0 ? [...stations, ...station.physical_stations] : [...stations];
            });
            // TODO à revoir
            this.filterOptions = { ...this.filterOptions, stations: [] };
        } else {
            this.filterOptions = { ...this.filterOptions, stations: [] };
        }

        this.physicalStations = stations;
        this.changeDetectorRef.markForCheck();
        this._getFilteredMsnList();
    }

    filterMsn(event: any) {
        let filtered = [];
        for (let i = 0; i < this.filteredMsns.length; i++) {
            let msn = this.filteredMsns[i];
            if (msn.msn?.toString().toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                filtered.push(msn);
            }
        }
        this.msnSuggestions = filtered;
    }

    onSelect() {
        if (this.selectedMsn) {
            this.filterOptions = { ...this.filterOptions, msn: this.selectedMsn.msn };
            this.changeDetectorRef.markForCheck();
        }
    }

    clearMsn(event: any) {
        this.filterOptions = { ...this.filterOptions, msn: null };
        this.changeDetectorRef.markForCheck();
    }

    getSelectedItemsLabel() {
        let result = '';
        if (this.selectedStations && this.selectedStations.length > 0) {
            this.selectedStations
                .map((station: any) => station.station)
                .forEach((ele) => {
                    result = result + `${ele} ,`;
                });
        }
        return result;
    }

    private _getFilteredMsnList(): Msn[] {
        const line = this.filterOptions?.line;
        const status = this.filterOptions?.status;
        const stations = this.filterOptions?.stations;
        const msn = this.filterOptions?.msn;
        this._filteredMsns = [...this.msnList];
        if (line && line !== null) {
            this._filteredMsns = this.msnList.filter((msn: Msn) => msn.line === line);
        }
        if (status) {
            this._filteredMsns = this._filteredMsns.filter((msn: Msn) => msn.status === status);
        }
        if (stations && stations.length > 0) {
            this._filteredMsns = this._filteredMsns.filter((msn: Msn) => stations.includes(msn.station));
        }
        if (msn && msn !== null) {
            this._filteredMsns = this._filteredMsns.filter((msnTmp: Msn) => msnTmp.msn === msn);
        }
        return this._filteredMsns;
    }

    private _getMsnStatus(): string[] {
        console.log(this.msnList);
        const result = new Set(this.msnList.map((msn: Msn) => msn.status));
        return Array.from(result);
    }

    backToProgramPage() {
        this.route.navigateByUrl('/program-list');
    }

    backToProdutionSitePage() {
        const programName = TmdcUtils.formatName(this.currentProgram.name);
        this.route.navigateByUrl(`${programName}/site_list`);
    }

    sortProductionLines(lines: ProductionLine[]): ProductionLine[] {
        //ASC
        return lines.sort((l1: ProductionLine, l2: ProductionLine) => (l1.short_name < l2.short_name ? -1 : 1));
    }

    sortLogicalStations(stations: LogicalStation[]): LogicalStation[] {
        //DESC
        return stations.sort((s1: LogicalStation, s2: LogicalStation) => (s1.short_name < s2.short_name ? 1 : -1));
    }

    openPlannerMsn0() {
        this.showSpinner = true;
        const lineRefAngAllGtis$ = forkJoin({
            lineRef: this._tmdcMsnService.getLinesRefByProgramCode(this.currentProgram.code),
            gtiList: this.gtiService.getGtiListMock()
            // TODO gtiList: this.gtiService.getGtiWithChapters(this._groupByGtiNumber(this.msnList))
        });
        this._subs$.add(
            lineRefAngAllGtis$
                .pipe(switchMap((val) => this._addPlannerMsn0(this.msnList, val)))
                //  TODO .pipe(switchMap((tmfcMsn) => this._manageDifference(tmfcMsn)))
                .subscribe((val) => {
                    console.log(val);

                    const programName = this.currentSite.short_name?.split(' ')[0] === 'S/A' ? 'A320' : this.currentSite.short_name?.split(' ')[0];
                    const url = `${programName + '/' + this.currentSite.production_location_id + '/msn-list/' + '000' + '/planner'}`;
                    this.route.navigateByUrl(url);
                })
        );
    }

    _manageDifference(tmdcMsn: TmdcMsn): Observable<TmdcMsn> {
        const gtisFromBd = this._getGtiFromTmdcMsn(tmdcMsn);
        const woFromBd = gtisFromBd.map((gt) => gt.wo);
        const gtisFromGtsi = this._groupByGtiNumber(this.msnList);
        const gtiToAdd = gtisFromGtsi.filter((gti) => !woFromBd.includes(gti.rgti_reference));

        let toTmdcGtis = TmdcUtils.toTmdcGti(gtiToAdd, tmdcMsn);
        toTmdcGtis = PlannerUtils.addNewGtiInUndefLine(toTmdcGtis, tmdcMsn);
        return this._tmdcMsnService.addTmdcGtis(toTmdcGtis, '000', this.currentProgram.code, this.currentSite.production_location_id);

        //return of(tmdcMsn);
    }
    private _getGtiFromTmdcMsn(tmdcMsn: TmdcMsn): TmdcGti[] {
        let result = [];
        for (let j = 0; j < tmdcMsn.postes.length; j++) {
            const poste = tmdcMsn.postes[j];
            for (let i = 0; i < poste.lines.length; i++) {
                result = [...result, ...poste.lines[i].gtis];
            }
        }

        console.log('FROM TMDC', result);
        return result;
    }
    getShowSpinnerValue(value: boolean) {
        this.showSpinner = value;
        this.changeDetectorRef.markForCheck();
    }

    _addPlannerMsn0(msnList: Msn[], val: any): Observable<TmdcMsn> {
        console.log('DANS ADD PLANNER 00', msnList, val);
        const linesRef = val.lineRef;
        const gtisList = val.gtiList;
        const tmdcMsn000 = { ...this._buildTmdcMsn('000'), postes: this._buildPostes00('000', gtisList, linesRef) };
        console.log(tmdcMsn000);

        return this._tmdcMsnService.addTmdcMsn(tmdcMsn000);
    }

    _buildTmdcMsn(msnNumber: string): TmdcMsn {
        return {
            msnNumber,
            responsable: '',
            principalPoste: null,
            start: '2022-01-01 06:00:00',
            end: '2022-01-09 21:00:00',
            programCode: this.currentProgram.code,
            siteId: this.currentSite.production_location_id
        };
    }

    _buildPostes00(msnNumber: string, gtisList: Gti[], linesRef: any): TmdcPoste[] {
        return this.currentSite.logical_stations.map((station) => ({ name: station.short_name, lines: this._mapLines00(msnNumber, gtisList, linesRef, station.short_name) }));
    }
    _buildLines(msnNumber: string, gtisList: Gti[], linesRef: any): TmdcPoste[] {
        return this.currentSite.production_lines.map((station) => ({ name: station.short_name, lines: this._mapLines00(msnNumber, gtisList, linesRef, station.short_name) }));
    }

    _mapLines00(msnNumber: string, gtisList: Gti[], linesRef: any, poste: string): TmdcLine[] {
        // linesRef = this.isFalTianjin || this.isFalTianjin || this.isFalHambourg ? linesRef.filter((line) => line.title === 'Undef' || line.isFalHambourg) : linesRef;

        return linesRef
            .filter((lineRef) => !lineRef.isFalHambourg)
            .map((line) => ({
                id: this.currentProgram.code + this.currentSite.id + msnNumber + poste + line.title,
                title: line.title,
                remainder: 0,
                try: 0,
                gtis: line.title === 'Undef' ? PlannerUtils.eventFromResource('2022-01-01 06:00:00', '2022-01-10 21:00:00', TmdcUtils.toTmdcGtis(gtisList, poste)) : []
            }));
    }

    _groupByGtiNumber(msnList: Msn[]): Gti[] {
        let gtis = [];
        for (let i = 0; i < msnList.length; i++) {
            gtis = gtis.concat(msnList[i].gtiList);
        }
        return [...new Map(gtis.map((item) => [item['rgti_reference'], item])).values()];
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }
}
