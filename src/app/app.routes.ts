import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
   {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.component').then(m => m.SplashComponent)
  },
   {
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
  path: 'signup',
  loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent)
},
{
  path: 'member',
  loadComponent: () => import('./pages/member/member-dashboard/member-dashboard.component').then(m => m.MemberDashboardComponent)
},
{
  path: 'member/dues',
  loadComponent: () => import('./pages/member/member-dues/member-dues.component').then(m => m.MemberDuesComponent)
},
{
  path: 'member/transport',
  loadComponent: () => import('./pages/member/member-transport/member-transport.component').then(m => m.MemberTransportComponent)
},
{
    path: 'member/payment-history',
    loadComponent: () => import('./pages/member/member-payment-history/member-payment-history.component').then(m => m.MemberPaymentHistoryComponent)
  },
{
  path: 'member/events',
  loadComponent: () => import('./pages/member/member-event/member-event.component').then(m => m.MemberEventComponent)
},
{
  path: 'member/notifications',
  loadComponent: () => import('./pages/member/member-notification/member-notification.component').then(m => m.MemberNotificationComponent)
},
{
  path: 'welfare/admin',
  loadComponent: () => import('./pages/welfare/welfare-dashboard/welfare-dashboard.component').then(m => m.WelfareDashboardComponent)
},
{
  path: 'welfare/manage-role',
  loadComponent: () => import('./pages/welfare/manage-user-role/manage-user-role.component').then(m => m.ManageUserRoleComponent)
},
{
  path: 'welfare/manage-contact',
  loadComponent: () => import('./pages/welfare/manage-contact/manage-contact.component').then(m => m.ManageContactComponent)
},
{
  path: 'welfare/members',
  loadComponent: () => import('./pages/welfare/manage-member/manage-member.component').then(m => m.ManageMemberComponent)
},
{
  path: 'welfare/members/add',
  loadComponent: () => import('./pages/welfare/add-member/add-member.component').then(m => m.AddMemberComponent)
},
{
  path: 'welfare/members/edit/:id',
  loadComponent: () => import('./pages/welfare/edit-member/edit-member.component').then(m => m.EditMemberComponent)
},
{
  path: 'welfare/receipts',
  loadComponent: () => import('./pages/welfare/manage-receipts/manage-receipts.component').then(m => m.ManageReceiptsComponent)
},
{
  path: 'welfare/receipts/add',
  loadComponent: () => import('./pages/welfare/add-receipt/add-receipt.component').then(m => m.AddReceiptComponent)
},
{
  path: 'welfare/payments',
  loadComponent: () => import('./pages/welfare/manage-payments/manage-payments.component').then(m => m.ManagePaymentsComponent)
},
{
  path: 'welfare/payments/add',
  loadComponent: () => import('./pages/welfare/add-payment/add-payment.component').then(m => m.AddPaymentComponent)
},
{
  path: 'welfare/events',
  loadComponent: () => import('./pages/welfare/manage-events/manage-events.component').then(m => m.ManageEventsComponent)
},
{
  path: 'welfare/events/add',
  loadComponent: () => import('./pages/welfare/add-event/add-event.component').then(m => m.AddEventComponent)
},
{
  path: 'welfare/events/edit/:id',
  loadComponent: () => import('./pages/welfare/edit-event/edit-event.component').then(m => m.EditEventComponent)
},
{
  path: 'welfare/yearly-dues',
  loadComponent: () => import('./pages/welfare/manage-yearly-dues/manage-yearly-dues.component').then(m => m.ManageYearlyDuesComponent)
},
{
  path: 'welfare/yearly-dues/add',
  loadComponent: () => import('./pages/welfare/add-yearly-dues/add-yearly-dues.component').then(m => m.AddYearlyDuesComponent)
},
{
  path: 'welfare/yearly-dues/edit/:id',
  loadComponent: () => import('./pages/welfare/edit-yearly-dues/edit-yearly-dues.component').then(m => m.EditYearlyDuesComponent)
},
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/main-dashboard/main-dashboard.component').then(m => m.MainDashboardComponent)
},
{
  path: 'dashboard/membership-dashboard',
  loadComponent: () => import('./pages/dashboard/membership-dashboard/membership-dashboard.component').then(m => m.MembershipDashboardComponent)
},
{
  path: 'dashboard/receipts-dashboard',
  loadComponent: () => import('./pages/dashboard/receipts-dashboard/receipts-dashboard.component').then(m => m.ReceiptsDashboardComponent)
},
{
  path: 'dashboard/payments-dashboard',
  loadComponent: () => import('./pages/dashboard/payments-dashboard/payments-dashboard.component').then(m => m.PaymentsDashboardComponent)
},
{
  path: 'dashboard/events-dashboard',
  loadComponent: () => import('./pages/dashboard/events-dashboard/events-dashboard.component').then(m => m.EventsDashboardComponent)
}
];
