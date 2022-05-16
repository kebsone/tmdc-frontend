import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { SiteService } from 'src/app/services/site.services';
import { StorageService } from 'src/app/services/storage.service';
import { Program } from 'src/app/shared/model/program.model';

@Component({
    selector: 'tm-site-list',
    templateUrl: './site-list.component.html',
    styleUrls: ['./site-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteListComponent implements OnInit {
    sites$: Observable<any>;
    showSpinner = false;
    programName$: Observable<string>;
    constructor(private activeRoute: ActivatedRoute, private storageService: StorageService, private siteService: SiteService, private dataSharing: DataSharingService, private router: Router) {}

    ngOnInit(): void {
        this.programName$ = this.activeRoute.params.pipe(map((data) => data.programName));
        this.sites$ = this.dataSharing.getCureentProgram().pipe(switchMap((prog) => this.siteService.getSitesByProgramId('consult_root_gti', prog.code)));
    }

    formatName(name: string): string {
        return name ? name.split(' ')[2] : '';
    }
    siteChosed(site: any) {
        console.log(site);
        this.showSpinner = true;
        this.storageService.saveCurrentSite(site);
        const programName = site.short_name?.split(' ')[0] === 'S/A' ? 'A320' : site.short_name?.split(' ')[0];
        this.router.navigateByUrl(`${programName}/${site.production_location_id}/msn-list`);
    }

    backToProgramPage() {
        this.router.navigateByUrl('/program-list');
    }
}
