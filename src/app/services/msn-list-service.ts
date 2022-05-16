import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Msn } from '../shared/model/msn.model';
import { GTSI_AIRCRAFT_API, GTSI_REF_API, GTSI_SHOPFLOOR_API } from '../shared/router/router.model';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export default class MsnListService {
    constructor(private http: HttpClient) {}

    getMsns(): Observable<Msn[]> {
        return this.http.get<Msn[]>('assets/msn.json');
    }
    getMsnListByProgram(programCode: string, short_name: string): Observable<any> {
        //  const url = GTSI_REF_API + '/msn?program_code=' + programCode; from Ref
        const url = GTSI_AIRCRAFT_API + '/aircraft/list'; // from aircraft
        const body = {
            ac_program_ids: [programCode],
            production_site_ids: [short_name]
        };
        console.log('dans le serve', body);
        return this.http.post<any>(url, body, { headers }).pipe(map((response) => response.data));
    }

    getLogicalStations(): Observable<any> {
        const url = GTSI_SHOPFLOOR_API + '/authorized/logical-station/list'; // from aircraft

        return this.http.post<any>(url, { headers }).pipe(map((response) => response));
    }
}
