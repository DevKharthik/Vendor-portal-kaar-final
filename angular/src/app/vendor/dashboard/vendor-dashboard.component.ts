import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { DashboardTile } from '../vendor.model';
import { SidebarComponent } from '../sidebar.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  tiles: DashboardTile[] = [];
  isLoading = true;
  vendorId: string | null = null;
  isFinancePage = false;
  today = new Date();

  // Data arrays for counting
  rfqs: any[] = [];
  pos: any[] = [];
  grs: any[] = [];
  invoices: any[] = [];
  memos: any[] = [];
  agings: any[] = [];

  constructor(
    private vendorService: VendorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();

    if (!this.vendorId) {
      console.warn('No vendor ID found, redirecting to login.');
      this.router.navigate(['/vendor/login']);
      return;
    }

    this.isFinancePage = this.router.url.includes('/vendor/invoice') || this.router.url.includes('/vendor/finance');
    this.loadAllDataAndTiles();
  }

  loadAllDataAndTiles(): void {
    this.isLoading = true;
    forkJoin({
      rfqs: this.vendorService.getRFQList(),
      pos: this.vendorService.getPOList(),
      grs: this.vendorService.getGrList(),
      invoices: this.vendorService.getInvoice(),
      memos: this.vendorService.getMemo(),
      agings: this.vendorService.getAging()
    }).subscribe({
      next: (results) => {
        this.rfqs = results.rfqs || [];
        this.pos = results.pos || [];
        this.grs = results.grs || [];
        this.invoices = results.invoices || [];
        this.memos = results.memos || [];
        this.agings = results.agings || [];

        const allTiles: DashboardTile[] = [
          { title: 'Request for Quotation', icon: '📄', count: this.rfqs.length, route: '/vendor/rfq', color: '#3b82f6' },
          { title: 'Purchase Orders', icon: '📦', count: this.pos.length, route: '/vendor/po', color: '#10b981' },
          { title: 'Goods Receipt', icon: '📥', count: this.grs.length, route: '/vendor/gs', color: '#f59e0b' },
          { title: 'Invoice', icon: '🧾', count: this.invoices.length, route: '/vendor/invoice', color: '#8b5cf6' },
          { title: 'Memo', icon: '📝', count: this.memos.length, route: '/vendor/memo', color: '#8b5cf6' },
          { title: 'Aging', icon: '⏳', count: this.agings.length, route: '/vendor/aging', color: '#8b5cf6' }
        ];

        if (this.isFinancePage) {
          this.tiles = allTiles.filter(tile =>
            tile.title === 'Invoice' || tile.title === 'Memo' || tile.title === 'Aging'
          );
        } else {
          this.tiles = allTiles;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  onTileClick(tile: DashboardTile): void {
    this.router.navigate([tile.route]);
  }

  onLogout(): void {
    this.vendorService.logout();
    this.router.navigate(['/vendor/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/vendor/profile']);
  }
}
