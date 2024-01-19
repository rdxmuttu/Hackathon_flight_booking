import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AirlineService } from '../airline.service';

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.css']
})

export class FlightBookingComponent implements OnInit {
  flightRecommendations: any[] = [];
  fromCode: string='';
  toCode: string='';
  tClass: string='';
  rDate: string='';
 
  
  // Declare the flights property
  flights: any[] = [];

  constructor(private airline: AirlineService, private route:ActivatedRoute) {}
  ngOnInit(): void {
     this.route.paramMap.subscribe((params)=>{
       this.fromCode=params.get('flyingFrom') ||'';
       this.toCode=params.get('flyingTo')||'';
       this.tClass=params.get('tClass')||'';
       this.rDate=params.get('rDate')||'';

       const requestData = {
        airport_from: this.fromCode,
        airport_to: this.toCode,
        flight_class: this.tClass,
        flight_date: this.rDate
      };

      console.log('this is my requestData: ',requestData)

      this.getFlightRecommendations(requestData);

     })

    
  }

  // Define a function to fetch flight recommendations
  getFlightRecommendations(data:any) {

    this.airline.getFlightRecommendations(data).subscribe(
      (response) => {
        console.log('this is my response from backend : ',response)
        this.flightRecommendations = response['Available Flights'];
        // Update the flights property with the recommendations
        this.flights = this.flightRecommendations;
      },
      (error) => {
        console.error('Error fetching flight recommendations:', error);
      }
    );
  }
}
