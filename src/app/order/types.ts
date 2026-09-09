export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Shipping {
  address: string;
  fee: number;
}

export interface OrderData {
  id: string;
  total: number;
  items: OrderItem[];
  date: string;
  paymentMethod: string;
  status: string;
  customer: Customer;
  shipping: Shipping;
}
