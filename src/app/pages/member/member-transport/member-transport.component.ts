import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Notification } from 'src/app/services/notification';
import { ApiService } from 'src/app/services/api';
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
  selector: 'app-member-transport',
  templateUrl: './member-transport.component.html',
  styleUrls: ['./member-transport.component.scss'],
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


export class MemberTransportComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private notification = inject(Notification);
  
  // Data properties
  totalTransportExpected: number = 0;
  totalPaid: number = 0;
  overallProgress: number = 0;
  
  currentYear: number = new Date().getFullYear();
  currentYearExpected: number = 0;
  currentYearPaid: number = 0;
  currentYearProgress: number = 0;
  
  // Contributions to affected members
  memberContributions: any[] = [];
  loading: boolean = false;

  async ngOnInit() {
    await this.loadTransportLeviesReport();
  }

  async loadTransportLeviesReport() {
    this.loading = true;
    try {
      console.log('Loading transport levies report...');
      
      const response = await this.apiService.getTransportLeviesReport().toPromise();
      
      // Map the response data to component properties
      this.totalTransportExpected = response.totalTransportExpected;
      this.totalPaid = response.totalPaid;
      this.overallProgress = response.overallProgress;
      this.currentYearExpected = response.currentYearExpected;
      this.currentYearPaid = response.currentYearPaid;
      this.currentYearProgress = response.currentYearProgress;
      this.memberContributions = response.memberContributions;
      
      console.log('Transport levies report loaded successfully:', response);
      // this.notification.success('Transport levies report loaded');
    } catch (error) {
      console.error('Error loading transport levies report:', error);
      this.notification.error('Failed to load transport levies report');
    } finally {
      this.loading = false;
    }
  }

  calculateProgress() {
    this.overallProgress = Math.round((this.totalPaid / this.totalTransportExpected) * 100);
    this.currentYearProgress = Math.round((this.currentYearPaid / this.currentYearExpected) * 100);
  }
}