// Alliance Data
export const alliances: Alliance[] = [
    {
        id: 'alliance_1',
        name: 'Thiên Hạ Quy Nhất',
        tag: 'THQN',
        level: 25,
        rank: 1,
        totalPower: 98500000,
        memberCount: 98,
        maxMembers: 100,
        territory: 45,
        victoryPoints: 12500,
        winRate: 92.5,
        avgMemberLevel: 48,
        leader: 'ThiênLongĐế',
        foundedDate: '2024-01-15',
        region: 'north',
        language: 'vietnamese',
        requirements: {
            minLevel: 40,
            minPower: 1000000,
            approvalRequired: true
        },
        status: 'recruiting',
        achievements: ['Season 1 Champion', 'Season 2 Champion', 'Elite Alliance', 'Conqueror'],
        recentActivity: 'Vừa chinh phục thành Đại La',
        joinType: 'approval',
        discord: 'discord.gg/thqn',
        description: 'Liên minh hùng mạnh nhất server, tập trung những chiến binh ưu tú. Mục tiêu thống nhất giang sơn và xây dựng đế chế vĩ đại.',
        specialties: ['PvP', 'Conquest', 'Strategy']
    },
    {
        id: 'alliance_2',
        name: 'Hào Khí Đông A',
        tag: 'HKDA',
        level: 24,
        rank: 2,
        totalPower: 87200000,
        memberCount: 95,
        maxMembers: 100,
        territory: 38,
        victoryPoints: 11200,
        winRate: 89.3,
        avgMemberLevel: 46,
        leader: 'BachDangChienThan',
        foundedDate: '2024-02-20',
        region: 'north',
        language: 'vietnamese',
        requirements: {
            minLevel: 35,
            minPower: 800000,
            approvalRequired: true
        },
        status: 'recruiting',
        achievements: ['Season 2 Runner-up', 'Elite Alliance', 'Tournament Champion'],
        recentActivity: 'Chiến thắng giải đấu liên minh',
        joinType: 'approval',
        description: 'Liên minh với tinh thần thượng võ, kế thừa hào khí Đông A. Chú trọng phát triển kỹ năng chiến đấu và chiến thuật.',
        specialties: ['Tournament', 'Training', 'Combat']
    },
    {
        id: 'alliance_3',
        name: 'Lạc Hồng Thần Tộc',
        tag: 'LHTT',
        level: 23,
        rank: 3,
        totalPower: 76500000,
        memberCount: 92,
        maxMembers: 100,
        territory: 35,
        victoryPoints: 9800,
        winRate: 86.7,
        avgMemberLevel: 45,
        leader: 'HongBangVuong',
        foundedDate: '2024-03-10',
        region: 'central',
        language: 'vietnamese',
        requirements: {
            minLevel: 30,
            minPower: 600000,
            approvalRequired: false
        },
        status: 'recruiting',
        achievements: ['Season 1 Top 5', 'Rising Star', 'Event Specialist'],
        recentActivity: 'Hoàn thành sự kiện mùa giải',
        joinType: 'open',
        description: 'Liên minh của con Rồng cháu Tiên, đề cao tinh thần đoàn kết và phát triển cộng đồng. Phù hợp với mọi thể loại người chơi.',
        specialties: ['Community', 'Events', 'Development']
    },
    {
        id: 'alliance_4',
        name: 'Con Rồng Cháu Tiên',
        tag: 'CRCT',
        level: 22,
        rank: 4,
        totalPower: 69800000,
        memberCount: 88,
        maxMembers: 100,
        territory: 32,
        victoryPoints: 8900,
        winRate: 84.2,
        avgMemberLevel: 43,
        leader: 'LacLongQuanDe',
        foundedDate: '2024-04-05',
        region: 'south',
        language: 'vietnamese',
        requirements: {
            minLevel: 25,
            minPower: 500000,
            approvalRequired: true
        },
        status: 'recruiting',
        achievements: ['Active Alliance', 'Friendly Community', 'Fast Growing'],
        recentActivity: 'Tuyển thành viên mới',
        joinType: 'approval',
        description: 'Cộng đồng thân thiện, hỗ trợ thành viên phát triển. Tập trung vào xây dựng và phát triển bền vững.',
        specialties: ['Development', 'Support', 'Community']
    },
    {
        id: 'alliance_5',
        name: 'Âu Lạc Vương Triều',
        tag: 'ALVT',
        level: 21,
        rank: 5,
        totalPower: 64500000,
        memberCount: 85,
        maxMembers: 100,
        territory: 29,
        victoryPoints: 7800,
        winRate: 81.5,
        avgMemberLevel: 42,
        leader: 'AnDuongVuong',
        foundedDate: '2024-05-12',
        region: 'highlands',
        language: 'vietnamese',
        requirements: {
            minLevel: 20,
            minPower: 400000,
            approvalRequired: false
        },
        status: 'full',
        achievements: ['Stable Growth', 'Reliable Team', 'Consistent Performance'],
        recentActivity: 'Đã đạt đủ thành viên',
        joinType: 'open',
        description: 'Liên minh ổn định với thành tích phát triển đều đặn. Môi trường tốt để học hỏi và tiến bộ.',
        specialties: ['Consistency', 'Teamwork', 'Growth']
    }
];

