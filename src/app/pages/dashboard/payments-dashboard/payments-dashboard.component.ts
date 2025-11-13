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
  member_benefits: number;
  operational: number;
  event_expenses: number;
}

interface PaymentsInsights {
  // Financial Health
  monthly_surplus: number;
  spending_ratio: number;
  welfare_ratio: number;
  total_receipts: number;
  yearly_balance: number;
  
  // Payments Overview
  total_year_payments: number;
  total_payments_count: number;
  current_month_total: number;
  monthly_growth: number;
  average_payment_amount: number;
  
  // Payment Type Breakdown
  member_benefits_total: number;
  operational_total: number;
  event_expenses_total: number;
  other_expenses_total: number;
  
  // Trends
  monthly_trends: MonthlyTrend[];
}

@Component({
  selector: 'app-payments-dashboard',
  templateUrl: './payments-dashboard.component.html',
  styleUrls: ['./payments-dashboard.component.scss'],
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
export class PaymentsDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)

  insights: PaymentsInsights | null = null;
  loading: boolean = false;
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    this.loadPaymentsInsights();
  }



  async loadPaymentsInsights() {
  this.loading = true;
  try {
    console.log('Loading payments insights...');
    
    this.insights = await this.apiService.getPaymentsInsights(this.currentYear).toPromise();
    
    console.log('Payments insights loaded successfully', this.insights);
  } catch (error) {
    console.error('Error loading payments insights:', error);
    // Fallback to mock data for development
    this.loadMockData();
    this.notification.error('Failed to load payments insights');
  } finally {
    this.loading = false;
  }
}

  loadMockData() {
    this.insights = {
      // Financial Health
      monthly_surplus: 450.00,
      spending_ratio: 72,
      welfare_ratio: 35,
      total_receipts: 28500.00,
      yearly_balance: 6500.00,
      
      // Payments Overview
      total_year_payments: 22000.00,
      total_payments_count: 156,
      current_month_total: 1850.00,
      monthly_growth: -8.5, // Negative growth is good for payments (less spending)
      average_payment_amount: 141.03,
      
      // Payment Type Breakdown
      member_benefits_total: 7700.00,
      operational_total: 8500.00,
      event_expenses_total: 4500.00,
      other_expenses_total: 1300.00,
      
      // Trends
      monthly_trends: [
        { month: 'Jan', total: 1800, member_benefits: 600, operational: 800, event_expenses: 300 },
        { month: 'Feb', total: 2200, member_benefits: 800, operational: 900, event_expenses: 400 },
        { month: 'Mar', total: 1900, member_benefits: 650, operational: 850, event_expenses: 350 },
        { month: 'Apr', total: 2100, member_benefits: 750, operational: 900, event_expenses: 400 },
        { month: 'May', total: 2400, member_benefits: 900, operational: 1000, event_expenses: 450 },
        { month: 'Jun', total: 1850, member_benefits: 600, operational: 850, event_expenses: 350 }
      ]
    };
  }

  formatCurrency(amount: number): string {
    return '₵' + amount.toFixed(2);
  }

  getTypePercentage(type: string): number {
    if (!this.insights) return 0;
    
    const total = this.insights.member_benefits_total + this.insights.operational_total + 
                  this.insights.event_expenses_total + this.insights.other_expenses_total;
    if (total === 0) return 0;
    
    let amount = 0;
    switch (type) {
      case 'member_benefits': amount = this.insights.member_benefits_total; break;
      case 'operational': amount = this.insights.operational_total; break;
      case 'events': amount = this.insights.event_expenses_total; break;
      case 'other': amount = this.insights.other_expenses_total; break;
    }
    
    return Math.round((amount / total) * 100);
  }

  async refreshData() {
    await this.loadPaymentsInsights();
  }



  // Add these methods
getMonthlyGrowth(): number {
  return this.insights?.monthly_growth || 0;
}

isPositiveGrowth(): boolean {
  return (this.insights?.monthly_growth || 0) > 0;
}

getGrowthSymbol(): string {
  return (this.insights?.monthly_growth || 0) > 0 ? '+' : '';
}



getSpendingRatioStatus(): string {
  const ratio = this.insights?.spending_ratio || 0;
  
  if (ratio <= 80) return 'healthy';
  if (ratio <= 100) return 'warning';
  return 'critical';
}

getSpendingRatioText(): string {
  const ratio = this.insights?.spending_ratio || 0;
  
  if (ratio <= 80) return 'spending less than you earn';
  if (ratio <= 100) return 'spending as you earn';
  return `spending ${(ratio / 100).toFixed(1)} times more than you're earning!`;
}

getWelfareRatioStatus(): string {
  const ratio = this.insights?.welfare_ratio || 0;
  
  if (ratio >= 40 && ratio <= 60) return 'healthy';
  if (ratio >= 30 && ratio <= 70) return 'warning';
  return 'critical';
}

getWelfareRatioText(): string {
  const ratio = this.insights?.welfare_ratio || 0;
  
  if (ratio >= 40 && ratio <= 60) return 'good balance between benefits and operations';
  if (ratio > 60) return 'most spending goes to member benefits';
  return 'most spending goes to operational costs';
}

}




