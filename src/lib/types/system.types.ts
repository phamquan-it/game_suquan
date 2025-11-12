export interface SystemStats {
    serverUptime: string;
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    networkTraffic: number;
    activeConnections: number;
    responseTime: number;
    errorRate: number;
    databaseConnections: number;
    cacheHitRate: number;
    queueLength: number;
    playerCapacity: number;
}

export interface Server {
    id: string;
    name: string;
    type: 'game' | 'database' | 'cache' | 'api' | 'backup';
    status: 'online' | 'offline' | 'degraded' | 'maintenance';
    ip: string;
    port: number;
    region: string;
    playerCount?: number;
    maxPlayers?: number;
    cpu: number;
    memory: number;
    storage?: number;
    uptime: string;
    version: string;
    lastUpdate: string;
    issues?: string[];
}

export interface SystemAlert {
    id: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    server: string;
    timestamp: string;
    acknowledged: boolean;
}

export interface SystemLog {
    id: string;
    level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
    message: string;
    source: string;
    timestamp: string;
    details?: any;
}

export interface Backup {
    id: string;
    name: string;
    type: 'full' | 'incremental';
    size: number;
    status: 'completed' | 'failed' | 'running';
    timestamp: string;
    duration: number;
    checksum: string;
}

export interface MaintenanceTask {
    id: string;
    name: string;
    type: 'backup' | 'update' | 'cleanup' | 'optimization';
    status: 'pending' | 'running' | 'completed' | 'failed';
    scheduled: string;
    started?: string;
    completed?: string;
    progress: number;
    details?: string;
}
