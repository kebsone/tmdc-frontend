export interface User {
    username?: string;
    fullname?: string;
    email?: string;
    id?: string;
    lastname?: string;
    provider?: string;
    providerId?: string;
    role?: any;
    status?: number;
}
export interface Gti {
    id?: string;
    ac_node_id?: string;
    rgti_node_id?: string;
    created_by?: User;
    created_on?: string;
    rgti_ref_number_ata?: string;
    rgti_ref_number_group?: string;
    rgti_ref_number_seq_number?: string;
    rgti_title?: string;
    rgti_title_second_lang?: string;
    updated_by?: User;
    updated_on?: string;
    reference?: string;
    status?: string;
    attested_by?: string;
    attested_on?: string;
    ac_msn_number?: string;
    ac_revision?: number;
    ac_production_site?: string;
    ac_program_id?: string;
    rgti_revision?: number;
    rgti_reference?: string;
    rgti_lang?: string;
    rgti_second_lang?: string;
    rgti_main_skill_code?: string;
    allowed_execution?: string;
    progress?: number;
    workload?: number;
    duration?: string;
    missing_measure?: string;
    attestation_type?: string;
    rgti_release?: number;
    start_by?: string;
    start_on?: string;
    rgti_description_chapters?: string[];
    rgti_attachments?: string[];
    ac_fal_rank?: number;
    logical_station_production_site?: string;
    logical_station_short_name?: string;
    ac_customer_version_name?: string;
    ac_customer_version_rank?: number;
    ac_status?: AC_STATUS;
    steering_status?: string;
    type?: string;
    chapters?: Chapter[];
    go?: boolean;
    noGo?: boolean;
}

export enum AC_STATUS {
    DECLARED = 'DECLARED',
    CREATED = 'CREATED'
}

export interface Chapter {
    id?: string;
    numbering: string;
    order?: number;
    attested_by?: User;
    attested_on?: Date;
    status: string;
    ac_testunit_title: string;
    ac_testunit_title_second_lang?: string;
    workload?: number;
    locked_by?: User;
    locked_on?: Date;
    start_on?: Date;
    duration?: number; // TODO
    parsed_data?: any;
}

export const AUTHORIZED_STATUS: string[] = ['NS', 'IP', 'AT', 'FA'];

export const GTI_TO_DISPLAY: string[] = ['NS', 'IP', 'FA'];
