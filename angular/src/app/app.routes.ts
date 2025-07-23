import { Routes } from '@angular/router';
import { AuthGuard } from './vendor/auth.guard'; // 👈 Import guard

export const routes: Routes = [
  { path: '', redirectTo: '/vendor/login', pathMatch: 'full' },

  {
    path: 'vendor/login',
    loadComponent: () =>
      import('./vendor/login/vendor-login.component').then(m => m.VendorLoginComponent)
  },
  {
    path: 'vendor/dashboard',
    loadComponent: () =>
      import('./vendor/dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent),
    canActivate: [AuthGuard] // ✅ Protect this route
  },
  {
    path: 'vendor/profile',
    loadComponent: () =>
      import('./vendor/profile/vendor-profile.component').then(m => m.VendorProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor/rfq',
    loadComponent: () =>
      import('./vendor/rfq/vendor-rfq-table.component').then(m => m.VendorRfqTableComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor/po',
    loadComponent: () =>
      import('./vendor/po/vendor-po-table.component').then(m => m.VendorpoTableComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'vendor/gs',
    loadComponent: () =>
      import('./vendor/gr/vendor-gr-table.component').then(m => m.VendorGrTableComponent),
    canActivate: [AuthGuard]
  },

  {
    path: 'vendor/invoice',
    loadComponent: () =>
      import('./vendor/invoice/vendor-invoice-table.component').then(m => m.VendorInvoiceTableComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor/memo',
    loadComponent: () =>
      import('./vendor/memo/vendor-memo-table.component').then(m => m.VendorMemoTableComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor/aging',
    loadComponent: () =>
      import('./vendor/aging/vendor-aging-table.component').then(m => m.VendorAgingTableComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor/finance',
    loadComponent: () =>
      import('./vendor/dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/vendor/login' }
];
