// export interface Product{
//     msn?:number;
//     program?:string;
//     FAL?:string;
//     start_date?:string;
//     end_date?:string;
//     industrial_standard?:string;
//     customer_version?:string;
//     customer_version_rank?:string;
//     program_code?:string;
//     status?:string;

import { MSnComment } from 'src/app/shared/model/msn.model';

// }
export interface Product {
    msn?: number;
    line?: number;
    status?: string;
    fot?: string;
    paint?: string;
    category?: string;
    activity?: number;
    motor?: string;
    model?: string;
    station: string;
    comments: MSnComment[];
    responsable: string;
}
