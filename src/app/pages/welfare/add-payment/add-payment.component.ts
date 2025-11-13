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
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
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
export class AddPaymentComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notification = inject(Notification)

  paymentForm!: FormGroup;
  members: Member[] = [];
  isLoading: boolean = false;
  showBeneficiaryField: boolean = false;

  ngOnInit() {
    this.initializeForm();
    this.loadMembers();
  }

  initializeForm() {
    this.paymentForm = this.fb.group({
      payment_type: ['', [Validators.required]],
      beneficiary_member: [''],
      payee_name: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      payment_method: ['', [Validators.required]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      receipt_number: [''],
      description: ['']
    });
  }

  onPaymentTypeChange() {
    const paymentType = this.paymentForm.get('payment_type')?.value;
    this.showBeneficiaryField = paymentType === 'member_benefit';
    
    // Update validation for beneficiary_member
    const beneficiaryControl = this.paymentForm.get('beneficiary_member');
    if (this.showBeneficiaryField) {
      beneficiaryControl?.setValidators([Validators.required]);
    } else {
      beneficiaryControl?.clearValidators();
      beneficiaryControl?.setValue('');
    }
    beneficiaryControl?.updateValueAndValidity();
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

  
async savePayment() {
  if (this.paymentForm.invalid) return;

  this.isLoading = true;
  try {
    const paymentData = {
      ...this.paymentForm.value,
      created_by: this.authService.getCurrentUser()?.id,
      church: this.authService.getCurrentUser()?.church.id
    };

    // Remove beneficiary_member if not member_benefit
    if (paymentData.payment_type !== 'member_benefit') {
      delete paymentData.beneficiary_member;
    }

    console.log('Saving payment:', paymentData);
    
    await this.apiService.createPayment(paymentData).toPromise();
    
    console.log('Payment saved successfully');
    this.notification.success('Payment created successfully');
    
    this.router.navigate(['/welfare/payments']);
  } catch (error) {
    console.error('Error saving payment:', error);
    this.notification.error('Failed to create payment');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/payments']);
  }
}