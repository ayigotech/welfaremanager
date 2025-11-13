import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
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
export class AddEventComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
   private notification = inject(Notification);


  eventForm!: FormGroup;
  members: Member[] = [];
  isLoading: boolean = false;

  ngOnInit() {
    this.initializeForm();
    this.loadMembers();
  }

  initializeForm() {
    this.eventForm = this.fb.group({
      event_type: ['', [Validators.required]],
      member: ['', [Validators.required]],
      event_date: [new Date().toISOString().split('T')[0], [Validators.required]],
      venue: [''],
      description: [''],
      levy_amount: [0, [Validators.min(0)]],
      is_levy_paid: [false]
    });
  }

 
   async loadMembers() {
  try {
    console.log('Loading active members...');
    
    const response = await this.apiService.getMembers().toPromise();
    this.members = response.filter((member: any) => member.status === 'active');
    
    console.log('Active members loaded:', this.members.length);
  } catch (error) {
    console.error('Error loading members:', error);
    this.notification.error('Failed to load members');
  }
}

 async saveEvent() {
  if (this.eventForm.invalid) return;

  this.isLoading = true;
  try {
    const eventData = {
      ...this.eventForm.value,
      created_by: this.authService.getCurrentUser()?.id,
      church: this.authService.getCurrentUser()?.church.id
    };

    // Ensure levy_amount is a number
    eventData.levy_amount = parseFloat(eventData.levy_amount) || 0;

    console.log('Saving event:', eventData);
    
    await this.apiService.createEvent(eventData).toPromise();
    
    console.log('Event saved successfully');
    this.notification.success('Event created successfully');
    
    this.router.navigate(['/welfare/events']);
  } catch (error) {
    console.error('Error saving event:', error);
    this.notification.error('Failed to create event');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/events']);
  }
}