import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fal, Poste } from '../components/planner/shared/msn.model';
@Injectable({
    providedIn: 'root'
})
export class SharedService {
    constructor(private http: HttpClient) {}
    getFals(): Observable<Fal[]> {
        return this.http.get<Fal[]>('assets/msn.json');
    }

    getPostes(): Observable<Poste[]> {
        return this.http.get<Poste[]>('assets/poste.json');
    }

    getFalById(id: string): Observable<Fal | undefined> {
        return this.getFals().pipe(map((fals) => fals.find((fal) => fal.title === id)));
    }
}
