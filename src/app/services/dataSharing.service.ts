import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Program } from '../shared/model/program.model';
import { ProductionSite } from '../shared/model/site.model';
import { PROGRAMS_KEY, TOKEN_KEY } from '../shared/router/router.model';
import { TmdcUser } from '../shared/model/tmdc-model/tmdc-user.model';
import { User } from '../shared/model/gti.model';

@Injectable()
export class DataSharingService {
    private programs = window.localStorage.getItem('program');
    private currentProgram = window.localStorage.getItem('currentProgram');
    private currentToken = window.localStorage.getItem('auth-token');
    private currentSite = window.localStorage.getItem('currentSite');
    private tokenDuration = window.localStorage.getItem('expiresIn');
    private tmdcUser = window.localStorage.getItem('tmdcUser');

    private _token: BehaviorSubject<string> = new BehaviorSubject(this.currentToken);
    private _currentProgram: BehaviorSubject<Program> = new BehaviorSubject(JSON.parse(this.currentProgram));
    private _currentSite: BehaviorSubject<ProductionSite> = new BehaviorSubject(JSON.parse(this.currentSite));
    private _tokenDuration: BehaviorSubject<number> = new BehaviorSubject(+this.tokenDuration);
    private _tmdcUser: BehaviorSubject<TmdcUser> = new BehaviorSubject(JSON.parse(this.tmdcUser));

    private _programs: BehaviorSubject<Program[]> = new BehaviorSubject(JSON.parse(this.programs));
    public getPrograms(): Observable<Program[]> {
        return this._programs.asObservable();
    }

    public setPrograms(programs: Program[]) {
        this._programs.next(programs);
    }

    public setToken(token: string) {
        this._token.next(token);
    }

    public getToken(): Observable<string> {
        return this._token.asObservable();
    }

    public setCurrentProgram(program: Program) {
        this._currentProgram.next(program);
    }

    public getCureentProgram(): Observable<Program> {
     return  of({name: "A330", code: "L"})   // TODO this._currentProgram.asObservable();
    }

    public setCurrentSite(site: ProductionSite) {
        this._currentSite.next(site);
    }

    public getCurrentSite(): Observable<ProductionSite> {
        return of({short_name:"FAL TLS",  production_location_id:"a330_fal_toulouse",     name:"FAL TLS", ac_program_id:"id_fal_tls" , logical_stations:[
            {
                short_name: "P40"
            },
            {
                short_name: "P30"
            },
             {
                short_name: "P20"
            }, {
                short_name: "P25"
            },
            {
                short_name: "P17"
            }
            
        ]})        // TODO this._currentSite.asObservable();
    }

    public setTokenDuration(value: number) {
        this._tokenDuration.next(value);
    }

    public setTmdcUser(user: TmdcUser) {
        this._tmdcUser.next(user);
    }

    public getCurrentTmdcUser(): Observable<TmdcUser> {
        return  of({
            firstName:"serigne", lastName:"kebe", email:"ldds@dsd.fr", isManager: true
        
        })    //this._tmdcUser.asObservable();
    }
}
