// app/(admin)/beauty-system/page.tsx
"use client";

import React, { useState } from "react";
import { Card, Row, Col, Tabs, Statistic, Button, notification } from "antd";
import {
    CrownOutlined,
    TeamOutlined,
    RocketOutlined,
    GiftOutlined,
    BarChartOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import BeautyCharacterCard from "@/components/admin/beauty-system/BeautyCharacterCard";
import BeautyMissionBoard from "@/components/admin/beauty-system/BeautyMissionBoard";
import BeautyAttributeChart from "@/components/admin/beauty-system/BeautyAttributeChart";
import { BeautyCharacter } from "@/types/beauty-system";
import BeautyGachaSystem from "@/components/admin/beauty-system/BeautyGachaSystem";
import BeautyManagementTable from "@/components/admin/beauty-system/BeautyManagementTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";

const BeautySystemPage = () => {
    const [activeTab, setActiveTab] = useState("characters");
    const [beauties, setBeauties] = useState<BeautyCharacter[]>(mockBeauties);
    const { data, isFetching } = useQuery({
        queryKey: ["beauty_characters_with_skills"],
        queryFn: async () => {
            const { data, error } = await supabase.from("beauty_characters")
                .select(`
        *,
        skills:beauty_skills (
          id,
          name,
          description,
          type,
          effect_type,
          effect_value,
          effect_target,
          cooldown,
          level,
          max_level
        ),
         costumes:costumes (
          id,
          name,
          rarity,
          charm,
          intelligence,
          diplomacy,
          equipped,
          image
        ),
        jewelry:jewelry (
          id,
          name,
          type,
          rarity,
          charm,
          intrigue,
          loyalty,
          equipped,
          image
        )
      `);

            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 60, // 1 phút
    });

    // Thống kê tổng quan
    const beautyStats = {
        totalCharacters: beauties.length,
        activeMissions: beauties.filter((b) => b.status === "mission").length,
        trainingCharacters: beauties.filter((b) => b.status === "training")
            .length,
        availableCharacters: beauties.filter((b) => b.status === "available")
            .length,
        totalCharm: beauties.reduce((acc, b) => acc + b.attributes.charm, 0),
        avgSuccessRate: Math.round(
            beauties.reduce((acc, b) => acc + b.missionSuccessRate, 0) /
                beauties.length
        ),
        legendaryCount: beauties.filter((b) => b.rarity === "legendary").length,
        averageLevel: Math.round(
            beauties.reduce((acc, b) => acc + b.level, 0) / beauties.length
        ),
    };

    // Handler functions
    const handleViewDetails = (character: BeautyCharacter) => {
        notification.info({
            message: `Xem chi tiết ${character.name}`,
            description: `Đang mở thông tin chi tiết của ${character.name}`,
            placement: "topRight",
        });
    };

    const handleEdit = (character: BeautyCharacter) => {
        notification.info({
            message: `Chỉnh sửa ${character.name}`,
            description: `Đang mở form chỉnh sửa thông tin`,
            placement: "topRight",
        });
    };

    const handleAssignMission = (character: BeautyCharacter) => {
        if (character.status !== "available") {
            notification.warning({
                message: "Không thể giao nhiệm vụ",
                description: `${character.name} đang không ở trạng thái sẵn sàng`,
                placement: "topRight",
            });
            return;
        }

        notification.info({
            message: `Giao nhiệm vụ cho ${character.name}`,
            description: `Đang chọn nhiệm vụ phù hợp`,
            placement: "topRight",
        });
    };

    const handleTrain = (character: BeautyCharacter) => {
        if (character.status !== "available") {
            notification.warning({
                message: "Không thể huấn luyện",
                description: `${character.name} đang không ở trạng thái sẵn sàng`,
                placement: "topRight",
            });
            return;
        }

        notification.info({
            message: `Huấn luyện ${character.name}`,
            description: `Đang chọn chương trình huấn luyện`,
            placement: "topRight",
        });
    };

    const handleToggleStatus = (
        characterId: string,
        status: BeautyCharacter["status"]
    ) => {
        // Simulate API call
        setTimeout(() => {
            setBeauties((prev) =>
                prev.map((char) =>
                    char.id === characterId ? { ...char, status } : char
                )
            );
            notification.success({
                message: "Thay đổi trạng thái thành công",
                description: `Đã cập nhật trạng thái nhân vật`,
                placement: "topRight",
            });
        }, 500);
    };

    const handleDelete = (characterId: string) => {
        // Simulate API call
        setTimeout(() => {
            setBeauties((prev) =>
                prev.filter((char) => char.id !== characterId)
            );
            notification.success({
                message: "Xóa thành công",
                description: "Đã xóa Hồng Nhan khỏi hệ thống",
                placement: "topRight",
            });
        }, 500);
    };

    const tabItems = [
        {
            key: "characters",
            label: (
                <span className="flex items-center">
                    <TeamOutlined className="mr-2" />
                    Quản Lý Hồng Nhan
                </span>
            ),
            children: (
                <div className="space-y-6">
                    {/* Quick Stats Row */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card size="small" className="text-center">
                                <Statistic
                                    title="Sẵn Sàng"
                                    value={beautyStats.availableCharacters}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: "#52C41A" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card size="small" className="text-center">
                                <Statistic
                                    title="Đang Nhiệm Vụ"
                                    value={beautyStats.activeMissions}
                                    prefix={<RocketOutlined />}
                                    valueStyle={{ color: "#1890FF" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card size="small" className="text-center">
                                <Statistic
                                    title="Đang Huấn Luyện"
                                    value={beautyStats.trainingCharacters}
                                    prefix={<ThunderboltOutlined />}
                                    valueStyle={{ color: "#FAAD14" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card size="small" className="text-center">
                                <Statistic
                                    title="Huyền Thoại"
                                    value={beautyStats.legendaryCount}
                                    prefix={<SafetyCertificateOutlined />}
                                    valueStyle={{ color: "#722ED1" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Management Table */}
                    <BeautyManagementTable
                        data={data ?? []}
                        loading={isFetching}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onAssignMission={handleAssignMission}
                        onTrain={handleTrain}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                    />

                    {/* Grid View Preview */}
                </div>
            ),
        },
        {
            key: "missions",
            label: (
                <span className="flex items-center">
                    <RocketOutlined className="mr-2" />
                    Bảng Nhiệm Vụ
                </span>
            ),
            children: <BeautyMissionBoard />,
        },
        {
            key: "gacha",
            label: (
                <span className="flex items-center">
                    <GiftOutlined className="mr-2" />
                    Triệu Hồi
                </span>
            ),
            children: <BeautyGachaSystem />,
        },
        {
            key: "analytics",
            label: (
                <span className="flex items-center">
                    <BarChartOutlined className="mr-2" />
                    Phân Tích
                </span>
            ),
            children: (
                <div className="space-y-6">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Card title="Phân Bố Độ Hiếm" className="h-80">
                                {/* Add rarity distribution chart here */}
                                <div className="flex items-center justify-center h-48 text-gray-400">
                                    Biểu đồ phân bố độ hiếm
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="Hiệu Suất Theo Loại" className="h-80">
                                {/* Add performance by type chart here */}
                                <div className="flex items-center justify-center h-48 text-gray-400">
                                    Biểu đồ hiệu suất theo loại
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Card title="Thuộc Tính Trung Bình">
                                <div className="h-64">
                                    <BeautyAttributeChart
                                        attributes={{
                                            charm: Math.round(
                                                beauties.reduce(
                                                    (acc, b) =>
                                                        acc +
                                                        b.attributes.charm,
                                                    0
                                                ) / beauties.length
                                            ),
                                            intelligence: Math.round(
                                                beauties.reduce(
                                                    (acc, b) =>
                                                        acc +
                                                        b.attributes
                                                            .intelligence,
                                                    0
                                                ) / beauties.length
                                            ),
                                            diplomacy: Math.round(
                                                beauties.reduce(
                                                    (acc, b) =>
                                                        acc +
                                                        b.attributes.diplomacy,
                                                    0
                                                ) / beauties.length
                                            ),
                                            intrigue: Math.round(
                                                beauties.reduce(
                                                    (acc, b) =>
                                                        acc +
                                                        b.attributes.intrigue,
                                                    0
                                                ) / beauties.length
                                            ),
                                            loyalty: Math.round(
                                                beauties.reduce(
                                                    (acc, b) =>
                                                        acc +
                                                        b.attributes.loyalty,
                                                    0
                                                ) / beauties.length
                                            ),
                                        }}
                                        characterName="Trung Bình Hệ Thống"
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ),
        },
    ];

    return (
        <div className="beauty-system-page">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Hệ Thống Hồng Nhan
                </h1>
                <p className="text-gray-600">
                    Quản lý và phát triển đội ngũ Hồng Nhan trong thế giới 12 Sứ
                    Quân
                </p>
            </div>

            {/* Header Stats */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-md transition-shadow duration-300">
                        <Statistic
                            title="Tổng Số Hồng Nhan"
                            value={beautyStats.totalCharacters}
                            prefix={<CrownOutlined className="text-red-600" />}
                            valueStyle={{ color: "#8B0000" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-md transition-shadow duration-300">
                        <Statistic
                            title="Nhiệm Vụ Đang Thực Hiện"
                            value={beautyStats.activeMissions}
                            prefix={
                                <RocketOutlined className="text-yellow-600" />
                            }
                            valueStyle={{ color: "#D4AF37" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-md transition-shadow duration-300">
                        <Statistic
                            title="Tỷ Lệ Thành Công TB"
                            value={beautyStats.avgSuccessRate}
                            suffix="%"
                            prefix={
                                <BarChartOutlined className="text-green-600" />
                            }
                            valueStyle={{ color: "#2E8B57" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center hover:shadow-md transition-shadow duration-300">
                        <Statistic
                            title="Cấp Độ Trung Bình"
                            value={beautyStats.averageLevel}
                            prefix={
                                <TeamOutlined className="text-purple-600" />
                            }
                            valueStyle={{ color: "#722ED1" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content */}
            <Card className="shadow-sm">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    size="large"
                    className="beauty-system-tabs"
                />
            </Card>
        </div>
    );
};

// Mock data
const mockBeauties: BeautyCharacter[] = [
    {
        id: "beauty_001",
        name: "Tây Thi",
        title: "Tuyệt Sắc Giai Nhân",
        rarity: "legendary",
        level: 50,
        experience: 32000,
        maxLevel: 60,
        attributes: {
            charm: 98,
            intelligence: 82,
            diplomacy: 76,
            intrigue: 88,
            loyalty: 95,
        },
        skills: [
            {
                id: "skill_001",
                name: "Nụ Cười Nghiêng Nước",
                description:
                    "Tăng sức hút và khả năng thành công trong sứ mệnh ngoại giao.",
                type: "passive",
                effect: {
                    type: "mission_success",
                    value: 15,
                    target: "diplomatic_mission",
                },
                level: 3,
                maxLevel: 5,
            },
        ],
        costumes: [
            {
                id: "costume_001",
                name: "Lụa Bích Thủy",
                rarity: "epic",
                attributes: { charm: 20, intelligence: 5, diplomacy: 8 },
                equipped: true,
                image: "/images/beauty/costume_taythi.png",
            },
        ],
        jewelry: [
            {
                id: "jewelry_001",
                name: "Trâm Ngọc Lam",
                type: "hairpin",
                rarity: "rare",
                attributes: { charm: 10, intrigue: 4, loyalty: 6 },
                equipped: true,
                image: "/images/beauty/jewelry_hairpin.png",
            },
        ],
        status: "available",
        currentMission: undefined,
        trainingEndTime: undefined,
        avatar: "/images/beauty/taythi_avatar.png",
        fullImage: "/images/beauty/taythi_full.png",
        acquisitionDate: "2025-02-10",
        lastUsed: "2025-10-12",
        missionSuccessRate: 90,
    },
    {
        id: "beauty_002",
        name: "Vương Chiêu Quân",
        title: "Hồng Nhan Tri Kỷ",
        rarity: "epic",
        level: 42,
        experience: 21000,
        maxLevel: 55,
        attributes: {
            charm: 85,
            intelligence: 90,
            diplomacy: 95,
            intrigue: 70,
            loyalty: 88,
        },
        skills: [
            {
                id: "skill_002",
                name: "Ca Khúc Hòa Bình",
                description:
                    "Tăng tỷ lệ thành công khi thực hiện sứ mệnh ngoại giao khó.",
                type: "active",
                effect: {
                    type: "attribute_boost",
                    value: 20,
                    target: "diplomacy",
                },
                cooldown: 24,
                level: 2,
                maxLevel: 5,
            },
        ],
        costumes: [
            {
                id: "costume_002",
                name: "Áo Choàng Hồ Quốc",
                rarity: "rare",
                attributes: { charm: 8, intelligence: 10, diplomacy: 15 },
                equipped: true,
                image: "/images/beauty/costume_chieuquan.png",
            },
        ],
        jewelry: [
            {
                id: "jewelry_002",
                name: "Vòng Ngọc Bích",
                type: "bracelet",
                rarity: "epic",
                attributes: { charm: 12, intrigue: 8, loyalty: 10 },
                equipped: true,
                image: "/images/beauty/jewelry_bracelet.png",
            },
        ],
        status: "mission",
        currentMission: "Ngoại giao biên cương",
        trainingEndTime: undefined,
        avatar: "/images/beauty/chieuquan_avatar.png",
        fullImage: "/images/beauty/chieuquan_full.png",
        acquisitionDate: "2025-03-05",
        lastUsed: "2025-10-10",
        missionSuccessRate: 87,
    },
    {
        id: "beauty_003",
        name: "Điêu Thuyền",
        title: "Vũ Nữ Khuynh Thành",
        rarity: "legendary",
        level: 48,
        experience: 29500,
        maxLevel: 60,
        attributes: {
            charm: 96,
            intelligence: 84,
            diplomacy: 78,
            intrigue: 95,
            loyalty: 82,
        },
        skills: [
            {
                id: "skill_003",
                name: "Liên Hoàn Kế",
                description:
                    "Tăng mạnh mưu kế và khả năng thao túng trong các nhiệm vụ cung đình.",
                type: "active",
                effect: {
                    type: "special_event",
                    value: 20,
                    target: "court_event",
                },
                cooldown: 12,
                level: 4,
                maxLevel: 5,
            },
        ],
        costumes: [
            {
                id: "costume_003",
                name: "Lụa Huyền Ảnh",
                rarity: "legendary",
                attributes: { charm: 25, intelligence: 10, diplomacy: 5 },
                equipped: true,
                image: "/images/beauty/costume_dieuthuyen.png",
            },
        ],
        jewelry: [
            {
                id: "jewelry_003",
                name: "Khuyên Vàng Phượng",
                type: "earring",
                rarity: "legendary",
                attributes: { charm: 15, intrigue: 12, loyalty: 5 },
                equipped: true,
                image: "/images/beauty/jewelry_earring.png",
            },
        ],
        status: "training",
        currentMission: "Huấn luyện đặc biệt",
        trainingEndTime: "2025-10-14T23:59:00Z",
        avatar: "/images/beauty/dieuthuyen_avatar.png",
        fullImage: "/images/beauty/dieuthuyen_full.png",
        acquisitionDate: "2025-04-01",
        lastUsed: "2025-10-13",
        missionSuccessRate: 91,
    },
];

export default BeautySystemPage;
