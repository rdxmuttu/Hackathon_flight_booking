import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirlineService {

  private baseUrl = 'http://localhost:8000'; // Replace with your FastAPI backend URL

  constructor(private http: HttpClient) {}

  // Define a method to fetch flight recommendations based on user inputs
  getFlightRecommendations(data: any): Observable<any> {
    const url = `${this.baseUrl}/recommend_flights`;
    return this.http.post(url, data);
  }

  getReturnRecommendations(data: any): Observable<any> {
    const url = `${this.baseUrl}/adv_filter`;
    return this.http.post(url, data);
  }

}
