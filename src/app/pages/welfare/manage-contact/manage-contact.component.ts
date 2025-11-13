import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-manage-contact',
  templateUrl: './manage-contact.component.html',
  styleUrls: ['./manage-contact.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonIcon,
    IonButtons,
    IonBackButton,
    // IonItem,
    // IonLabel,
    // IonInput,
    // IonButton
  ]
})
export class ManageContactComponent implements OnInit {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private notification = inject(Notification);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;
  loading: boolean = false;
  churchData: any;

  async ngOnInit() {
    this.initializeForm();
    await this.loadChurchData();
  }

  initializeForm() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      welfare_momo: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      church_momo: ['', [Validators.pattern(/^0[0-9]{9}$/)]]
    });
  }

  async loadChurchData() {
    this.loading = true;
    try {
      console.log('Loading church data...');
      
      this.churchData = await this.apiService.getChurchInfo().toPromise();
      
      this.contactForm.patchValue({
        email: this.churchData.email,
        welfare_momo: this.churchData.welfare_momo,
        church_momo: this.churchData.church_momo || ''
      });
      
      console.log('Church data loaded successfully');
    } catch (error) {
      console.error('Error loading church data:', error);
      this.notification.error('Failed to load church data');
    } finally {
      this.loading = false;
    }
  }

  async updateContact() {
    if (this.contactForm.invalid) {
      this.notification.warning('Please fill all required fields correctly');
      return;
    }

    this.loading = true;
    try {
      console.log('Updating contact information:', this.contactForm.value);
      
      await this.apiService.updateChurchContact(this.contactForm.value).toPromise();
      
      console.log('Contact information updated successfully');
      this.notification.success('Contact information updated successfully');
      
      this.router.navigate(['/welfare/dashboard']);
    } catch (error) {
      console.error('Error updating contact information:', error);
      this.notification.error('Failed to update contact information');
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/welfare/dashboard']);
  }
}