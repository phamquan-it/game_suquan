import { LootBox, RewardItem, RewardPool } from "../types/loot-box";
import { PlayerContext } from "../types/reward-system";

// lib/utils/loot-generator.ts
export class LootGenerator {
    /**
     * Generate rewards from a loot box
     */
    static generateRewards(
        box: LootBox,
        count: number = 1,
        playerContext?: PlayerContext
    ): RewardItem[] {
        const rewards: RewardItem[] = [];

        for (let i = 0; i < count; i++) {
            const reward = this.generateSingleReward(box, playerContext);
            rewards.push(reward);
        }

        // Add guaranteed drops based on open count
        const guaranteed = this.getGuaranteedDrops(box, playerContext);
        rewards.push(...guaranteed);

        return rewards;
    }

    private static generateSingleReward(
        box: LootBox,
        playerContext?: PlayerContext
    ): RewardItem {
        const { rewardTable } = box;

        // Select reward pool based on weights
        const selectedPool = this.selectRewardPool(rewardTable.pools);

        // Select rewards from the pool
        const poolRewards = this.selectPoolRewards(selectedPool, playerContext);

        // Apply pity system if applicable
        const pityReward = this.checkPitySystem(box, playerContext);
        if (pityReward) {
            return pityReward;
        }

        return poolRewards[0]; // For now, return first reward from pool
    }

    private static selectRewardPool(pools: RewardPool[]): RewardPool {
        const totalWeight = pools.reduce((sum, pool) => sum + pool.weight, 0);
        let random = Math.random() * totalWeight;

        for (const pool of pools) {
            random -= pool.weight;
            if (random <= 0) {
                return pool;
            }
        }

        return pools[0]; // Fallback
    }

    private static selectPoolRewards(
        pool: RewardPool,
        playerContext?: PlayerContext
    ): RewardItem[] {
        const rewards: RewardItem[] = [];
        const dropCount = this.randomInt(pool.minDrops, pool.maxDrops);

        for (let i = 0; i < dropCount; i++) {
            const reward = this.weightedRandomSelection(pool.rewards, playerContext);
            if (reward) {
                rewards.push(reward);
            }
        }

        return rewards;
    }

    private static weightedRandomSelection(
        rewards: RewardItem[],
        playerContext?: PlayerContext
    ): RewardItem | null {
        const validRewards = rewards.filter(reward =>
            this.meetsConditions(reward, playerContext)
        );

        if (validRewards.length === 0) return null;

        const totalWeight = validRewards.reduce((sum, reward) => sum + reward.weight, 0);
        let random = Math.random() * totalWeight;

        for (const reward of validRewards) {
            random -= reward.weight;
            if (random <= 0) {
                return reward;
            }
        }

        return validRewards[0];
    }

    private static meetsConditions(
        reward: RewardItem,
        playerContext?: PlayerContext
    ): boolean {
        if (!reward.conditions || !playerContext) return true;

        return reward.conditions.every(condition => {
            switch (condition.type) {
                case 'player_level':
                    return playerContext.level >= condition.value;
                case 'vip_level':
                    return playerContext.vipLevel >= condition.value;
                // Add more condition checks...
                default:
                    return true;
            }
        });
    }

    private static checkPitySystem(
        box: LootBox,
        playerContext?: PlayerContext
    ): RewardItem | null {
        if (!box.pitySystem?.enabled || !playerContext) return null;

        for (const counter of box.pitySystem.counters) {
            const currentCount = playerContext.pityCounters.get(counter.rarity) || 0;
            if (currentCount >= counter.threshold) {
                // Reset counter if configured
                if (box.pitySystem.resetOnRareDrop) {
                    playerContext.pityCounters.set(counter.rarity, 0);
                }
                return counter.guaranteedReward;
            }
        }

        return null;
    }

    private static getGuaranteedDrops(
        box: LootBox,
        playerContext?: PlayerContext
    ): RewardItem[] {
        if (!playerContext) return [];

        const guaranteed: RewardItem[] = [];
        const totalOpenings = playerContext.totalOpenings + 1; // +1 for current opening

        for (const guaranteedDrop of box.guaranteedDrops) {
            if (totalOpenings % guaranteedDrop.openCount === 0) {
                guaranteed.push(...guaranteedDrop.rewards);
            }
        }

        return guaranteed;
    }

    private static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
