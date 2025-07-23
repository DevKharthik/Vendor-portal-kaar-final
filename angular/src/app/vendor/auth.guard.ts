import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { VendorService } from './vendor.service';

export const AuthGuard: CanActivateFn = () => {
  const vendorService = inject(VendorService);
  const router = inject(Router);

  const vendorId = vendorService.getCurrentVendorId();

  if (!vendorId) {
    router.navigate(['/vendor/login']);
    return false;
  }

  return true;
};
