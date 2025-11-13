import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonNote,
  IonBadge,
  IonSpinner
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-member-payment-history',
  templateUrl: './member-payment-history.component.html',
  styleUrls: ['./member-payment-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonIcon,
    IonButtons,
    IonBackButton,
    // IonItem,
    // IonLabel,
    // IonNote,
    // IonBadge,
    IonSpinner
  ]
})
export class MemberPaymentHistoryComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private notification = inject(Notification);

  payments: any[] = [];
  loading: boolean = false;
  filteredPayments: any[] = [];
  searchTerm: string = '';
  currentFilter: string = 'all';

  // Filters
  filters = [
    { value: 'all', label: 'All Payments' },
    { value: 'monthly_dues', label: 'Monthly Dues' },
    { value: 'transport_levy', label: 'Transport Levy' },
   
  ];

  async ngOnInit() {
    await this.loadPaymentHistory();
  }

  async loadPaymentHistory() {
    this.loading = true;
    try {
      console.log('Loading payment history...');
      
      // We'll create this endpoint in backend
      this.payments = await this.apiService.getMemberPaymentHistory().toPromise();
      this.filteredPayments = [...this.payments];
      
      console.log('Payment history loaded successfully:', this.payments);
      // this.notification.success('Payment history loaded');
    } catch (error) {
      console.error('Error loading payment history:', error);
      this.notification.error('Failed to load payment history');
    } finally {
      this.loading = false;
    }
  }

  filterPayments() {
    let filtered = this.payments;

    // Filter by type
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(payment => payment.receipt_type === this.currentFilter);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.receipt_number.toLowerCase().includes(term) ||
        (payment.details && payment.details.toLowerCase().includes(term)) ||
        payment.year.toString().includes(term)
      );
    }

    this.filteredPayments = filtered;
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filterPayments();
  }

  onFilterChange(filter: string) {
    this.currentFilter = filter;
    this.filterPayments();
  }

  getReceiptTypeDisplay(type: string): string {
    const typeMap: { [key: string]: string } = {
      'monthly_dues': 'Monthly Dues',
      'transport_levy': 'Transport Levy',
      'donation': 'Donation',
      'passbook': 'Passbook',
      'other': 'Other'
    };
    return typeMap[type] || type;
  }

  getReceiptTypeClass(type: string): string {
    return type; // This will use the CSS classes defined in SCSS
  }

  formatCurrency(amount: any): string {
    const numAmount = Number(amount);
    return isNaN(numAmount) ? '₵0.00' : '₵' + numAmount.toFixed(2);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  goBack() {
    this.router.navigate(['/member/dashboard']);
  }
}