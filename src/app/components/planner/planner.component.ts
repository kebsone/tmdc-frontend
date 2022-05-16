import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; // useful for typechecking
import resourceTimeline from '@fullcalendar/resource-timeline';
import interaction, { EventDragStartArg, EventResizeDoneArg } from '@fullcalendar/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Resource } from './shared/resource.model';
import * as PlannerUtils from './shared/planner.utils';
import { DOCUMENT } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import timeGrid from '@fullcalendar/timegrid';
import { SharedService } from 'src/app/shared/shared.service';
import { Fal, Interval, Msn } from './shared/msn.model';
import * as moment from 'moment';
import * as TmdcUtils from '../../shared/tmdc-utils';
import { TmdcMsn, TmdcGti, TmdcLine, TmdcPoste, TmdcChapter, TMDC_MINIMAL_DURATION } from '../../shared/model/tmdc-model/tmdc-msn.model';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';
import { TreeTableService } from 'primeng/treetable';
FullCalendarModule.registerPlugins([
    // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin,
    timeGrid
]);
@Component({
    selector: 'tm-planner',
    templateUrl: './planner.component.html',
    styleUrls: ['./planner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlannerComponent implements OnInit, OnDestroy {
    display = false;
    displayModalNew = false;
    displayDetails = false;
    items: MenuItem[];
    itemsBreadCrumb: MenuItem[];
    selectedInfo: any;
    private _subscription$: Subscription = new Subscription();
    events$: Observable<Event[]>;
    events: TmdcGti[] = [];
    calendarOptions: CalendarOptions;
    resourcesSelection: TmdcLine[];
    newEvent: TmdcGti;
    selected: TmdcGti;
    chapters: TmdcChapter[];
    chaptersInEdit: TmdcChapter[];
    selectedChaptersInEdit: TmdcChapter[];
    selectedChapters: TmdcChapter[];
    gtsiError = false;
    displayModalEdit = false;
    displayModalDuplicate = false;
    displayModalDetailsView = false;
    start: string;
    itemsActions: MenuItem[];
    found: any;
    dragtLeftStart: boolean;
    dragRightStart: boolean;
    verticalDragStart: boolean;
    inSameLine: boolean;
    resource: TmdcLine;
    _gtis: TmdcGti[];
    _resources: TmdcLine[];
    _currentMsn: TmdcMsn;
    selectedPoste: string;
    postes: TmdcPoste[];
    editingGtis: TmdcGti[];
    startEndDate: any[];
    TmdcUtils = TmdcUtils;
    @Input()
    mode: string;
    @Input()
    currentFal: Fal;

    resources: TmdcLine[];
    @Input()
    set currentMsn(msn: TmdcMsn) {
        console.log('MSN RECU', msn);
        this.postes = msn.postes;
        this.selectedPoste = msn.selectedPoste || TmdcUtils.sortLogicalStation(msn.postes)[0].name;
        this.gtis = PlannerUtils.allTmdcGtis(msn, this.selectedPoste, this.mode);

        this.resources = PlannerUtils.calculateTryValues(msn.postes.find((posteTmp) => posteTmp.name === this.selectedPoste).lines, this.gtis);
        this._currentMsn = msn;
        this.hourOrder = 1;
        console.log('LES GTIS', this.gtis, this.resources);
        this._initCalendarOptions();
    }

    @Input()
    saveGti() {
        this.onSave();
    }

    get currentMsn() {
        return this._currentMsn;
    }

    gtis: TmdcGti[];
    selectedEvent: any;

    @Input()
    hourOrder: number;

    @Input()
    interval: Interval;

    @Output() onTmdcGtisUpdated = new EventEmitter<TmdcGti[]>();

    @Output() onDeleteGtisEvent = new EventEmitter<TmdcGti[]>();

    @Output() onEditGtisEvent = new EventEmitter<TmdcGti[]>();
    @Output()
    onCurrentPosteChanged = new EventEmitter<string>();
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    // handler to call when windows is clicked
    _externalClickHandler!: { ($event: any): void; (this: Window, ev: MouseEvent): any };
    get lineTile(): string {
        return this.resource ? this.resource.title : 'Lines';
    }

    get gtisToPlace(): TmdcGti[] {
        let result = [];
        if (!this.resource || this.resource.try == 0 || !this.resource.gtis || this.resource.gtis.length == 0) {
            return [];
        }
        for (let i = 0; i < this.resource.gtis.length; i++) {
            const gti = this.resource.gtis[i];
            if (PlannerUtils.atLeastOneNoPlace(gti.chapters)) {
                result.push(gti);
            }
        }
        return result;
    }
    get chaptersToPlace(): TmdcChapter[] {
        return this.selected && this.selected.chapters && this.selected.chapters.length > 0 ? this.selected.chapters.filter((chapt) => !chapt.alreadyPlace) : [];
    }
    get isDisabled() {
        return !this.selectedInfo;
    }

    get isDuplicated() {
        return this.selectedInfo && this.selectedInfo.event && this.selectedInfo.event._def.extendedProps.isDuplicated;
    }

    get selectedGti() {
        return this.selectedInfo ? PlannerUtils.toTMDCEvent(this.currentMsn.start, this.selectedInfo.event) : null;
    }

    get availableResources(): TmdcLine[] {
        return this.resources && this.resources.length > 0 && this.selectedInfo
            ? this.resources.filter((line) => line.title !== 'Undef' && line.id !== this.selectedInfo.event._def.extendedProps.line.id)
            : [];
    }
    get disabledEdit(): boolean {
        if (this.selectedChaptersInEdit && this.selectedChaptersInEdit.length > 0 && this.chaptersInEdit && this.chaptersInEdit.length > 0) {
            const selectedChaptersIds = this.selectedChaptersInEdit.map((chp) => chp.id);
            const unSelectedChapts = this.chaptersInEdit.filter((chap) => !selectedChaptersIds.includes(chap.id)).map((chapt) => ({ ...chapt, alreadyPlace: false }));
            console.log('Unselect', unSelectedChapts);
            return unSelectedChapts && unSelectedChapts.length > 0;
        }
        return false;
    }
    get chaptersAlreadyPlace(): TmdcChapter[] {
        return this.chaptersInEdit && this.chaptersInEdit.length > 0 ? this.chaptersInEdit.filter((chapt) => chapt.alreadyPlace) : [];
    }

    get availableChapters(): TmdcChapter[] {
        return this.selectedGti && this.selectedGti.chapters ? this.selectedGti.chapters.filter((chapt) => chapt.alreadyPlace) : [];
    }
    constructor(private route: Router, private changeDetectorRef: ChangeDetectorRef, private confirmationService: ConfirmationService, private messageService: MessageService) {}

    ngOnInit(): void {
        /**
         * Init calendar options
         */
        this._initCalendarOptions();
    }

    addGti() {
        this.displayModalNew = true;
        this.changeDetectorRef.markForCheck();
    }
    private _initCalendarOptions() {
        console.log(this.gtis, this.resources);
        this.calendarOptions = {
            plugins: [interaction, resourceTimeline],
            initialView: 'resourceTimeline',
            droppable: false,
            allDaySlot: false,
            nowIndicator: true,
            slotMinTime: this._getminTime(), // on commence par l'heure du start du MSN
            slotMaxTime: this._getHours(),
            initialDate: this._getStartDate(),
            // weekends: false, // on ne prend pas en compte samedi et dimanche
            slotDuration: { hours: 1 }, // durée minimale
            slotMinWidth: this.interval ? 50 : 80, // width des cellules
            selectable: true,
            locale: 'fr',
            slotLabelContent: (arg) => {
                if (arg.level === 0) {
                    let order = this.hourOrder++;
                    return {
                        html: `
                        <span class="tm-planner-hour">${order}h</span>` //<pan>${arg.text}</span> <br>
                    };
                }
                return arg.text;
            },

            headerToolbar: false,
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                meridiem: false
            },
            eventOverlap: false, // un GTI par date
            selectOverlap: function (event) {
                return true;
            },

            select: (info) => {
                this.selectedInfo = null;
                this.selectedEvent = info;
                this.resource = PlannerUtils.toTMDCResource(info.resource);
                this.changeDetectorRef.markForCheck();
            },

            eventClick(arg) {
                console.log(arg);
            },

            eventDrop: (info) => {
                console.log(info.event, info.oldEvent);

                if (!info.event._def.resourceIds || !info.oldEvent._def.resourceIds) {
                    return;
                }
                if (info.event._def.extendedProps.parentId || (info.event._def.extendedProps.isDuplicated && info.event._def.resourceIds[0] !== info.oldEvent._def.resourceIds[0])) {
                    info.revert();
                } else {
                    this._updateEvent(info);
                }
            },
            height: 'auto',
            eventDidMount: (info) => {
                this.hourOrder = 1;
                info.el.addEventListener(
                    'contextmenu',
                    (ev) => {
                        this.selectedInfo = info;
                        this.changeDetectorRef.markForCheck();
                        this.chaptersInEdit = info.event._def.extendedProps?.chapters;
                        this.selectedChaptersInEdit = info.event._def.extendedProps?.chapters;
                        this.displayDetails = true;
                        this.selectedEvent = null;
                        ev.preventDefault();
                        return false;
                    },
                    false
                );
            },
            eventResize: (event: EventResizeDoneArg) => {
                event.revert();
            },
            editable: this.mode === 'edit',

            eventContent: (arg) => {
                return this.getFormatedEventRender(arg);
            },

            // aspectRatio: 1.605,
            resourceLabelContent: (arg) => {
                if (this.mode === 'view') {
                    // Mode View on n'affiche pas Reliquat
                    return;
                }
                return {
                    html: `${arg.resource._resource.title}`
                };
            },

            events: this.gtis,
            resourceAreaColumns:
                this.mode === 'edit'
                    ? [
                          {
                              field: 'title',
                              headerContent: 'Lines',
                              width: 120
                          },
                          {
                              field: 'try',
                              headerContent: 'Try',
                              width: 50,
                              cellClassNames: 'ressource-try-content'
                          }
                      ]
                    : [
                          {
                              field: 'title',
                              headerContent: 'Lines'
                          }
                      ],

            resources: this.resources,
            resourceOrder: '-title',
            eventResourceEditable: this.mode === 'edit',
            resourceAreaWidth: this.mode === 'edit' ? '170px' : '70px' // Largeur du tableau des resourcexws
        };
        this.changeDetectorRef.markForCheck();
    }

    _getStartDate() {
        return this.interval ? this.interval.start : this.currentMsn.start;
    }

    _getminTime() {
        return this.interval ? moment(this.interval.start).format('HH:mm') : moment(this.currentMsn.start).format('HH:mm') || '01:00';
    }

    private _getHours() {
        if (this.interval) {
            const end = moment(this.interval.end);
            const start = moment(moment(this.interval.start).format('YYYY-MM-DD hh:mm'));
            return { hours: +moment(end.diff(start, 'hours')) + (+moment(start.diff(moment(new Date(moment(start).format('YYYY-MM-DD'))), 'hours')) + 1) }; // 40h
        }
        const end = moment(this.currentMsn.end);
        const start = moment(moment(this.currentMsn.start).format('YYYY-MM-DD'));
        return { hours: +moment(end.diff(start, 'hours')) };
    }

    onContextMenu(event: any) {
        console.log(event);
        // If selected info show modal for items else do nothing
        if (this.mode === 'view' || (!this.selectedEvent && !this.selectedInfo)) {
            event.stopPropagation();
            event.stopImmediatePropagation();
        } else {
            this._initContexMenuitems(event);
        }
    }
    onTmdcGtiChange(event: any) {
        this.chapters = event.value.chapters;
        this.gtsiError = false;
        this.changeDetectorRef.markForCheck();
    }
    openAdditemModal() {
        this.displayModalNew = true;
        this.changeDetectorRef.markForCheck();
    }

    onSave(): void {
        // Guard
        if (!this.selected || !this.selectedChapters || this.selectedChapters.length <= 0) {
            this.messageService.add({ severity: 'error', summary: 'New item', detail: 'Please select one chapter or more!' });
            return;
        }
        const chaptersToAdd = this.selectedChapters.map((chapt) => ({ ...chapt, alreadyPlace: true }));
        const newGti: TmdcGti = {
            ...this.selected,
            isDuplicated: false,
            gtiDuration: this.selected.gtiDuration,
            start: this.selectedEvent.startStr,
            //  end: this.selectedEvent.endStr,
            chapters: chaptersToAdd,
            idTmdcGti: null,
            uiId: PlannerUtils.random(),
            groupId: PlannerUtils.random()
        };

        const chaptersToAddIds = chaptersToAdd.map((chap) => chap.id);
        const selectedChapters = this.selected.chapters.filter((chap) => !chaptersToAddIds.includes(chap.id));

        const selected = { ...this.selected, chapters: selectedChapters, inEdit: true };
        this.onEditGtisEvent.emit([newGti, selected]);
        this.selectedInfo = null;
        this.displayModalNew = false;
    }

    _getChildren(gti: TmdcGti, event: any = null): TmdcGti[] {
        let result = (this.gtis.filter((gt) => gt.parentId === gti.uiId) || []).map((elem) => ({ ...elem, position: gti.position }));
        if (!event) {
            return result;
        }

        const daysDelta = event.delta.days;
        const millisecondsDelata = event.delta.milliseconds;
        return result && result.length > 0
            ? result.map((child) => ({
                  ...child,
                  start: moment(child.start).add({ days: daysDelta, milliseconds: millisecondsDelata }).format(PlannerUtils.DATE_FORMAT)
                  // end: moment(child.end).add({ days: daysDelta, milliseconds: millisecondsDelata }).format(PlannerUtils.DATE_FORMAT)
              }))
            : [];
    }

    _updateGtiPosition(gtis: TmdcGti[], gti: TmdcGti): TmdcGti[] {
        let result = [];
        const start = moment(moment(gti.start).format('YYYY-MM-DD HH:MM'));

        for (let i = 0; i < gtis.length; i++) {
            let elem = gtis[i];
            const startTmpBis = moment(moment(elem.start).format('YYYY-MM-DD HH:MM'));
            const position = Math.abs(+moment(startTmpBis.diff(start, 'hours'))) + gti.position;
            elem = { ...elem, position };
            result.push(elem);
        }
        return result;
    }

    _updateEvent(event: any) {
        const oldEvent = PlannerUtils.toTMDCEvent(this.currentMsn.start, event.oldEvent);
        let newTmdcGti = PlannerUtils.toTMDCEvent(this.currentMsn.start, event.event, oldEvent.resourceId);

        if (oldEvent.resourceId !== newTmdcGti.resourceId) {
            this.dragtLeftStart = false;
            this.dragRightStart = false;
            this.verticalDragStart = true;
        } else if (moment(oldEvent.start).isBefore(moment(newTmdcGti.start))) {
            this.dragtLeftStart = false;
            this.dragRightStart = true;
            this.verticalDragStart = false;
        } else {
            this.dragtLeftStart = true;
            this.dragRightStart = false;
            this.verticalDragStart = false;
        }

        let children = this._getChildren(newTmdcGti, event);
        newTmdcGti = { ...newTmdcGti, line: this.resources.find((line) => line.id === newTmdcGti.resourceId) };
        children.push(newTmdcGti);
        /// Before saving
        if (children && children.length > 0) {
            const ids = children.map((contact) => contact.uiId);
            const gtis = this.gtis.filter((gt) => !ids.includes(gt.uiId));
            children = children.map((ct) => ({ ...ct, inEdit: true }));
            this.gtis = [...gtis, ...children];
        }

        this.changeDetectorRef.markForCheck();
        this.updateTmdcGtis(this.gtis);
    }

    onCancel(): void {
        this._initparams();
    }

    private _initparams(): void {
        this.selectedInfo = null;
        this.selected = null;
        this.selectedEvent = null;
        this.selectedChapters = [];
        this.displayModalNew = false;
        this.chapters = [];
        this.selectedChaptersInEdit = [];
        this.chaptersInEdit = [];
        this.changeDetectorRef.markForCheck();
    }

    onEditModalCancel(): void {
        this.displayModalEdit = false;
    }
    onEditModalSave(): void {
        if (!this.selectedGti) {
            return;
        }
        if (!this.selectedChaptersInEdit || !this.chaptersInEdit) {
            return;
        }
        if (this.selectedChaptersInEdit.length === this.chaptersInEdit.length) {
            return;
        }
        const selectedChaptersIds = this.selectedChaptersInEdit.map((chp) => chp.id);
        const unSelectedChapts = this.chaptersInEdit.filter((chap) => !selectedChaptersIds.includes(chap.id)).map((chapt) => ({ ...chapt, alreadyPlace: false }));
        const updatedChapters = [...this.selectedChaptersInEdit, ...unSelectedChapts];
        let updatedGti: TmdcGti = { ...this.selectedGti, chapters: updatedChapters, inEdit: true };

        this.onEditGtisEvent.emit([updatedGti]);
        this.selectedInfo = null;
        this.displayModalEdit = false;
    }

    onDeleteGti() {
        if (this.selectedInfo && this.selectedInfo.event && this.selectedInfo.event._def) {
            let gti = PlannerUtils.toTMDCEvent(this.currentMsn.start, this.selectedInfo.event);
            const undefLine = this.currentMsn.postes.find((poste) => poste.name === this.selectedPoste).lines.find((line) => line.title === 'Undef');
            let children = [];
            const firstEmptyCell = PlannerUtils.findLastEmptyCell(this.gtis, this.currentMsn.start, gti.gtiDuration);

            // Si on supprime un GTI qui était dupliqué, supprimer les enfants
            if (gti.isDuplicated) {
                children = this.gtis.filter((gt) => gt.parentId === gti.uiId).map((gt) => ({ ...gt, toDelete: true }));
            }
            // si on supprime un child , supprimer directement depuis la DB
            if (gti.parentId) {
                gti = { ...gti, toDelete: true };
            } else {
                // Si le gti n'est pas un dupliqué on le remet dans la ligne undef

                const updateChapters = gti.chapters && gti.chapters.length > 0 ? gti.chapters.map((chap) => ({ ...chap, alreadyPlace: true })) : [];

                gti = {
                    ...gti,
                    chapters: updateChapters,
                    line: undefLine,
                    resourceId: undefLine.id,
                    ...firstEmptyCell,
                    isDuplicated: false,
                    groupId: PlannerUtils.random(),
                    leftRelatedIds: [],
                    rightRelatedIds: []
                };
            }
            const result = [...children, gti];
            this.selectedInfo = null;
            this.onDeleteGtisEvent.emit(result);
        }
    }

    onDuplicateModalCancel() {
        this.displayModalDuplicate = false;
    }

    onDuplicateModalSave() {
        let newTmdcGtiTmp = this.gtis.find((event) => event.uiId === this.selectedInfo.event._def.extendedProps.uiId);
        let currentTmdcGti = PlannerUtils.toTMDCEvent(this.currentMsn.start, this.selectedInfo.event);

        let gtisToAdd = [];
        let children = [];
        if (currentTmdcGti) {
            if (currentTmdcGti.isDuplicated) {
                children = this._getChildren(currentTmdcGti).map((gti) => ({ ...gti, toDelete: true }));
            }
            let i = 0;
            console.log(this.resourcesSelection, children);
            let duration = Math.floor(newTmdcGtiTmp.gtiDuration / this.resourcesSelection.length + 1);
            duration = duration < TMDC_MINIMAL_DURATION ? TMDC_MINIMAL_DURATION : duration;
            // On ne duplique pas sur la ligne Undef ni sur la même ligne
            while (i < this.resourcesSelection.length) {
                let gtsiTmp: TmdcGti;
                // On ne duplique pas sur la ligne Undef même si elle est sélectionnée
                if (this.resourcesSelection[i].title == 'Undef' || this.resourcesSelection[i].id === this.selectedInfo.event._def.resourceIds[0]) {
                    i = i + 1;
                } else {
                    gtsiTmp = {
                        ...newTmdcGtiTmp,
                        idTmdcGti: undefined,
                        line: this.resourcesSelection[i],
                        //   end: moment(newTmdcGtiTmp.start).add(duration, 'minutes').format(PlannerUtils.DATE_FORMAT),
                        uiId: PlannerUtils.random(),
                        resourceId: this.resourcesSelection[i].id,
                        isDuplicated: false,
                        className: newTmdcGtiTmp.className,
                        parentId: newTmdcGtiTmp.uiId,
                        gtiDuration: duration,
                        chapters: newTmdcGtiTmp.chapters && newTmdcGtiTmp.chapters.length > 0 ? newTmdcGtiTmp.chapters.filter((chap) => chap.alreadyPlace) : []
                    };

                    gtisToAdd.push(gtsiTmp);
                    i = i + 1;
                }
            }
            currentTmdcGti.gtiDuration = duration;
        }

        gtisToAdd = [...gtisToAdd, { ...currentTmdcGti, resourceEditable: false, isDuplicated: true, inEdit: true }, ...children];
        this.displayModalDuplicate = false;
        this.resourcesSelection = [];
        this.selectedInfo = null;
        console.log(gtisToAdd);
        this.onEditGtisEvent.emit(gtisToAdd);
    }

    private _initContexMenuitems(event: any) {
        console.log(event);
        if (this.mode === 'view' || (!this.selectedEvent && !this.selectedInfo)) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            return;
        }
        if (this.selectedEvent) {
            this.items = [
                {
                    label: 'Add GTI',
                    command: () => {
                        this.displayModalNew = true;
                    },
                    visible: this.selectedGti?.line?.title !== 'Undef' && !this.selectedGti?.parentId
                }
            ];
            return;
        }
        if (this.selectedInfo.event._def.extendedProps.isDuplicated) {
            const uiId = this.selectedInfo.event._def.extendedProps.uiId;
            const children = this.gtis.filter((gt) => gt.parentId === uiId);
            const resourceSelectionsIds = children.map((child) => child.line.id);
            this.resourcesSelection = this.resources.filter((res) => resourceSelectionsIds.includes(res.id));
        }
        this.items = [
            {
                label: 'Edit',
                command: () => {
                    this.displayModalEdit = true;
                },
                visible: this.selectedGti?.line?.title !== 'Undef' && !this.selectedGti?.parentId
            },
            {
                label: 'Duplicate',
                command: () => {
                    this.displayModalDuplicate = true;
                },
                visible: this.selectedGti?.line?.title !== 'Undef' && !this.selectedGti?.parentId
            },
            {
                label: 'Details',
                command: () => {
                    this.displayModalDetailsView = true;
                }
            },

            {
                label: 'Delete',
                command: (info) => {
                    this.confirmationService.confirm({
                        message: 'Etes-vous sûr de vouloir supprimer le GTI du planner?',
                        header: 'TMDC_NG_VAL',
                        icon: 'pi pi-info-circle',
                        accept: () => {
                            this.onDeleteGti();
                            this.messageService.add({ severity: 'info', summary: 'Confirmation', detail: 'GTI Déplacé dans la ligne Undef avec succès!' });
                        },
                        reject: (type: ConfirmEventType) => {
                            switch (type) {
                                case ConfirmEventType.REJECT:
                                    this.messageService.add({ severity: 'error', summary: 'Annulation', detail: 'Suppression annulée' });
                                    break;
                                case ConfirmEventType.CANCEL:
                                    this.messageService.add({ severity: 'warn', summary: 'Annulation', detail: 'Suppression annulée' });
                                    break;
                            }
                        }
                    });
                },
                visible: this.selectedGti?.line?.title !== 'Undef'
            }
        ];
    }

    getFormatedEventRender(arg: any) {
        console.log(arg.event._def.extendedProps.isDuplicated);
        const parentStyle = arg.event._def.extendedProps.isDuplicated
            ? ` <span class="tm-event-isParent">P</span>
            <div class="p-d-flex p-flex-column p-ai-center">
            <span class="tm-event-style">${arg.event._def.extendedProps.wo}</span>
            </div>
             `
            : `
            <div class="p-d-flex p-flex-column p-ai-center"> <span class="tm-event-style">${arg.event._def.extendedProps.wo}</span> </div>`;
        return {
            html: parentStyle
        };
    }

    updateTmdcGtis(gtis: TmdcGti[]) {
        this._initCalendarOptions();
        gtis = gtis.filter((gt) => gt.inEdit);
        this.onTmdcGtisUpdated.emit(gtis);
        this.changeDetectorRef.markForCheck();
    }

    onPosteChanged(poste: string) {
        const gtisInEdit = this.gtis.find((gt) => gt.inEdit);
        if (gtisInEdit) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.gtis = PlannerUtils.allTmdcGtis(this.currentMsn, poste, this.mode);
                    this.resources = PlannerUtils.calculateTryValues(this.currentMsn.postes.find((posteTmp) => posteTmp.name === poste).lines, this.gtis);
                    this.onCurrentPosteChanged.emit(poste);
                    this.hourOrder = 1;
                    this.selectedPoste = poste;
                    this.changeDetectorRef.detectChanges();
                    this._initCalendarOptions();
                },
                reject: () => {}
            });
        } else {
            this.gtis = PlannerUtils.allTmdcGtis(this.currentMsn, poste, this.mode);
            this.resources = PlannerUtils.calculateTryValues(this.currentMsn.postes.find((posteTmp) => posteTmp.name === poste).lines, this.gtis);
            this.onCurrentPosteChanged.emit(poste);
            this.selectedPoste = poste;
            this.hourOrder = 1;
            this.changeDetectorRef.detectChanges();
            this._initCalendarOptions();
        }
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy() {
        this._subscription$.unsubscribe();
        this.changeDetectorRef.detach();
        this.calendarComponent.ngOnDestroy();
    }
}
