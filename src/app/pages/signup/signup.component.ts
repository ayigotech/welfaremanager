import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonBackButton,
  IonRefresher,
  IonRefresherContent,
  IonIcon
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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
    IonRefresher,
    IonRefresherContent,
    IonIcon
  ]
})
export class SignupComponent {
  private apiService = inject(ApiService);
  private notificationService = inject(Notification);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  signupForm!: FormGroup;
  currentStep: number = 1;
  isLoading: boolean = false;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.fb.group({
      // Step 1: Church Information
      church_name: ['', [Validators.required]],
      welfare_name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      church_email: ['', [Validators.required, Validators.email]],
      welfare_momo: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]], // 10 digits starting with 0
      church_momo: ['', [Validators.pattern(/^0[0-9]{9}$/)]], //
      
      // Step 2: User Information  
      name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
  }

  // Step Navigation
  nextStep(): void {
    if (this.isStep1Valid()) {
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  // Validation Methods
  isStep1Valid(): boolean {
    const controls = ['church_name', 'welfare_name', 'location', 'church_email'];
    return controls.every(control => this.signupForm.get(control)?.valid);
  }

  isStep2Valid(): boolean {
    const controls = ['name', 'phone_number'];
    return controls.every(control => this.signupForm.get(control)?.valid);
  }

  showError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  // Form Submission
async onSubmit(): Promise<void> {
  // Mark all fields as touched to show validation errors
  Object.keys(this.signupForm.controls).forEach(key => {
    this.signupForm.get(key)?.markAsTouched();
  });

  if (this.signupForm.valid) {
    this.isLoading = true;
    
    try {
      const formData = this.signupForm.value;
      
      // Transform data to match backend expectations
      const signupData = {
        church_name: formData.church_name,
        welfare_name: formData.welfare_name,
        location: formData.location,
        church_email: formData.church_email,
        welfare_momo: formData.welfare_momo,
        church_momo: formData.church_momo,
        name: formData.name,
        phone_number: formData.phone_number,
        gender: formData.gender
      };

      console.log('signupData, ', signupData)
      const response = await this.apiService.signup(signupData).toPromise();
      
      this.isLoading = false;
      this.notificationService.success('Church account created successfully!');
      
      // Navigate to login page
      this.router.navigate(['/login']);
      
    } catch (error: any) {
      this.isLoading = false;
      this.notificationService.error(
        error?.error?.message || 'Failed to create account. Please try again.'
      );
    }
  }
}

  handleRefresh(event: any) {
    setTimeout(() => {
      this.initializeForm();
      this.currentStep = 1;
      event.target.complete();
    }, 1000);
  }
}