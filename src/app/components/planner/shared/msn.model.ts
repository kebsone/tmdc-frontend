export interface Msn {
    msnNumber?: number;
    currentPoste?: string;
    allPoste?: string[];
    msnTitle?: string;
    start: string;
    end: string;
    motor:string;
}
export interface Poste {
    idPoste?: number;
    title?: string;
}

export interface Fal {
    id?: number;
    title?: string;
    msns?: Msn[];
    img?: string;
}

export interface Interval {
    start: string;
    end: string;
    diff?: number;
}
