import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonRefresher,
  IonRefresherContent,
  IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonContent, 
    // IonHeader, 
    // IonToolbar, 
    // IonTitle,
    IonRefresher,
    IonRefresherContent,
    IonIcon
  ]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router)
  
  loginForm!: FormGroup;
  isLoading: boolean = false;

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async login() {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    const phone_number = this.loginForm.value.phoneNumber;

    console.log('phone_number,,',  phone_number)
    
    const success = await this.authService.login(phone_number);
    
    this.isLoading = false;
  }


 onSignup(){
  this.router.navigate(['/signup'])
 }


}