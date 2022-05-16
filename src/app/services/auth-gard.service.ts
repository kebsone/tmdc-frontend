import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataSharingService } from './dataSharing.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private dataSharingSerive: DataSharingService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        this.dataSharingSerive.getToken().subscribe((token) => {
            if (!token) {
                this.router.navigateByUrl('/');
                return false;
            }
        });

        return true;
    }
}
