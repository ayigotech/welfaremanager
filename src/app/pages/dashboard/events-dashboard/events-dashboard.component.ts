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

interface EventTypeDistribution {
  event_type: string;
  count: number;
}

interface MonthlyTrend {
  month: string;
  total_events: number;
  levy_collected: number;
  levy_collection_rate: number;
}

interface EventsInsights {
  // Event Volume
  total_events: number;
  current_month_events: number;
  
  // Event Type Distribution
  event_type_distribution: EventTypeDistribution[];
  
  // Financial Impact
  total_levy_collected: number;
  levy_collection_rate: number;
  average_levy_amount: number;
  events_with_levy: number;
  cost_recovery_rate: number;
  
  // Trends
  monthly_trends: MonthlyTrend[];
  
  // Performance
  levy_collection_target: number;
  levy_trend: number;
}

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss'],
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


export class EventsDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification)


  insights: EventsInsights | null = null;
  loading: boolean = false;
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    this.loadEventsInsights();
  }

 
  async loadEventsInsights() {
  this.loading = true;
  try {
    console.log('Loading events insights...');
    
    this.insights = await this.apiService.getEventsInsights(this.currentYear).toPromise();
    
    console.log('Events insights loaded successfully', this.insights);
  } catch (error) {
    console.error('Error loading events insights:', error);
    // Fallback to mock data for development
    this.loadMockData();
    this.notification.error('Failed to load events insights');
  } finally {
    this.loading = false;
  }
}

  loadMockData() {
    this.insights = {
      // Event Volume
      total_events: 48,
      current_month_events: 6,
      
      // Event Type Distribution
      event_type_distribution: [
        { event_type: 'funeral', count: 18 },
        { event_type: 'wedding', count: 12 },
        { event_type: 'child_dedication', count: 8 },
        { event_type: 'sickness', count: 6 },
        { event_type: 'other', count: 4 }
      ],
      
      // Financial Impact
      total_levy_collected: 8400.00,
      levy_collection_rate: 75,
      average_levy_amount: 175.00,
      events_with_levy: 36,
      cost_recovery_rate: 65,
      
      // Trends
      monthly_trends: [
        { month: 'Jan', total_events: 8, levy_collected: 1200, levy_collection_rate: 70 },
        { month: 'Feb', total_events: 7, levy_collected: 1100, levy_collection_rate: 72 },
        { month: 'Mar', total_events: 9, levy_collected: 1400, levy_collection_rate: 68 },
        { month: 'Apr', total_events: 8, levy_collected: 1350, levy_collection_rate: 75 },
        { month: 'May', total_events: 6, levy_collected: 1050, levy_collection_rate: 78 },
        { month: 'Jun', total_events: 6, levy_collected: 1150, levy_collection_rate: 80 }
      ],
      
      // Performance
      levy_collection_target: 85,
      levy_trend: 12
    };
  }

  formatCurrency(amount: number): string {
    return '₵' + amount.toFixed(2);
  }

  getEventTypeClass(eventType: string): string {
    return eventType.replace('_', '-');
  }

  getEventTypeIcon(eventType: string): string {
    const iconMap: { [key: string]: string } = {
      'funeral': 'heart-dislike-outline',
      'wedding': 'heart-outline',
      'child_dedication': 'people-outline',
      'sickness': 'medical-outline',
      'other': 'ellipsis-horizontal-outline'
    };
    return iconMap[eventType] || 'help-outline';
  }

  getEventTypeDisplay(eventType: string): string {
    const displayMap: { [key: string]: string } = {
      'funeral': 'Funeral',
      'wedding': 'Wedding',
      'child_dedication': 'Child Dedication',
      'sickness': 'Sickness',
      'other': 'Other'
    };
    return displayMap[eventType] || eventType;
  }

  getTypePercentage(eventType: string): number {
    if (!this.insights) return 0;
    
    const total = this.insights.event_type_distribution.reduce((sum, type) => sum + type.count, 0);
    if (total === 0) return 0;
    
    const typeData = this.insights.event_type_distribution.find(t => t.event_type === eventType);
    return typeData ? Math.round((typeData.count / total) * 100) : 0;
  }

  async refreshData() {
    await this.loadEventsInsights();
  }


  getLevyCollectionStatus(): string {
  const rate = this.insights?.levy_collection_rate || 0;
  
  if (rate >= 80) return 'healthy';
  if (rate >= 60) return 'warning';
  return 'critical';
}

getLevyCollectionText(): string {
  const rate = this.insights?.levy_collection_rate || 0;
  
  if (rate >= 80) return 'good collection';
  if (rate >= 60) return 'average collection';
  return 'poor collection';
}

getLevyCoverageStatus(): string {
  const eventsWithLevy = this.insights?.events_with_levy || 0;
  const totalEvents = this.insights?.total_events || 1; // Avoid division by zero
  const coverage = (eventsWithLevy / totalEvents) * 100;
  
  if (coverage >= 90) return 'healthy';
  if (coverage >= 70) return 'warning';
  return 'critical';
}

getLevyCoverageText(): string {
  const eventsWithLevy = this.insights?.events_with_levy || 0;
  const totalEvents = this.insights?.total_events || 1;
  const coverage = (eventsWithLevy / totalEvents) * 100;
  
  if (coverage >= 90) return 'most funerals have levies';
  if (coverage >= 70) return 'some funerals missing levies';
  return 'many funerals without levies';
}

getCostRecoveryStatus(): string {
  const rate = this.insights?.cost_recovery_rate || 0;
  
  if (rate >= 80) return 'healthy';
  if (rate >= 60) return 'warning';
  return 'critical';
}

getCostRecoveryText(): string {
  const rate = this.insights?.cost_recovery_rate || 0;
  
  if (rate >= 80) return 'levies cover most costs';
  if (rate >= 60) return 'partial cost coverage';
  return 'levies cover little costs';
}
}