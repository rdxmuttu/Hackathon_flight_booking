import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FlightBookingComponent } from './flight-booking/flight-booking.component';
import { FlightBooking2Component } from './flight-booking2/flight-booking2.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FlightListComponent,
    FlightBookingComponent,
    FlightBooking2Component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
