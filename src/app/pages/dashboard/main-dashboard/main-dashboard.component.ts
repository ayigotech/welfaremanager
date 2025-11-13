import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Notification } from 'src/app/services/notification';
import { ApiService } from 'src/app/services/api';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonCard, IonCardContent, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { IonBackButton } from '@ionic/angular/standalone';


interface DashboardStats {
  total_members: number;
  active_members: number;
  total_receipts: number;
  monthly_receipts: number;
  total_payments: number;
  monthly_payments: number;
  total_events: number;
  upcoming_events: number;
  balance: number;
}

interface Activity {
  type: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    // IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonButtons,
    IonRefresher,
    IonRefresherContent
]
})


export class MainDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)

  user: any = null;
  stats: DashboardStats | null = null;
  recentActivity: Activity[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  async loadDashboardData() {
  this.loading = true;
  try {
    // Load dashboard stats
    this.stats = await this.apiService.getDashboardStats().toPromise();
    
    // Load recent activity
    this.recentActivity = await this.apiService.getDashboardRecentActivity().toPromise();
    
    console.log('Dashboard data loaded successfully');
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Fallback to mock data for development
    // this.loadMockData();
    this.notification.error('Failed to load dashboard data');
  } finally {
    this.loading = false;
  }
}

  // loadMockData() {
  //   // Mock data for development
  //   this.stats = {
  //     total_members: 150,
  //     active_members: 142,
  //     total_receipts: 12500,
  //     monthly_receipts: 2500,
  //     total_payments: 8500,
  //     monthly_payments: 1200,
  //     total_events: 45,
  //     upcoming_events: 3
  //   };

  //   this.recentActivity = [
  //     {
  //       type: 'receipt',
  //       description: 'John Doe paid monthly dues',
  //       time: '2 hours ago'
  //     },
  //     {
  //       type: 'event',
  //       description: 'New funeral event added',
  //       time: '5 hours ago'
  //     },
  //     {
  //       type: 'member',
  //       description: 'Jane Smith updated profile',
  //       time: '1 day ago'
  //     },
  //     {
  //       type: 'payment',
  //       description: 'Member benefit payment processed',
  //       time: '2 days ago'
  //     }
  //   ];
  // }

  formatCurrency(amount: number): string {
    return '₵' + amount.toFixed(2);
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'member': 'person-outline',
      'receipt': 'receipt-outline',
      'payment': 'card-outline',
      'event': 'calendar-outline'
    };
    return iconMap[type] || 'help-outline';
  }

  async refreshData() {
    await this.loadDashboardData();
  }

  // Navigation methods
  navigateToMembership() {
    this.router.navigate(['/dashboard/membership-dashboard']);
  }

  navigateToReceipts() {
    this.router.navigate(['/dashboard/receipts-dashboard']);
  }

  navigateToPayments() {
    this.router.navigate(['/dashboard/payments-dashboard']);
  }

  navigateToEvents() {
    this.router.navigate(['/dashboard/events-dashboard']);
  }


  
  async refreshPage(event: any) {
    await this.loadDashboardData();
    event.target.complete();
  }
}