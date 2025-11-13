import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

interface Member {
  id: number;
  full_name: string;
  phone_number: string;
}

interface Event {
  id: number;
  event_type: 'funeral' | 'wedding' | 'child_dedication' | 'sickness' | 'other';
  member: number;
  event_date: string;
  venue?: string;
  description?: string;
  levy_amount: number;
  is_levy_paid: boolean;
}

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
export class EditEventComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
   private notification = inject(Notification);

  eventForm!: FormGroup;
  members: Member[] = [];
  event!: Event;
  eventId!: number;
  isLoading: boolean = false;

  ngOnInit() {
    this.eventId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadMembers();
    this.loadEvent();
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      event_type: ['', [Validators.required]],
      member: ['', [Validators.required]],
      event_date: ['', [Validators.required]],
      venue: [''],
      description: [''],
      levy_amount: [0, [Validators.min(0)]],
      is_levy_paid: [false]
    });
  }

  async loadMembers() {
    try {
      // this.members = await this.apiService.get('members/');
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }

  async loadEvent() {
  this.isLoading = true;
  try {
    console.log('Loading event:', this.eventId);
    
    this.event = await this.apiService.getEvent(this.eventId).toPromise();
    
    this.eventForm.patchValue({
      event_type: this.event.event_type,
      member: this.event.member,
      event_date: this.event.event_date,
      venue: this.event.venue || '',
      description: this.event.description || '',
      levy_amount: this.event.levy_amount,
      is_levy_paid: this.event.is_levy_paid
    });
    
    console.log('Event loaded successfully');
  } catch (error) {
    console.error('Error loading event:', error);
    this.notification.error('Failed to load event');
  } finally {
    this.isLoading = false;
  }
}

  
  async updateEvent() {
  if (this.eventForm.invalid) return;

  this.isLoading = true;
  try {
    const eventData = {
      ...this.eventForm.value,
      levy_amount: parseFloat(this.eventForm.value.levy_amount) || 0
    };

    console.log('Updating event:', this.eventId, eventData);
    
    await this.apiService.updateEvent(this.eventId, eventData).toPromise();
    
    console.log('Event updated successfully');
    this.notification.success('Event updated successfully');
    
    this.router.navigate(['/welfare/events']);
  } catch (error) {
    console.error('Error updating event:', error);
    this.notification.error('Failed to update event');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/events']);
  }
}