import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtiListComponent } from './gti-list.component';

describe('GtiListComponent', () => {
    let component: GtiListComponent;
    let fixture: ComponentFixture<GtiListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GtiListComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GtiListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
