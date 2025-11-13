import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
   IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';

interface Receipt {
  id?: number;
  receipt_number: string;
  member: number;
  member_name: string;
  date: string;
  receipt_type: 'monthly_dues' | 'transport_levy' | 'donation' | 'passbook' | 'other';
  amount: number;
  year: number;
  details: string;
  created_by: number;
  created_at: string;
}

@Component({
  selector: 'app-manage-receipts',
  templateUrl: './manage-receipts.component.html',
  styleUrls: ['./manage-receipts.component.scss'],
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
export class ManageReceiptsComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)

  receipts: Receipt[] = [];
  filteredReceipts: Receipt[] = [];
  searchTerm: string = '';
  typeFilter: string = 'all';
  loading: boolean = false;
  
  // Delete confirmation
  showDeleteConfirm: boolean = false;
  receiptToDelete: Receipt | null = null;

  ngOnInit() {
    this.loadReceipts();
  }

  async loadReceipts() {
  this.loading = true;
  try {
    console.log('Loading receipts...');
    
    this.receipts = await this.apiService.getReceipts().toPromise();
    this.filteredReceipts = [...this.receipts];
    
    console.log('Receipts loaded successfully:', this.receipts);
    // this.notification.success('Receipts loaded successfully');
  } catch (error) {
    console.error('Error loading receipts:', error);
    this.notification.error('Failed to load receipts');
  } finally {
    this.loading = false;
  }
}

  filterReceipts() {
    this.filteredReceipts = this.receipts.filter(receipt => {
      const matchesSearch = receipt.member_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           receipt.receipt_number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           this.searchTerm === '';
      const matchesType = this.typeFilter === 'all' || receipt.receipt_type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  setFilter(filter: string) {
    this.typeFilter = filter;
    this.filterReceipts();
  }

  getTotalAmount(): number {
    return this.filteredReceipts.reduce((total, receipt) => total + Number(receipt.amount), 0);
  }


formatCurrency(amount: any): string {
  // Convert to number first, handle null/undefined/string
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return '₵0.00';
  }
  
  return '₵' + numAmount.toFixed(2);
}

  getReceiptTypeDisplay(type: string | undefined): string {
  if (!type) return 'Unknown';
  const typeMap: { [key: string]: string } = {
    'monthly_dues': 'Monthly Dues',
    'transport_levy': 'Transport Levy',
    'donation': 'Donation',
    'passbook': 'Passbook',
    'other': 'Other'
  };
  return typeMap[type] || type;
}

  navigateToAddReceipt() {
    this.router.navigate(['/welfare/receipts/add']);
  }

  confirmDelete(receipt: Receipt) {
    this.receiptToDelete = receipt;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.receiptToDelete = null;
  }

  
 async deleteReceipt() {
  if (!this.receiptToDelete || !this.receiptToDelete.id) return;

  try {
    console.log('Deleting receipt:', this.receiptToDelete.id);
    
    await this.apiService.deleteReceipt(this.receiptToDelete.id).toPromise();
    
    this.receipts = this.receipts.filter(r => r.id !== this.receiptToDelete!.id);
    this.filterReceipts();
    
    console.log('Receipt deleted successfully');
    this.notification.success('Receipt deleted successfully');
  } catch (error) {
    console.error('Error deleting receipt:', error);
    this.notification.error('Failed to delete receipt');
  } finally {
    this.cancelDelete();
  }
}





 async refreshPage(event: any) {
    await this.loadReceipts();
    event.target.complete();
  }






}