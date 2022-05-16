import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookInformationGeneralComponent } from './notebook-information-general.component';

describe('NotebookInformationGeneralComponent', () => {
  let component: NotebookInformationGeneralComponent;
  let fixture: ComponentFixture<NotebookInformationGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotebookInformationGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookInformationGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
