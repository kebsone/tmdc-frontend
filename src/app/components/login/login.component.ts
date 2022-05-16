import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from 'src/app/services/login.service';
import { ProgramService } from 'src/app/services/program.service';
import { StorageService } from 'src/app/services/storage.service';
import { Program } from 'src/app/shared/model/program.model';
import { ManagerService } from '../../services/managerService';
import { User } from '../../shared/model/gti.model';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'tm-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
    userName: string;
    password: string;
    loginForm: FormGroup;
    identifiant_ok: boolean = true;
    submitted = false;
    returnUrl: string;
    programs: Program[];
    programData: any = [];
    private _subs$: Subscription = new Subscription();
    constructor(
        private route: ActivatedRoute,
        private storageService: StorageService,
        private router: Router,
        private loginService: LoginService,
        private messageService: MessageService,
        private programService: ProgramService,
        private managerService: ManagerService
    ) {}

    ngOnInit() {}

    onSubmit() {
        this._subs$.add(
            this.loginService.getAuthentification(this.userName, this.password).subscribe(
                (retour) => {
                    if (retour !== null) {
                        console.log(retour);
                        const user = JSON.parse(window.atob(retour.accessToken.split('.')[1])).user;
                        console.log(user);
                        this.managerService.addTmdcUser(user).subscribe((result) => {
                            console.log(result);
                            this.storageService.saveCurrentTmdcUser(result);
                        });

                        this.storageService.saveToken(retour.accessToken);
                        this.programService // get the program list of user connected
                            .getPrograms('consult_root_gti')
                            .then((datas) => {
                                this.storageService.savePrograms(datas);

                                this.router.navigateByUrl(`program-list`);
                            });
                    }
                },
                (error) => {
                    this.identifiant_ok = false;
                    this.messageService.add({ severity: 'error', summary: 'Erreur: ', detail: 'Incorrect login or password', life: 3000 });
                    if (error.status == 401) {
                        console.log('---Failed Incorrect login or password---');
                    }
                    console.log('detail of error:  ', error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this._subs$.unsubscribe();
    }
}
