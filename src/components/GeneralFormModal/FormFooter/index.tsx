// components/GeneralFormModal/components/FormFooter/index.tsx
import React from 'react';
import { Button, Space, Row, Col } from 'antd';

interface FormFooterProps {
    currentStep: number;
    totalSteps: number;
    onPrev: () => void;
    onNext: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export const FormFooter: React.FC<FormFooterProps> = ({
    currentStep,
    totalSteps,
    onPrev,
    onNext,
    onCancel,
    isLoading,
}) => {
    return (
        <Row justify="space-between">
            <Col>
                {currentStep > 0 && (
                    <Button
                        size="large"
                        onClick={onPrev}
                        style={{
                            borderColor: '#CD7F32',
                            color: '#8B4513',
                        }}
                    >
                        Previous
                    </Button>
                )}
            </Col>
            <Col>
                <Space>
                    <Button
                        size="large"
                        onClick={onCancel}
                        style={{
                            borderColor: '#CD7F32',
                            color: '#8B4513',
                        }}
                    >
                        Cancel
                    </Button>
                    {currentStep < totalSteps - 1 ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={onNext}
                            style={{
                                backgroundColor: '#8B0000',
                                borderColor: '#8B0000',
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={isLoading}
                            style={{
                                backgroundColor: '#2E8B57',
                                borderColor: '#2E8B57',
                                fontWeight: 600,
                            }}
                        >
                            Create General
                        </Button>
                    )}
                </Space>
            </Col>
        </Row>
    );
};
