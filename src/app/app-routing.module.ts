import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BicycleComponent } from './components/bicycle/bicycle.component';
import { GtiListComponent } from './components/gti-list/gti-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MsnListComponent } from './components/msn-list/msn-list.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { PlannerComponent } from './components/planner/planner.component';
import { PlannerResolverService } from './components/planner/planner.resolver';
import { PrincipalComponent } from './components/planner/principal/principal.component';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { RtiListComponent } from './components/rti-list/rti-list.component';
import { SiteListComponent } from './components/site-list/site-list.component';
import { ManagerComponent } from './components/manager/manager.component';
import { AuthGuardService } from './services/auth-gard.service';
import { MsnListResolver } from './services/msn-list-resolver';
import { RouterPaths } from './shared/router/router.model';
import { GtiListResolver } from './services/gti-list.resolver';
import { NotebookResolver } from './services/notebook.resolver';

const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    {
        path: '',
        component: LoginComponent
    },

    {
        path: 'program-list',
        component: ProgramListComponent
    },

    {
        path: ':programName' + '/site_list',
        component: SiteListComponent
    },
    //TODO
    // {
    //     path: ':programName' + '/:siteName' + '/msn-list',
    //     component: MsnListComponent,
    //     canActivate: [AuthGuardService],
    //     resolve: {
    //         msns: MsnListResolver
    //     }
    // },

    {
        path: 'A330/fal-toulouse/msn-list',
        component: MsnListComponent,
        resolve: {
            msns: MsnListResolver
        }
    },
    {
        path: ':program' + '/:siteName' + '/msn-list' + '/:msn' + '/gti-list',
        component: GtiListComponent,
        resolve: {
            gtis: GtiListResolver
        }
        // canActivate: [AuthGuardService] TODO
    },

    {
        path: ':program' + '/:siteName' + '/msn-list' + '/:msn' + '/root-gti-list',
        component: RtiListComponent,
        canActivate: [AuthGuardService]
    },

    { path: 'managers', component: ManagerComponent, canActivate: [AuthGuardService] },

    {
        path: RouterPaths.NOTEBOOK + '/:id',
        component: NotebookComponent,
        resolve: { notebookData: NotebookResolver }
    },

    {
        path: ':program' + '/:siteName' + '/msn-list' + '/:msn' + '/planner',
        component: PrincipalComponent,
        resolve: { plannerData: PlannerResolverService }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
