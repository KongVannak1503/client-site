import React, { useState } from 'react';
import { Form, Input, Button, message, Select, Checkbox } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';

const CreateDelivery = () => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/api/delivery-partners/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values), // Send form data as JSON
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An unknown error occurred');
            }

            message.success(data.message || 'Delivery Partner created successfully!');
            form.resetFields();
            setError(null);
            navigate(`/delivery-partners`);
        } catch (error) {
            console.error('Error creating delivery partner:', error);
            setError(error.message || 'Failed to create delivery partner.');
            message.error(error.message || 'Failed to create delivery partner.');
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-8">Create Delivery Partner</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded overflow-hidden shadow-lg bg-white p-8">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{ available: true }} // Set default checkbox value
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Name is required!' }]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>

                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Phone number is required!' }]}
                    >
                        <Input placeholder="Enter phone number" />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Gender is required!' }]}
                    >
                        <Select placeholder="Select gender">
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Address is required!' }]}
                    >
                        <TextArea placeholder="Enter address" rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="available"
                        valuePropName="checked" // Maps `checked` state to form value
                    >
                        <Checkbox>Available</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Create Delivery Partner
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CreateDelivery;
