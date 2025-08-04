import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './order.service';
import { NgIf } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, OrderListComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  @ViewChild(OrderListComponent) orderListComponent!: OrderListComponent;
  customerId: string = '';
  phoneNo: string = '';
  orderStatus: string = 'pending';
  deliveryStatus: string = 'Pending';
  paymentStatus: string = 'Pending';
  description: string = '';
  newOrder: boolean = false;
  isEditMode: boolean = false;
  selectedOrderId: number | null = null;

  constructor(private route: ActivatedRoute, private orderService:OrderService){}

  ngOnInit(): void{
    this.route.paramMap.subscribe(
      param => {
        this.customerId = param.get('id') || '';
        this.phoneNo = param.get('phone') || '';
        });
    }

  isEditable(): boolean {
    return this.orderStatus !== 'pending'
    }

  addNewOrder(): void {
    this.newOrder = true;
    this.isEditMode = false;
    this.selectedOrderId = null;
    this.resetForm();
    }

  editOrder(order: any):void {
    this.newOrder = true;
    this.isEditMode = true;
    this.selectedOrderId = order.ORD_OrderID;
    this.customerId = order.ORD_CUS_CustomerID;
    this.phoneNo = order.ORD_PhoneNumber || '';
    this.orderStatus = order.ORD_OrderStatus;
    this.deliveryStatus = order.ORD_DeliveryStatus;
    this.paymentStatus = order.ORD_PaymentStatus;
    this.description = order.ORD_ShortDescription || '';
    }

   cancelNewOrder(): void {
      this.newOrder = false;
      this.isEditMode = false;
      this.selectedOrderId = null;
      this.resetForm();
    }

    resetForm(): void {
      this.orderStatus = 'pending';
      this.deliveryStatus = 'Pending';
      this.paymentStatus = 'Pending';
      this.description = '';
    }

  submitOrder(): void{
      const orderData = {
        ORD_CUS_CustomerID:this.customerId,
        ORD_PhoneNumber:this.phoneNo,
        ORD_ShortDescription:this.description,
        ORD_OrderStatus:this.orderStatus,
        ORD_DeliveryStatus:this.deliveryStatus,
        ORD_PaymentStatus:this.paymentStatus
        };
        if (this.isEditMode && this.selectedOrderId !== null) {
            this.orderService.updateOrder(this.selectedOrderId, orderData).subscribe({
              next: res => {
                console.log('Order updated successfully', res);
                alert('Order updated successfully!');
                this.cancelNewOrder();
                this.orderListComponent.loadOrders();
              },
              error: err => {
                console.error('Failed to update order', err);
                alert('Failed to update order.');
              }
            });
          }
        else{
          this.orderService.createOrder(orderData).subscribe({
            next: res => {
               console.log('Order saved successfully', res);
               alert('Order submitted successfully!');
               this.cancelNewOrder();
               this.orderListComponent.loadOrders();
              },
             error: err => {
                console.error('Failed to save order', err);
                alert('Failed to submit order.');
              }
            });
          }
    }
}
