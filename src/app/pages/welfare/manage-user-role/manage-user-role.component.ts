// manage-user-roles.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar
} from '@ionic/angular/standalone';
import { ApiService, RoleUser } from 'src/app/services/api';
import { Notification } from 'src/app/services/notification';

@Component({
  selector: 'app-manage-user-role',
  templateUrl: './manage-user-role.component.html',
  styleUrls: ['./manage-user-role.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle,
    IonButtons,
    IonBackButton,
    // IonButton,
    IonIcon,
    // IonItem,
    // IonLabel,
    // IonList,
    // IonSearchbar
  ]
})
export class ManageUserRoleComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notification = inject(Notification);

  searchTerm: string = '';
  isLoading: boolean = false;
  users: RoleUser[] = [];
  filteredUsers: RoleUser[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading = true;
    try {
      const response = await this.apiService.getUsers().toPromise();
      this.users = response?.users || [];
      this.filteredUsers = [...this.users];
      console.log('this.filteredUsers, ', this.filteredUsers)
    } catch (error: any) {
      console.error('Error loading users:', error);
      const errorMessage = error.error?.error || 'Failed to load users';
      this.notification.error(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async searchUsers(event: any) {
    const term = event.target.value.toLowerCase();
    this.searchTerm = term;
    
    this.isLoading = true;
    try {
      const response = await this.apiService.getUsers(term).toPromise();
      this.filteredUsers = response?.users || [];
    } catch (error: any) {
      console.error('Error searching users:', error);
      const errorMessage = error.error?.error || 'Failed to search users';
      this.notification.error(errorMessage);
      this.filteredUsers = [];
    } finally {
      this.isLoading = false;
    }
  }

  async toggleUserRole(user: RoleUser, role: 'is_member' | 'is_welfare_admin' | 'is_church_admin') {
    const originalValue = user[role];
    
    // Optimistically update UI
    user[role] = !user[role];
    
    try {
      const response = await this.apiService.updateUserRoles(user.id, { [role]: user[role] }).toPromise();
      this.notification.success(response?.message || `Updated ${user.full_name}'s ${this.getRoleDisplayName(role)} role`);
    } catch (error: any) {
      // Revert on error
      user[role] = originalValue;
      console.error('Error updating user role:', error);
      const errorMessage = error.error?.error || 'Failed to update user role';
      this.notification.error(errorMessage);
    }
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'is_member': 'Member',
      'is_welfare_admin': 'Welfare Admin',
      'is_church_admin': 'Church Admin'
    };
    return roleMap[role] || role;
  }

  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'is_member': '#27ae60',
      'is_welfare_admin': '#2980b9',
      'is_church_admin': '#8e44ad'
    };
    return colorMap[role] || '#7f8c8d';
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}