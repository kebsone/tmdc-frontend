import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from '../services/storage.service';

@Component({
    selector: 'tm-session-expired-modal',
    templateUrl: './session-expired-modal.component.html',
    styleUrls: ['./session-expired-modal.component.scss']
})
export class SessionExpiredModalComponent implements OnInit {
    constructor(private router: Router, public ref: DynamicDialogRef, private storageService: StorageService, private dialogService: DialogService) {}

    ngOnInit(): void {}

    goToLoginPage() {
        this.storageService.signOut();
        this.ref.close();
        this.router.navigateByUrl('/');
    }
}
