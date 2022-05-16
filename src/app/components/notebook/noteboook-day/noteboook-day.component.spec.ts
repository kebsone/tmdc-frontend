import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteboookDayComponent } from './noteboook-day.component';

describe('NoteboookDayComponent', () => {
  let component: NoteboookDayComponent;
  let fixture: ComponentFixture<NoteboookDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteboookDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteboookDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
