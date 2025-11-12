import { NotificationPriority, NotificationType, SystemNotification } from "@/types/notification";

// Mock data cho hệ thống thông báo
export const mockNotifications: SystemNotification[] = [
    {
        id: '1',
        title: 'Server Restart Scheduled',
        message: 'Server sẽ được khởi động lại vào lúc 02:00 AM để bảo trì hệ thống',
        type: 'system',
        priority: 'medium',
        status: 'unread',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
        source: 'System Admin',
        actionUrl: '/admin/system'
    },
    {
        id: '2',
        title: 'High CPU Usage Detected',
        message: 'CPU usage trên server game-01 đạt 95%. Cần kiểm tra ngay lập tức',
        type: 'system',
        priority: 'high',
        status: 'unread',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
        source: 'Monitoring System',
        metadata: {
            serverId: 'game-01',
            errorCode: 'CPU_OVERLOAD'
        }
    },
    {
        id: '3',
        title: 'Player Violation Detected',
        message: 'Player "DragonWarrior" bị phát hiện sử dụng tool bất hợp pháp',
        type: 'player',
        priority: 'high',
        status: 'unread',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
        source: 'Anti-Cheat System',
        metadata: {
            playerId: 'player_12345'
        },
        actionUrl: '/admin/players'
    },
    {
        id: '4',
        title: 'Database Backup Completed',
        message: 'Sao lưu cơ sở dữ liệu đã hoàn thành thành công',
        type: 'system',
        priority: 'low',
        status: 'read',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
        source: 'Backup System'
    },
    {
        id: '5',
        title: 'Alliance War Started',
        message: 'Chiến tranh liên minh giữa "Thiên Hạ Vô Địch" và "Long Vương" đã bắt đầu',
        type: 'alliance',
        priority: 'medium',
        status: 'unread',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 phút trước
        source: 'Battle System',
        metadata: {
            allianceId: 'alliance_67890'
        },
        actionUrl: '/admin/battles'
    },
    {
        id: '6',
        title: 'Security Alert: Multiple Failed Logins',
        message: 'Phát hiện nhiều lần đăng nhập thất bại vào tài khoản admin từ IP 192.168.1.100',
        type: 'security',
        priority: 'critical',
        status: 'unread',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 phút trước
        source: 'Security System',
        metadata: {
            errorCode: 'BRUTE_FORCE_ATTEMPT'
        }
    },
    {
        id: '7',
        title: 'Economy Balance Update',
        message: 'Tỷ lệ trao đổi vàng/đá quý đã được điều chỉnh theo bản cập nhật mới',
        type: 'economy',
        priority: 'medium',
        status: 'read',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 giờ trước
        source: 'Economy System',
        actionUrl: '/admin/economy'
    }
];

export const generateNewNotification = (): SystemNotification => {
    const types: NotificationType[] = ['system', 'security', 'player', 'alliance', 'battle', 'economy'];
    const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'critical'];
    const sources = ['System Admin', 'Monitoring', 'Security', 'Battle System', 'Economy System'];

    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];

    const messages = {
        system: [
            'Server performance đang ở mức ổn định',
            'Cập nhật hệ thống đã được áp dụng thành công',
            'Kiểm tra định kỳ hệ thống đã hoàn thành'
        ],
        security: [
            'Đăng nhập admin thành công từ IP mới',
            'Hệ thống bảo mật đã được cập nhật',
            'Quét malware định kỳ không phát hiện mối đe dọa'
        ],
        player: [
            'Người chơi mới đã đăng ký thành công',
            'Player đạt cấp độ tối đa',
            'Giao dịch người chơi hoàn thành'
        ],
        alliance: [
            'Liên minh mới được thành lập',
            'Thành viên liên minh đạt thành tích',
            'Chiến tranh liên minh kết thúc'
        ],
        battle: [
            'Trận đấu PvP mới bắt đầu',
            'Boss raid đã được hoàn thành',
            'Tournament sắp kết thúc'
        ],
        economy: [
            'Tỷ giá ổn định',
            'Giao dịch lớn được thực hiện',
            'Thị trường vật phẩm hoạt động bình thường'
        ]
    };

    return {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Update`,
        message: messages[randomType][Math.floor(Math.random() * messages[randomType].length)],
        type: randomType,
        priority: randomPriority,
        status: 'unread',
        timestamp: new Date().toISOString(),
        source: randomSource
    };
};

export const getPriorityColor = (priority: NotificationPriority): string => {
    switch (priority) {
        case 'critical': return '#ff4d4f';
        case 'high': return '#ff7a45';
        case 'medium': return '#faad14';
        case 'low': return '#52c41a';
        default: return '#d9d9d9';
    }
};

export const getTypeColor = (type: NotificationType): string => {
    switch (type) {
        case 'system': return 'blue';
        case 'security': return 'red';
        case 'player': return 'green';
        case 'alliance': return 'purple';
        case 'battle': return 'volcano';
        case 'economy': return 'cyan';
        case 'maintenance': return 'geekblue';
        default: return 'default';
    }
};

export const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
};
