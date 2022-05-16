import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookGtiComponent } from './notebook-gti.component';

describe('NotebookGtiComponent', () => {
    let component: NotebookGtiComponent;
    let fixture: ComponentFixture<NotebookGtiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotebookGtiComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotebookGtiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
