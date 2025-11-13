import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';

interface YearlyDues {
  id?: number;
  year: number;
  monthly_amount: number;
  created_at: string;
  created_by: number;
}

@Component({
  selector: 'app-manage-yearly-dues',
  templateUrl: './manage-yearly-dues.component.html',
  styleUrls: ['./manage-yearly-dues.component.scss'],
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
export class ManageYearlyDuesComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)

  yearlyDues: YearlyDues[] = [];
  loading: boolean = false;
  
  // Delete confirmation
  showDeleteConfirm: boolean = false;
  duesToDelete: YearlyDues | null = null;

  ngOnInit() {
    this.loadYearlyDues();
  }

  async loadYearlyDues() {
  this.loading = true;
  try {
    console.log('Loading yearly dues...');
    
    this.yearlyDues = await this.apiService.getYearlyDues().toPromise();
    
    console.log('Yearly dues loaded successfully:', this.yearlyDues);
    // this.notification.success('Yearly dues loaded successfully');
  } catch (error) {
    console.error('Error loading yearly dues:', error);
    this.notification.error('Failed to load yearly dues');
  } finally {
    this.loading = false;
  }
}


formatCurrency(amount: any): string {
  // Convert to number first, handle null/undefined/string
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return '₵0.00';
  }
  
  return '₵' + numAmount.toFixed(2);
}

  navigateToAddDues() {
    this.router.navigate(['/welfare/yearly-dues/add']);
  }

  editDues(dues: YearlyDues) {
    this.router.navigate(['/welfare/yearly-dues/edit', dues.id]);
  }

  confirmDelete(dues: YearlyDues) {
    this.duesToDelete = dues;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.duesToDelete = null;
  }

  async deleteDues() {
  if (!this.duesToDelete || !this.duesToDelete.id) return;

  try {
    console.log('Deleting yearly dues:', this.duesToDelete.id);
    
    await this.apiService.deleteYearlyDues(this.duesToDelete.id).toPromise();
    
    this.yearlyDues = this.yearlyDues.filter(d => d.id !== this.duesToDelete!.id);
    
    console.log('Yearly dues deleted successfully');
    this.notification.success('Yearly dues deleted successfully');
  } catch (error) {
    console.error('Error deleting yearly dues:', error);
    this.notification.error('Failed to delete yearly dues');
  } finally {
    this.cancelDelete();
  }
}



  
 async refreshPage(event: any) {
    await this.loadYearlyDues();
    event.target.complete();
  }
}