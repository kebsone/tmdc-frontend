import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleComponent } from './bicycle.component';

describe('BicycleComponent', () => {
  let component: BicycleComponent;
  let fixture: ComponentFixture<BicycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
