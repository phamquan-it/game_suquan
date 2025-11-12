export interface Currency {
    id: string;                  // Mã định danh duy nhất (ví dụ: 'gold', 'diamond')
    name: string;                // Tên hiển thị (ví dụ: 'Vàng', 'Kim Cương')
    code: string;                // Mã viết tắt (GOLD, DIAMOND, SILVER, HONOR)
    type: 'basic' | 'premium' | 'special';  // Phân loại tiền tệ
    inCirculation: number;       // Số lượng đang lưu hành
    exchangeRate: number;        // Tỷ giá so với đơn vị chuẩn (1 GOLD = 1)
    inflationRate: number;       // Tỷ lệ lạm phát (%)
    lastUpdated: string;         // ISO timestamp (ngày cập nhật cuối)
    status: 'active' | 'inactive'; // Trạng thái tiền tệ
}


export interface Transaction {
    id: string;
    playerId: string;
    playerName: string;
    type: 'purchase' | 'refund' | 'reward' | 'transfer' | 'exchange';
    amount: number;
    currency: string;
    description: string;
    itemId?: string;
    itemName?: string;
    status: 'completed' | 'pending' | 'failed' | 'cancelled';
    timestamp: string;
    server: string;
    ipAddress: string;
    reason?: string;
}

export interface EconomyStats {
    totalRevenue: number;
    dailyRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    activePlayers: number;
    averageSpend: number;
    currencyInCirculation: number;
    totalTransactions: number;
    fraudAttempts: number;
    successfulTransactions: number;
    revenueGrowth: number;
    popularItems: Array<EconomyBaseItem>;
}

export interface EconomyBaseItem {
    name: string;
    revenue: number;
    sales: number;
}

export interface ShopItem {
    id: string;
    name: string;
    category: string;
    price: number;
    currency: string;
    stock: number;
    sales: number;
    revenue: number;
    status: 'active' | 'inactive' | 'sold_out';
    createdAt: string;
    updatedAt: string;
}

export interface PriceAdjustment {
    itemId: string;
    oldPrice: number;
    newPrice: number;
    reason: string;
    timestamp: string;
    admin: string;
}

export interface FraudDetection {
    transactionId: string;
    playerId: string;
    playerName: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    flags: string[];
    amount: number;
    timestamp: string;
    status: 'pending' | 'investigated' | 'resolved';
}
