import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, Form, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import ImagePreview from "../../components/utils/ImagePreview";
import Nav from "./_nav";

const RestaurantUpdate = () => {
  const { id } = useParams(); // Access restaurantId and itemId from the URL
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
          `http://localhost:5000/api/restaurants/${id}`
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
  }, [id, form]);

  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("open_time", values.open_time);
      formData.append("close_time", values.close_time);

      // Append image file only if selected
      if (
        values.image &&
        values.image.fileList &&
        values.image.fileList.length > 0
      ) {
        formData.append("image", values.image.fileList[0].originFileObj);
      }

      const response = await axios.put(
        `http://localhost:5000/api/restaurants/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLoading(false);
      message.success("Updated successfully!");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        console.error("Error updating:", error.response.data); // Log detailed error response
      } else {
        console.error("Error updating:", error.message); // Log generic error message
      }
      message.error("Failed to update");
    }
  };

  // Handle file change and preview
  const handleImageChange = (info: any) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj; // Get the newly selected file
      setImagePreview(URL.createObjectURL(file)); // Update the preview with the new file
    } else {
      setImagePreview(null); // Reset preview if no file is selected
    }
  };

  // If the menu item is not yet loaded, display loading state
  if (!menuItem) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Update Menu Item</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <Nav />
        </div>
        <div className="col-span-3">
          <div className="grid gap-4">
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
                          <Button icon={<UploadOutlined />}>
                            Select Image
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                    <div className="col-span-3">
                      <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please input the restaurant name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Please input the phone number!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: "Please input the restaurant address!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                          name="open_time"
                          label="Open Time"
                          rules={[
                            {
                              required: true,
                              message: "Please select the opening time!",
                            },
                          ]}
                        >
                          <Input type="time" />
                        </Form.Item>
                        <Form.Item
                          name="close_time"
                          label="Close Time"
                          rules={[
                            {
                              required: true,
                              message: "Please select the closing time!",
                            },
                          ]}
                        >
                          <Input type="time" />
                        </Form.Item>
                      </div>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                        >
                          Update Menu Item
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantUpdate;
