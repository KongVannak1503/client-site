import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useParams, useLocation } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL
  const location = useLocation();

  // Define your items with dynamic paths
  const items: MenuItem[] = [
    {
      key: "sub1",
      type: "group",
      children: [
        { key: "1", label: "Profile", path: `/restaurant/profile/${id}` },
        { key: "2", label: "Items", path: `/restaurant/menu-items/${id}` },
      ],
    },
  ];

  // Determine the currently active key based on the current path
  const selectedKey = items
    .flatMap((item) => item.children)
    .find((child) => child.path === location.pathname)?.key;

  const handleClick = (e: { key: string }) => {
    const selectedItem = items
      .flatMap((item) => item.children)
      .find((child) => child.key === e.key);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };

  return (
    <Menu
      className="py-6 px-4"
      onClick={handleClick}
      selectedKeys={[selectedKey]} // Set the active key here
      defaultOpenKeys={["sub1"]}
      mode="inline"
      style={{ width: "100%", maxWidth: 256 }} // Make sure it is contained
      items={items}
    />
  );
};

export default Nav;
