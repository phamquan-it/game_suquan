// components/CreateGeneralButton.tsx
import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GeneralFormModal from './GeneralFormModal';

const CreateGeneralButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSuccess = () => {
        message.success('New general has been created!');
    };

    return (
        <>
            <Button
                type="primary"
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
            >
                Thêm Tướng
            </Button>

            <GeneralFormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default CreateGeneralButton;
