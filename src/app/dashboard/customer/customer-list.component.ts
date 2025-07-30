import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CustomerListService } from './customer-list.service';
import { FormsModule } from '@angular/forms';
import { Customer } from './customer-list.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit{
  customer: any[] = [];
  filterCustomer: any[] = [];
  searchPhone: string = '';
  currentPage = 1;
  itemPerPage = 10;
  showModal = false;
    newCustomer:Customer = {
      CUS_CustomerName: '',
      CUS_PhoneNumber: '',
      CUS_Village: '',
      CUS_Block: '',
      CUS_District: '',
      CUS_CreatedBy: 1,
      };

  constructor(private customerService: CustomerListService, private router: Router){}
  ngOnInit(): void {
    /*this.customerService.getCustomer().subscribe({
      next: (data) => {
        this.customer = data;
        this.filterCustomer = data;
        },
      error: (err) => {
        console.log('Error loading customer',err);
        }
      });*/
     this.loadCustomers();
    }
  loadCustomers(): void {
    this.customerService.getCustomer().subscribe({
      next: (data) => {
        this.customer = data;
        this.filterCustomer = data;
        //this.menuService.showOrderMenu();
      },
      error: (err) => {
        console.error('Error loading customers', err);
      }
    });
  }
    onSearch() {
      const search = this.searchPhone.trim();
      if (search) {
        this.filterCustomer = this.customer.filter(c =>
          c.CUS_PhoneNumber?.includes(search)
        );
      } else {
        this.filterCustomer = [...this.customer];
      }
      this.currentPage = 1;
    }

    get paginatedCustomers() {
      const start = (this.currentPage - 1) * this.itemPerPage;
      return this.filterCustomer.slice(start, start + this.itemPerPage);
    }

    totalPages() {
      return Math.ceil(this.filterCustomer.length / this.itemPerPage);
    }

    changePage(direction: 'prev' | 'next') {
      if (direction === 'prev' && this.currentPage > 1) this.currentPage--;
      if (direction === 'next' && this.currentPage < this.totalPages()) this.currentPage++;
    }

    openAddCustomer(): void {
        this.newCustomer = {
          CUS_CustomerName: '',
          CUS_PhoneNumber: '',
          CUS_Village: '',
          CUS_Block: '',
          CUS_District: '',
          CUS_CreatedBy: 1
        };
        this.showModal = true;
      }
      closeModal() {
          this.showModal = false;
        }
      addCustomer(){
        if(this.newCustomer.CUS_CustomerID){
          this.customerService.updateCustomer(this.newCustomer).subscribe({
            next: (res)=>{
              this.loadCustomers();
              this.closeModal();
              },
            error: (err)=>{
              console.error('Error Updating Customer', err);
              }
            });
          }
        else{
          this.customerService.addCustomer(this.newCustomer).subscribe({
            next: (res)=>{
               this.loadCustomers();
               this.closeModal();
              },
            error: (err)=>{
              console.error('Error Adding Customer', err);
              }
            });
          }
        }
      deleteCustomer(id:number):void{
        this.customerService.deleteCustomer(id).subscribe({
          next: ()=>{
            this.loadCustomers();
            }
          });
        }
      openEditCustomer(customer:Customer):void{
        this.newCustomer = { ...customer };
        this.showModal = true;
        }

      orderCustomer(customer: any) {
        const id = customer.CUS_CustomerID;
        const phone = customer.CUS_PhoneNumber;
        this.router.navigate([`/dashboard/order`, id, phone]);
      }
}
