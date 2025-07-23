import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { RFQ } from '../vendor.model';

@Component({
  selector: 'app-vendor-rfq-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-rfq-table.component.html',
  styleUrls: ['./vendor-rfq-table.component.css']
})
export class VendorRfqTableComponent implements OnInit {
  rfqs: RFQ[] = [];
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

    this.loadRFQs();
  }

  // ✅ USE REAL BACKEND NOW
  loadRFQs(): void {
    this.vendorService.getRFQList().subscribe({
      next: (rfqs) => {
        this.rfqs = rfqs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading RFQs:', error);
        this.error = 'Failed to load RFQ data';
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

formatStatus(status: string | undefined): string {
  if (!status) return 'Unknown';
  switch (status.toLowerCase()) {
    case 'a': return 'Active';
    case 'pending': return 'Pending';
    case 'closed': return 'Closed';
    default: return status;
  }
}
}
