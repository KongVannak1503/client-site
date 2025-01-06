import React, { useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  ShopFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet for rendering child routes
import { getIsLogin, getUser, logout } from '../../utils/services';
import styles from './MainLayout.module.css';
import imgLogo from '../../../public/logo.png';

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />),
  getItem('Restaurant', 'sub2', <ShopFilled />),
  getItem('Delivery', 'sub3', <TeamOutlined />),

  getItem('Logout', 'logout', <FileOutlined />),
];

const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (!getIsLogin()) {
      window.location.href = "/login";
    }
  }, []);

  const user = getUser();
  if (user == null) {
    return null; // Optionally handle loading state or redirect
  }

  const [current, setCurrent] = useState('1');

  const handleClick = (e) => {
    setCurrent(e.key);
    if (e.key === '2') {
      navigate('/dashboard');
    }
    if (e.key === 'sub1') {
      navigate('/users');
    }
    if (e.key === 'sub2') {
      navigate('/restaurant');
    }
    if (e.key === 'sub3') {
      navigate('/delivery-partners');
    }
    if (e.key === 'logout') {
      logout();
    }

  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical my-5" />
        <div className={styles.G1}>
          <div className={styles.logo}>
            <img src={imgLogo} alt="Logo" />
          </div>
          <div>
            <div className='text-white text-lg font-bold'>Food Delivery</div>
            <div className={styles.subbrand}>Java Mobile Android</div>
          </div>
        </div>
        <hr className='mt-5 border-0' />
        <Menu theme="dark" onClick={handleClick} selectedKeys={[current]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <div className={styles.headercontainer}>
          <div></div>
          <div className={styles.G2}>
            <div className="flex justify-center items-center">
              <div className="w-9 h-9 overflow-hidden rounded-full border-2 border-gray-300">
                <img
                  src="https://imgcdn.stablediffusionweb.com/2024/11/10/9cf53bca-4ed8-4384-9b96-3d4c3ffac4ad.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className='ml-2'>
                <div className={styles.username}>{user.name || 'User'}</div> {/* Display user name */}
                <div className={styles.role}>{user.role}</div>
              </div>
            </div>
          </div>
        </div>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {/* Add breadcrumb items if needed */}
          </Breadcrumb>
          {/* <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          > */}
          <Outlet /> {/* Render child routes here */}
          {/* </div> */}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;