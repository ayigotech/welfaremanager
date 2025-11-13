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
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-member-notification',
  templateUrl: './member-notification.component.html',
  styleUrls: ['./member-notification.component.scss'],
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


export class MemberNotificationComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private notification = inject(Notification);
  
  // Data for outstanding amounts
  outstandingDues: any = {};
  outstandingTransport: any = {};

  // Recent payments data
  recentPayments: any[] = [];
  loading: boolean = false;

   // Church data
  welfareMomo: string = '';
  churchMomo: string = '';

  async ngOnInit() {
      await this.loadChurchData();
    await this.loadOutstandingAmounts();
  }



async loadChurchData() {
  try {
    console.log('Loading church data from API...');
    
    const church = await this.apiService.getChurchInfo().toPromise();
    console.log('Church data loaded:', church);
    
    if (church) {
      this.welfareMomo = church.welfare_momo || '055 123 4567'; // Fallback
      this.churchMomo = church.church_momo || '';
    } else {
      this.welfareMomo = '055 123 4567'; // Default fallback
    }
  } catch (error) {
    console.error('Error loading church data:', error);
    this.welfareMomo = '055 123 4567'; // Default fallback
    this.notification.error('Failed to load church contact information');
  }
}



  async loadOutstandingAmounts() {
    this.loading = true;
    try {
      console.log('Loading outstanding amounts...');
      
      const response = await this.apiService.getOutstandingAmountsReport().toPromise();
      
      // Map the response data to component properties
      this.outstandingDues = response.outstandingDues;
      this.outstandingTransport = response.outstandingTransport;
      this.recentPayments = response.recentPayments;
      
      console.log('Outstanding amounts loaded successfully:', response);
      // this.notification.success('Notifications loaded successfully');
    } catch (error) {
      console.error('Error loading outstanding amounts:', error);
      this.notification.error('Failed to load notifications');
    } finally {
      this.loading = false;
    }
  }


  formatMomoNumber(momo: string): string {
    if (!momo) return '';
    // Format as 055 123 4567
    return momo.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }

  getTotalDuesDue(): number {
    return Object.values(this.outstandingDues).reduce((sum: number, amount: any) => sum + amount, 0);
  }

  getTotalTransportDue(): number {
    return Object.values(this.outstandingTransport).reduce((sum: number, amount: any) => sum + amount, 0);
  }

  getPaymentTypeClass(type: string): string {
    switch(type.toLowerCase()) {
      case 'dues': return 'dues';
      case 'transport levy': return 'transport';
      default: return 'other';
    }
  }

  viewPaymentHistory() {
    // Navigate to full payment history page
    this.router.navigate(['/member/payment-history']);
  }

  contactWelfare() {
  if (this.welfareMomo) {
    // Format the number for tel: link (remove spaces)
    const phoneNumber = this.welfareMomo.replace(/\s/g, '');
    
    // Create a tel: link to initiate a call
    window.open(`tel:${phoneNumber}`, '_system');
    
    console.log('Calling welfare department:', phoneNumber);
  } else {
    console.log('Welfare mobile number not available');
    this.notification.warning('Welfare contact number not available');
  }
}
}