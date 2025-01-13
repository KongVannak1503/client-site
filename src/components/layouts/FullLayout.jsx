import React, { useEffect, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  HeartOutlined,
  PieChartOutlined,
  ShopFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom'; // Import Outlet for rendering child routes
import { getIsLogin, getUser, logout } from '../../utils/services';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies
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

const FullLayout = () => {
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
  const [cartCount, setCartCount] = useState(0); // Track the count of products in the cart

  useEffect(() => {
    // Retrieve cart data from cookie and update the cart count
    const savedCart = Cookies.get('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        setCartCount(cartItems.length); // Set cart count based on number of items in the cart
      } catch (error) {
        console.error('Error parsing cart from cookies:', error);
        setCartCount(0); // If there is an error parsing the cart, reset the count
      }
    }
  }, []); // Re-run when the component is mounted

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

  const goShopping = () => {
    navigate('/shopping');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <div className="shadow-lg">
          <div className={styles.headercontainer}>
            <div></div>
            <div className={styles.G2}>
              <button
                onClick={goShopping}
                className="w-[35px] h-[35px] flex justify-center items-center rounded-full text-lg mx-2 hover:bg-gray-200 transition duration-300"
              >
                <HeartOutlined />
                {/* Display the cart count if it's greater than 0 */}
                {cartCount > 0 && (
                  <span className="absolute top-0 ml-5 text-xs text-red-500 bg-white rounded-full w-5 h-5 flex justify-center items-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <div className="flex justify-center items-center">
                <div className="w-9 h-9 overflow-hidden rounded-full border-2 border-gray-300">
                  <img
                    src="https://imgcdn.stablediffusionweb.com/2024/11/10/9cf53bca-4ed8-4384-9b96-3d4c3ffac4ad.jpg"
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-2">
                  <div className={styles.username}>{user.name || 'User'}</div>
                  <div className={styles.role}>{user.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}></Breadcrumb>
          <Outlet /> {/* Render child routes here */}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default FullLayout;
