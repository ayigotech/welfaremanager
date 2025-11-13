// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-member-dashboard',
//   templateUrl: './member-dashboard.component.html',
//   styleUrls: ['./member-dashboard.component.scss'],
// })
// export class MemberDashboardComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }



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
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss'],
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
export class MemberDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user: any = null;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  // Navigation methods
  navigateToDues() {
    this.router.navigate(['/member/dues']);
  }

  navigateToTransport() {
    this.router.navigate(['/member/transport']);
  }

  navigateToEvents() {
    this.router.navigate(['/member/events']);
  }

  navigateToNotifications() {
    this.router.navigate(['/member/notifications']);
  }
}
