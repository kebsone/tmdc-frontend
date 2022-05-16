import { GtsiChapters } from './resource.model';

export interface Gtsi {
    /**
     * idof event
     */
    uiId: number;
    /** Id of the linked resource */
    resourceId?: string;

    /** Title of the event */
    title?: string;

    /**
     * start date
     */
    start?: string;

    className?: string;

    /**
     * End date
     */
    end?: string;

    /**
     * Is editable
     */
    editable?: boolean;

    /**
     * Is duplicated event
     */
    isDuplicated?: boolean;

    description?: string;
    child?: any[];

    desc?: string;

    groupId?: string;
    wo?: string;
    chapters?: GtsiChapters[];
    startEditable?: boolean;
    parentId?: number;
    leftRelatedIds?: any;
    rightRelatedIds?: any;
    resourceEditable?: boolean;
}
