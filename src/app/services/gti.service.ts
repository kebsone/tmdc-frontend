import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { concatAll, map, switchMap } from 'rxjs/operators';
import { Gti, Chapter, AUTHORIZED_STATUS } from '../shared/model/gti.model';
import { Msn } from '../shared/model/msn.model';
import { GTSI_SHOPFLOOR_API, GTSI_TEST_MANAGEMENT_API } from '../shared/router/router.model';
import { RootGtiService } from './root-gti.service';
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS'
});
@Injectable()
export class GtiService {
    constructor(private http: HttpClient) {}
    getGtiList(msn_like: string, ac_program_id: string, production_site_ids: string[]): Observable<Gti[]> {
        const body = {
            ac_program_id,
            msn_like,
            production_site_ids,
            statuses: AUTHORIZED_STATUS
        };

        console.log(body);
        const url = GTSI_TEST_MANAGEMENT_API + '/acgti/list';
        return this.http.post<Gti[]>(url, body, { headers }).pipe(map((result: any) => result.data));
    }

    getGtiListMock(): Observable<Gti[]> {
        return of([
            {
                rgti_title: 'GTI Test',
                reference: '1-012-120',
                status: 'IP',
                chapters: [
                    {
                        numbering: '1',
                        status: 'IP',
                        duration: 30,
                        ac_testunit_title: 'Chap 1'
                    },
                    {
                        numbering: '2',
                        status: 'NS',
                        duration: 10,
                        ac_testunit_title: 'Chap 2'
                    },
                    {
                        numbering: '3',
                        duration: 80,
                        status: 'IP',
                        ac_testunit_title: 'Chap 3'
                    }
                ],
                rgti_reference: '1-012-120'
            },
            {
                rgti_title: 'Title',
                reference: '1-012-126',
                logical_station_short_name: 'P17',
                status: 'NS',
                chapters: [
                    {
                        numbering: '1',
                        status: 'AT',
                        duration: 30,
                        ac_testunit_title: 'Chap 1'
                    },
                    {
                        numbering: '2',
                        status: 'NS',
                        duration: 30,
                        ac_testunit_title: 'Chap 2'
                    },
                    {
                        numbering: '3',
                        status: 'NS',
                        duration: 30,
                        ac_testunit_title: 'Chap 3'
                    }
                ],
                rgti_reference: '1-012-126'
            },
            {
                rgti_title: 'Test ',
                reference: '1-014-120',
                logical_station_short_name: 'P40',
                status: 'NS',
                chapters: [
                    {
                        numbering: '1',
                        status: 'NS',
                        duration: 30,
                        ac_testunit_title: 'Chap 1'
                    },
                    {
                        numbering: '2',
                        status: 'NS',
                        duration: 30,
                        ac_testunit_title: 'Chap 2'
                    },
                    {
                        numbering: '3',
                        status: 'NS',
                        duration: 30,
                        ac_testunit_title: 'Chap 3'
                    }
                ],
                rgti_reference: '1-014-120'
            },
            {
                rgti_title: 'Application',
                reference: '1-015-120',
                logical_station_short_name: 'P40',
                status: 'AT',
                chapters: [
                    {
                        numbering: '1',
                        status: 'AT',
                        duration: 30,
                        ac_testunit_title: 'Chap 1'
                    },
                    {
                        numbering: '2',
                        status: 'AT',
                        duration: 30,
                        ac_testunit_title: 'Chap 2'
                    },
                    {
                        numbering: '3',
                        status: 'AT',
                        duration: 30,
                        ac_testunit_title: 'Chap 3'
                    }
                ],
                rgti_reference: '1-015-120'
            },
            {
                rgti_title: 'gestion des erreurs',
                reference: '1-016-120',
                logical_station_short_name: 'P30',
                status: 'FA',
                chapters: [
                    {
                        numbering: '1',
                        status: 'NS',
                        duration: 10,
                        ac_testunit_title: 'Chap 1'
                    },
                    {
                        numbering: '2',
                        status: 'FA',
                        duration: 10,
                        ac_testunit_title: 'Chap 2'
                    },
                    {
                        numbering: '3',
                        status: 'NS',
                        duration: 10,
                        ac_testunit_title: 'Chap 3'
                    }
                ],
                rgti_reference: '1-016-120'
            },
            {
                rgti_title: 'GTI Test avion',
                reference: '1-017-120',
                rgti_reference: '1-017-120',
                logical_station_short_name: 'P17',
                status: 'NS'
            },
            {
                rgti_title: 'Procédure',
                reference: '1-018-120',

                rgti_reference: '1-018-120',
                status: 'NS',
                logical_station_short_name: 'P40'
            },
            {
                rgti_title: 'autres tests',
                reference: '1-019-120',
                rgti_reference: '1-019-120',
                status: 'NS',
                chapters: [
                    {
                        numbering: '1',
                        status: 'NS',
                        duration: 10,
                        ac_testunit_title: 'Chap 1test'
                    },
                    {
                        numbering: '2',
                        status: 'NS',
                        duration: 10,
                        ac_testunit_title: 'Chap 2test'
                    },
                    {
                        numbering: '3',
                        status: 'NS',
                        ac_testunit_title: 'Chap 3test'
                    }
                ],
                logical_station_short_name: 'P40'
            },
            {
                rgti_title: 'GTI Test',
                reference: '2-011-120',
                logical_station_short_name: 'P30',
                status: 'IP',
                rgti_reference: '2-011-120'
            }
        ]);
    }

    getGtiWithChapters(gtis: Gti[]): Observable<Gti[]> {
        // const url = GTSI_TEST_MANAGEMENT_API + `/actestunits?acgti_id=${acgti_id}`;
        let batch: any = [];
        gtis.forEach((gti) => {
            const url = GTSI_TEST_MANAGEMENT_API + `/consult/acgti/${gti.id}/test-procedure/parsed-script-data`;
            batch.push(this.http.get<Chapter[]>(url, { headers }).pipe(map((result: any) => ({ ...gti, chapters: result?.test_units }))));
        });
        return forkJoin(batch) as Observable<Gti[]>;
    }

    msnWithGtsi(msns: Msn[], ac_program_id: string, production_site_ids: string[]): Observable<Msn[]> {
        if (!msns || msns.length === 0) {
            return of([]);
        }

        const body = {
            ac_program_id,
            aircraft_ids: msns.map((msn) => msn.node_id),
            production_site_ids,
            statuses: AUTHORIZED_STATUS
        };

        const url = GTSI_TEST_MANAGEMENT_API + '/acgti/list?offset=0&limit=0'; // on récupère tous

        return this.http
            .post<Gti[]>(url, body, { headers })
            .pipe(map((result: any) => result.data))
            .pipe(map((resultdata) => msns.map((msn) => ({ ...msn, gtiList: resultdata.filter((gti) => gti.ac_msn_number === msn.msn) }))));
    }
}
