import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { DataSharingService } from '../../services/dataSharing.service';
import { TmdcMsn } from '../../shared/model/tmdc-model/tmdc-msn.model';
import { TmdcMsnSerivice } from '../../services/tmdc-msn-service';

@Injectable({
    providedIn: 'root'
})
export class PlannerResolverService implements Resolve<any> {
    constructor(private tmdcMsnSerivice: TmdcMsnSerivice, private dataSharingService: DataSharingService, private sharedService: SharedService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<TmdcMsn> {
        console.log(route);
        const programCode = route.params.program === 'A330' ? 'L' : route.params.program === 'A320' ? 'N' : 'P';
        return this.tmdcMsnSerivice.getMsnByNumber(route.params.msn, 'L', "a330_fal_toulouse")
      //  return this.tmdcMsnSerivice.getMsnByNumber(route.params.msn, programCode, route.params.siteName);
    }
}
