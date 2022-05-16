import { User } from './gti.model';

export interface RootGti {
    node_id: string;
    production_site_names: string[];
    ca_codes: string[];
    logical_stations: RootGtiLogicalStation[];
    lang: string;
    second_lang: string;
    ac_program_name: string;
    reference: string;
    updated_by: User;
    updated_on: string;
    created_on: string;
    title: string;
    last_release: string;
    cas: RootGtiCode[];
    execution_modes: string[];
    release_in_production_name: string;
    release_in_production_date: string;
    release_in_production_rgti_revision: number;
    has_pending_review: boolean;
    review_release_id: string;
    status: RootGtsiStatus;
    works_session_active: boolean;
}

export interface RootGtiLogicalStation {
    logical_station_name: string;
    production_site_id: string;
}

export interface RootGtiCode {
    code: string;
}

export enum RootGtsiStatus {
    'DASHBOARD_STATUS_RELEASED' = 'DASHBOARD_STATUS_RELEASED'
}
