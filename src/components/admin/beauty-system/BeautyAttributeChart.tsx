// components/admin/beauty-system/BeautyAttributeChart.tsx
'use client';

import RadarChart from '@ant-design/plots/es/components/radar';
import React from 'react';

interface BeautyAttributeChartProps {
    attributes: {
        charm: number;
        intelligence: number;
        diplomacy: number;
        intrigue: number;
        loyalty: number;
    };
    characterName: string;
}

const BeautyAttributeChart: React.FC<BeautyAttributeChartProps> = ({
    attributes,
    characterName
}) => {
    const chartData = [
        {
            attribute: 'Duyên Dáng',
            value: attributes.charm,
            fullMark: 100,
        },
        {
            attribute: 'Trí Tuệ',
            value: attributes.intelligence,
            fullMark: 100,
        },
        {
            attribute: 'Ngoại Giao',
            value: attributes.diplomacy,
            fullMark: 100,
        },
        {
            attribute: 'Mưu Mẹo',
            value: attributes.intrigue,
            fullMark: 100,
        },
        {
            attribute: 'Trung Thành',
            value: attributes.loyalty,
            fullMark: 100,
        },
    ];

    const chartConfig = {
        data: chartData,
        xField: 'attribute',
        yField: 'value',
        area: {
            style: {
                fill: 'rgba(139, 0, 0, 0.3)',
            },
        },
        line: {
            color: '#8B0000',
        },
        point: {
            size: 4,
            style: {
                fill: '#8B0000',
                stroke: '#D4AF37',
                lineWidth: 2,
            },
        },
        meta: {
            value: {
                min: 0,
                max: 100,
            },
        },
    };

    return (
        <div className="beauty-attribute-chart">
            <h4 className="text-center mb-4 font-cinzel">
                Biểu Đồ Thuộc Tính - {characterName}
            </h4>
            <RadarChart {...chartConfig} />
        </div>
    );
};

export default BeautyAttributeChart;
