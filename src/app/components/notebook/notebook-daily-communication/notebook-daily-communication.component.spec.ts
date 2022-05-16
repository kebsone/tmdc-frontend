import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookDailyCommunicationComponent } from './notebook-daily-communication.component';

describe('NotebookDailyCommunicationComponent', () => {
  let component: NotebookDailyCommunicationComponent;
  let fixture: ComponentFixture<NotebookDailyCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotebookDailyCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookDailyCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
