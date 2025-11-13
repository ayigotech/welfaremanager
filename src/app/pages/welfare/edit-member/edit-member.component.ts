import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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

interface Member {
  id: number;
  full_name: string;
  phone_number: string;
  gender: 'male' | 'female';
  status: string;
  location?: string;
  date_joined: string;
  church: number;
}

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
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
export class EditMemberComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private notification = inject(Notification)

  memberForm!: FormGroup;
  isLoading: boolean = false;
  memberId!: number;
  member!: Member;

  ngOnInit() {
    this.memberId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadMember();
  }

  initializeForm() {
    this.memberForm = this.fb.group({
      full_name: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      gender: ['', [Validators.required]],
      status: ['active'],
      location: [''],
      date_joined: ['']
    });
  }

  async loadMember() {
  this.isLoading = true;
  try {
    console.log('Loading member with ID:', this.memberId);
    
    this.member = await this.apiService.getMember(this.memberId).toPromise();
    console.log('Member data:', this.member);
    
    this.memberForm.patchValue({
      full_name: this.member.full_name,
      phone_number: this.member.phone_number,
      gender: this.member.gender,
      status: this.member.status,
      location: this.member.location || '',
      date_joined: this.member.date_joined
    });
    
    console.log('Member form patched successfully');
    // this.notification.success('Member loaded successfully');
  } catch (error) {
    console.error('Error loading member:', error);
    this.notification.error('Failed to load member');
  } finally {
    this.isLoading = false;
  }
}

  async updateMember() {
  if (this.memberForm.invalid) return;

  this.isLoading = true;
  try {
    console.log('Updating member:', this.memberId, this.memberForm.value);
    
    await this.apiService.updateMember(this.memberId, this.memberForm.value).toPromise();
    
    console.log('Member updated successfully');
    this.notification.success('Member updated successfully');
    
    this.router.navigate(['/welfare/members']);
  } catch (error) {
    console.error('Error updating member:', error);
    this.notification.error('Failed to update member');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/members']);
  }
}