import { Interval, Msn } from './msn.model';
import { GtsiChapters, Resource } from './resource.model';
import * as moment from 'moment';
import { TmdcMsn, TmdcPoste, TmdcLine, TmdcGti, TmdcChapter } from '../../../shared/model/tmdc-model/tmdc-msn.model';
export const TIMES_OFF = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'];
export const DATE_FORMAT = 'YYYY-MM-DD HH:mm';
export function toTMDCResource(resource: any): TmdcLine {
    const result: TmdcLine = {
        id: resource.id,
        title: resource.title,
        gtis: resource.extendedProps.gtis,
        try: resource.extendedProps.try,
        remainder: resource.extendedProps.remainder
    };
    return result;
}

export function toTMDCEvent(start: string, event: any, oldResourceId?: string): TmdcGti {
    const startTmp = moment(moment(start).format('YYYY-MM-DD hh:mm'));
    const startTmpBis = moment(moment(event.startStr).format('YYYY-MM-DD HH:MM'));
    const position = Math.abs(+moment(startTmp.diff(startTmpBis, 'hours'))) + 1;
    const result: TmdcGti = {
        className: event.classNames[0],
        resourceId: event._def.resourceIds[0],
        start: event.startStr,
        end: moment(event.startStr).add(event._def.extendedProps.gtiDuration, 'minutes').format(DATE_FORMAT),
        title: event._def.title,
        uiId: event._def.extendedProps.uiId,
        chapters: event._def.extendedProps.chapters,
        groupId: event._def.groupId,
        leftRelatedIds: event._def.extendedProps.leftRelatedIds || [],
        rightRelatedIds: event._def.extendedProps.rightRelatedIds || [],
        isDuplicated: event._def.extendedProps.isDuplicated,
        wo: event._def.extendedProps.wo,
        idTmdcGti: event._def.extendedProps.idTmdcGti,
        inEdit: true,
        status: event._def.extendedProps.status,
        position,
        line: event._def.extendedProps.line,
        gtiDuration: event._def.extendedProps.gtiDuration,
        parentId: event._def.extendedProps.parentId
    };
    return result;
}

export function buildEvent(selected: TmdcGti, selectedChapters: TmdcChapter[], selectedInfo: any): TmdcGti {
    return {
        resourceId: selectedInfo.resource._resource.id,
        start: selectedInfo.startStr,
        // end: selectedInfo.endStr,
        title: selected.title,
        isDuplicated: false,
        chapters: [], //TODO
        className: selectedInfo.className,
        groupId: selected.groupId,
        wo: selected.wo,
        uiId: random(3),
        idTmdcGti: selected.idTmdcGti,
        status: selected.status,
        line: selected.line,
        gtiDuration: selected.gtiDuration,
        position: selected.position,
        parentId: selected.parentId
    };
}

export function updateResouce(resource: TmdcLine, selectedGtiId: number): TmdcLine {
    const result: TmdcLine = {
        id: resource.id,
        title: resource.title,
        try: resource.try || 0,
        gtis: [],
        remainder: resource.remainder
    };
    return result;
}

export function eventFromResource(start: string, end: string, result: TmdcGti[]): TmdcGti[] {
    moment.utc();
    moment.locale('fr');

    for (let i = 0; i < result.length; i++) {
        const duration = result[i].gtiDuration;

        result[i].start = start;
        //  result[i].end = moment(start).add(duration, 'minutes').format(DATE_FORMAT);
        start = moment(start).add(duration, 'minutes').format(DATE_FORMAT);
    }
    return result;
}
export function getNbDays(time: any): number {
    switch (time) {
        case '00:00':
            return 6;
        case '01:00':
            return 5;
        case '02:00':
            return 4;
        case '03:00':
            return 3;
        case '04:00':
            return 2;
        case '05:00':
            return 1;
        default:
            break;
    }
    return 0;
}

export function random(length = 5): string {
    return Math.random().toString(10).substr(2, length);
}

export function randomUiId(): number {
    return Math.random() * (10 - 1) + 1;
}
export function findLastEmptyCell(gtis: TmdcGti[], msnStart: string, duration: number): { start: string | undefined; end: string } {
    let gtsisTmp = gtis.filter((gti) => gti.line.title === 'Undef');
    let startResult = null;
    let endResult = null;
    let lastGti: any = null;
    let j = 0;
    gtsisTmp = gtsisTmp.sort((gt1, gt2) => (gt1.start > gt2.start ? 1 : -1));
    console.log(gtsisTmp, gtis);
    lastGti = gtsisTmp && gtsisTmp.length > 0 ? gtsisTmp[gtsisTmp.length - 1] : null;
    return lastGti
        ? { start: lastGti.end, end: moment(lastGti.end).add(duration, 'minutes').format(DATE_FORMAT) }
        : { start: msnStart, end: moment(msnStart).add(duration, 'minutes').format(DATE_FORMAT) };
}

