import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrderListService {
  private urls = `${environment.apiUrl}/orders`;
  private productUrl = `${environment.apiUrl}/products`;
  private orderItemsUrl = `${environment.apiUrl}/order-items`;
  private orderPaymentUrl = `${environment.apiUrl}/order-payments`;
  constructor(private http: HttpClient) {}

  getOrders(id?: number): Observable<any[]> {
    if (id) {
      return this.http.get<any[]>(`${this.urls}/${id}`);
    } else {
      return this.http.get<any[]>(this.urls);
    }
  }

  getProduct(): Observable<any[]> {
    return this.http.get<any[]>(this.productUrl);
  }

  getOrderItem(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.orderItemsUrl}/order/${id}`);
  }

  deleteOrderItem(id: number) {
    return this.http.delete(`${this.orderItemsUrl}/${id}`);
  }

  addOrderItem(item: any): Observable<any> {
    return this.http.post(this.orderItemsUrl, item);
  }

  updateOrderItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.orderItemsUrl}/${id}`, item);
  }

  getPaymentByOrderId(id: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.orderPaymentUrl}/order/${id}`);
    }

  addPayment(payments: any): Observable<any> {
    return this.http.post(this.orderPaymentUrl, payments);
  }

  updateOrderPayment(id: number, item: any): Observable<any> {
    return this.http.put(`${this.urls}/payment/${id}`, item);
  }
}
