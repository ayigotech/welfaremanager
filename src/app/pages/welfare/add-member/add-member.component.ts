import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Notification } from 'src/app/services/notification';
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

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
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
export class AddMemberComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notification = inject(Notification)


  memberForm!: FormGroup;
  isLoading: boolean = false;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.memberForm = this.fb.group({
      full_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      gender: ['', [Validators.required]],
      status: ['active'],
      location: [''],
      date_joined: [new Date().toISOString().split('T')[0]]
    });
  }

  
  async saveMember() {
  if (this.memberForm.invalid) return;

  this.isLoading = true;
  try {
    const memberData = {
      ...this.memberForm.value,
      church: this.authService.getCurrentUser()?.church.id
    };

    console.log('Saving member data:', memberData);
    
    // API call here
    const response = await this.apiService.createMember(memberData).toPromise();
    
    console.log('Member saved successfully:', response);
    this.notification.success('Member added successfully');
    
    this.router.navigate(['/welfare/members']);
  } catch (error) {
    console.error('Error saving member:', error);
    this.notification.error('Failed to add member');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/members']);
  }
}