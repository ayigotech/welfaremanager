import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';

interface Event {
  id?: number;
  event_type: 'funeral' | 'wedding' | 'child_dedication' | 'sickness' | 'other';
  event_type_display: string;
  member: number;
  member_name: string;
  event_date: string;
  venue?: string;
  description?: string;
  levy_amount: number;
  is_levy_paid: boolean;
  created_by: number;
  created_at: string;
}

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.scss'],
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
export class ManageEventsComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification);

  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  typeFilter: string = 'all';
  loading: boolean = false;
  
  // Delete confirmation
  showDeleteConfirm: boolean = false;
  eventToDelete: Event | null = null;


  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
  this.loading = true;
  try {
    console.log('Loading events...');
    
    this.events = await this.apiService.getEvents().toPromise();
    this.filteredEvents = [...this.events];
    
    console.log('Events loaded successfully:', this.events);
    // this.notification.success('Events loaded successfully');
  } catch (error) {
    console.error('Error loading events:', error);
    this.notification.error('Failed to load events');
  } finally {
    this.loading = false;
  }
}

  filterEvents() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.member_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           event.venue?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           this.searchTerm === '';
      const matchesType = this.typeFilter === 'all' || event.event_type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  setFilter(filter: string) {
    this.typeFilter = filter;
    this.filterEvents();
  }

  formatCurrency(amount: any): string {
  // Convert to number first, handle null/undefined/string
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return '₵0.00';
  }
  
  return '₵' + numAmount.toFixed(2);
}

  getEventTypeClass(eventType: string): string {
    const classMap: { [key: string]: string } = {
      'funeral': 'funeral',
      'wedding': 'wedding',
      'child_dedication': 'child-dedication',
      'sickness': 'sickness',
      'other': 'other'
    };
    return classMap[eventType] || 'other';
  }

  getEventTypeIcon(eventType: string): string {
    const iconMap: { [key: string]: string } = {
      'funeral': 'heart-dislike-outline',
      'wedding': 'heart-outline',
      'child_dedication': 'people-outline',
      'sickness': 'medical-outline',
      'other': 'calendar-outline'
    };
    return iconMap[eventType] || 'calendar-outline';
  }

  navigateToAddEvent() {
    this.router.navigate(['/welfare/events/add']);
  }

  confirmDelete(event: Event) {
    this.eventToDelete = event;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.eventToDelete = null;
  }

 
  async deleteEvent() {
  if (!this.eventToDelete || !this.eventToDelete.id) return;

  try {
    console.log('Deleting event:', this.eventToDelete.id);
    
    await this.apiService.deleteEvent(this.eventToDelete.id).toPromise();
    
    this.events = this.events.filter(e => e.id !== this.eventToDelete!.id);
    this.filterEvents();
    
    console.log('Event deleted successfully');
    this.notification.success('Event deleted successfully');
  } catch (error) {
    console.error('Error deleting event:', error);
    this.notification.error('Failed to delete event');
  } finally {
    this.cancelDelete();
  }
}


  async editEvent(evnt: Event | null) {
    if (!evnt) return;
    
    // Navigate to edit page
    console.log('Edit event:', evnt);
    this.router.navigate(['/welfare/events/edit', evnt.id]);
}



async refreshPage(event: any) {
    await this.loadEvents();
    event.target.complete();
  }
}