export const myAlliance: Alliance = {
    id: 'alliance_my',
    name: 'Liên Minh Mới',
    tag: 'LMN',
    level: 15,
    rank: 28,
    totalPower: 24500000,
    memberCount: 45,
    maxMembers: 100,
    territory: 12,
    victoryPoints: 3200,
    winRate: 72.3,
    avgMemberLevel: 35,
    leader: 'SứQuânCủaBạn',
    foundedDate: '2024-06-10',
    region: 'central',
    language: 'vietnamese',
    requirements: {
        minLevel: 15,
        minPower: 200000,
        approvalRequired: false
    },
    status: 'recruiting',
    achievements: ['New Alliance', 'Rapid Growth', 'Active Members'],
    recentActivity: 'Đang phát triển và tuyển thành viên',
    joinType: 'open',
    description: 'Liên minh mới thành lập, đang trên đà phát triển. Cơ hội tốt cho những người muốn xây dựng từ đầu.',
    specialties: ['New Players', 'Development', 'Growth']
};

export const allianceStats: AllianceStats = {
    totalBattles: 1247,
    wins: 1156,
    losses: 91,
    winRate: 92.5,
    totalTerritory: 45,
    averagePower: 985000,
    seasonRank: 1,
    eventWins: 23,
    resources: {
        gold: 1250000,
        wood: 890000,
        stone: 765000,
        food: 1200000
    }
};

export const allianceMembers: AllianceMember[] = Array.from({ length: 50 }, (_, i) => ({
    id: `member_${i + 1}`,
    name: `ThànhViên${i + 1}`,
    level: 50 - Math.floor(i / 10),
    power: 1000000 - (i * 15000),
    role: i === 0 ? 'leader' : i < 5 ? 'deputy' : i < 15 ? 'elite' : i < 45 ? 'member' : 'recruit',
    joinDate: '2024-06-15',
    lastActive: '2024-12-15',
    contribution: 50000 - (i * 800),
    status: i % 4 === 0 ? 'online' : i % 4 === 1 ? 'away' : 'offline',
    avatar: `/api/placeholder/40/40?seed=member${i}`
}));


export const languages = [
    { value: 'all', label: 'Tất Cả Ngôn Ngữ' },
    { value: 'vietnamese', label: 'Tiếng Việt' },
    { value: 'english', label: 'English' },
    { value: 'chinese', label: '中文' }
];

export const sortOptions = [
    { value: 'power', label: 'Sức Mạnh' },
    { value: 'level', label: 'Cấp Độ' },
    { value: 'members', label: 'Thành Viên' },
    { value: 'territory', label: 'Lãnh Thổ' },
    { value: 'winRate', label: 'Tỷ Lệ Thắng' }
];

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'recruiting': return '#52c41a';
        case 'full': return '#faad14';
        case 'closed': return '#fa541c';
        case 'inviteOnly': return '#722ed1';
        default: return '#8B0000';
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'recruiting': return 'Đang tuyển';
        case 'full': return 'Đã đầy';
        case 'closed': return 'Đóng cửa';
        case 'inviteOnly': return 'Chỉ mời';
        default: return 'Unknown';
    }
};

export const getRegionInfo = (region: string) => {
    return regions.find(r => r.value === region) || regions[0];
};

export const getRoleColor = (role: string) => {
    switch (role) {
        case 'leader': return '#FFD700';
        case 'deputy': return '#C0C0C0';
        case 'elite': return '#CD7F32';
        case 'member': return '#003366';
        case 'recruit': return '#8B0000';
        default: return '#D4AF37';
    }
};

export const getRoleText = (role: string) => {
    switch (role) {
        case 'leader': return 'Tộc Trưởng';
        case 'deputy': return 'Phó Tộc';
        case 'elite': return 'Tinh Nhuệ';
        case 'member': return 'Thành Viên';
        case 'recruit': return 'Tân Binh';
        default: return 'Thành Viên';
    }
};
    // Extended regions
   export const regions = [
        { value: 'all', label: 'Tất Cả Vùng', color: '#8B0000' },
        { value: 'north', label: 'Bắc Bộ', color: '#003366' },
        { value: 'central', label: 'Trung Bộ', color: '#D4AF37' },
        { value: 'south', label: 'Nam Bộ', color: '#2E8B57' },
        { value: 'highlands', label: 'Tây Nguyên', color: '#CD7F32' }
    ];
