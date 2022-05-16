import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { StorageService } from 'src/app/services/storage.service';
import { Program } from 'src/app/shared/model/program.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tm-program-list',
    templateUrl: './program-list.component.html',
    styleUrls: ['./program-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramListComponent implements OnInit, OnDestroy {
    programs: Program[];
    private _subs$: Subscription = new Subscription();
    constructor(private storageService: StorageService, private dataSharingService: DataSharingService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

    ngOnInit(): void {
        this._subs$.add(
            this.dataSharingService.getPrograms().subscribe((programs: Program[]) => {
                this.programs = programs;
                this.changeDetectorRef.markForCheck();
            })
        );
    }

    programChoosed(program: Program) {
        console.log(program);
        const name = this.getCode(program?.name);
        this.storageService.saveCurrentProgram(program);
        this.router.navigateByUrl(`${name}/site_list`);
    }

    getCode(name: string) {
        return name === 'Single Aisle' ? 'A320' : name;
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }
}
