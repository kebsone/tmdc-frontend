import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GTSI_SHOPFLOOR_API } from '../shared/router/router.model';

const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export class ProductionLineService {
    constructor(private http: HttpClient) {}
    getProductionLines(): Observable<string[]> {
        const url = GTSI_SHOPFLOOR_API + '/authorized/production-line/eff-prod-site-suffix/list';
        return this.http.get<string[]>(url, { headers });
    }

    getProductions(): Observable<any[]> {
        return of([
            {
                idPoste: 2,
                name: 'P40',
                progress: '100%'
            },
            {
                idPoste: 3,
                name: 'P30',
                progress: '100%'
            },
            {
                idPoste: 4,
                name: 'P25',
                progress: '100%'
            },
            {
                idPoste: 5,
                name: 'P20',
                progress: '98%'
            },
            {
                idPoste: 6,
                name: 'P17',
                progress: '0%'
            }
        ]);
    }
}
