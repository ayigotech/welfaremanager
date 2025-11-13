// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-splash',
//   templateUrl: './splash.component.html',
//   styleUrls: ['./splash.component.scss'],
// })
// export class SplashComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }



import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent]
})
export class SplashComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 4000);
  }
}
