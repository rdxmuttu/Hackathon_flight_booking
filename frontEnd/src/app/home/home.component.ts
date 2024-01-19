import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RecommendationService } from '../recommendation.service';
import { AirlineService } from '../airline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFlightType: string = 'roundtrip';
  multiCityFlights: any[] = [];
  flyingFromInput: string = '';
  flyingFromCode:string='';
  flyingToInput: string = '';
  flyingToCode:string='';
  departingDate: string = '';
  travelClass: string = 'E';
  returningDate: string = '';
  flyingFromSuggestions: any[] = [];


  airportFrom: string = '';
  airportTo: string = ''; 
  flightClass: string = ''; 
  flightDate: string = '';

  isRoundtrip: boolean = false; 
 

  flyingToSuggestions: any[] = [];
  
  constructor(private router: Router, private recommendationService: RecommendationService , private airlineService: AirlineService,) { }

  ngOnInit(): void {
  }

  // onFlightTypeChange(type: string) {
  //   this.selectedFlightType = type;
  //   if (type === 'multi-city') {
  //     this.multiCityFlights = [{ from: '', to: '' }];
  //   } else {
  //     this.multiCityFlights = [];
  //   }
  // }

  addFlight() {
    this.multiCityFlights.push({ from: '', to: '' });
  }

  removeFlight(index: number) {
    if (index >= 0 && index < this.multiCityFlights.length) {
      this.multiCityFlights.splice(index, 1);
    }
  }

  onFlightTypeChange(type: string) {
    this.selectedFlightType=type;
  }
  showFlights() {

    const flyingFrom=this.flyingFromCode;
    const flyingTo=this.flyingToCode;
    const tClass=this.travelClass;
    const rDate=this.departingDate;
    

    //if (this.isRoundtrip) {
      if (this.selectedFlightType === 'roundtrip') {
      const returningDate = this.returningDate;
      this.router.navigate(['/flight-booking2', {
          flyingFrom,
          flyingTo,
          tClass,
          rDate,
          returningDate
      }]);
    } else if(this.selectedFlightType === 'one-way') {
      // Navigate with only departing date for one-way
      this.router.navigate(['/flight-booking', {
        flyingFrom,
        flyingTo,
        tClass,
        rDate
    }]);
    }
  }


    // this.router.navigate(["/flight-booking" ,{flyingFrom,flyingTo,tClass,rDate}])
    


  autocompleteAirports(Input: string, inputField: string) {

    if (Input.length >= 3) {

      console.log(`Autocompleting airports for ${inputField}: ${Input}`);

      this.recommendationService.autocompleteAirports(Input).subscribe(

        (response) => {

          console.log(`Received autocomplete response for ${inputField}:`, response);

          if (inputField === 'flyingFrom') {

            this.flyingFromSuggestions = response;

          } else if (inputField === 'flyingTo') {

            this.flyingToSuggestions = response;

          }

        },

        (error) => {

          console.error('Autocomplete error:', error);

        }

      );

    } else {

      // Clear suggestions if input is less than 3 characters

      if (inputField === 'flyingFrom') {

        this.flyingFromSuggestions = [];
      } else if (inputField === 'flyingTo') {

        this.flyingToSuggestions = [];

      }

    }

  }
  selectAirport(airport: any, inputField: string) {

    console.log(`Selected airport for ${inputField}:`, airport);

    // Set the selected airport in the input field

    if (inputField === 'flyingFrom') {

      // this.flyingFromInput = airport.name;
      this.flyingFromInput = airport.Name;
      this.flyingFromCode=airport.Code;

      this.flyingFromSuggestions = [];

    } else if (inputField === 'flyingTo') {
      // 
      this.flyingToCode=airport.Code;
      this.flyingToInput = airport.Name;
      this.flyingToSuggestions = [];

    }

  }
}  