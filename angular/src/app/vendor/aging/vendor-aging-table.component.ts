import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { Aging } from '../vendor.model';

@Component({
  selector: 'app-vendor-memo-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-aging-table.component.html',
  styleUrls: ['./vendor-aging-table.component.css']
})
export class VendorAgingTableComponent implements OnInit {
  aging: Aging[] = [];
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
    this.vendorService.getAging().subscribe({
      next: (aging) => {
        // Calculate aging for each record
        this.aging = aging.map(record => ({
          ...record,
          calculatedAgingDays: this.calculateAgingDays(record.Zfbdt)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading RFQs:', error);
        this.error = 'Failed to load RFQ data';
        this.isLoading = false;
      }
    });
  }

  // Calculate aging days: Due Date - Current Date
  calculateAgingDays(dueDate: string): number {
    try {
      if (!dueDate || dueDate.includes('-62134368000000')) {
        return 0;
      }
      const match = /\d+/.exec(dueDate);
      if (!match) {
        return 0;
      }
      const dueTimestamp = parseInt(match[0], 10);
      if (!dueTimestamp || dueTimestamp < 0) {
        return 0;
      }
      const due = new Date(dueTimestamp);
      const now = new Date();
      now.setHours(0,0,0,0); // Only compare dates, not time
      // Always positive difference in days
      const timeDiff = due.getTime() - now.getTime();
      const daysDiff = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));
      return isNaN(daysDiff) ? 0 : daysDiff;
    } catch (error) {
      console.error('Error calculating aging days:', error);
      return 0;
    }
  }

  // Get aging class for styling
  getAgingClass(agingDays: number | undefined): string {
    if (!agingDays) return '';
    
    if (agingDays <= 30) return 'aging-normal';
    if (agingDays <= 60) return 'aging-warning';
    if (agingDays <= 90) return 'aging-attention';
    return 'aging-critical';
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
    if (!odataDate || odataDate.includes('-62134368000000')) {
      return '-';
    }
    const timestamp = parseInt(odataDate.replace(/[^0-9]/g, ''), 10);
    if (!timestamp || timestamp < 0) {
      return '-';
    }
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}
