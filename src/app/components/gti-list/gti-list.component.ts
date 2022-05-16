import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { Gti } from 'src/app/shared/model/gti.model';
import { Program } from 'src/app/shared/model/program.model';
import { ProductionSite } from 'src/app/shared/model/site.model';
import { switchMap } from 'rxjs/operators';
import { TmdcMsnSerivice } from 'src/app/services/tmdc-msn-service';
import * as PlannerUtils from '../planner/shared/planner.utils';
import { Msn } from '../../shared/model/msn.model';
import { Observable, Subscription } from 'rxjs';
import { TmdcMsn, TmdcPoste, TmdcLine } from '../../shared/model/tmdc-model/tmdc-msn.model';
import * as TmdcUtils from '../../shared/tmdc-utils';
import { ProductionLineService } from 'src/app/services/production-line.service';
export interface TreeNode {
    data?: Node;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    isParent?: boolean;
}

export interface Node {
    gtiNumber?: string;
    gtiTitle?: string;
    refAta?: number;
    gtiWorkOrder?: string;
    gtiStatus?: string;
    isParent?: boolean;
    isGti?: boolean;
    go?: boolean;
    noGo?: boolean;
    comment?: string;
}

@Component({
    selector: 'tm-gtsi-list',
    templateUrl: './gti-list.component.html',
    styleUrls: ['./gti-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GtiListComponent implements OnInit, OnDestroy {
    navigation: MenuItem[];
    currentMsnNumber: string;
    msnUpdateItems: MenuItem[];
    gtiActionsItems: MenuItem[];
    searchValue: string;
    gtiList: TreeNode[] = [];
    currentProgram: Program;
    currentSite: ProductionSite;
    showSpinner = false;
    display = false;
    commentDialog = false;
    selectedGti: any;
    selectedNode: Node;
    selectedRowData: any;
    selectedGtiNumber: Gti;
    gtiNumbers: Gti[];
    allAuthorizedGtis: Gti[];
    items: any;
    showAt: false;
    gtiComment: string;
    stations$: Observable<any[]>;
    private _subs$: Subscription = new Subscription();

    get getGtiList(): TreeNode[] {
        return this.showAt ? this.gtiList : this.gtiList.filter((gt) => gt.data.gtiStatus !== 'AT');
    }
    constructor(
        private route: Router,
        private dataSharingService: DataSharingService,
        private activedRoute: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private _tmdcMsnService: TmdcMsnSerivice,
        private _productionService: ProductionLineService
    ) {}

    ngOnInit(): void {
        this.currentMsnNumber = this.activedRoute.snapshot.params?.msn;
        this._menuItems();
        console.log(this.activedRoute, this.activedRoute.snapshot.url.values);

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

        this.stations$ = this._productionService.getProductions();
        this.gtiNumbers = this.activedRoute?.snapshot?.data?.gtis;
        console.log('LES GTIS', this.gtiNumbers);
        this._toTreeNode(this.gtiNumbers);
        this._msnUpdateMenuItems();
        this._gtiActionsItems();
    }

    _menuItems() {
        this.items = [
            {
                label: 'MSN ' + this.currentMsnNumber,
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {
                        label: 'Update'
                    },
                    { separator: true },

                    {
                        label: 'Edit the bicycle',
                        command: () => {
                            this.openPlanner();
                        }
                    },
                    { label: 'Extract all tests' },
                    { label: 'Extract FA, IP, NS tests' }
                ]
            },
            {
                label: 'GO/NoGO',
                icon: 'pi pi-comment',

                items: [
                    {
                        label: 'Add point',
                        icon: 'pi pi-plus-circle',
                        disabled: !this.selectedNode
                    },
                    { separator: true },
                    {
                        label: 'GO',
                        icon: 'pi pi-check-circle',
                        disabled: !this.selectedNode,
                        command: () => {
                            this._addGoNoGo('GO');
                        }
                    },
                    {
                        label: 'No GO',
                        icon: 'pi pi-ban',
                        disabled: !this.selectedNode,
                        command: () => {
                            this._addGoNoGo('NOGO');
                        }
                    },
                    {
                        label: 'Comment',
                        icon: 'pi pi-comment',
                        disabled: !this.selectedNode || (this.selectedNode && !this.selectedNode?.go && this.selectedNode && !this.selectedNode.noGo),
                        command: () => {
                            this._addComment();
                        }
                    },
                    { label: 'Delete comment', icon: 'pi pi-trash', disabled: !this.selectedNode || !this.selectedNode.comment }
                ]
            },
            {
                label: 'Actions',
                icon: 'pi pi-eye',
                items: [
                    {
                        label: 'CDO'
                    },
                    { separator: true },
                    {
                        label: 'GTSA'
                    },
                    { separator: true },
                    { label: 'WO' },
                    { separator: true },
                    {
                        label: 'Notebook',
                        command: () => {
                            this._openNoteBook();
                        }
                    }
                ]
            }
        ];
    }

    _addGoNoGo(goNoGo: string) {
        let selected = this.gtiNumbers.find((gt) => gt.reference == this.selectedNode.gtiNumber);
        switch (goNoGo) {
            case 'GO':
                selected = { ...selected, go: true };
                break;
            case 'NOGO':
                selected.noGo = true;
                break;
            default:
                break;
        }
        const gtis = this.gtiNumbers.filter((gt) => gt.reference !== this.selectedNode.gtiNumber);
        gtis.push(selected);
        this.gtiNumbers = [...gtis];
        this.changeDetectorRef.markForCheck();
        console.log(selected, this.gtiNumbers, gtis);
        this._toTreeNode(gtis);
    }

    saveComment() {
        console.log(this.gtiComment);
        this.commentDialog = false;
        this.gtiComment = null;
    }

    closeAddCommentModal() {
        this.commentDialog = false;
        this.gtiComment = null;
    }

    _openNoteBook() {
        this.route.navigateByUrl(`notebook/${this.currentMsnNumber}`);
    }

    _addComment() {
        this.commentDialog = true;
    }

    _toTreeNode(gtis: Gti[]) {
        console.log('treenode', gtis);
        const gtiWithAtas: Map<string, Gti[]> = this.groupBy(gtis, (gti: Gti) => gti.rgti_reference.split('-')[1]);
        let result = [];
        for (let entry of gtiWithAtas.entries()) {
            console.log(entry);
            let treeNodeGti = {
                data: {
                    isParent: true,
                    gtiTitle: 'ATA ' + entry[0]
                },
                expanded: true,
                children: entry[1].map((gti: Gti) => ({
                    data: {
                        gtiNumber: gti.rgti_reference,
                        gtiTitle: gti.rgti_title,
                        gtiStatus: gti.status,
                        gtiWorkOrder: '11101222',
                        refAta: gti.rgti_reference.split('-')[1],
                        isParent: false,
                        isGti: true,
                        go: gti.go,
                        noGo: gti.noGo
                    },
                    children: TmdcUtils.sortChapters(gti.chapters)?.map((chap) => ({
                        data: {
                            gtiNumber: chap.numbering,
                            gtiTitle: chap.ac_testunit_title,
                            gtiStatus: chap.status,
                            refAta: '',
                            gtiWorkOrder: '',
                            isParent: false,
                            go: gti.go,
                            noGo: gti.noGo
                        }
                    }))
                }))
            };
            result.push(treeNodeGti);
        }

        this.gtiList = result;

        console.log(this.gtiList);
        this.changeDetectorRef.markForCheck();
    }

    _msnUpdateMenuItems() {
        this.msnUpdateItems = [
            {
                label: 'Update'
            },
            { separator: true },

            {
                label: 'Edit the bicycle',
                command: () => {
                    this.openPlanner();
                }
            },
            { label: 'Extract all tests' },
            { label: 'Edit Ep, EC, ND tests' }
        ];
    }

    openPlanner() {
        this.showSpinner = true;
        this._subs$.add(
            this._tmdcMsnService
                .getLinesRefByProgramCode(this.currentProgram.code)
                .pipe(switchMap((lineRef) => this._addPlannerMsn(this.currentMsnNumber, lineRef)))
                .subscribe((val) => {
                    console.log(val);

                    this.showSpinner = true;
                    const programName = this.currentSite.short_name?.split(' ')[0] === 'S/A' ? 'A320' : this.currentSite.short_name?.split(' ')[0];
                    const url = `${programName + '/' + this.currentSite.production_location_id + '/msn-list/' + this.currentMsnNumber + '/planner'}`;
                    this.route.navigateByUrl(url);
                })
        );
    }

    _gtiActionsItems() {
        this.gtiActionsItems = [
            {
                label: 'Add',
                icon: 'pi pi-plus-circle'
            },
            { separator: true },
            {
                label: 'GO',
                icon: 'pi pi-check-circle'
            },
            { label: 'No GO', icon: 'pi pi-ban' },
            { label: 'Comment', icon: 'pi pi-comment' },
            { label: 'Delete comment', icon: 'pi pi-trash' }
        ];
    }
    backToProgramPage() {
        this.route.navigateByUrl('/program-list');
    }

    backToProdutionSitePage() {
        const programName = this.formatName(this.currentProgram.name);
        this.route.navigateByUrl(`${programName}/site_list`);
    }

    formatName(name: string) {
        return name && name === 'Single Aisle' ? 'A320' : name;
    }

    backToProdutionMsnListPage() {
        const program = this.activedRoute.snapshot.params.program;
        const siteName = this.activedRoute.snapshot.params.siteName;
        this.route.navigateByUrl(`${program}/${siteName}/msn-list`);
    }

    openGtiDetals(rowData: any) {
        const number = rowData.gtiNumber;
        this.selectedRowData = rowData;
        this.display = !this.display;

        this.changeDetectorRef.markForCheck();
    }
    selectRow(event: any) {
        console.log(event);
        this.selectedNode = event.node.data;
        console.log(this.selectedNode);

        this.changeDetectorRef.markForCheck();
        this._menuItems();
    }

    unSelectRow(event: any = null) {
        console.log(event);
        this.selectedNode = null;
        this.changeDetectorRef.markForCheck();
        this._menuItems();
    }

    groupBy(list: Gti[], keyGetter: any) {
        const map = new Map<string, Gti[]>();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    onSelect() {
        this.gtiNumbers = this.gtiNumbers.filter((gti) => gti.rgti_reference === this.selectedGtiNumber.rgti_reference);
        this._toTreeNode(this.gtiNumbers);
    }

    filterGtiList(event: any) {
        let filtered = [];
        for (let i = 0; i < this.gtiNumbers.length; i++) {
            let gti: Gti = this.gtiNumbers[i];
            if (gti.rgti_reference?.toString().toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                filtered.push(gti);
            }
        }
        this.gtiNumbers = filtered;
        this._toTreeNode(this.gtiNumbers);
        this.changeDetectorRef.markForCheck();
    }

    clearGti(event: any) {
        this.gtiNumbers = this.activedRoute?.snapshot?.data?.gtis;
        this._toTreeNode(this.gtiNumbers);
        this.changeDetectorRef.markForCheck();
    }

    _addPlannerMsn(msn: string, linesRef: any): Observable<TmdcMsn> {
        const tmdcMsn = { ...this._buildTmdcMsn(msn), postes: this._buildPostes(msn, linesRef) };
        console.log(tmdcMsn);

        return this._tmdcMsnService.addTmdcMsn(tmdcMsn);
    }

    _buildTmdcMsn(msnNumber: string): TmdcMsn {
        return {
            msnNumber,
            responsable: '',
            principalPoste: null,
            start: '2022-02-21 06:00:00',
            end: '2022-02-23 21:00:00',
            programCode: this.currentProgram.code,
            siteId: this.currentSite.production_location_id
        };
    }
    _buildPostes(msn: string, lineRef: any): TmdcPoste[] {
        return this.currentSite.logical_stations.map((station) => ({
            name: station.short_name,
            lines: this._mapLines(msn, lineRef, station.short_name)
        }));
    }

    _mapLines(msn: string, linesRef: any, poste: string): TmdcLine[] {
        return linesRef.map((line) => ({
            id: this.currentProgram.code + this.currentSite.id + msn + poste + line.title,
            title: line.title,
            remainder: 0,
            try: 0,
            gtis: line.title === 'Undef' ? PlannerUtils.eventFromResource('2022-02-21 06:00:00', '2022-02-23 21:00:00', TmdcUtils.toTmdcGtis(this.gtiNumbers, poste)) : []
        }));
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }
}
