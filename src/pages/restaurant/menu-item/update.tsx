import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, Form, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

// ImagePreview Component
const ImagePreview: React.FC<{ imagePreview: string | null }> = ({
  imagePreview,
}) => {
  return (
    <div className="mt-2 mb-3">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-[200px] h-[200px] object-cover"
        />
      ) : (
        <img
          src="https://png.pngtree.com/png-vector/20231215/ourmid/pngtree-transaction-approved-png-image_11354742.png"
          alt="Placeholder"
          className="w-[200px] h-[200px] object-cover"
        />
      )}
    </div>
  );
};

const UpdateMenu = () => {
  const { id, itemId } = useParams(); // Access restaurantId and itemId from the URL
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch the menu item data on component mount
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/restaurant/items/view/${itemId}`
        );
        setMenuItem(response.data.data);
        form.setFieldsValue(response.data.data); // Populate form fields
        setImagePreview("http://localhost:5000/" + response.data.data.image); // Set the initial image preview
      } catch (error) {
        message.error("Failed to load menu item details");
        console.error("Error loading menu item:", error); // Log error
      }
    };

    fetchMenuItem();
  }, [itemId, form]);

  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);

      // Create the form data object
      const formData = new FormData();

      // Append form values to formData
      formData.append("restaurantId", id); // Adding restaurantId from URL
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("description", values.description);
      formData.append("price", values.price);

      // Append image file only if selected
      if (
        values.image &&
        values.image.fileList &&
        values.image.fileList.length > 0
      ) {
        formData.append("image", values.image.fileList[0].originFileObj);
      }

      // Send the PUT request with the form data
      const response = await axios.put(
        `http://localhost:5000/api/restaurant/items/update/${itemId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLoading(false);
      message.success("Menu item updated successfully!");
      navigate(`/restaurant/menu-items/${id}`); // Navigate to the menu items list
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.error("Error updating menu item:", error.response.data); // Log detailed error response
      } else {
        console.error("Error updating menu item:", error.message); // Log generic error message
      }
      message.error("Failed to update menu item");
    }
  };

  // Handle file change and preview
  const handleImageChange = (info: any) => {
    if (info.file.status === "done") {
      // Check if a new image file is selected and update preview
      const file = info.file.originFileObj;
      setImagePreview(URL.createObjectURL(file)); // Update preview in real-time
    }
  };

  // If the menu item is not yet loaded, display loading state
  if (!menuItem) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Update Menu Item</h1>

      <div className="grid  gap-4">
        <div className="col-span-3">
          <div className="p-6 shadow-lg bg-white">
            <Form
              form={form}
              initialValues={menuItem}
              onFinish={handleUpdate}
              layout="vertical"
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  {/* Show image preview */}
                  <ImagePreview imagePreview={imagePreview} />
                  {/* Image Upload Field */}
                  <Form.Item className="mx-auto" name="image">
                    <Upload
                      beforeUpload={() => false} // Prevent automatic upload
                      maxCount={1}
                      showUploadList={false}
                      onChange={handleImageChange} // Handle image selection and preview
                      fileList={form.getFieldValue("image")?.fileList || []} // Set fileList correctly
                    >
                      <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                  </Form.Item>
                </div>
                <div className="col-span-2">
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the menu item name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Code"
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Please input the item code!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please input the item description!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: "Please input the item price!",
                      },
                    ]}
                  >
                    <Input type="number" step="0.01" min="0" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Update Menu Item
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateMenu;
