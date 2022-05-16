import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { StorageService } from 'src/app/services/storage.service';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/shared/model/program.model';
import { ProductionSite } from 'src/app/shared/model/site.model';
import * as TmdcUtils from '../../shared/tmdc-utils';
@Component({
    selector: 'tm-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
    items: MenuItem[];
    displayBasic: boolean;
    connected = false;
    itemsconnection: MenuItem[];
    currentProgram: Program;
    currentSite: ProductionSite;
    TmdcUtils = TmdcUtils;
    private _subs$: Subscription = new Subscription();
    constructor(
        private dataSharingService: DataSharingService,
        private changeDetectorRef: ChangeDetectorRef,
        private storageService: StorageService,
        private router: Router,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this._subs$.add(
            this.dataSharingService.getToken().subscribe((token) => {
                if (token) {
                    this.connected = true;
                    this._buildMenuItems();
                } else {
                    this.connected = false;
                }
                this.changeDetectorRef.detectChanges();
            })
        );

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
        this.changeDetectorRef.markForCheck();
    }
    showBasicDialog() {
        this.displayBasic = true;
    }

    logOut() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.storageService.signOut();
                this._buildMenuItems();
                this.router.navigateByUrl('/');
            },
            reject: () => {}
        });
    }

    private _openManagersPage() {
        this.router.navigateByUrl('/managers');
    }

    private _buildMenuItems() {
        this.items = [
            {
                label: 'Managers',
                icon: 'pi pi-users',
                command: () => {
                    this._openManagersPage();
                },
                visible: this.connected
            },
            {
                label: 'About us',
                icon: 'pi pi-info-circle',
                command: () => {
                    this.showBasicDialog();
                }
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logOut();
                },
                visible: this.connected
            }
        ];
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }

    backToProgramPage() {}
    backToProdutionSitePage() {}
}
