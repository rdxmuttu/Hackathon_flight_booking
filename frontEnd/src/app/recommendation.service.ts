import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private baseUrl = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  autocompleteAirports(Input: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/autocompletion`, { Input });

  }
  
}
