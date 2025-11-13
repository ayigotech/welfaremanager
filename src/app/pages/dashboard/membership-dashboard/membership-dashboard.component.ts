import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';

interface StatusBreakdown {
  status: string;
  count: number;
}

interface TopContributor {
  name: string;
  amount: number;
}

interface MembershipInsights {
  total_members: number;
  active_members: number;
  male_count: number;
  female_count: number;
  compliance_rate: number;
  regular_contributors: number;
  members_with_outstanding_dues: number;
  total_outstanding_amount: number;
  status_breakdown: StatusBreakdown[];
  top_contributors: TopContributor[];
}

@Component({
  selector: 'app-membership-dashboard',
  templateUrl: './membership-dashboard.component.html',
  styleUrls: ['./membership-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon
  ]
})
export class MembershipDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)


  insights: MembershipInsights | null = null;
  loading: boolean = false;

  ngOnInit() {
    this.loadMembershipInsights();
  }


  async loadMembershipInsights() {
  this.loading = true;
  try {
    console.log('Loading membership insights...');
    
    this.insights = await this.apiService.getMembershipInsights().toPromise();
    console.log('Membership insights loaded successfully', this.insights);
  } catch (error) {
    console.error('Error loading membership insights:', error);
    // Fallback to mock data for development
    this.loadMockData();
    this.notification.error('Failed to load membership insights');
  } finally {
    this.loading = false;
  }
}


  loadMockData() {
    this.insights = {
      total_members: 150,
      active_members: 142,
      male_count: 85,
      female_count: 65,
      compliance_rate: 78,
      regular_contributors: 110,
      members_with_outstanding_dues: 32,
      total_outstanding_amount: 2450.00,
      status_breakdown: [
        { status: 'active', count: 142 },
        { status: 'inactive', count: 5 },
        { status: 'transferred', count: 2 },
        { status: 'privileged', count: 1 }
      ],
      top_contributors: [
        { name: 'John Mensah', amount: 1250.00 },
        { name: 'Grace Appiah', amount: 980.00 },
        { name: 'Kwame Asare', amount: 875.00 },
        { name: 'Abena Osei', amount: 760.00 },
        { name: 'Kofi Boateng', amount: 650.00 }
      ]
    };
  }

  formatCurrency(amount: number): string {
    return '₵' + amount.toFixed(2);
  }

  getGenderPercentage(gender: 'male' | 'female'): number {
    if (!this.insights) return 0;
    
    const total = this.insights.male_count + this.insights.female_count;
    if (total === 0) return 0;
    
    const count = gender === 'male' ? this.insights.male_count : this.insights.female_count;
    return Math.round((count / total) * 100);
  }

  async refreshData() {
    await this.loadMembershipInsights();
  }
}