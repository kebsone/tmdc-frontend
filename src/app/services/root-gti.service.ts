import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RootGti } from '../shared/model/root-gti.model';
import { GTSI_TEST_DESIGN_API, GTSI_TEST_MANAGEMENT_API } from '../shared/router/router.model';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});

@Injectable()
export class RootGtiService {
    constructor(private http: HttpClient) {}
    getRooutGtsi(ac_program_id: string, production_site_id: string): Observable<RootGti[]> {
        const body = {
            ac_program_id,
            production_site_id
        };
        console.log(body);
        const url = GTSI_TEST_DESIGN_API + '/root-test/rgti/list?offset=0&limit=50&sortBy=reference&sortType=ASC';
        return this.http.post<RootGti[]>(url, body, { headers }).pipe(map((result: any) => result));
    }
}
