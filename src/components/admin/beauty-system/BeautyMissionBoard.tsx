// components/admin/beauty-system/BeautyMissionBoard.tsx
"use client";

import React, { useState } from "react";
import {
    Card,
    Table,
    Tag,
    Button,
    Modal,
    Select,
    Progress,
    Row,
    Col,
} from "antd";
import {
    RocketOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { BeautyMission, BeautyCharacter } from "@/types/beauty-system";

const BeautyMissionBoard: React.FC = () => {
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [selectedMission, setSelectedMission] =
        useState<BeautyMission | null>(null);

    const missions: BeautyMission[] = []; // Mock data
    const characters: BeautyCharacter[] = []; // Mock data

    const columns = [
        {
            title: "Tên Nhiệm Vụ",
            dataIndex: "name",
            key: "name",
            render: (text: string, record: BeautyMission) => (
                <div>
                    <div className="font-semibold">{text}</div>
                    <div className="text-xs text-gray-500">
                        {record.description}
                    </div>
                </div>
            ),
        },
        {
            title: "Độ Khó",
            dataIndex: "difficulty",
            key: "difficulty",
            render: (difficulty: string) => {
                const colors = {
                    easy: "green",
                    medium: "blue",
                    hard: "orange",
                    expert: "red",
                };
                return (
                    <Tag color={colors[difficulty as keyof typeof colors]}>
                        {difficulty.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Thời Gian",
            dataIndex: "duration",
            key: "duration",
            render: (duration: number) => (
                <div className="flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    {duration}h
                </div>
            ),
        },
        {
            title: "Tỷ Lệ Thành Công",
            dataIndex: "successRate",
            key: "successRate",
            render: (rate: number) => (
                <Progress
                    percent={rate}
                    size="small"
                    strokeColor={
                        rate >= 80
                            ? "#52C41A"
                            : rate >= 60
                              ? "#FAAD14"
                              : "#FF4D4F"
                    }
                />
            ),
        },
        {
            title: "Phần Thưởng",
            dataIndex: "rewards",
            key: "rewards",
            render: (rewards: any) => (
                <div className="flex items-center">
                    <TrophyOutlined className="text-yellow-500 mr-1" />
                    <span className="text-green-600 font-semibold">
                        {rewards.gold.toLocaleString()} Vàng
                    </span>
                </div>
            ),
        },
        {
            title: "Thao Tác",
            key: "actions",
            render: (_: any, record: BeautyMission) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<RocketOutlined />}
                    onClick={() => handleAssignMission(record)}
                >
                    Giao Nhiệm Vụ
                </Button>
            ),
        },
    ];

    const handleAssignMission = (mission: BeautyMission) => {
        setSelectedMission(mission);
        setAssignModalVisible(true);
    };

    const handleMissionAssign = (characterId: string) => {
        // Logic assign mission
        console.log(
            `Assign mission ${selectedMission?.id} to character ${characterId}`
        );
        setAssignModalVisible(false);
    };

    return (
        <div>
            <Card title="Bảng Nhiệm Vụ Hồng Nhan">
                <Table
                    columns={columns}
                    dataSource={missions}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={`Giao Nhiệm Vụ: ${selectedMission?.name}`}
                open={assignModalVisible}
                onCancel={() => setAssignModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedMission && (
                    <div className="space-y-4">
                        {/* Mission Requirements */}
                        <Card title="Yêu Cầu Nhiệm Vụ" size="small">
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <div className="flex justify-between">
                                        <span>Duyên Dáng:</span>
                                        <Tag color="red">
                                            {
                                                selectedMission
                                                    .requiredAttributes.charm
                                            }
                                            +
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex justify-between">
                                        <span>Trí Tuệ:</span>
                                        <Tag color="blue">
                                            {
                                                selectedMission
                                                    .requiredAttributes
                                                    .intelligence
                                            }
                                            +
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex justify-between">
                                        <span>Ngoại Giao:</span>
                                        <Tag color="green">
                                            {
                                                selectedMission
                                                    .requiredAttributes
                                                    .diplomacy
                                            }
                                            +
                                        </Tag>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="flex justify-between">
                                        <span>Mưu Mẹo:</span>
                                        <Tag color="purple">
                                            {
                                                selectedMission
                                                    .requiredAttributes.intrigue
                                            }
                                            +
                                        </Tag>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* Available Characters */}
                        <Card title="Hồng Nhan Có Thể Giao" size="small">
                            <div className="space-y-2">
                                {characters
                                    .filter(
                                        (char) => char.status === "available"
                                    )
                                    .map((character) => (
                                        <div
                                            key={character.id}
                                            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={character.avatar}
                                                    alt={character.name}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div>
                                                    <div className="font-semibold">
                                                        {character.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Duyên:{" "}
                                                        {
                                                            character.attributes
                                                                .charm
                                                        }{" "}
                                                        | Trí:{" "}
                                                        {
                                                            character.attributes
                                                                .intelligence
                                                        }{" "}
                                                        | Thành công:{" "}
                                                        {
                                                            character.missionSuccessRate
                                                        }
                                                        %
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={() =>
                                                    handleMissionAssign(
                                                        character.id
                                                    )
                                                }
                                                disabled={
                                                    character.attributes.charm <
                                                        selectedMission
                                                            .requiredAttributes
                                                            .charm ||
                                                    character.attributes
                                                        .intelligence <
                                                        selectedMission
                                                            .requiredAttributes
                                                            .intelligence
                                                }
                                            >
                                                Chọn
                                            </Button>
                                        </div>
                                    ))}
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BeautyMissionBoard;
