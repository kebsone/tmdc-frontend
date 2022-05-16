import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { ProgramService } from 'src/app/services/program.service';
import { Program } from 'src/app/shared/model/program.model';
import { SharedService } from 'src/app/shared/shared.service';
import { Fal, Msn, Poste } from '../planner/shared/msn.model';

export interface TreeNode {
    data?: any;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    isParent?: boolean;
    isSubParent?: boolean;
    progessStatus?: ProgressStatus;
}

export enum ProgressStatus {
    'ND' = 'ND',
    'EC' = 'EC',
    'AT' = 'AT',
    'EP' = 'EP'
}

@Component({
    selector: 'tm-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    msns: Msn[] = [];
    allPostes: Poste[];
    selectedMsn: Msn;
    fals: Fal[] = [];
    items: MenuItem[];
    programs: Program[];

    constructor(
        private sharedService: SharedService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private dataSharingService: DataSharingService,
        private programService: ProgramService
    ) {}

    ngOnInit(): void {
        this.sharedService.getFals().subscribe((val: Fal[]) => {
            this.fetchData(val);
        });
        this.items = [
            { label: 'Program', routerLink: 'program' },
            { label: 'Site', routerLink: 'site' }
        ];
    }

    fetchData(fals: Fal[]) {
        this.fals = fals;
        this.changeDetectorRef.markForCheck();
    }
    fetchPostes(postes: Poste[]) {
        this.allPostes = postes;
        this.changeDetectorRef.markForCheck();
    }

    openMsnList(fal: Fal) {
        this.router.navigate([fal.title + '/msn-list']);
    }
}
