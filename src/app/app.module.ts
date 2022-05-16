import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MenubarModule } from 'primeng/menubar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TreeTableModule } from 'primeng/treetable';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGrid from '@fullcalendar/timegrid';
import { PlannerService } from './components/planner/planner.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from './shared/shared.service';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { MsnListComponent } from './components/msn-list/msn-list.component';
import { BicycleComponent } from './components/bicycle/bicycle.component';
import { NoteboookDayComponent } from './components/notebook/noteboook-day/noteboook-day.component';
import { NotebookGtiComponent } from './components/notebook/notebook-gti/notebook-gti.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { MessageModule } from 'primeng/message';
import { ListboxModule } from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { PlannerComponent } from './components/planner/planner.component';
import { ManagerLinesService } from './components/bicycle/service/managerLines-service';
import { MsnService } from './components/bicycle/service/msn-service';
import { PickListModule } from 'primeng/picklist';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NodeService } from './components/msn-list/nodeservice';
import { ProgressBarModule } from 'primeng/progressbar';
import { TreeModule } from 'primeng/tree';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PrincipalComponent } from './components/planner/principal/principal.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FilterService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MsnCardComponent } from './components/msn-list/msn-card/msn-card.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';
import { DataSharingService } from './services/dataSharing.service';
import { ProgramService } from './services/program.service';
import { FileUploadModule } from 'primeng/fileupload';
import { authInterceptorProviders } from './services/auth-interceptor';
import MsnListService from './services/msn-list-service';
import { AuthGuardService } from './services/auth-gard.service';
import { ProductionLineService } from './services/production-line.service';
import { GtiService } from './services/gti.service';
import { StepsModule } from 'primeng/steps';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { SiteListComponent } from './components/site-list/site-list.component';
import { SiteService } from './services/site.services';
import { RootGtiService } from './services/root-gti.service';
import { MsnListResolver } from './services/msn-list-resolver';
import { RtiListComponent } from './components/rti-list/rti-list.component';
import { GtiListComponent } from './components/gti-list/gti-list.component';
import { ManagerComponent } from './components/manager/manager.component';
import { GtiListResolver } from './services/gti-list.resolver';
import { SessionExpiredModalComponent } from './session-expired-modal/session-expired-modal.component';
import { ManagerService } from './services/managerService';
import { TmdcMsnSerivice } from './services/tmdc-msn-service';
import { TimelineModule } from 'primeng/timeline';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NotebookResolver } from './services/notebook.resolver';
import { NotebookInformationGeneralComponent } from './components/notebook/notebook-information-general/notebook-information-general.component';
import { NotebookDailyCommunicationComponent } from './components/notebook/notebook-daily-communication/notebook-daily-communication.component';
FullCalendarModule.registerPlugins([
    // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin,
    timeGrid
]);

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PlannerComponent,
        HomeComponent,
        MsnListComponent,
        BicycleComponent,
        NoteboookDayComponent,
        NotebookGtiComponent,
        NotebookComponent,
        LoginComponent,
        PrincipalComponent,
        MsnCardComponent,
        FooterComponent,
        LoginComponent,
        GtiListComponent,
        ProgramListComponent,
        SiteListComponent,
        RtiListComponent,
        ManagerComponent,
        SessionExpiredModalComponent,
        NotebookInformationGeneralComponent,
        NotebookDailyCommunicationComponent
    ],

    imports: [
        FullCalendarModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MenubarModule,
        InputTextModule,
        ButtonModule,
        TreeTableModule,
        SplitButtonModule,
        FileUploadModule,
        SpeedDialModule,
        PanelModule,
        SharedModule,
        MenuModule,
        SidebarModule,
        BadgeModule,
        HttpClientModule,
        TooltipModule,
        ToolbarModule,
        CarouselModule,
        TableModule,
        TabViewModule,
        DividerModule,
        FieldsetModule,
        DialogModule,
        CardModule,
        ContextMenuModule,
        ConfirmDialogModule,
        DynamicDialogModule,
        DropdownModule,
        ToastModule,
        MessagesModule,
        ListboxModule,
        MessageModule,
        ChipModule,
        AvatarModule,
        FormsModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        MultiSelectModule,
        SplitterModule,
        ScrollPanelModule,
        ListboxModule,
        PickListModule,
        ProgressBarModule,
        TreeModule,
        SelectButtonModule,
        ProgressSpinnerModule,
        InputTextareaModule,
        AutoCompleteModule,
        CheckboxModule,
        StepsModule,
        TimelineModule,
        RadioButtonModule,
        ReactiveFormsModule
    ],

    providers: [
        MessageService,
        FilterService,
        PlannerService,
        SharedService,
        ConfirmationService,
        ManagerLinesService,
        DialogService,
        MsnService,
        NodeService,
        LoginService,
        DataSharingService,
        ProgramService,
        authInterceptorProviders,
        MsnListService,
        AuthGuardService,
        ProductionLineService,
        GtiService,
        SiteService,
        RootGtiService,
        MsnListResolver,
        GtiListResolver,
        ManagerService,
        TmdcMsnSerivice,
        NotebookResolver
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
