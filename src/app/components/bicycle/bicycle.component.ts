import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { IManagerLines } from './iManagerLines';
import { MessageService } from 'primeng/api';
import { MsnService } from './service/msn-service';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'tm-bicycle',
    templateUrl: './bicycle.component.html',
    styleUrls: ['./bicycle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BicycleComponent implements OnInit, OnDestroy {
    managerLines: IManagerLines[];
    p30: IManagerLines[];
    p18: IManagerLines[];
    list1: any[];
    list2: any[];
    clonedProducts: { [s: string]: IManagerLines } = {};
    msnGroups: any[];
    msnGroupsSubscription: Subscription;
    msnGroupsIds: any[];

    constructor(private messageService: MessageService, private msnService: MsnService) {
        this.msnGroupsSubscription = this.msnService.taskGroupsSubject.subscribe((taskGroups: any[]) => {
            this.msnGroups = taskGroups;
            taskGroups.forEach((child) => {
                this.msnGroupsIds.push(child);
            });
        });
        this.msnService.emitTaskGroups();
    }

    ngOnDestroy(): void {
        this.msnGroupsSubscription.unsubscribe();
    }

    ngOnInit(): void {
        // P35
        this.managerLines = [
            {
                id: '1000',
                line: 'UNDEF',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1001',
                line: 'Essai P35',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1002',
                line: 'Essai P28',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1003',
                line: 'Essai P20',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1004',
                line: 'Essai P30',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1005',
                line: 'Essai P19/22',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1006',
                line: 'Essai P18',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1007',
                line: 'Essai FL',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1008',
                line: 'Prod Green',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1008',
                line: 'Prod Cabine',
                day: '',
                night: '',
                vsd: ''
            }
        ];
        // P30
        this.p30 = [
            {
                id: '1000',
                line: 'UNDEF',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1001',
                line: 'Essai P35',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1002',
                line: 'Essai P28',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1003',
                line: 'Essai P20',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1004',
                line: 'Essai P30',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1005',
                line: 'Essai P19/22',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1006',
                line: 'Essai P18',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1007',
                line: 'Essai FL',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1008',
                line: 'Prod Green',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1008',
                line: 'Prod Cabine',
                day: '',
                night: '',
                vsd: ''
            }
        ];
        // P18
        this.p18 = [
            {
                id: '1000',
                line: 'UNDEF',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1001',
                line: 'Essai P35',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1002',
                line: 'Essai P28',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1003',
                line: 'Essai P20',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1004',
                line: 'Essai P30',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1005',
                line: 'Essai P19/22',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1006',
                line: 'Essai P18',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1007',
                line: 'Essai FL',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1008',
                line: 'Prod Green',
                day: '',
                night: '',
                vsd: ''
            },
            {
                id: '1008',
                line: 'Prod Cabine',
                day: '',
                night: '',
                vsd: ''
            }
        ];
    }

    onRowEditInit(manager: IManagerLines) {
        this.clonedProducts[manager.id] = { ...manager };
    }

    onRowEditSave(manager: IManagerLines) {
        if (manager.line > '') {
            delete this.clonedProducts[manager.id];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Managers Lines is updated' });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid' });
        }
    }

    onRowEditCancel(manager: IManagerLines, index: number) {
        this.managerLines[index] = this.clonedProducts[manager.id];
        delete this.clonedProducts[manager.id];
    }

    onMsnDrop(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }
}
