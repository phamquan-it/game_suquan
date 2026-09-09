import { OrderData } from '../types';

// Mock API function - replace with actual API call
export const fetchOrderData = async (orderId: string): Promise<OrderData | null> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const orders: Record<string, OrderData> = {
    'DH123': {
      id: 'DH123',
      total: 1250000,
      items: [
        { id: 1, name: 'Kiếm Rồng Thiêng', quantity: 1, price: 750000, rarity: 'legendary' },
        { id: 2, name: 'Khiên Hoàng Gia', quantity: 2, price: 250000, rarity: 'epic' },
        { id: 3, name: 'Vương Miện Quý Tộc', quantity: 1, price: 500000, rarity: 'legendary' },
      ],
      date: '2026-09-08',
      paymentMethod: 'Thẻ Tín Dụng',
      status: 'pending',
      customer: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567'
      },
      shipping: {
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        fee: 30000
      }
    },
    'DH456': {
      id: 'DH456',
      total: 2500000,
      items: [
        { id: 4, name: 'Giáp Rồng Đen', quantity: 1, price: 2000000, rarity: 'legendary' },
        { id: 5, name: 'Nhẫn Ma Thuật', quantity: 2, price: 250000, rarity: 'epic' },
      ],
      date: '2026-09-09',
      paymentMethod: 'Chuyển Khoản',
      status: 'pending',
      customer: {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321'
      },
      shipping: {
        address: '456 Đường Nguyễn Huệ, Quận 2, TP.HCM',
        fee: 50000
      }
    }
  };
  
  return orders[orderId] || null;
};
