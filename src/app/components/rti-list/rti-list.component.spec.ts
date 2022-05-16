import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtiListComponent } from './rti-list.component';

describe('RtiListComponent', () => {
    let component: RtiListComponent;
    let fixture: ComponentFixture<RtiListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RtiListComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RtiListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
