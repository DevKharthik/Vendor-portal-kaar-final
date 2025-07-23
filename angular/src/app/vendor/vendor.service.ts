import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  VendorLogin, 
  VendorProfile, 
  RFQ, 
  PurchaseOrder, 
  GoodsReceipt, 
   Invoice, 
  Aging, 
  Memo,
  DashboardTile 
} from './vendor.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private baseUrl = '/sap/opu/odata/sap/ZVENDOR_632_SRV';
  private currentVendorId: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: VendorLogin): Observable<any> {
    return this.http.post<any>('http://localhost:5000/api/vendor/login', {
      VENDOR_ID: credentials.VENDOR_ID,
      PASSWORD: credentials.PASSWORD
    });
  }

 setCurrentVendorId(id: string): void {
  this.currentVendorId = id;
  localStorage.setItem('vendorId', id); // ✅ store in localStorage
}

//  getCurrentVendorId(): string | null {
//   if (!this.currentVendorId) {
//     this.currentVendorId = localStorage.getItem('vendorId'); // ✅ read from localStorage
//   }
//   return this.currentVendorId;
// }
getCurrentVendorId(): string | null {
  if (!this.currentVendorId) {
    this.currentVendorId = localStorage.getItem('vendorId'); // ✅ load if not already
  }
  console.log('Vendor ID:', this.currentVendorId); // Add this line to debug
  return this.currentVendorId;
}

 logout(): void {
  this.currentVendorId = null;
  localStorage.removeItem('vendorId'); // ✅ clear it
  this.router.navigate(['/vendor/login']);
}

  getVendorProfile(vendorId: string): Observable<VendorProfile> {
    return this.http.get<{ success: boolean; data: VendorProfile }>(
      `http://localhost:5000/api/vendor/profile/${vendorId}`
    ).pipe(map(response => response.data));
  }

  // Dashboard Tiles
  getDashboardTiles(): Observable<DashboardTile[]> {
    const tiles: DashboardTile[] = [
      { title: 'Request for Quotation', icon: '📄', count: 12, route: '/vendor/rfq', color: '#3b82f6' },
      { title: 'Purchase Orders', icon: '📦', count: 8, route: '/vendor/po', color: '#10b981' },
      { title: 'Goods Receipt', icon: '📥', count: 5, route: '/vendor/gs', color: '#f59e0b' },
      { title: 'Invoice', icon: '💰', count: 15, route: '/vendor/invoice', color: '#8b5cf6' },
      { title: 'Memo', icon: '💰', count: 15, route: '/vendor/memo', color: '#8b5cf6' },
      { title: 'Aging', icon: '💰', count: 15, route: '/vendor/aging', color: '#8b5cf6' }
    ];
    return of(tiles).pipe(delay(500));
  }

  // RFQ Data
getRFQList(): Observable<RFQ[]> {
  const vendorId = this.getCurrentVendorId();
  if (!vendorId) {
    return of([]); // or throw error
  }

  return this.http.get<{ success: boolean; data: RFQ[] }>(
    `http://localhost:5000/api/vendor/rfq/${vendorId}`
  ).pipe(map(res => res.data));
}

  // Purchase Orders
 getPOList(): Observable<PurchaseOrder[]> {
  const vendorId = this.getCurrentVendorId();
  if (!vendorId) {
    return of([]);
  }

  return this.http.get<{ success: boolean; data: PurchaseOrder[] }>(
    `http://localhost:5000/api/vendor/po/${vendorId}`
  ).pipe(map(res => res.data));
}

  // Goods Receipt
getGrList(): Observable<GoodsReceipt[]> {
  const vendorId = this.getCurrentVendorId();
  if (!vendorId) {
    return of([]); // or throw error
  }

  return this.http.get<{ success: boolean; data: GoodsReceipt[] }>(
    `http://localhost:5000/api/vendor/gr/${vendorId}`
  ).pipe(map(res => res.data));
}


  getInvoice(): Observable< Invoice[]> {
  const vendorId = this.getCurrentVendorId();
  if (!vendorId) {
    return of([]); // or throw error
  }

  return this.http.get<{ success: boolean; data:  Invoice[] }>(
    `http://localhost:5000/api/vendor/invoice/${vendorId}`
  ).pipe(map(res => res.data));
}



getMemo(): Observable< Memo[]> {
  const vendorId = this.getCurrentVendorId();
  if (!vendorId) {
    return of([]); // or throw error
  }

  return this.http.get<{ success: boolean; data:  Memo[] }>(
    `http://localhost:5000/api/vendor/memo/${vendorId}`
  ).pipe(map(res => res.data));
}


getAging(): Observable<Aging[]> {
  const vendorId = this.getCurrentVendorId();
  if (!vendorId) {
    return of([]); // or throw error
  }

  return this.http.get<{ success: boolean; data:  Aging[] }>(
    `http://localhost:5000/api/vendor/aging/${vendorId}`
  ).pipe(map(res => res.data));
}

}
