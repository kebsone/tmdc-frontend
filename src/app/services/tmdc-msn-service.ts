import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TmdcMsn, TmdcGti, TmdcLine } from '../shared/model/tmdc-model/tmdc-msn.model';
import { Observable, of } from 'rxjs';
import { Params } from '@angular/router';

@Injectable()
export class TmdcMsnSerivice {
    constructor(private http: HttpClient) {}

    addTmdcMsn(tmdcMsn: TmdcMsn): Observable<any> {
        console.log('DANS LE SAVE DUT MSN', tmdcMsn);

        const url = 'http://localhost:8080/api/msns/add';
        return this.http.post<TmdcMsn>(url, { ...tmdcMsn });
    }
    getMsn(msnNumber: string): Observable<any> {
        console.log(msnNumber);
        return of(msn);
    }
    getMsnByNumber(msnNumber: string, programCode: string, siteId: string): Observable<TmdcMsn> {
        console.log('hehehheheh', msnNumber);
        const params = new HttpParams().set('msnNumber', msnNumber).set('programCode', programCode).set('siteId', siteId);
        const url = `http://localhost:8080/api/msns/${msnNumber}/${programCode}/${siteId}`;
        console.log('testttt', url);
        return this.http.get<TmdcMsn>(url);
    }

    updateTmdcGtis(tmdcGtis: TmdcGti[], msnNumber: string, programCode: string, siteId: string): Observable<TmdcMsn> {
        console.log(tmdcGtis);
        const body = {
            gtis: tmdcGtis,
            msnNumber,
            programCode,
            siteId
        };
        const url = 'http://localhost:8080/api/msns/gtis';
        return this.http.put<TmdcMsn>(url, body);
    }

    editGti(tmdcGti: TmdcGti, msnNumber: string, programCode: string, siteId: string): Observable<TmdcMsn> {
        console.log(tmdcGti);
        const body = {
            gti: tmdcGti,
            msnNumber,
            programCode,
            siteId
        };
        const url = 'http://localhost:8080/api/msns/update';
        return this.http.put<TmdcMsn>(url, body);
    }

    addTmdcGtis(tmdcGtis: TmdcGti[], msnNumber: string, programCode: string, siteId: string): Observable<TmdcMsn> {
        console.log('DANS LE SERVICE', tmdcGtis);
        const body = {
            gtis: tmdcGtis,
            msnNumber,
            programCode,
            siteId
        };
        const url = 'http://localhost:8080/api/msns/gtis';
        return this.http.post<TmdcMsn>(url, body);
    }

    deletGtis(tmdcGtis: number[], msnNumber: string, programCode: string, siteId: string): Observable<TmdcMsn> {
        console.log('DANS LE SERVICE', tmdcGtis);
        const body = {
            gtis: tmdcGtis,
            msnNumber,
            programCode,
            siteId
        };
        const url = 'http://localhost:8080/api/msns/gtis';
        return this.http.delete<TmdcMsn>(url, { body });
    }

    getLinesRefByProgramCode(programCode: string): Observable<any> {
        const body = {
            programCode
        };

        const url = 'http://localhost:8080/api/linesRef/all';

        return this.http.post<any>(url, body);
    }

    allTmdcMsns(programCode: string, siteId: string): Observable<TmdcMsn[]> {
        console.log('dans l api', programCode, siteId);
        const url = `http://localhost:8080/api/msns/${programCode}/${siteId}`;
        console.log('testttt', url);
        return this.http.get<TmdcMsn[]>(url);
    }

    updateTmdcLines(lines: TmdcLine[], msnNumber: string, programCode: string, siteId: string): Observable<TmdcMsn> {
        const body = {
            lines,
            msnNumber,
            programCode,
            siteId
        };

        console.log('MON BODY VANT LA REQUETE', body);
        const url = `http://localhost:8080/api/msns/lines`;
        return this.http.put<TmdcMsn>(url, body);
    }
}

const msn = {
    msn: '20579',
    start: '2022-02-23 06:00:00',
    end: '2022-03-28 21:00:00',
    poste: 'P20',
    gtiList: [
        {
            rgti_title: 'GTI Test',
            reference: '1-012-120',
            status: 'NS',
            chapters: [
                {
                    numbering: '1',
                    duration: 25,
                    status: 'NS',
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

            rgti_reference: '1-012-120'
        },
        {
            rgti_title: 'Title',
            reference: '1-013-120',
            logical_station_short_name: 'P17',
            status: 'NS',
            chapters: [
                {
                    numbering: '1',
                    status: 'NS',
                    ac_testunit_title: 'Chap 1'
                },
                {
                    numbering: '2',
                    status: 'NS',
                    ac_testunit_title: 'Chap 2'
                },
                {
                    numbering: '3',
                    status: 'NS',
                    ac_testunit_title: 'Chap 3'
                }
            ],
            rgti_reference: '1-013-120'
        },
        {
            rgti_title: 'Test ',
            reference: '1-014-120',
            logical_station_short_name: 'P20',
            status: 'NS',
            chapters: [
                {
                    numbering: '1',
                    status: 'NS',
                    ac_testunit_title: 'Chap 1'
                },
                {
                    numbering: '2',
                    status: 'NS',
                    ac_testunit_title: 'Chap 2'
                },
                {
                    numbering: '3',
                    status: 'NS',
                    ac_testunit_title: 'Chap 3'
                }
            ],
            rgti_reference: '1-014-120'
        },
        {
            rgti_title: 'Application',
            reference: '1-015-120',
            logical_station_short_name: 'P20',
            status: 'NS',
            chapters: [
                {
                    numbering: '1',
                    status: 'NS',
                    ac_testunit_title: 'Chap 1'
                },
                {
                    numbering: '2',
                    status: 'NS',
                    ac_testunit_title: 'Chap 2'
                },
                {
                    numbering: '3',
                    status: 'NS',
                    ac_testunit_title: 'Chap 3'
                }
            ],
            rgti_reference: '1-015-120'
        },
        {
            rgti_title: 'gestion des erreurs',
            reference: '1-016-120',
            logical_station_short_name: 'P30',
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
                    duration: 30,
                    status: 'NS',
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
            chapters: [],
            rgti_reference: '1-018-120',
            status: 'NS',
            logical_station_short_name: 'P40'
        },
        {
            rgti_title: 'autres tests',
            reference: '1-019-120',
            rgti_reference: '1-019-120',
            chapters: [
                {
                    numbering: '1',
                    status: 'NS',
                    duration: 90,
                    ac_testunit_title: 'Chap 1test'
                },
                {
                    numbering: '2',
                    status: 'NS',
                    duration: 12,
                    ac_testunit_title: 'Chap 2test'
                },
                {
                    numbering: '3',
                    status: 'NS',
                    ac_testunit_title: 'Chap 3test'
                }
            ],
            status: 'NS',
            logical_station_short_name: 'P40'
        },
        {
            rgti_title: 'GTI Test',
            reference: '2-011-120',
            logical_station_short_name: 'P30',
            chapters: [],
            status: 'NS',
            rgti_reference: '2-011-120'
        }
    ],
    status: 'DECLARED',
    engine_type: 'AX_250'
};
