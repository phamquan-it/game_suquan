'use client';

import React from 'react';
import { Line } from '@ant-design/plots';

export default function RealTimeChart() {
    const data = [
        { time: '00:00', players: 1200 },
        { time: '04:00', players: 800 },
        { time: '08:00', players: 1500 },
        { time: '12:00', players: 3200 },
        { time: '16:00', players: 2800 },
        { time: '20:00', players: 4500 },
        { time: '23:59', players: 3800 },
    ];

    const config = {
        data,
        xField: 'time',
        yField: 'players',
        smooth: true,
        color: '#8B0000',
        lineStyle: {
            lineWidth: 3,
        },
        point: {
            size: 5,
            shape: 'circle',
            style: {
                fill: '#D4AF37',
                stroke: '#8B0000',
                lineWidth: 2,
            },
        },
        areaStyle: {
            fill: 'l(270) 0:#8B000010 1:#8B000000',
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 2000,
            },
        },
    };

    return <Line {...config} />;
}
