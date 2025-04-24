export interface Vendor {
  id?: string;
  shopName: string;
  category: string;
  contact: string;
  lat: number;
  lng: number;
  items?: Item[];
  openingTime?: string;
  closingTime?: string;
  description?: string;
}

export interface Item {
  id?: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
}

export interface User {
  uid: string;
  email: string | null;
  isVendor?: boolean;
}