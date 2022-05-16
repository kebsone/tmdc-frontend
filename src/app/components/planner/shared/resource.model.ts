import { Gtsi } from './event.model';

export interface Resource {
    /**
     * Id of current resource
     */
    id: string;

    /**
     * Title of current resource
     */

    title: string;
    gtsi: Gtsi[];
    reliquat: number;
    essais: number;
}

export interface GtsiChapters {
    title: string;
    order: number;
}
