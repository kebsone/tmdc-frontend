import { Injectable } from '@angular/core';
import { Program } from '../shared/model/program.model';
import { ProductionSite } from '../shared/model/site.model';
import { PRODUCTION_SITE_KEY, PROGRAMS_KEY, PROGRAM_KEY, TOKEN_KEY, TOKEN_DURATION, TMDC_USER_KEY } from '../shared/router/router.model';
import { DataSharingService } from './dataSharing.service';
import { TmdcUser } from '../shared/model/tmdc-model/tmdc-user.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private dataSharingService: DataSharingService) {}

    signOut() {
        window.localStorage.clear();
        this.dataSharingService.setToken('');
        this.dataSharingService.setPrograms([]);
    }

    public saveToken(token: string) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
        this.dataSharingService.setToken(token);
    }

    public getToken(): string {
        return window.localStorage.getItem(TOKEN_KEY) as string;
    }

    public savePrograms(programs: Program[]) {
        window.localStorage.removeItem(PROGRAMS_KEY);
        window.localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
        this.dataSharingService.setPrograms(programs);
    }

    public saveCurrentProgram(program: Program) {
        window.localStorage.removeItem(PROGRAM_KEY);
        window.localStorage.setItem(PROGRAM_KEY, JSON.stringify(program));
        this.dataSharingService.setCurrentProgram(program);
    }

    public saveCurrentSite(site: ProductionSite) {
        window.localStorage.removeItem(PRODUCTION_SITE_KEY);
        window.localStorage.setItem(PRODUCTION_SITE_KEY, JSON.stringify(site));
        this.dataSharingService.setCurrentSite(site);
    }

    public getPrograms(): any {
        console.log(JSON.parse(window.localStorage.getItem(PROGRAMS_KEY)));
        return JSON.parse(window.localStorage.getItem(PROGRAMS_KEY));
    }

    public saveExpiresIn(value: number) {
        window.localStorage.removeItem(TOKEN_DURATION);
        window.localStorage.setItem(TOKEN_DURATION, value.toString());
        this.dataSharingService.setTokenDuration(value);
    }

    public saveCurrentTmdcUser(user: TmdcUser) {
        window.localStorage.removeItem(TMDC_USER_KEY);
        window.localStorage.setItem(TMDC_USER_KEY, JSON.stringify(user));
        this.dataSharingService.setTmdcUser(user);
    }
}
