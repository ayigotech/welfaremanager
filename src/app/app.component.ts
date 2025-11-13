import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Platform } from '@ionic/angular';
import { SplashComponent } from './pages/splash/splash.component';

import { 
  school, checkmarkCircle, cash, checkmarkDone, wallet, alertCircle,
  mailOutline, personAdd, personCircle, swapHorizontal, removeCircle, calendarOutline, 
  people,logOutOutline,lockClosedOutline,calendar, call, chatbubble,documentTextOutline,
  peopleOutline,documentText, book, peopleCircle,document,bookOutline,remove, callOutline, home, settings, notifications, person, add,
  arrowBack,createOutline, trashOutline, 
  personOutline, locationOutline,
  checkmark,
  trendingDown,
  trendingUp,
  heartOutline,
  download,
  businessOutline,
  navigateOutline,
  giftOutline,
  lockClosed,
  mailOpenOutline,
  personCircleOutline,
  phonePortraitOutline,
  timer,
  warning, close,
  link,
  rocketOutline,
  warningOutline,
  refresh,
  create,
  personRemove,
  cashOutline,
  pricetagOutline,
  toggleOutline,
  trash,
  libraryOutline,
  ellipsisVertical,
  constructOutline,
  shieldCheckmark,
  closeCircle,
  card,
  gift,
  time,
  analytics,
  location,
  chatbubbles,
  heartCircle,
  heart,
  searchOutline,
  chevronDownCircleOutline,
  folderOutline,
  documentAttach,
  chevronForwardOutline,
  shieldCheckmarkOutline,
  walletOutline,
  busOutline,
  notificationsOutline,
  checkmarkCircleOutline,
  timeOutline,
  receiptOutline,
  listOutline,
  cardOutline,
  peopleCircleOutline,
  addOutline,
  cloudUploadOutline,
  maleFemaleOutline,
  statsChartOutline,
  barChartOutline,
  refreshOutline,
  maleOutline,
  femaleOutline,
  trendingUpOutline,
  analyticsOutline,
  calendarNumberOutline,
  ellipsisHorizontalOutline,
  pieChartOutline,
  calculatorOutline,
  todayOutline,
  heartDislikeOutline,
  trendingDownOutline,
  medicalOutline,
  informationCircleOutline,
  
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})




export class AppComponent {
  isLoading: boolean = true;

  showDebugOverlay = true;
  currentUrl = '';
  showSplash = true;
  
  constructor(
    // private authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {

       this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log('📍 Current route:', this.currentUrl);
      }
    }
  );

 
    // Register all icons we're using in the app
    addIcons({
      school, 'checkmark-circle': checkmarkCircle, cash, 'checkmark-done': checkmarkDone, wallet,"checkmark-circle-outline":checkmarkCircleOutline,
      'alert-circle': alertCircle,  'mail-outline': mailOutline,checkmark, 'library-outline': libraryOutline,"time-outline":timeOutline,
       'log-out-outline': logOutOutline, 'lock-closed-outline': lockClosedOutline, 'people-outline': peopleOutline,
      'call-outline': callOutline,home,settings,notifications,calendar,person,add,people,'document-text': documentText,
    book,'people-circle': peopleCircle,'arrow-back': arrowBack, 'create-outline': createOutline, 'trash-outline': trashOutline,
    'person-outline': personOutline, call, chatbubble,document, 'location-outline': locationOutline, 'person-add': personAdd,
  'person-circle': personCircle,'document-text-outline': documentTextOutline, 'swap-horizontal': swapHorizontal,
  'remove-circle': removeCircle, 'trending-down':trendingDown, 'trending-up': trendingUp, 'heart-outline':heartOutline,
  'calendar-outline': calendarOutline,  'book-outline': bookOutline, remove,download,timer,warning, 
  'business-outline': businessOutline, trash, 'ellipsis-vertical':ellipsisVertical,'construct-outline':constructOutline,
    'navigate-outline': navigateOutline, 'rocket-outline':rocketOutline, 'warning-outline':warningOutline,
    'person-circle-outline': personCircleOutline, 'shield-checkmark':shieldCheckmark, 'search-outline':searchOutline,
    'mail-open-outline': mailOpenOutline,create,refresh, 'person-remove':personRemove,heart,"chevron-down-circle-outline":chevronDownCircleOutline,
    'phone-portrait-outline': phonePortraitOutline, 'toggle-outline':toggleOutline,chatbubbles, 'heart-circle':heartCircle,
    'lock-closed': lockClosed,link, 'cash-outline': cashOutline, 'pricetag-outline':pricetagOutline, 'folder-outline':folderOutline,
    'gift-outline': giftOutline,close, 'close-circle': closeCircle, card, gift, time, analytics,location,"document-attach":documentAttach,
    "chevron-forward-outline":chevronForwardOutline,"shield-checkmark-outline":shieldCheckmarkOutline,
    "wallet-outline":walletOutline, "bus-outline":busOutline, "notifications-outline":notificationsOutline, "receipt-outline":receiptOutline,
    "list-outline":listOutline,"card-outline":cardOutline,"people-circle-outline":peopleCircleOutline,
    "add-outline":addOutline,"cloud-upload-outline":cloudUploadOutline,"male-female-outline":maleFemaleOutline,
    "stats-chart-outline":statsChartOutline,"bar-chart-outline":barChartOutline,"refresh-outline":refreshOutline,
    "male-outline":maleOutline,"female-outline":femaleOutline,"trending-up-outline":trendingUpOutline,
    "analytics-outline":analyticsOutline,"calendar-number-outline":calendarNumberOutline, "ellipsis-horizontal-outline":ellipsisHorizontalOutline,
    "pie-chart-outline":pieChartOutline,"calculator-outline":calculatorOutline, "today-outline":todayOutline,
    "heart-dislike-outline":heartDislikeOutline, "trending-down-outline":trendingDownOutline, "medical-outline":medicalOutline,
    "information-circle-outline":informationCircleOutline,

    });
  }

  
 ngOnInit() {
}




 hideOverlay() {
    this.showDebugOverlay = false;
  }


  //  initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Hide preloader after 3 seconds or when platform is ready
  //     setTimeout(() => {
  //       this.showSplash = false;
  //     }, 3500);
  //   });
  // }

}
