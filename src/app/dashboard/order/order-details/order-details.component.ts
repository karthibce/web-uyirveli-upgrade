import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgIf } from '@angular/common';
import { OrderDetailService } from "./order-details.service";

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
  @Input() orderId: number | null = null;
  showPaymentModel : boolean = false;
  orderData: any = null;
  constructor(private orderDetailService: OrderDetailService) {}
  viewPaymentModel(orderId: number){
    this.orderId = orderId;
    this.showPaymentModel = true;
    //console.log('this.orderId' + this.orderId);
    this.orderDetailService.getOrderDetailsById(this.orderId).subscribe({
      next: (order: any) => {
        this.orderData = order;
        //console.log('order::' + JSON.stringify(order));
        },
        error: (err: any) => {
          console.error('Error fetching order details:', err);
        }
      });
    }

   closePaymentModel() {
      this.showPaymentModel = false;
    }

}
