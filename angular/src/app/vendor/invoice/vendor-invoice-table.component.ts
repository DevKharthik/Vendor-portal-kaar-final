import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { Invoice } from '../vendor.model';

@Component({
  selector: 'app-vendor-invoice-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-invoice-table.component.html',
  styleUrls: ['./vendor-invoice-table.component.css']
})
export class VendorInvoiceTableComponent implements OnInit {
  invs: Invoice[] = [];
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

    this.loadInvoices();
  }

  loadInvoices(): void {
    this.vendorService.getInvoice().subscribe({
      next: (invs) => {
        this.invs = invs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Invoices:', error);
        this.error = 'Failed to load Invoice data';
        this.isLoading = false;
      }
    });
  }

  formatDate(odataDate: string): string {
    const timestamp = parseInt(odataDate.replace(/[^0-9]/g, ''), 10);
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
downloadPDF(belnr: string): void {
  const apiUrl = `http://localhost:5000/api/vendor/invoice-pdf/${belnr}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Invalid response or PDF not returned. Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${belnr}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('PDF download error:', error);
      alert('Failed to download PDF.');
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
}
