import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSharingService } from './dataSharing.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { SessionExpiredModalComponent } from '../session-expired-modal/session-expired-modal.component';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private dataSharingService: DataSharingService, private route: Router, private dialogService: DialogService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        let token;
        this.dataSharingService.getToken().subscribe((value) => (token = value));
        if (!token) {
            return next.handle(req);
        }
        authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
        return next.handle(authReq).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                },
                (error: any) => {
                    // Expired Token
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 401) {
                            // window.localStorage.clear();
                            // this.route.navigateByUrl('/');
                            this.dialogService.open(SessionExpiredModalComponent, {
                                header: 'Session expired',
                                width: '30%'
                            });
                        }
                    }
                }
            )
        );
    }
}
export const authInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
