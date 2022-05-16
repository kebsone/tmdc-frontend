import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Gtsi } from './shared/event.model';

import { Observable, of } from 'rxjs';
import { Resource } from './shared/resource.model';
@Injectable()
export class PlannerService {
    constructor(private http: HttpClient) {}

    getResources(): Observable<Resource[]> {
        return this.http.get<Resource[]>('assets/resources.json');
    }

    addEvent(gtsi: Gtsi): Observable<any> {
        this.http.get<Gtsi[]>('assets/events.json').subscribe((gtsis) => {
            gtsis = [gtsi, ...gtsis];
            return of(gtsis);
        });
        return of(null);
    }
}
