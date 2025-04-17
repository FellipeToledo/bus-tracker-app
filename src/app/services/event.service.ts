import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiBaseUrl}/api/v1/event`;

  constructor(private http: HttpClient) { }

  // Operações CRUD
  getAllEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  createScheduledEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/scheduled`, eventData);
  }

  createUnscheduledEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/unscheduled`, eventData);
  }

  // ... outros métodos conforme necessário
}