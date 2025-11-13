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

@Component({
  selector: 'app-add-yearly-dues',
  templateUrl: './add-yearly-dues.component.html',
  styleUrls: ['./add-yearly-dues.component.scss'],
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
export class AddYearlyDuesComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private notification = inject(Notification)

  duesForm!: FormGroup;
  isLoading: boolean = false;
  availableYears: number[] = [];
 

  ngOnInit() {
    this.initializeForm();
    this.generateAvailableYears();
  }

  initializeForm() {
    const currentYear = new Date().getFullYear();
    
    this.duesForm = this.fb.group({
      year: [currentYear, [Validators.required]],
      monthly_amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 10 }, (_, i) => currentYear + i);
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) {
      return '₵0.00';
    }
    return '₵' + amount.toFixed(2);
  }

 async saveDues() {
  if (this.duesForm.invalid) return;

  this.isLoading = true;
  try {
    const duesData = {
      ...this.duesForm.value,
      created_by: this.authService.getCurrentUser()?.id,
      church: this.authService.getCurrentUser()?.church.id
    };

    console.log('Saving yearly dues:', duesData);
    
    await this.apiService.createYearlyDues(duesData).toPromise();
    
    console.log('Yearly dues saved successfully');
    this.notification.success('Yearly dues created successfully');
    
    this.router.navigate(['/welfare/yearly-dues']);
  } catch (error) {
    console.error('Error saving yearly dues:', error);
    this.notification.error('Failed to create yearly dues');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/yearly-dues']);
  }
}