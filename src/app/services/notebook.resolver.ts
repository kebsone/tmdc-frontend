import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Msn } from '../shared/model/msn.model';
import { DataSharingService } from './dataSharing.service';
import { GtiService } from './gti.service';
import MsnListService from './msn-list-service';
import { RootGtiService } from './root-gti.service';
import { TmdcMsnSerivice } from './tmdc-msn-service';
import { TmdcMsn } from '../shared/model/tmdc-model/tmdc-msn.model';

@Injectable()
export class NotebookResolver implements Resolve<TmdcMsn> {
    constructor(private msnService: TmdcMsnSerivice, private dataSharingService: DataSharingService, private rootGtiService: RootGtiService, private gtiService: GtiService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TmdcMsn> {
        console.log(route);
        return this.msnService.getMsnByNumber('20579', 'L', 'a330_fal_toulouse');
    }
}
