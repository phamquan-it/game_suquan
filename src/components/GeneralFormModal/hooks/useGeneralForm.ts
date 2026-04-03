// components/GeneralFormModal/hooks/useGeneralForm.ts
import { useState } from 'react';
import { FormInstance } from 'antd';

export const useGeneralForm = (form: FormInstance) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});

    const nextStep = async () => {
        try {
            const values = await form.validateFields();
            setFormData(prev => ({ ...prev, ...values }));
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const resetForm = () => {
        setCurrentStep(0);
        setFormData({});
    };

    const calculateTotalStats = () => {
        const values = { ...formData, ...form.getFieldsValue() };
        const baseStats = [
            'base_attack', 'base_defense', 'base_health',
            'base_speed', 'base_intelligence', 'base_leadership',
        ];

        return baseStats.reduce((total, stat) => total + (Number(values[stat]) || 0), 0);
    };

    return {
        currentStep,
        formData,
        setCurrentStep,
        nextStep,
        prevStep,
        resetForm,
        calculateTotalStats,
    };
};
