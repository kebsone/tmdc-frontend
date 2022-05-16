export interface ProductionSite {
    id?: string;
    ac_program_id: string;
    production_location_id?: string;
    production_lines?: ProductionLine[];
    name: string;
    short_name: string;
    effectivity_short_name?: string;
    has_production_lines?: boolean;
    logical_stations?: LogicalStation[];
}

export interface ProductionLine {
    id: string;
    name?: string;
    short_name?: string;
    description?: string;
    effectivity_prod_site_suffix?: string;
    physical_stations: PhysicalStation[];
}

export interface LogicalStation {
    id?: string;
    short_name?: string;
    description?: string;
    delay?: number;
    physical_stations?: PhysicalStation[];
}

export interface PhysicalStation {
    id: string;
    short_name: string;
    description: string;
}
