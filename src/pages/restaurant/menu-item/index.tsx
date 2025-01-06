import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiService } from "../../../components/api/CrudUse";
import Nav from "../_nav";
import { formatDate } from "../../../components/FormatDate";

const MenuItemsList = () => {
  const navigate = useNavigate();
  const [lists, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { id } = useParams();

  const fetchLists = async () => {
    try {
      const data = await apiService.get(`/restaurant/items/${id}`);
      setList(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (valueId) => {
    // Show a confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the menu item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    // If the user confirms, proceed with the deletion
    if (result.isConfirmed) {
      try {
        await apiService.delete(`/restaurant/items/delete/${valueId}`);
        setList(
          (prevItems) => prevItems.filter((item) => item._id !== valueId) // Use valueId here
        );
        // Show a success message
        Swal.fire("Deleted!", "The menu item has been deleted.", "success");
      } catch (err) {
        // Show an error message if the deletion fails
        Swal.fire(
          "Error!",
          `Failed to delete the menu item: ${err.message}`,
          "error"
        );
      }
    }
  };
  useEffect(() => {
    fetchLists();
  }, []);

  // Filter restaurants based on search query
  const filteredRestaurants = lists.filter((list) => {
    const code = list.code || "";
    const name = list.name || "";
    return (
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePageChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  const createHandler = () => {
    navigate(`/restaurant/menu-item/create/${id}`);
  };

  const updateHandler = (itemId) => {
    navigate(`/restaurant/menu-item/update/${id}/${itemId}`); // Use id as restaurantId
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">List of Restaurants</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1">
          <Nav />
        </div>

        <div className="col-span-3">
          <div className="mb-8">
            <div className="flex">
              <input
                type="text"
                name="search"
                placeholder="Search by code or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Button
                type="link"
                className="bg-yellow-500 mx-3 hover:bg-yellow-600 text-white rounded-lg"
                size="large"
                icon={<PlusOutlined />}
                onClick={createHandler}
              >
                Add New
              </Button>
            </div>
          </div>
          <div className="rounded overflow-hidden shadow-lg bg-white p-8">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-start">No</th>
                  <th className="py-2 px-4 border-b text-start">Code</th>
                  <th className="py-2 px-4 border-b text-start">Name</th>
                  <th className="py-2 px-4 border-b text-start">Price</th>
                  <th className="py-2 px-4 border-b text-start">Created At</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((list, index) => (
                    <tr key={index._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{list.code}</td>
                      <td className="py-2 px-4 border-b">{list.name}</td>
                      <td className="py-2 px-4 border-b">{list.price}</td>
                      <td className="py-2 px-4 border-b">
                        {formatDate(list.createdAt)}
                      </td>{" "}
                      {/* Format the date here */}
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => updateHandler(list._id)} // Implement your update handler
                          className="bg-gray-200 mx-1 shadow-sm hover:shadow-sm transition-shadow text-black hover:text-white hover:bg-gray-300 focus:outline-none rounded-full w-[25px] h-[25px]"
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() => deleteHandler(list._id)}
                          className="bg-gray-200 mx-1 shadow-sm hover:shadow-sm transition-shadow text-black hover:text-white hover:bg-gray-300 focus:outline-none rounded-full w-[25px] h-[25px]"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-2">
                      No restaurants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <hr className="border-0 mt-5" />
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              onShowSizeChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuItemsList;
