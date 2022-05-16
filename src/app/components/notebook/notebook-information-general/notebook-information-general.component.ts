import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NoteBookEvent } from '../notebook.component';
import { Msn } from '../../planner/shared/msn.model';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as PlannerUtils from '../../planner/shared/planner.utils';
export interface Information {
    value: string;
    date?: string;
    dayTime?: string;
    msn?: string;
    poste?: string;
    userName?: string;
    uiId?: string;
    login?: string;
}
@Component({
    selector: 'tm-notebook-information-general',
    templateUrl: './notebook-information-general.component.html',
    styleUrls: ['./notebook-information-general.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotebookInformationGeneralComponent implements OnInit {
    @Input()
    currentNotebook: NoteBookEvent;
    @Input()
    dayTime: string;

    @Input()
    currentDay: any;

    get currentInformations() {
        return this.informations.filter((info: Information) => info.dayTime === this.dayTime);
    }
    submitted: boolean;
    informations: Information[];
    information: any;
    addInformationDialog: boolean;
    moreDetailsDialog: boolean;
    constructor(private changeDetectorRef: ChangeDetectorRef, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit(): void {
        this.informations = [
            {
                value: 'test',
                uiId: PlannerUtils.random(),
                dayTime: 'Morning',
                userName: 'TEST, test',
                login: 'sp545877',
                date: '2022-02-23'
            },
            {
                value: 'test2',
                uiId: PlannerUtils.random(),
                dayTime: 'Night',
                userName: 'KEBE, Serigne',
                login: 'sp545877',
                date: '2022-02-23'
            },
            {
                value: 'test3',
                uiId: PlannerUtils.random(),
                dayTime: 'Night',
                userName: 'PROS, Guillaume',
                login: 'sp545877',
                date: '2022-02-23'
            }
        ];
    }
    viewMoreDetails() {
        this.moreDetailsDialog = true;
    }
    onRowEditInit(info: any) {}

    onRowEditSave(info: any) {}

    deleteRow(event: any, info: Information, ri: number) {
        event.stopPropagation();
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this information?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log('dans le confirm', this.informations, info);
                this.informations = this.informations.filter((information) => info.uiId !== information.uiId);
                this.changeDetectorRef.markForCheck();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
                this.confirmationService.close();
            },
            reject: () => {
                this.confirmationService.close();
            }
        });
    }
    hideDialog() {}
    addInformation() {
        this.submitted = false;
        this.information = {
            date: moment(new Date()).format('YYYY-MM-DD'),
            msn: this.currentNotebook.msn.msnNumber,
            poste: this.currentNotebook.msn.principalPoste,
            dayTime: this.dayTime,
            uiId: PlannerUtils.random()
        };
        this.addInformationDialog = true;
    }
    saveInformation() {
        this.submitted = true;
        console.log(this.information);
        if (this.information.value) {
            this.addInformationDialog = false;
            this.informations.push(this.information);
            console.log(this.informations);
            this.changeDetectorRef.markForCheck();
        }
    }
}
