import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-welfare-dashboard',
  templateUrl: './welfare-dashboard.component.html',
  styleUrls: ['./welfare-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent
  ]
})
export class WelfareDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: any = null;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  // Navigation methods for welfare admin
  navigateToMembers() {
    this.router.navigate(['/welfare/members']);
  }

  navigateToReceipts() {
    this.router.navigate(['/welfare/receipts']);
  }

  navigateToPayments() {
    this.router.navigate(['/welfare/payments']);
  }

  navigateToEvents() {
    this.router.navigate(['/welfare/events']);
  }

  navigateToYearlyDues() {
    this.router.navigate(['/welfare/yearly-dues']);
  }

  navigateToUpdateContact() {
    this.router.navigate(['/welfare/manage-contact']);
  }

  navigateToNotifications() {
    this.router.navigate(['/welfare/notifications']);
  }

  
  navigateToManageRole() {
    this.router.navigate(['/welfare/manage-role']);
  }
}