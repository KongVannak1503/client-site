import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiService } from "../../components/api/CrudUse";

const RestaurantList = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]); // All restaurants
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiService.get("/restaurants");

      const restaurantIds = data.map((item) => item._id);

      // Send POST request with ids
      const countResponse = await fetch(
        "http://localhost:5000/api/restaurant/items/counts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: restaurantIds }),
        }
      );

      const countData = await countResponse.json();
      // Merge count data with restaurants
      const listWithCounts = data.map((item) => {
        // Find the count for the restaurant using the restaurantId
        const countItem = countData.counts.find(
          (count) => count.restaurantId === item._id
        );
        const count = countItem ? countItem.count : 0; // Default to 0 if not found
        return {
          ...item,
          count, // Add the count to the restaurant item
        };
      });

      setLists(listWithCounts);
      setPagination((prev) => ({ ...prev, total: listWithCounts.length }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the restaurant.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await apiService.delete(`/restaurants/${id}`);
        setLists((prevLists) => prevLists.filter((list) => list._id !== id));
        Swal.fire("Deleted!", "The restaurant has been deleted.", "success");
      } catch (err) {
        Swal.fire(
          "Error!",
          `Failed to delete the restaurant: ${err.message}`,
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

  // Paginate the filtered restaurants
  const paginatedRestaurants = filteredRestaurants.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const createHandler = () => {
    navigate("/restaurant/create");
  };

  const updateHandler = (id) => {
    navigate(`/restaurant/profile/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">List of Restaurants</h1>
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
              <th className="py-2 px-4 border-b text-start">Phone</th>
              <th className="py-2 px-4 border-b text-start">Address</th>
              <th className="py-2 px-4 border-b text-start">Count</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRestaurants.length > 0 ? (
              paginatedRestaurants.map((list, index) => (
                <tr key={list._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{list.code || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{list.name || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{list.phone || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {list.address || "N/A"}
                  </td>
                  {/* Update count column to use list.count */}
                  <td className="py-2 px-4 border-b">{list.count || 0}</td>
                  <td className="py-2 px-4  text-center  flex justify-center items-center">
                    <button
                      onClick={() => updateHandler(list._id)}
                      className="bg-gray-200 mx-1 shadow-sm hover:shadow-md transition-shadow text-black hover:text-white hover:bg-gray-300 focus:outline-none rounded-full w-[25px] h-[25px]"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => deleteHandler(list._id)}
                      className="bg-gray-200 mx-1 shadow-sm hover:shadow-md transition-shadow text-black hover:text-white hover:bg-gray-300 focus:outline-none rounded-full w-[25px] h-[25px]"
                    >
                      <DeleteOutlined />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-2">
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
          total={filteredRestaurants.length}
          onChange={handlePageChange}
          showSizeChanger
        />
      </div>
    </>
  );
};

export default RestaurantList;
