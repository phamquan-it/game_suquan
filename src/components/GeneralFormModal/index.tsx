// components/GeneralFormModal/index.tsx
import React from 'react';
import { Modal, Form, Steps, Row, Col, Divider, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGeneralForm } from './hooks/useGeneralForm';
import { useGeneralMutation } from './hooks/useGeneralMutation';
import { BasicInfoStep } from './FormSteps/BasicInfoStep';
import { StatisticsStep } from './FormSteps/StatisticsStep';
import { FormFooter } from './FormFooter';
import { FORM_STEPS } from './constants/steps';
import { SettingsStep } from './SettingsStep';

interface GeneralFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const GeneralFormModal: React.FC<GeneralFormModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const { currentStep, nextStep, prevStep, resetForm, calculateTotalStats } = useGeneralForm(form);
    const { mutate: createGeneral, isPending } = useGeneralMutation(onSuccess);

    const handleClose = () => {
        form.resetFields();
        resetForm();
        onClose();
    };

    const onFinish = (values: any) => {
        createGeneral(values);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <BasicInfoStep form={form} />;
            case 1:
                return <StatisticsStep form={form} totalStats={calculateTotalStats()} />;
            case 2:
                return <SettingsStep form={form} />;
            default:
                return null;
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <PlusOutlined style={{ color: '#8B0000' }} />
                    <span>Create New General</span>
                </Space>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            width={800}
            style={{ top: 20 }}
            styles={{
                body: {
                    padding: '0 24px',
                    background: 'linear-gradient(135deg, #F5F5DC 0%, #FFFFFF 100%)',
                },
                header: {
                    borderBottom: `2px solid #D4AF37`,
                    background: 'linear-gradient(135deg, #8B0000 0%, #A52A2A 100%)',
                },
                content: {
                    border: `2px solid #D4AF37`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                },
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    level: 1,
                    max_level: 60,
                    base_attack: 10,
                    base_defense: 10,
                    base_health: 100,
                    base_speed: 10,
                    base_intelligence: 10,
                    base_leadership: 10,
                    status: 'active',
                    favorite: false,
                }}
            >
                <Steps
                    current={currentStep}
                    items={FORM_STEPS}
                    style={{
                        marginBottom: 32,
                        padding: '16px 0',
                    }}
                />

                {renderStepContent()}

                <Divider />

                <FormFooter
                    currentStep={currentStep}
                    totalSteps={FORM_STEPS.length}
                    onPrev={prevStep}
                    onNext={nextStep}
                    onCancel={handleClose}
                    isLoading={isPending}
                />
            </Form>
        </Modal>
    );
};

export default GeneralFormModal;
