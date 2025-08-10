import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss'
})
export class PaymentModalComponent {
  @Input() orderId: number | null = null;
  @Input() paymentData: any = null;
  @Output() onSave = new EventEmitter<any>();

  showModal: boolean = false;

  amount: number | null = null;
  paymode: string = '';
  referenceno: string = '';
  remark: string = '';

 open(data?: any){
    this.showModal = true
    if(data) {
      this.amount = data.ORP_PaymentAmount;
      this.paymode = data.ORP_PaymentMode;
      this.referenceno = data.ORP_ReferenceNumber;
      this.remark = data.ORP_Remarks;
      }
    else {
      this.amount = null;
      this.paymode = '';
      this.referenceno = '';
      this.remark = '';
      }
    }

    close() {
        this.showModal = false;
    }

    save() {
       const now = new Date();
       const formattedDate = now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + ' ' +
          String(now.getHours()).padStart(2, '0') + ':' +
          String(now.getMinutes()).padStart(2, '0') + ':' +
          String(now.getSeconds()).padStart(2, '0');
      const payload = {
        ORP_ORD_OrderID : this.orderId,
        ORP_PaymentDate: formattedDate,
        ORP_PaymentAmount : this.amount,
        ORP_PaymentMode : this.paymode,
        ORP_ReferenceNumber : this.referenceno,
        ORP_Remarks : this.remark,
        ORP_CreatedBy: '1'
        };
        this.onSave.emit(payload);
        this.close();
      }
}
