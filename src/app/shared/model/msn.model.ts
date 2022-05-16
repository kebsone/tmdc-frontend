import { Gti } from './gti.model';
import { RootGti } from './root-gti.model';

export interface Msn {
    msn: string;
    industrial_tandard?: string;
    serie?: string;
    customer_version?: string;
    customer_versionRank?: string;
    end_date?: string;
    fal?: string;
    program?: string;
    program_code?: string;
    start_date?: string;
    status?: string;
    ac_program_name?: string;
    engine_type?: string;
    is_gtsi_custom?: boolean;
    last_update?: string;
    node_id?: string;
    rank?: string;
    standard?: string;
    synchronization_status?: string;
    version?: string;
    line?: string;
    station?: string;
    gtiList?: Gti[];
    rootGtiList: RootGti[];
}

export interface MSnComment {
    user: string;
    date: string;
    value: string;
    toDisplay: boolean;
}
