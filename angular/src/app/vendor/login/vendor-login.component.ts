import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { VendorLogin } from '../vendor.model';

@Component({
  selector: 'app-vendor-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css']
})
export class VendorLoginComponent {
  credentials: VendorLogin = {
    VENDOR_ID: '',
    PASSWORD: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.credentials.VENDOR_ID || !this.credentials.PASSWORD) {
      this.errorMessage = 'Please enter both Vendor ID and Password';
      return;
    }
    

    this.isLoading = true;
    this.errorMessage = '';

    this.vendorService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login response:', response);

        if (response && response.MESSAGE === 'Login successful') {
          this.vendorService.setCurrentVendorId(this.credentials.VENDOR_ID);
          this.router.navigate(['/vendor/dashboard']).then(navigated => {
            console.log('Navigated to dashboard:', navigated);
          });
        } else {
          alert(response.MESSAGE || 'Invalid login.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
        alert(this.errorMessage);
      }
      
    });
  }
}
