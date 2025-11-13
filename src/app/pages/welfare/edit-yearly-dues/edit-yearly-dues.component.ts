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

interface YearlyDues {
  id: number;
  year: number;
  monthly_amount: number;
}

@Component({
  selector: 'app-edit-yearly-dues',
  templateUrl: './edit-yearly-dues.component.html',
  styleUrls: ['./edit-yearly-dues.component.scss'],
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
export class EditYearlyDuesComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private notification = inject(Notification)

  duesForm!: FormGroup;
  yearlyDues!: YearlyDues;
  duesId!: number;
  isLoading: boolean = false;

  ngOnInit() {
    this.duesId = +this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadYearlyDues();
  }

  initializeForm() {
    this.duesForm = this.fb.group({
      monthly_amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }


  async loadYearlyDues() {
  this.isLoading = true;
  try {
    console.log('Loading yearly dues for editing:', this.duesId);
    
    this.yearlyDues = await this.apiService.getYearlyDuesById(this.duesId).toPromise();
    
    this.duesForm.patchValue({
      year: this.yearlyDues.year,
      monthly_amount: this.yearlyDues.monthly_amount
    });
    
    console.log('Yearly dues loaded successfully');
    this.notification.success('Yearly dues loaded successfully');
  } catch (error) {
    console.error('Error loading yearly dues:', error);
    this.notification.error('Failed to load yearly dues');
  } finally {
    this.isLoading = false;
  }
}


formatCurrency(amount: any): string {
  // Convert to number first, handle null/undefined/string
  const numAmount = Number(amount);
  
  if (isNaN(numAmount)) {
    return '₵0.00';
  }
  
  return '₵' + numAmount.toFixed(2);
}


  async updateDues2() {
  if (this.duesForm.invalid) return;

  this.isLoading = true;
  try {
    console.log('Updating yearly dues:', this.duesId, this.duesForm.value);
    
    await this.apiService.updateYearlyDues(this.duesId, this.duesForm.value).toPromise();
    
    console.log('Yearly dues updated successfully');
    this.notification.success('Yearly dues updated successfully');
    
    this.router.navigate(['/welfare/yearly-dues']);
  } catch (error) {
    console.error('Error updating yearly dues:', error);
    this.notification.error('Failed to update yearly dues');
  } finally {
    this.isLoading = false;
  }
}



async updateDues() {
  if (this.duesForm.invalid) return;

  this.isLoading = true;
  try {
    const duesData = {
      ...this.duesForm.value,
      church: this.authService.getCurrentUser()?.church.id,
      year: this.yearlyDues.year, // Include the year from loaded data
      monthly_amount: this.duesForm.value.monthly_amount
    };

    console.log('Updating yearly dues:', this.duesId, duesData);
    
    await this.apiService.updateYearlyDues(this.duesId, duesData).toPromise();
    
    console.log('Yearly dues updated successfully');
    this.notification.success('Yearly dues updated successfully');
    
    this.router.navigate(['/welfare/yearly-dues']);
  } catch (error) {
    console.error('Error updating yearly dues:', error);
    this.notification.error('Failed to update yearly dues');
  } finally {
    this.isLoading = false;
  }
}

  goBack() {
    this.router.navigate(['/welfare/yearly-dues']);
  }
}