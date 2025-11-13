import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';

interface Payment {
  id?: number;
  payment_type: 'member_benefit' | 'operational_expense' | 'event_expense' | 'other';
  payment_type_display: string;
  beneficiary_member?: number;
  beneficiary_name?: string;
  related_event?: number;
  payee_name: string;
  date: string;
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
  payment_method_display: string;
  description?: string;
  receipt_number?: string;
  created_by: number;
  created_at: string;
}

@Component({
  selector: 'app-manage-payments',
  templateUrl: './manage-payments.component.html',
  styleUrls: ['./manage-payments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent
]
})
export class ManagePaymentsComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)

  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchTerm: string = '';
  typeFilter: string = 'all';
  loading: boolean = false;
  
  // Delete confirmation
  showDeleteConfirm: boolean = false;
  paymentToDelete: Payment | null = null;

  ngOnInit() {
    this.loadPayments();
  }

  async loadPayments() {
  this.loading = true;
  try {
    console.log('Loading payments...');
    
    this.payments = await this.apiService.getPayments().toPromise();
    this.filteredPayments = [...this.payments];
    
    console.log('Payments loaded successfully:', this.payments);
    // this.notification.success('Payments loaded successfully');
  } catch (error) {
    console.error('Error loading payments:', error);
    this.notification.error('Failed to load payments');
  } finally {
    this.loading = false;
  }
}

  filterPayments() {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = payment.payee_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           payment.beneficiary_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           this.searchTerm === '';
      const matchesType = this.typeFilter === 'all' || payment.payment_type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  setFilter(filter: string) {
    this.typeFilter = filter;
    this.filterPayments();
  }

  getTotalAmount(): number {
    return this.filteredPayments.reduce((total, payment) => total + Number(payment.amount), 0);
  }

 
  formatCurrency(amount: any): string {
  // Convert to number first, handle null/undefined/string
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return '₵0.00';
  }
  
  return '₵' + numAmount.toFixed(2);
}

  getPaymentTypeClass(paymentType: string): string {
    const classMap: { [key: string]: string } = {
      'member_benefit': 'benefit',
      'operational_expense': 'operational',
      'event_expense': 'event',
      'other': 'other'
    };
    return classMap[paymentType] || 'other';
  }

  getPaymentTypeIcon(paymentType: string): string {
    const iconMap: { [key: string]: string } = {
      'member_benefit': 'people-outline',
      'operational_expense': 'business-outline',
      'event_expense': 'calendar-outline',
      'other': 'card-outline'
    };
    return iconMap[paymentType] || 'card-outline';
  }

  navigateToAddPayment() {
    this.router.navigate(['/welfare/payments/add']);
  }

  confirmDelete(payment: Payment) {
    this.paymentToDelete = payment;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.paymentToDelete = null;
  }

  async deletePayment() {
  if (!this.paymentToDelete || !this.paymentToDelete.id) return;

  try {
    console.log('Deleting payment:', this.paymentToDelete.id);
    
    await this.apiService.deletePayment(this.paymentToDelete.id).toPromise();
    
    this.payments = this.payments.filter(p => p.id !== this.paymentToDelete!.id);
    this.filterPayments();
    
    console.log('Payment deleted successfully');
    this.notification.success('Payment deleted successfully');
  } catch (error) {
    console.error('Error deleting payment:', error);
    this.notification.error('Failed to delete payment');
  } finally {
    this.cancelDelete();
  }
}





 async refreshPage(event: any) {
    await this.loadPayments();
    event.target.complete();
  }
}