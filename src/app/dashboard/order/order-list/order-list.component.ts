import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrderListService } from './order-list.service';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  currentPage = 1;
  itemPerPage = 1;

  customerId!: number;

  constructor(
    private orderService: OrderListService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.customerId = idParam ? Number(idParam) : 0;

    console.log('this.customerId: ', this.customerId);

    if (this.customerId) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.orderService.getOrders(this.customerId).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error loading Order', err);
      }
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
  editOrderStatus(order: any){
    this.editOrderEvent.emit(order);
    }
}
