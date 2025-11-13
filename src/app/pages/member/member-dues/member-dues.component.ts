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
  IonBackButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-member-dues',
  templateUrl: './member-dues.component.html',
  styleUrls: ['./member-dues.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class MemberDuesComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private notification = inject(Notification);
  
  // Data properties
  totalDuesExpected: number = 0;
  totalPaid: number = 0;
  overallProgress: number = 0;
  
  currentYear: number = new Date().getFullYear();
  currentYearExpected: number = 0;
  currentYearPaid: number = 0;
  currentYearProgress: number = 0;
  
  paymentHistory: any[] = [];
  loading: boolean = false;

  async ngOnInit() {
    await this.loadMemberDuesReport();
  }

  async loadMemberDuesReport() {
    this.loading = true;
    try {
      console.log('Loading member dues report...');
      
      const response = await this.apiService.getMemberDuesReport().toPromise();
      
      // Map the response data to component properties
      this.totalDuesExpected = response.totalDuesExpected;
      this.totalPaid = response.totalPaid;
      this.overallProgress = response.overallProgress;
      this.currentYearExpected = response.currentYearExpected;
      this.currentYearPaid = response.currentYearPaid;
      this.currentYearProgress = response.currentYearProgress;
      this.paymentHistory = response.paymentHistory;
      
      console.log('Member dues report loaded successfully:', response);
      // this.notification.success('Member dues report loaded');
    } catch (error) {
      console.error('Error loading member dues report:', error);
      this.notification.error('Failed to load member dues report');
    } finally {
      this.loading = false;
    }
  }

  calculateProgress() {
    this.overallProgress = Math.round((this.totalPaid / this.totalDuesExpected) * 100);
    this.currentYearProgress = Math.round((this.currentYearPaid / this.currentYearExpected) * 100);
  }
}