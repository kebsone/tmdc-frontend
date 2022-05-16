export const TMDC_MINIMAL_DURATION = 60;
export interface TmdcMsn {
    msnNumber: string;
    responsable?: string;
    start: string;
    end: string;
    comments?: [];
    principalPoste: TmdcPoste;
    postes?: TmdcPoste[];
    programCode: string;
    siteId: string;
    selectedPoste?: string;
}

export interface TmdcPoste {
    idPoste?: number;
    name: string;
    lines?: TmdcLine[];
}

export interface TmdcLine {
    id: string;
    title: string;
    remainder?: number;
    try: number;
    gtis: TmdcGti[];
}

export interface TmdcGti {
    idTmdcGti?: number;
    title: string;
    groupId: string;
    isDuplicated: boolean;
    start?: string;
    end?: string;
    uiId: string;
    line?: TmdcLine;
    resourceId?: string;
    leftRelatedIds?: string[];
    rightRelatedIds?: string[];
    className?: string;
    chapters: TmdcChapter[];
    wo: string;
    inEdit?: boolean;
    status: string;
    station?: string;
    position?: number;
    gtiDuration: number;
    parentId?: string;
    toDelete?: boolean;
}

export interface TmdcChapter {
    id?: number;
    numbering: string;
    title: string;
    status?: string;
    chapterDuration: number;
    alreadyPlace: boolean;
}
