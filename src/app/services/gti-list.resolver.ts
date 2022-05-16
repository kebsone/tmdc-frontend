import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Gti } from '../shared/model/gti.model';
import { DataSharingService } from './dataSharing.service';
import { GtiService } from './gti.service';

@Injectable()
export class GtiListResolver implements Resolve<Gti[]> {
    constructor(private dataSharingService: DataSharingService, private gtiService: GtiService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Gti[]> {
        return this.gtiService.getGtiListMock()
        // TODO let program;
        // let currentSite;
        // this.dataSharingService.getCureentProgram().subscribe((prog) => (program = prog));
        // this.dataSharingService.getCurrentSite().subscribe((site) => (currentSite = site));
        // const msn = route.params.msn;
        // console.log(route.params);
      // return this.gtiService.getGtiList(msn, program.code, [currentSite.id]).pipe(switchMap((result) => this.gtiService.getGtiWithChapters(result)));
    }
}
