import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TmdcUser } from '../shared/model/tmdc-model/tmdc-user.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export class ManagerService {
    constructor(private http: HttpClient) {}

    allTmdcUsers(): Observable<TmdcUser[]> {
        const url = 'http://localhost:8080/api/users/all';
        return this.http.get<TmdcUser[]>(url);
    }

    addTmdcUser(user: any): Observable<TmdcUser> {
        const tmduser: TmdcUser = {
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            gtsiUserId: user.id,
            isManager: false
        };
        return this.http.post<TmdcUser>('http://localhost:8080/api/users/add', tmduser);
    }

    updateUser(user: TmdcUser): Observable<TmdcUser> {
        console.log(user);
        const url = 'http://localhost:8080/api/users/user';
        return this.http.put<TmdcUser>(url, user);
    }
}
