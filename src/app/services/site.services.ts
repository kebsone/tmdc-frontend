import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GTSI_REF_API, GTSI_SHOPFLOOR_API, TOKEN_KEY } from '../shared/router/router.model';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export class SiteService {
    constructor(private http: HttpClient) {}

    getSitesByProgramId(permission_id: string, ac_program_id: string) {
        const url = GTSI_SHOPFLOOR_API + '/authorized/production-sites';
        const params = new HttpParams().set('permission_id', permission_id).set('ac_program_id', ac_program_id);
        const options = { headers, params };
        console.log(params);
        return this.http.get<any>(url, options);
    }
}
