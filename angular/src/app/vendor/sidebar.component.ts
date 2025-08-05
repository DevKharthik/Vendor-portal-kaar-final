import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VendorService } from './vendor.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <img src="https://media.licdn.com/dms/image/v2/D560BAQGwMDdgf5EZ9A/company-logo_200_200/company-logo_200_200/0/1725880536062/kaar_tech_logo?e=2147483647&v=beta&t=lVL6qhh9ZIqFlWrtYiCaYErGwpc7x_NXg73nMD3gRWQ" alt="Logo" class="sidebar-logo" />
        </div>
        <div class="vendor-info" *ngIf="vendorId">
          <div class="vendor-id">{{ vendorId }}</div>
          <div class="vendor-name" *ngIf="vendorName">{{ vendorName }}</div>
        </div>
      </div>
      <ul>
        <li (click)="navigate('/vendor/dashboard')">
          <span class="icon">🏠</span> Dashboard
        </li>
        <li (click)="navigate('/vendor/finance')">
          <span class="icon">💰</span> Finance
        </li>
        <li (click)="navigate('/vendor/profile')">
          <span class="icon">👤</span> Profile
        </li>
      </ul>
      <button class="logout-sidebar-button" (click)="logout()">
        <span class="icon">🚪</span> Logout
      </button>
    </nav>
  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  vendorId: string | null = null;
  vendorName: string | null = null;

  constructor(private router: Router, private vendorService: VendorService) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();
    if (this.vendorId) {
      this.vendorService.getVendorProfile(this.vendorId).subscribe(profile => {
        this.vendorName = profile?.Name1 || null;
      });
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.vendorService.logout();
  }
} 