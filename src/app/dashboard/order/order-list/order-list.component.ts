import { Component, OnInit, ViewChild  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { OrderListService } from "./order-list.service";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { EventEmitter, Output } from "@angular/core";
import { PaymentModalComponent } from "app/dashboard/order/payment-modal/payment-modal.component";
import { OrderDetailsComponent } from "app/dashboard/order/order-details/order-details.component";

declare var bootstrap: any;
@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, PaymentModalComponent, OrderDetailsComponent],
  templateUrl: "./order-list.component.html",
  styleUrl: "./order-list.component.scss",
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  currentPage = 1;
  itemPerPage = 1;
  customerId!: number;
  productForm: any[] = [];
  productList: any[] = [];
  selectedOrder: any = null;
  isEditMode: boolean = false;
  private productModal: any;
  selectedOrderId: number | null = null;
  selectedPaymentData: any = null;
  @ViewChild('paymentModal') paymentModal!: PaymentModalComponent;
  @ViewChild('OrderDetailsComponent') orderDetailsComp!: OrderDetailsComponent;

  constructor(
    private orderService: OrderListService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    this.customerId = idParam ? Number(idParam) : 0;

    console.log("this.customerId: ", this.customerId);

    if (this.customerId) {
      this.loadOrders();
    }

    this.orderService.getProduct().subscribe({
      next: (data: any[]) => {
        this.productList = data;
      },
      error: (err: any) => {
        console.error("Error loading products", err);
      },
    });
  }

  loadOrders(): void {
    this.orderService.getOrders(this.customerId).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error("Error loading Order", err);
      },
    });
  }

  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemPerPage;
    return this.orders.slice(startIndex, startIndex + this.itemPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  @Output() editOrderEvent = new EventEmitter<any>();
  editOrderStatus(order: any) {
    this.editOrderEvent.emit(order);
  }

  openProductModal(order: any, editMode: boolean = false) {
    this.selectedOrder = order;
    this.isEditMode = editMode;
    console.log("Selected order:", this.selectedOrder);

    if (editMode) {
      this.orderService
        .getOrderItem(order.ORD_OrderID)
        .subscribe((products: any[]) => {
          if (products && products.length > 0) {
            this.productForm = products.map((p) => ({
              OIT_OrderItemID: p.OIT_OrderItemID,
              productId: p.OIT_PRD_ProductID,
              quantity: p.OIT_Quantity,
              price: p.OIT_Price,
              discount: p.OIT_Discount,
              total: p.OIT_Quantity * p.OIT_Price - (p.OIT_Discount || 0),
            }));
          } else {
            this.productForm = [
              {
                productId: "",
                quantity: 1,
                price: 0,
                discount: 0,
                total: 0,
              },
            ];
          }
          const modalEl: any = document.getElementById("productModal");
          this.productModal = new bootstrap.Modal(modalEl);
          this.productModal.show();
        });
    } else {
      this.productForm = [
        {
          productId: "",
          quantity: 1,
          price: 0,
          discount: 0,
          total: 0,
        },
      ];

      const modalEl: any = document.getElementById("productModal");
      this.productModal = new bootstrap.Modal(modalEl);
      this.productModal.show();
    }
  }
  closeProductModal() {
    if (this.productModal) {
      this.productModal.hide();
    }
  }
  addItem() {
    this.productForm.push({
      productId: "",
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0,
    });
  }

  removeItem(index: number) {
    const item = this.productForm[index];

    // If this item exists in DB, delete it from backend first
    if (item.OIT_OrderItemID) {
      this.orderService.deleteOrderItem(item.OIT_OrderItemID).subscribe({
        next: () => {
          console.log(`Item ${item.OIT_OrderItemID} deleted from DB`);
          this.productForm.splice(index, 1); // remove from UI after deletion
        },
        error: (err) => {
          console.error("Failed to delete item", err);
        },
      });
    } else {
      // Just remove from UI for unsaved items
      this.productForm.splice(index, 1);
    }
  }

  calculateTotal(index: number) {
    const item = this.productForm[index];
    const subtotal = item.quantity * item.price;
    item.total = subtotal - (item.discount || 0);
  }

  saveProducts() {
    if (!this.selectedOrder?.ORD_OrderID) {
      console.error("Order ID missing!");
      return;
    }

    const userId = 1;
    let orderAmount = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    this.productForm.forEach((product) => {

      const itemAmount = product.quantity * product.price;
      const discount = product.discount || 0;
      const total = itemAmount - discount;

      orderAmount += itemAmount;
      totalDiscount += discount;
      totalAmount += total;

      const payload = {
        OIT_ORD_OrderID: this.selectedOrder.ORD_OrderID,
        OIT_PRD_ProductID: product.productId,
        OIT_Quantity: product.quantity,
        OIT_Price: product.price,
        OIT_ItemAmount: itemAmount,
        OIT_Discount: discount,
        OIT_TotalAmount: total,
        OIT_Status: "Active",
        OIT_CreatedBy: userId,
        OIT_LastModifiedBy: userId,
      };

      if (product.OIT_OrderItemID) {
        this.orderService
          .updateOrderItem(product.OIT_OrderItemID, payload)
          .subscribe({
            next: (res) => console.log("Item updated", res),
            error: (err) => console.error("Failed to update item", err),
          });
      } else {
        this.orderService.addOrderItem(payload).subscribe({
          next: (res) => console.log("Item created", res),
          error: (err) => console.error("Failed to create item", err),
        });
      }
    });

    const orderTotalPayload = {
          ORD_OrderAmount: orderAmount,
          ORD_Discount: totalDiscount,
          ORD_Total: totalAmount,
          ORD_LastModifiedBy: userId
      };
    this.orderService.updateOrderPayment(this.selectedOrder.ORD_OrderID, orderTotalPayload)
    .subscribe({
       next: (res) => console.log("Order totals updated", res),
       error: (err) => console.error("Failed to update order totals", err),
     });
    // Hide modal
    setTimeout(() => {
      if (this.productModal) {
        this.productModal.hide(); // ✅ close modal
      } else {
        const modalEl: any = document.getElementById("productModal");
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl); // get existing instance
          if (modal) {
            modal.hide();
          }
        }
      }
    }, 200); // small delay if needed after save
  }

openPayment(order: any){
  this.selectedOrderId = order.ORD_OrderID;
  if(this.selectedOrderId) {
      this.orderService.getPaymentByOrderId(this.selectedOrderId).subscribe({
        next: (payment) => {
          this.selectedPaymentData = payment || null;
          this.paymentModal.open(this.selectedPaymentData);
          },
          error: (err) => {
            console.error("Error fetching payment", err);
            this.selectedPaymentData = null; // fallback to new payment
            this.paymentModal.open();
          }
        });
    }
  }
  handlePaymentSave(paymentData: any){
    this.orderService.addPayment(paymentData).subscribe({
      next: (res) => console.log("Payment Added", res),
      error: (err) => console.error("Payment Failed", err),
      });
    }

  viewPayment(order: any){
    this.selectedOrderId = order.ORD_OrderID;
    this.orderDetailsComp.viewPaymentModel(order.ORD_OrderID);
    }

}
