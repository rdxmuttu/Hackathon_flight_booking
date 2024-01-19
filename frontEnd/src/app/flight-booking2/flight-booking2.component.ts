
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AirlineService } from '../airline.service';

@Component({
  selector: 'app-flight-booking2',
  templateUrl: './flight-booking2.component.html',
  styleUrls: ['./flight-booking2.component.css']
})
export class FlightBooking2Component implements OnInit {
  flightRecommendations: any[] = [];
  fromCode: string = '';
  toCode: string = '';
  tClass: string = '';
  rDate: string = '';
  returningDate: string = '';

  // Declare the flights property for departing flights
  departingFlights: any[] = [];

  // Declare the returnFlights property for return flights
  returnFlights: any[] = [];

  constructor(private airline: AirlineService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.fromCode = params.get('flyingFrom') || '';
      this.toCode = params.get('flyingTo') || '';
      this.tClass = params.get('tClass') || '';
      this.rDate = params.get('rDate') || '';
      this.returningDate = params.get('returningDate') || '';

      const requestDataDeparting = {
        flight_class: [this.tClass],
        airline_code:[],
        routes:[{
          airport_from: this.fromCode,
          airport_to: this.toCode,
          flight_date: this.rDate
        }
      ]
        
      };

      const requestDataReturning = {
        flight_class: [this.tClass],
        airline_code:[],
        routes:[
        {
          airport_from: this.toCode,
          airport_to: this.fromCode,
          flight_date: this.returningDate
        }
      ]
      };

      console.log("this is my departingFlights data: ",requestDataDeparting)
      console.log("this is my returningFlights data : ",requestDataReturning)

      this.getFlightRecommendations(requestDataDeparting, 'departingFlights');
      this.getFlightRecommendations(requestDataReturning, 'returnFlights');
    });
  }

  // Define a function to fetch flight recommendations
  getFlightRecommendations(data: any, flightType: 'departingFlights' | 'returnFlights') {
    this.airline.getReturnRecommendations(data).subscribe(
      (response) => {
        console.log('This is my response from backend :'+flightType, response);

        // Check if there are routes in the response
        if (Array.isArray(response.routes)) {
          const flightsArray = flightType === 'departingFlights' ? this.departingFlights : this.returnFlights;

          flightsArray.length = 0; // Clear the respective flights array

          // Iterate through each route in the response
          response.routes.forEach((route: any) => {
            const results = route.Results;

            // Check if there are flight results for this route
            if (Array.isArray(results) && results.length > 0) {
              results.forEach((result: any) => {
                const airlineName = result['Airline Name'] || 'N/A';
                const airlineCode = result['Airline Code'] || 'N/A';
                const totalDuration = result['Total Duration'] || 'N/A';
                const flightClass = result['Class'] || 'N/A';

                // Push the flight details to the respective flights array
                flightsArray.push({
                  airlineName,
                  airlineCode,
                  totalDuration,
                  flightClass
                });
              });
            } else if (results === 'No Flights Found') {
              // Handle case where no flights are found for this route
              flightsArray.push({
                airlineName: 'N/A',
                airlineCode: 'N/A',
                totalDuration: 'N/A',
                flightClass: 'No Flights Found'
              });
            }
          });
        }
      },
      (error) => {
        console.error('Error fetching flight recommendations:', error);
      }
    );
  }
}
