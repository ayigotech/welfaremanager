
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Notification } from 'src/app/services/notification';

import { IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons,
   IonBackButton, IonButton, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';
import { ApiService } from 'src/app/services/api';

interface Member {
  id?: number;
  full_name: string;
  phone_number: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'transferred' | 'deceased' | 'privileged';
  location?: string;
  date_joined: string;
  church: number;
  user?: number;
}

@Component({
  selector: 'app-manage-member',
  templateUrl: './manage-member.component.html',
  styleUrls: ['./manage-member.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButtons,
    IonBackButton,
    IonButton,
    IonRefresher,
    IonRefresherContent
]
})
export class ManageMemberComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);
   private notification = inject(Notification)

  members: Member[] = [];
  filteredMembers: Member[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  loading: boolean = false;

  ngOnInit() {
    this.loadMembers();
  }

  async loadMembers() {
  this.loading = true;
  try {
    console.log('Loading members...');
    
    const response = await this.apiService.getMembers().toPromise();
    this.members = response;
    this.filteredMembers = [...this.members];
    
    console.log('Members loaded successfully:', this.members.length, 'members');
    // this.notification.success('Members loaded successfully');
  } catch (error) {
    console.error('Error loading members:', error);
    this.notification.error('Failed to load members');
  } finally {
    this.loading = false;
  }
}

  filterMembers() {
    this.filteredMembers = this.members.filter(member => {
      const matchesSearch = member.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           member.phone_number.includes(this.searchTerm);
      const matchesStatus = this.statusFilter === 'all' || member.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  setFilter(filter: string) {
    this.statusFilter = filter;
    this.filterMembers();
  }

  async openAddMemberModal() {
    // We'll implement this as a separate page or modal
    console.log('Open add member modal');
    this.router.navigate(['/welfare/members/add']);
  }

  async openImportModal() {
    // We'll implement the import functionality
    console.log('Open import modal');
  }

  async editMember(member: Member) {
    // Navigate to edit page
    console.log('Edit member:', member);
    this.router.navigate(['/welfare/members/edit', member.id]);
  }

  async deleteMember(member: Member) {
    if (confirm(`Are you sure you want to delete ${member.full_name}?`)) {
      try {
        // await this.apiService.delete(`members/${member.id}/`);
        this.members = this.members.filter(m => m.id !== member.id);
        this.filterMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  }










  async refreshPage(event: any) {
    await this.loadMembers();
    event.target.complete();
  }




}
