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
  selector: 'app-member-event',
  templateUrl: './member-event.component.html',
  styleUrls: ['./member-event.component.scss'],
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


export class MemberEventComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private notification = inject(Notification);
  
  allEvents: any[] = [];
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];
  loading: boolean = false;

  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    this.loading = true;
    try {
      console.log('Loading events...');
      
      this.allEvents = await this.apiService.getUpcomingEvents().toPromise();
      this.filterEvents();
      
      console.log('Events loaded successfully:', this.allEvents);
      // this.notification.success('Events loaded successfully');
    } catch (error) {
      console.error('Error loading events:', error);
      this.notification.error('Failed to load events');
    } finally {
      this.loading = false;
    }
  }

  filterEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter upcoming events (future dates)
    this.upcomingEvents = this.allEvents
      .filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    // Get 2 most recent past events
    this.pastEvents = this.allEvents
      .filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
      })
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
      .slice(0, 2);
  }
}