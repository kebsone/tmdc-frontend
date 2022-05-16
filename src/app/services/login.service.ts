import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export class LoginService {
    constructor(private http: HttpClient) {}

    getAuthentification(username: string, password: string): Observable<any> {
        let data = '{"password":"' + password + '","username":"' + username + '"}';
        return this.http.post<any>('https://gtsi-v.epaas.eu.airbus.corp/authentication/api/login/local', data, { headers: headers });
    }
}
