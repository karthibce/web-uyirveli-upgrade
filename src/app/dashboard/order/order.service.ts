import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable ({
  providedIn : 'root'
  })

export class OrderService {
  private urls = `${environment.apiUrl}/orders`;
  constructor (private http: HttpClient) {}

  createOrder(orderData: any ): Observable<any> {
    return this.http.post(this.urls, orderData);
  }

  updateOrder(orderId: number, data: any): Observable<any> {
      return this.http.put(`${this.urls}/${orderId}`,data)
      }

  }
