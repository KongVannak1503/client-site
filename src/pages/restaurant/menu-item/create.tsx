import React, { useState, useRef } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ImagePreview from "../../../components/utils/ImagePreview";

const CreateMenu = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle form submission
  const onFinish = async (values: any) => {
    const formData = new FormData();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      message.error("Please upload an image.");
      return;
    }

    // Set the image preview
    setImagePreview(URL.createObjectURL(file));

    formData.append("image", file);

    for (const key in values) {
      if (key !== "image") {
        formData.append(key, values[key]);
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurant/items/create/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An unknown error occurred");
      }

      message.success(data.message || "Menu item created successfully!");
      form.resetFields();
      navigate(`/restaurant/menu-items/${id}`); // Navigate to the menu items list
    } catch (error) {
      setError(error.message || "Failed to create menu item.");
      message.error(error.message || "Failed to create menu item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Create Menu Item</h1>
      <div className="grid gap-4 rounded overflow-hidden shadow-lg bg-white p-8">
        {error && <div className="text-red-500">{error}</div>}
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1">
              <Form.Item
                name="image"
                label="Image"
                rules={[{ required: true, message: "Please upload an image!" }]}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={() => {
                    const file = fileInputRef.current?.files?.[0];
                    if (file) {
                      setImagePreview(URL.createObjectURL(file)); // Update the preview when a file is selected
                    }
                  }}
                />
              </Form.Item>

              {/* Show image preview */}
              <ImagePreview imagePreview={imagePreview} />
            </div>
            <div className="col-span-2">
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Name is required!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: "Code is required!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Description is required!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Price is required!" }]}
              >
                <Input type="number" step="0.01" min="0" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Menu Item
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateMenu;
