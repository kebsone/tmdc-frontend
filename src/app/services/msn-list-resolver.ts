import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Msn } from '../shared/model/msn.model';
import { DataSharingService } from './dataSharing.service';
import { GtiService } from './gti.service';
import MsnListService from './msn-list-service';
import { RootGtiService } from './root-gti.service';

@Injectable()
export class MsnListResolver implements Resolve<Msn[]> {
    constructor(private msnService: MsnListService, private dataSharingService: DataSharingService, private rootGtiService: RootGtiService, private gtiService: GtiService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Msn[]> {
        return this.msnService.getMsns();
        let program;
        let currentSite;
        let rootGtiList;
        let gtiList;
        this.dataSharingService.getCureentProgram().subscribe((prog) => (program = prog));
        this.dataSharingService.getCurrentSite().subscribe((site) => (currentSite = site));
        this.gtiService.getGtiList('', program.code, [currentSite.id]).subscribe((gtis) => (gtiList = gtis));
        console.log(gtiList);
        let result = [];
        // return forkJoin({
        //     msns: this.msnService.getMsnListByProgram(program.code, currentSite.short_name),
        //     rootGtis: this.rootGtiService.getRooutGtsi(program.code, currentSite.id)
        // }).pipe(switchMap((val: { msns; rootGtis }) => this.gtiService.msnWithGtsi(val, program?.code, [currentSite.id])));
       
       // TODO return this.msnService.getMsnListByProgram(program.code, currentSite.short_name).pipe(switchMap((msns) => this.gtiService.msnWithGtsi(msns, program?.code, [currentSite.id])));
    }
}
