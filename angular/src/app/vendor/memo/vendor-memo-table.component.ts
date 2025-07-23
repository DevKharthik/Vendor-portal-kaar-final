import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { Memo } from '../vendor.model';

@Component({
  selector: 'app-vendor-memo-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-memo-table.component.html',
  styleUrls: ['./vendor-memo-table.component.css']
})
export class VendorMemoTableComponent implements OnInit {
  memos: Memo[] = [];
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

    this.loadMemo();
  }

  // ✅ USE REAL BACKEND NOW
  loadMemo(): void {
    this.vendorService.getMemo().subscribe({
      next: (memos) => {
        this.memos = memos;
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
formatDate(odataDate: string): string {
    const timestamp = parseInt(odataDate.replace(/[^0-9]/g, ''), 10);
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}
