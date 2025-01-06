import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Form, message, Checkbox, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';

const UpdateDelivery = () => {
    const { Option } = Select;
    const { id } = useParams(); // Access delivery-partner id from the URL
    const navigate = useNavigate();
    const [menuItem, setMenuItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Fetch the menu item data on component mount
    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/delivery-partners/${id}`);
                const data = response.data.data;

                // Normalize gender if needed
                const normalizedGender = data.gender
                    ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase()
                    : '';

                // Set form values with normalized data
                form.setFieldsValue({
                    ...data,
                    gender: normalizedGender,
                });
                setMenuItem(data);
            } catch (error) {
                message.error('Failed to load menu item details');
                console.error('Error loading menu item:', error);
            }
        };

        fetchMenuItem();
    }, [id, form]);

    const handleUpdate = async (values) => {
        try {
            setLoading(true);

            // Prepare the updated data payload
            const updatedData = {
                name: values.name,
                phone_number: values.phone_number,
                gender: values.gender,
                address: values.address,
                available: values.available || false,
            };

            // Send the PUT request with the updated data
            await axios.put(
                `http://localhost:5000/api/delivery-partners/${id}`,
                updatedData
            );

            setLoading(false);
            message.success('Delivery partner updated successfully!');
            navigate('/delivery-partners'); // Navigate to the delivery partners list
        } catch (error) {
            setLoading(false);
            message.error('Failed to update delivery partner');
            console.error('Error updating delivery partner:', error.response ? error.response.data : error.message);
        }
    };

    // If the menu item is not yet loaded, display loading state
    if (!menuItem) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-8">Update Delivery Partner</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-3">
                    <div className="p-6 shadow-lg bg-white">
                        <Form
                            form={form}
                            onFinish={handleUpdate}
                            layout="vertical"
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
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Update Delivery Partner
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateDelivery;
