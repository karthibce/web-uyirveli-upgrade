import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class OrderDetailService {
  private urls = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}

  getOrderDetailsById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urls}/${id}/details`);
  }
}
