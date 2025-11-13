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

interface MonthlyTrend {
  month: string;
  total: number;
  monthly_dues: number;
  transport_levy: number;
}

interface TopContributor {
  name: string;
  total: number;
  monthly_dues: number;
  transport_levy: number;
}

interface ReceiptsInsights {
  // Totals
  total_year_receipts: number;
  total_receipts_count: number;
  current_month_total: number;
  monthly_growth: number;
  average_receipt_amount: number;
  
  // Type Breakdown
  monthly_dues_total: number;
  transport_levy_total: number;
  other_types_total: number;
  
  // Trends
  monthly_trends: MonthlyTrend[];
  
  // Performance
  monthly_dues_compliance: number;
  monthly_dues_target: number;
  transport_levy_efficiency: number;
  transport_levy_expected: number;
  
  // Top Contributors
  top_contributors: TopContributor[];
}

@Component({
  selector: 'app-receipts-dashboard',
  templateUrl: './receipts-dashboard.component.html',
  styleUrls: ['./receipts-dashboard.component.scss'],
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
export class ReceiptsDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)

  insights: ReceiptsInsights | null = null;
  loading: boolean = false;
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    this.loadReceiptsInsights();
  }


  async loadReceiptsInsights() {
  this.loading = true;
  try {
    console.log('Loading receipts insights...');
    
    this.insights = await this.apiService.getReceiptsInsights(this.currentYear).toPromise();
    
    console.log('Receipts insights loaded successfully',  this.insights);
  } catch (error) {
    console.error('Error loading receipts insights:', error);
    // Fallback to mock data for development
    this.loadMockData();
    this.notification.error('Failed to load receipts insights');
  } finally {
    this.loading = false;
  }
}


  loadMockData() {
    this.insights = {
      total_year_receipts: 28500.00,
      total_receipts_count: 342,
      current_month_total: 3200.00,
      monthly_growth: 12.5,
      average_receipt_amount: 83.33,
      
      monthly_dues_total: 19800.00,
      transport_levy_total: 6500.00,
      other_types_total: 2200.00,
      
      monthly_trends: [
        { month: 'Jan', total: 2500, monthly_dues: 1800, transport_levy: 500 },
        { month: 'Feb', total: 2800, monthly_dues: 1900, transport_levy: 600 },
        { month: 'Mar', total: 3200, monthly_dues: 2200, transport_levy: 700 },
        { month: 'Apr', total: 3100, monthly_dues: 2100, transport_levy: 650 },
        { month: 'May', total: 3500, monthly_dues: 2400, transport_levy: 800 },
        { month: 'Jun', total: 3200, monthly_dues: 2200, transport_levy: 700 }
      ],
      
      monthly_dues_compliance: 78,
      monthly_dues_target: 85,
      transport_levy_efficiency: 65,
      transport_levy_expected: 75,
      
      top_contributors: [
        { name: 'John Mensah', total: 1850, monthly_dues: 1200, transport_levy: 650 },
        { name: 'Grace Appiah', total: 1620, monthly_dues: 1000, transport_levy: 620 },
        { name: 'Kwame Asare', total: 1480, monthly_dues: 900, transport_levy: 580 },
        { name: 'Abena Osei', total: 1350, monthly_dues: 850, transport_levy: 500 },
        { name: 'Kofi Boateng', total: 1220, monthly_dues: 800, transport_levy: 420 }
      ]
    };
  }

  formatCurrency(amount: number): string {
    return '₵' + amount.toFixed(2);
  }

  getTypePercentage(type: string): number {
    if (!this.insights) return 0;
    
    const total = this.insights.monthly_dues_total + this.insights.transport_levy_total + this.insights.other_types_total;
    if (total === 0) return 0;
    
    let amount = 0;
    switch (type) {
      case 'monthly_dues': amount = this.insights.monthly_dues_total; break;
      case 'transport_levy': amount = this.insights.transport_levy_total; break;
      case 'other': amount = this.insights.other_types_total; break;
    }
    
    return Math.round((amount / total) * 100);
  }

  async refreshData() {
    await this.loadReceiptsInsights();
  }

  getMonthlyGrowth(): number {
  return this.insights?.monthly_growth || 0;
}

isPositiveGrowth(): boolean {
  return (this.insights?.monthly_growth || 0) >= 0;
}

getGrowthSymbol(): string {
  return (this.insights?.monthly_growth || 0) >= 0 ? '+' : '';
}
}