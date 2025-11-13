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
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.scss'],
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
export class AddReceiptComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
    private notification = inject(Notification)

  receiptForm!: FormGroup;
  members: Member[] = [];
  isLoading: boolean = false;
  availableYears: number[] = [];

  filteredMembers: any[] = [];
  showDropdown = false;
  

  ngOnInit() {
    this.initializeForm();
    this.loadMembers();
    this.generateAvailableYears();
  }

  initializeForm() {
    const currentYear = new Date().getFullYear();
    
    this.receiptForm = this.fb.group({
      member: ['', [Validators.required]],
      receipt_type: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      year: [currentYear, [Validators.required]],
      details: ['']
    });
  }

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }


  async loadMembers() {
  try {
    console.log('Loading active members...');
    
    const response = await this.apiService.getMembers().toPromise();
    // Filter active members on frontend or modify API to accept query params
    this.members = response.filter((member: any) => member.status === 'active');
    
    console.log('Active members loaded:', this.members.length);
  } catch (error) {
    console.error('Error loading members:', error);
    this.notification.error('Failed to load members');
  }
}

  
async saveReceipt() {
  if (this.receiptForm.invalid) return;

  this.isLoading = true;
  try {
    const receiptData = {
      ...this.receiptForm.value,
      created_by: this.authService.getCurrentUser()?.id
    };

    console.log('Saving receipt:', receiptData);
    
    await this.apiService.createReceipt(receiptData).toPromise();
    
    console.log('Receipt saved successfully');
    this.notification.success('Receipt created successfully');
    
    this.router.navigate(['/welfare/receipts']);
  } catch (error) {
    console.error('Error saving receipt:', error);
    this.notification.error('Failed to create receipt');
  } finally {
    this.isLoading = false;
  }
}


  goBack() {
    this.router.navigate(['/welfare/receipts']);
  }



  
onSearchInput(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        this.filteredMembers = [];
        return;
    }
    
    this.filteredMembers = this.members.filter(member => 
        member.full_name.toLowerCase().includes(searchTerm) ||
        member.phone_number?.includes(searchTerm)
    );
}



hideDropdown() {
    setTimeout(() => this.showDropdown = false, 200);
}


selectMember(member: any, inputElement: any) {
    inputElement.value = member.full_name;
    this.receiptForm.get('member')?.setValue(member.id);
    this.showDropdown = false;
}








}