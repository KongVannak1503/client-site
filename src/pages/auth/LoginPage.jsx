import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Card } from 'antd';
import styles from './LoginPage.module.css';
import { request } from '../../utils/request';
import { setAccessToken, setIsLogin, setUser } from '../../utils/services';

const { Title } = Typography;

const Login = () => {
  const [message, setMessage] = useState("");
  const onFinish = async (values) => {
    var params = {
      email: values.email,
      password: values.password,
    }
    const res = await request("users/login","POST", params);
    if(res){
      setUser(JSON.stringify(res.user));
      setIsLogin("1");
      setAccessToken(res.access_token);
      window.location.href = "/dashboard";
    }else{
      console.log("error");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Title level={3} className={styles.title}>
          Food delivery
        </Title>
        <Form
          name="login"
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.footerText}>
          Don’t have an account? <a href="/register">Register here</a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
