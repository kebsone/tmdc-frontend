import { Gti, Chapter } from './model/gti.model';
import * as PlannerUtils from '../components/planner/shared/planner.utils';
import { TmdcMsnSerivice } from '../services/tmdc-msn-service';
import { TmdcMsn, TmdcLine, TmdcGti, TmdcChapter, TmdcPoste, TMDC_MINIMAL_DURATION } from './model/tmdc-model/tmdc-msn.model';
import { LogicalStation } from './model/site.model';
export function formatName(name: string) {
    return name && name === 'Single Aisle' ? 'A320' : name;
}

export function toTmdcGtis(gtis: Gti[], poste: string): TmdcGti[] {
    console.log('HEYE HEY HEYE ', gtis);
    return gtis
        .filter((gt) => gt.logical_station_short_name && gt.logical_station_short_name === poste)
        .map((gti) => ({
            title: gti.rgti_title,
            status: gti.status,
            groupId: PlannerUtils.random(),
            isDuplicated: false,
            className: `tm-event-edit-${gti.status}`,
            station: gti.logical_station_short_name,
            wo: gti.rgti_reference,
            uiId: PlannerUtils.random(),
            gtiDuration: calculateDuration(gti.chapters),
            chapters:
                gti.chapters && gti.chapters.length > 0
                    ? gti.chapters.map((chap) => ({ numbering: chap.numbering, title: chap.ac_testunit_title, status: chap.status, chapterDuration: chap.duration, alreadyPlace: true }))
                    : []
        }));
}

export function toTmdcGti(gtis: Gti[], msn: TmdcMsn): TmdcGti[] {
    return gtis.map((gti) => ({
        title: gti.rgti_title,
        status: gti.status,
        groupId: PlannerUtils.random(),
        station: gti.logical_station_short_name,
        isDuplicated: false,
        leftRelatedIds: [],
        rightRelatedIds: [],
        className: `tm-event-edit-${gti.status}`,
        wo: gti.rgti_reference,
        line: getUndefLineByPoste(msn, gti.logical_station_short_name),
        uiId: PlannerUtils.random(),
        gtiDuration: calculateDuration(gti.chapters),
        chapters:
            gti.chapters && gti.chapters.length > 0
                ? gti.chapters.map((chap) => ({ numbering: chap.numbering, title: chap.ac_testunit_title, status: chap.status, chapterDuration: chap.duration, alreadyPlace: true }))
                : []
    }));
}
function calculateDuration(chapters: Chapter[]): number {
    let duration = 0;
    if (!chapters || chapters.length === 0) {
        return TMDC_MINIMAL_DURATION;
    }
    for (let i = 0; i < chapters.length; i++) {
        const chapt = chapters[i];
        duration = duration + chapt.duration;
    }
    return duration > 60 ? duration : TMDC_MINIMAL_DURATION;
}
function getUndefLineByPoste(msn: TmdcMsn, poste: string): TmdcLine {
    return msn.postes.find((posteTmp) => posteTmp.name === poste)?.lines.find((line) => line.title === 'Undef');
}

export function sortChapters(chapters: TmdcChapter[] | Chapter[]): TmdcChapter[] | Chapter[] {
    if (!chapters || chapters.length === 0) {
        return [];
    }
    return chapters.sort((chap1, chap2) => {
        return +chap1.numbering - +chap2.numbering;
    });
}

export function sortLogicalStation(stations: TmdcPoste[]): TmdcPoste[] {
    if (!stations || stations.length === 0) {
        return [];
    }
    return stations.sort((st1, st2) => {
        return st1.name > st2.name ? -1 : 1;
    });
}
