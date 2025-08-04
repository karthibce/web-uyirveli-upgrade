import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable ({
  providedIn : 'root'
  })

export class OrderListService {
  private urls = `${environment.apiUrl}/orders`;
  constructor (private http: HttpClient) {}

  getOrders(id?: number): Observable<any[]> {
    if (id) {
      return this.http.get<any[]>(`${this.urls}/${id}`);
    } else {
      return this.http.get<any[]>(this.urls);
    }
  }

  }
