import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api';
import { NetworkService} from './network';
import { Notification} from './notification';

export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: 'is_member' | 'is_welfare_admin' | 'is_church_admin';
  church?: any;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private networkService = inject(NetworkService);
  private notification = inject(Notification);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const token = this.getAccessToken();
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  // Phone number login
  async login(phone_number: string): Promise<boolean> {
  const isOnline = await this.networkService.isOnline();
  
  if (!isOnline) {
    this.notification.error('Internet connection required for login');
    return false;
  }

  try {
    const response = await this.apiService.login({ phone_number }).toPromise();
    if (response) {
      this.handleAuthentication(response);
      this.router.navigate(['/home']);
      return true;
    }
    return false;
  } catch (error: any) {
    const errorMsg = this.notification.extractErrorMessage(error);
    this.notification.error(errorMsg);
    return false;
  }
}

  // Handle successful authentication
  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  // Token management
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }


  // Token refresh with network awareness
 async refreshToken(): Promise<boolean> {
  const refreshToken = this.getRefreshToken();
  const isOnline = await this.networkService.isOnline();
  
  if (!isOnline || !refreshToken) {
    return false;
  }

  try {
    const response = await this.apiService.refreshToken(refreshToken).toPromise();
    if (response) {
      localStorage.setItem('access_token', response.access);
      return true;
    }
    return false;
  } catch (error) {
    this.logout();
    return false;
  }
}

  // Logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check user roles
  isWelfareAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'is_welfare_admin';
  }

  isChurchAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'is_church_admin';
  }

  isMember(): boolean {
    return this.currentUserSubject.value?.role === 'is_member';
  }
}