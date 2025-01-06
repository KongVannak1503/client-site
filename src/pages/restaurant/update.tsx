import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Form, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Nav from './_nav';

const RestaurantUpdate = () => {
    const { id } = useParams(); // Accessing id from the URL
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Fetch the restaurant data on component mount
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
                setRestaurant(response.data.data);
                form.setFieldsValue(response.data.data); // Populate form fields
            } catch (error) {
                message.error('Failed to load restaurant details');
            }
        };

        fetchRestaurant();
    }, [id, form]);

    const handleUpdate = async (values) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phone', values.phone);
            formData.append('address', values.address);
            formData.append('open_time', values.open_time);
            formData.append('close_time', values.close_time);

            // Append the image file only if it's selected
            if (values.image && values.image.fileList.length > 0) {
                formData.append('image', values.image.fileList[0].originFileObj);
            }

            const response = await axios.put(
                `http://localhost:5000/api/restaurants/${id}`,  // PUT request to update the restaurant
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setLoading(false);
            message.success('Restaurant updated successfully!');
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                    <Nav />
                </div>

                <div className="col-span-3">
                    <div className="p-6 shadow-lg bg-white">  <Form
                        form={form}
                        initialValues={restaurant}
                        onFinish={handleUpdate}
                        layout="vertical"
                        encType="multipart/form-data"
                    >
                        {/* Keeping the 'code' field commented out based on your previous request */}
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the restaurant name!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the restaurant address!' }]}>
                            <Input />
                        </Form.Item>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update Restaurant
                            </Button>
                        </Form.Item>
                    </Form></div>
                </div>
            </div>
        </>
    );
};

export default RestaurantUpdate;
