import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsnCardComponent } from './msn-card.component';

describe('MsnCardComponent', () => {
  let component: MsnCardComponent;
  let fixture: ComponentFixture<MsnCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsnCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
