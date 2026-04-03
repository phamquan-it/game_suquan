'use client';

import React, { useMemo } from 'react';
import { Select, Space, Tag, Typography } from 'antd';
import type { SelectProps } from 'antd';
import { LootBoxRewardItem } from '../types';
import { getRarityColor } from '@/lib/utils/beauty-helpers';
import { getRarityLabel } from '@/components/admin/loot-box/helpers';

const { Text } = Typography;

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  items: LootBoxRewardItem[];
};

export default function RewardSelect({ value, onChange, items }: Props) {
  const options: SelectProps['options'] = useMemo(() => {
    return items.map((item) => ({
      value: item.id,
      label: (
        <Space>
          <Tag color={getRarityColor(item.rarity)}>
            {getRarityLabel(item.rarity)}
          </Tag>
          <span>{item.reward_type}</span>
          <Text type="secondary">
            ({item.amount_min}-{item.amount_max})
          </Text>
        </Space>
      ),

      // custom data để render dropdown
      item,
    }));
  }, [items]);

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      options={options}
      style={{ width: '100%' }}
      size="large"
      placeholder="Chọn phần thưởng"
      optionLabelProp="label"

      // 🔥 render dropdown item tại đây
      optionRender={(option) => {
        const item = (option.data as any).item as LootBoxRewardItem;

        return (
          <Space direction="vertical" size={0}>
            <Space>
              <Tag color={getRarityColor(item.rarity)}>
                {getRarityLabel(item.rarity)}
              </Tag>
              <span style={{ fontWeight: 500 }}>
                {item.reward_type}
              </span>
            </Space>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Số lượng: {item.amount_min} - {item.amount_max} | Trọng số: {item.weight}
            </Text>

            <Text type="secondary" style={{ fontSize: 12 }}>
              Loại ràng buộc: {item.bound_type}
            </Text>
          </Space>
        );
      }}
    />
  );
}
