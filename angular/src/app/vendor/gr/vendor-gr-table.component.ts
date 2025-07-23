import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { GoodsReceipt } from '../vendor.model';

@Component({
  selector: 'app-vendor-gr-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-gr-table.component.html',
  styleUrls: ['./vendor-gr-table.component.css']
})
export class VendorGrTableComponent implements OnInit {
  goodsReceipts: GoodsReceipt[] = [];
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

    this.loadGoodsReceipts();
  }

  loadGoodsReceipts(): void {
    this.vendorService.getGrList().subscribe({
      next: (gs) => {
        this.goodsReceipts = gs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Goods Receipts:', error);
        this.error = 'Failed to load Goods Receipt data';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/vendor/dashboard']);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'partial': return 'status-partial';
      default: return '';
    } 
  }
   formatDate(odataDate: string): string {
    const timestamp = parseInt(odataDate.replace(/[^0-9]/g, ''), 10);
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}