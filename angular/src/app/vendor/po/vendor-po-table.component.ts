import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import {  PurchaseOrder } from '../vendor.model';

@Component({
  selector: 'app-vendor-po-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-po-table.component.html',
  styleUrls: ['./vendor-po-table.component.css']
})
export class VendorpoTableComponent implements OnInit {
  pos: PurchaseOrder[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const vendorId = this.vendorService.getCurrentVendorId();
    
    if (!vendorId) {
      this.router.navigate(['/vendor/login']);
      return;
    }

    this.loadPOs();
  }

  // ✅ USE REAL BACKEND NOW
  loadPOs(): void {
    this.vendorService.getPOList().subscribe({
      next: (pos) => {
        this.pos = pos;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pos:', error);
        this.error = 'Failed to load POS data';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/vendor/dashboard']);
  }

  getStatusClass(status: string | undefined): string {
  if (!status) return '';
  switch (status.toLowerCase()) {
    case 'a': return 'status-open';      // Active
    case 'pending': return 'status-pending';
    case 'closed': return 'status-closed';
    default: return '';
  }
}

 formatDate(odataDate: string): string {
    const timestamp = parseInt(odataDate.replace(/[^0-9]/g, ''), 10);
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

}

