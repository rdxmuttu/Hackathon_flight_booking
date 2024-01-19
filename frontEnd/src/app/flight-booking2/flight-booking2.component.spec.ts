import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBooking2Component } from './flight-booking2.component';

describe('FlightBooking2Component', () => {
  let component: FlightBooking2Component;
  let fixture: ComponentFixture<FlightBooking2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightBooking2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBooking2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
