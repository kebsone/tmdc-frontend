import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TmdcUser } from '../../shared/model/tmdc-model/tmdc-user.model';
import { ManagerService } from '../../services/managerService';
import { Observable, Subscription } from 'rxjs';
import { DataSharingService } from '../../services/dataSharing.service';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'tm-manager',
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagerComponent implements OnInit, OnDestroy {
    users$: Observable<TmdcUser[]>;
    currentTmdcUser: TmdcUser;
    private _subs$: Subscription = new Subscription();
    get isConnectedUserManager(): boolean {
        return false;
    }
    constructor(
        private confirmationService: ConfirmationService,
        private managerService: ManagerService,
        private dataSharingService: DataSharingService,
        private changeDetectorRef: ChangeDetectorRef,
        private _location: Location
    ) {}

    ngOnInit(): void {
        this.users$ = this.managerService.allTmdcUsers();
        this._subs$.add(
            this.dataSharingService.getCurrentTmdcUser().subscribe((user) => {
                console.log(user);
                this.currentTmdcUser = user;
                this.changeDetectorRef.markForCheck();
            })
        );
    }

    onManagerChanged(value: any, user: TmdcUser) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                const newuser = { ...user, isManager: value.checked };
                this.managerService.updateUser(newuser).subscribe();
                window.location.reload();
            },
            reject: () => {
                window.location.reload();
            }
        });
    }

    previousPage() {
        this._location.back();
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }
}
