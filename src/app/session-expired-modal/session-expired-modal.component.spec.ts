import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredModalComponent } from './session-expired-modal.component';

describe('SessionExpiredModalComponent', () => {
  let component: SessionExpiredModalComponent;
  let fixture: ComponentFixture<SessionExpiredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpiredModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiredModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
