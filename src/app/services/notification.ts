


import { Injectable } from '@angular/core';
import * as iziToast from 'izitoast'; // Import at top level

@Injectable({
  providedIn: 'root'
})
export class Notification {
  
  constructor() {
    // Optional: Configure global iziToast settings
    iziToast.settings({
      timeout: 3000,
      resetOnHover: true,
      icon: 'material-icons',
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
      position: 'topRight'
    });
  }

  success(message: string, title: string = 'Success') {
    iziToast.success({
      title,
      message,
      backgroundColor: '#28a745',
      theme: 'dark'
    });
  }

  error(message: string, title: string = 'Error') {
    // console.log('🔔 NotificationService.error called:', { title, message }); // Add this

     // Handle undefined or null messages
      const safeMessage = message || 'An error occurred';
      const safeTitle = title || 'Error';

    iziToast.error({
      title,
      message,
      backgroundColor: '#dc3545',
      theme: 'dark'
    });
  }

  warning(message: string, title: string = 'Warning') {
    iziToast.warning({
      title,
      message,
      backgroundColor: '#ffc107',
      theme: 'dark',
      timeout: 8000
    });
  }

  info(message: string, title: string = 'Info') {
    iziToast.info({
      title,
      message,
      backgroundColor: '#17a2b8',
      theme: 'dark'
    });
  }



   extractErrorMessage(error: any): string {
  if (error.error && error.error.details) {
    // Django REST framework error format
    const details = error.error.details;
    
    if (details.non_field_errors && details.non_field_errors.length > 0) {
      return details.non_field_errors[0];
    }
    
    // Check all field errors
    for (const field in details) {
      if (details[field].length > 0) {
        return `${field}: ${details[field][0]}`;
      }
    }
  }
  
  if (error.error && error.error.error) {
    return error.error.error;
  }
  
  if (error.status === 0) {
    return 'Cannot connect to server. Please check your internet connection.';
  }
  
  if (error.status === 401) {
    return 'Invalid email or password. Please try again.';
  }
  
  if (error.status === 400) {
    return 'Invalid request. Please check your input.';
  }
  
  if (error.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}
}