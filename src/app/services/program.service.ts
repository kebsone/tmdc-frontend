import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Program } from '../shared/model/program.model';
import { GTSI_REF_API, GTSI_SHOPFLOOR_API, TOKEN_KEY } from '../shared/router/router.model';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export class ProgramService {
    constructor(private http: HttpClient) {}

    getAllPrograms() {
        const url = GTSI_REF_API + '/programs';
        return this.http
            .get<any>(url)
            .toPromise()
            .then((res) => {
                <Program[]>res;
                return res;
            });
    }

    getPrograms(permissionId: string) {
        const url = GTSI_SHOPFLOOR_API + '/authorized/ac-programs?permission_id=' + permissionId; // '/svc-shopfloor/api/authorized/ac-programs?permission_id=';
        return this.http
            .get<any>(url, { headers: headers })
            .toPromise()
            .then((res) => {
                <Program[]>res;
                return res;
            });
    }
}