export function splitMsn(msn: TmdcMsn, size: any): Interval[] {
    if (size === 'All') {
        return [{ start: msn.start, end: msn.end }];
    }
    let results = [];
    let start = msn.start;
    let end = msn.end;
    let newEnd = moment(start).add(size, 'hours').format(DATE_FORMAT);
    while (moment(newEnd).isBefore(end)) {
        let diff = 0;
        if (new Date(newEnd).getDay() === 6) {
            newEnd = moment(newEnd).add(2, 'days').format(DATE_FORMAT);
            const hours = moment(newEnd).hours();
            diff = diff + 2;
        } else if (new Date(newEnd).getDay() === 0) {
            const hours = moment(newEnd).hours();

            newEnd = moment(newEnd)
                .add(24 - hours, 'hours')
                .format(DATE_FORMAT);
            diff = diff + 1;
        } else {
            diff = size;
        }
        const result = { start: start, end: newEnd, diff };
        results.push(result);
        start = newEnd;
        newEnd = moment(start).add(size, 'hours').format(DATE_FORMAT);
    }

    let lastResult = results && results.length > 0 ? results[results.length - 1] : null;
    if (moment(lastResult?.end).isBefore(moment(end))) {
        const last = { start, end, diff: moment(end).diff(start, 'hours') };
        results.push(last);
    }
    return results;
}

export function allTmdcGtis(msn: TmdcMsn, poste: string, mode: string): TmdcGti[] {
    console.log('current poste', poste, mode);
    let result = [];
    msn.postes
        .find((posteTmp) => posteTmp.name === poste)
        .lines.forEach((line) => {
            result = [
                ...result,
                ...line.gtis.map((gti) => ({
                    ...gti,
                    resourceId: line.id,
                    end: moment(gti.start).add(gti.gtiDuration, 'minutes').format(DATE_FORMAT),
                    className: gti.className || 'tm-event-' + mode + '-' + gti.status
                }))
            ];
        });
    console.log(result);
    return result;
}

export function applyGtiOf(start: string, selectedStart: string, gtis: TmdcGti[], availablesGti: TmdcGti[]): TmdcGti[] {
    console.log('dans le apply of  gtis', gtis, availablesGti);
    moment.utc();
    moment.locale('fr');
    let result = [];
    let availablesIds = availablesGti && availablesGti.length > 0 ? availablesGti.map((gt) => gt.wo) : [];

    for (let i = 0; i < availablesGti.length; i++) {
        const availabe = availablesGti[i];
        const gtisToApply = gtis.filter((gt) => gt.wo == availabe.wo);
        console.log('gtisToApply', gtisToApply);

        if (gtisToApply && gtisToApply.length > 0) {
            for (let j = 0; j < gtisToApply.length; j++) {
                const gtiToApply = gtisToApply[j];
                const startTmp = moment(moment(selectedStart).format('YYYY-MM-DD hh:mm'));
                const startTmpBis = moment(moment(gtiToApply.start).format('YYYY-MM-DD hh:mm'));
                const position = Math.abs(+moment(startTmp.diff(startTmpBis, 'minutes')));
                console.log('position', position);
                if (gtiToApply.parentId) {
                    const newGti: TmdcGti = {
                        ...gtiToApply,
                        idTmdcGti: undefined,
                        parentId: availabe.uiId,
                        uiId: random(),
                        start: moment(start).add(position, 'minutes').format(DATE_FORMAT)
                        //  end: moment(gtiToApply.start).add(gtiToApply.gtiDuration, 'minutes').format(DATE_FORMAT)
                    };
                    result.push(newGti);
                } else {
                    if (gtiToApply.isDuplicated) {
                        availabe.isDuplicated = true;
                        availabe.groupId = gtiToApply.groupId;
                    }
                    availabe.gtiDuration = gtiToApply.gtiDuration;
                    availabe.start = moment(start).add(position, 'minutes').format(DATE_FORMAT);
                    //  availabe.end = moment(gtiToApply.start).add(gtiToApply.gtiDuration, 'minutes').format(DATE_FORMAT);
                    availabe.inEdit = true;
                    result.push(availabe);
                }
            }
        }
    }
    return result;
}

export function addNewGtiInUndefLine(gtis: TmdcGti[], msn: TmdcMsn): TmdcGti[] {
    let result = [];
    for (let i = 0; i < msn.postes.length; i++) {
        const gtisSamePostes = gtis.filter((gt) => gt.station === msn.postes[i].name);
        const undefLine = msn.postes[i].lines.find((ln) => ln.title === 'Undef');
        const lastGti = undefLine.gtis[undefLine.gtis.length - 1];
        for (let j = 0; j < gtisSamePostes.length; j++) {
            console.log(gtisSamePostes);
            let gti = gtisSamePostes[j];
            if (j > 0) {
                gti = {
                    ...gti,
                    start: result[j - 1].end,
                    // end: moment(result[j - 1].end)
                    //     .add(gti.gtiDuration, 'minutes')
                    //     .format(DATE_FORMAT),
                    position: result[j - 1].position + result[j - 1].duration
                };
            } else {
                //gti = { ...gti, start: lastGti?.end, end: moment(lastGti?.end).add(gti.duration, 'minutes').format(DATE_FORMAT), position: lastGti?.position + lastGti?.weight };
            }
            result.push(gti);
        }
    }

    return result;
}

export function calculateTryValues(lines: TmdcLine[], gtis: TmdcGti[]): TmdcLine[] {
    console.log('dans letry', gtis, lines);
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const gtisTocheck = gtis.filter((gti) => gti.resourceId === line.id && atLeastOneNoPlace(gti.chapters));
        line = { ...line, try: gtisTocheck.length };
        result.push(line);
    }
    return result;
}

export function atLeastOneNoPlace(chapters: TmdcChapter[]): boolean {
    if (!chapters || chapters.length == 0) {
        return false;
    }
    return chapters.findIndex((chap) => !chap.alreadyPlace) !== -1;
}
