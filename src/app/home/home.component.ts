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
  IonBackButton
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth';
import { User } from '../services/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: any = null; // Use any to access the actual properties

  ngOnInit() {
    console.log('🏠 Home component initialized');
    this.user = this.authService.getCurrentUser();
    console.log('👤 User in home:', this.user);
    
    // Debug: Check what properties the user object has
    if (this.user) {
      console.log('🔍 User properties:', Object.keys(this.user));
      console.log('🔍 is_welfare_admin:', this.user.is_welfare_admin);
      console.log('🔍 is_church_admin:', this.user.is_church_admin);
      console.log('🔍 is_member:', this.user.is_member);
      console.log('🔍 role:', this.user.role);
    }
    
    if (!this.user) {
      console.log('❌ No user found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  // Navigation methods
  navigateToMember() {
    this.router.navigate(['/member']);
  }

  navigateToWelfareAdmin() {
    this.router.navigate(['/welfare/admin']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Helper methods to check user role - check actual object properties
  isMember(): boolean {
    return !!this.user?.is_member;
  }

  isWelfareAdmin(): boolean {
    return !!this.user?.is_welfare_admin;
  }

  isChurchAdmin(): boolean {
    return !!this.user?.is_church_admin;
  }

  getUserRole(): string {
    if (!this.user) return '';
    
    if (this.user.is_church_admin) return 'Church Administrator';
    if (this.user.is_welfare_admin) return 'Welfare Administrator';
    if (this.user.is_member) return 'Church Member';
    
    return 'User';
  }
}