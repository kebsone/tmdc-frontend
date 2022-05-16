import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingComponent } from './reporting.component';

@NgModule({
    declarations: [ReportingComponent],
    imports: [CommonModule, ReportingModule],
    entryComponents: [ReportingComponent]
})
export class ReportingModule {}
