import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: 'is_member' | 'is_welfare_admin' | 'is_church_admin';
  church?: any;
}



export interface UsersResponse {
  users: RoleUser[];
}

export interface UserResponse {
  user: RoleUser;
  message?: string;
}

export interface RoleUser {
full_name: any;
email: any;
date_joined: any;
status: any;
  id: number;
  phone_number: string;
  name: string;
  church: any;
  is_welfare_admin: boolean;
  is_church_admin: boolean;
  is_member: boolean;
  // created_at: string;
  // updated_at: string;
}


export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface SignupData {
  church_name: string;
  welfare_name: string;
  location: string;
  church_email: string;
  name: string;
  phone_number: string;
}

export interface SignupResponse {
  message: string;
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  refreshToken(refresh: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${this.apiUrl}/api/auth/token/refresh/`, { refresh });
  }

  login(credentials: { phone_number: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login/`, credentials);
  }

  // Add signup endpoint
  signup(signupData: SignupData): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/api/auth/signup/`, signupData);
  }




  // Get all users with optional search
  getUsers(searchTerm?: string): Observable<UsersResponse> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    
    return this.http.get<UsersResponse>(`${this.apiUrl}/api/member-roles/`, { params });
  }

  // Update user roles
  updateUserRoles(userId: number, roleData: {
    is_member?: boolean;
    is_welfare_admin?: boolean;
    is_church_admin?: boolean;
  }): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.apiUrl}/api/member-roles/${userId}/update/`, 
      roleData
    );
  }


  // church data

getChurchInfo(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/church-info/`);
}

updateChurchContact(contactData: any): Observable<any> {
  return this.http.patch<any>(`${this.apiUrl}/api/church-contact/`, contactData);
}

  // Member endpoints
createMember(memberData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/members/`, memberData);
}

updateMember(id: number, memberData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/api/members/${id}/`, memberData);
}

getMembers(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/members/`);
}

getMember(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/members/${id}/`);
}


// Receipt endpoints
getReceipts(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/receipts/`);
}

getReceipt(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/receipts/${id}/`);
}

createReceipt(receiptData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/receipts/`, receiptData);
}

deleteReceipt(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/api/receipts/${id}/`);
}


// Payment endpoints
getPayments(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/payments/`);
}

createPayment(paymentData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/payments/`, paymentData);
}

deletePayment(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/api/payments/${id}/`);
}

// Event endpoints
getEvents(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/events/`);
}

getEvent(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/events/${id}/`);
}

createEvent(eventData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/events/`, eventData);
}

updateEvent(id: number, eventData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/api/events/${id}/`, eventData);
}
deleteEvent(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/api/events/${id}/`);
}

// Yearly Dues endpoints
getYearlyDues(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/yearly-dues/`);
}

createYearlyDues(duesData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/yearly-dues/`, duesData);
}

updateYearlyDues(id: number, duesData: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/api/yearly-dues/${id}/`, duesData);
}

deleteYearlyDues(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/api/yearly-dues/${id}/`);
}

getYearlyDuesById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/yearly-dues/${id}/`);
}


// Member Dashboard endpoints
getMemberDuesReport(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/reports-member-dues`);
}

getTransportLeviesReport(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/reports-transport-levies/`);
}

getUpcomingEvents(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/events-upcoming-list/`);
}

getOutstandingAmountsReport(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/reports-outstanding-amounts/`);
}

getMemberPaymentHistory(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/member-payment-history/`);
}


// Dashboard endpoints
getDashboardStats(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/dashboard/stats/`);
}

getDashboardRecentActivity(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/dashboard/recent-activity/`);
}
getMembershipInsights(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/api/membership/insights/`);
}


getReceiptsInsights(year?: number): Observable<any> {
  const params: any = {};
  if (year) {
    params.year = year.toString();
  }
  return this.http.get<any>(`${this.apiUrl}/api/receipts/insights/`, { params });
}


getPaymentsInsights(year?: number): Observable<any> {
  const params: any = {};
  if (year) {
    params.year = year.toString();
  }
  return this.http.get<any>(`${this.apiUrl}/api/payments/insights/`, { params });
}


getEventsInsights(year?: number): Observable<any> {
  const params: any = {};
  if (year) {
    params.year = year.toString();
  }
  return this.http.get<any>(`${this.apiUrl}/api/events/insights/`, { params });
}
}