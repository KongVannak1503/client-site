import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UpdateUser = () => {
    const { id } = useParams(); // Accessing id from the URL
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Fetch the restaurant data on component mount
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${id}`);
                setRestaurant(response.data.data);
                form.setFieldsValue(response.data.data); // Populate form fields
            } catch (error) {
                message.error('Failed to load restaurant details');
            }
        };

        fetchRestaurant();
    }, [id, form]);

    const handleUpdate = async (values) => {
        if (password && password !== confirmPassword) {
            message.error("Passwords don't match");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phone', values.phone);
            formData.append('address', values.address);
            formData.append('open_time', values.open_time);
            formData.append('close_time', values.close_time);
            formData.append('password', password); // Adding the password if provided

            // Append the image file only if it's selected
            if (values.image && values.image.fileList.length > 0) {
                formData.append('image', values.image.fileList[0].originFileObj);
            }

            const response = await axios.put(
                `http://localhost:5000/api/users/${id}`,  // PUT request to update the restaurant
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setLoading(false);
            message.success('Restaurant updated successfully!');
            navigate('/users'); // Navigate back to the restaurant list
        } catch (error) {
            setLoading(false);
            message.error('Failed to update restaurant');
        }
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-8">Update Restaurant</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded overflow-hidden shadow-lg bg-white p-8">
                <Form
                    form={form}
                    initialValues={restaurant}
                    onFinish={handleUpdate}
                    layout="vertical"
                    encType="multipart/form-data"
                >
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the restaurant name!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the restaurant address!' }]}>
                        <Input />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="open_time"
                            label="Open Time"
                            rules={[{ required: true, message: 'Please select the opening time!' }]}
                        >
                            <Input type="time" />
                        </Form.Item>
                        <Form.Item
                            name="close_time"
                            label="Close Time"
                            rules={[{ required: true, message: 'Please select the closing time!' }]}
                        >
                            <Input type="time" />
                        </Form.Item>
                    </div>

                    {/* Image Upload Field */}
                    <Form.Item label="Image" name="image">
                        <Upload
                            beforeUpload={() => false} // Prevent automatic upload
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Select Image</Button>
                        </Upload>
                    </Form.Item>

                    {/* Password and Confirm Password Fields */}
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: password ? true : false, // Only require password if it's typed
                                message: 'Please input the password!',
                            },
                        ]}
                    >
                        <Input.Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    {password && (
                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            rules={[
                                {
                                    required: password ? true : false,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords don't match"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Restaurant
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default UpdateUser;
