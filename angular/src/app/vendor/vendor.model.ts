export interface VendorLogin {
  VENDOR_ID: string;
  PASSWORD: string;
}

export interface VendorProfile {
  Lifnr: string;
  Name1: string;
  Land1: string;
  Ort01: string;
  Stras: string;
  Pstlz: string;
}

export interface RFQ {
  Lifnr: string;         // Vendor ID
  Ebeln: string;         // RFQ Number
  Aedat: string;         // Changed Date
  Bedat: string;         // Created Date
  Ekorg: string;         // Purchasing Org
  Matnr: string;         // Material Number
  Ktmng: number;         // Quantity
  Netpr: number;         // Net Price
  Statu: string;         // Status
  Txz01: string;         // Description
  Bstyp: string;         // PO Type / UOM if applicable
}


export interface PurchaseOrder {
  Lifnr: string;         // Vendor ID
  Ebeln: string;         // RFQ Number
  Aedat: string;         // Changed Date
  Bedat: string;         // Created Date
  Ekorg: string;         // Purchasing Org
  Matnr: string;         // Material Number
  Ktmng: number;         // Quantity
  Netpr: number;         // Net Price
  Statu: string;         // Status
  Txz01: string;         // Description
  Bstyp: string;         // PO Type / UOM if applicable
}

export interface GoodsReceipt {
  Mblnr: string;         // Material Document Number (e.g., "5000000001")
  Mjahr: string;         // Fiscal Year (e.g., "2025")
  Matnr: string;         // Material Number (e.g., "13")
  Menge: string;         // Quantity (e.g., "5.000") – use `number` if you parse it
  Werks: string;         // Plant (e.g., "1009")
  Meins: string;         // Unit of Measure (e.g., "KG")
  BudatMkpf: string;     // Posting Date (e.g., "2025-06-02T00:00:00") – use `Date` if parsed
  Lifnr: string;  
}

export interface Invoice {
  Belnr: string;
  Budat: string;
  Gjahr: number;
  Waers: Date;
  Wrbtr: Date;
  Lifnr: string;
  Matnr: string;
  Txz01: string;
  Name1: string;
}

export interface Payment {
  paymentNo: string;
  invoiceNo: string;
  amount: number;
  paymentDate: Date;
  method: string;
  status: string;
  agingDays: number;
}

export interface Aging {
  Lifnr: string;
  Gjahr: string;
  Buzei: string;
  Wrbtr: string;
  Zfbdt: string;
  Budat: string;
  Waers:string;
  Bldat:string;
  Aging:string;
}

export interface Memo {
  Lifnr: string;
  Gjahr: string;
  Budat: string;
  Cpudt: string;
  Blart: string;
  Netwr: string;
  Waerk:string;
}


export interface DashboardTile {
  title: string;
  icon: string;
  count: number;
  route: string;
  color: string;
}