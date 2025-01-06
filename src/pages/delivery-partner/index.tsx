import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiService } from '../../components/api/CrudUse';

const DeliveryList = () => {
    const navigate = useNavigate();
    const [lists, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Declare searchQuery state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchLists = async () => {
        try {
            const data = await apiService.get('/delivery-partners');
            setList(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        // Show a confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the restaurant.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
        });

        // If the user confirms, proceed with the deletion
        if (result.isConfirmed) {
            try {
                await apiService.delete(`/delivery-partners/${id}`);
                setList((prevRestaurants) =>
                    prevRestaurants.filter((list) => list._id !== id)
                );
                // Show a success message
                Swal.fire(
                    'Deleted!',
                    'The restaurant has been deleted.',
                    'success'
                );
            } catch (err) {
                // Show an error message if the deletion fails
                Swal.fire(
                    'Error!',
                    `Failed to delete the restaurant: ${err.message}`,
                    'error'
                );
            }
        }
    };
    useEffect(() => {
        fetchLists();
    }, []);

    // Filter restaurants based on search query
    const filteredRestaurants = lists.filter(list => {
        const role = list.role || ''; // Default to empty string if undefined
        const name = list.name || '';
        return role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handlePageChange = (page, pageSize) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize,
        });
    };

    const createHandler = () => {
        navigate('/delivery-partner/create');
    };

    const updateHandler = (id) => {
        navigate(`/delivery-partner/update/${id}`);
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1 className="text-2xl font-bold mb-8">List of Restaurants</h1>
            <div className='mb-8'>
                <div className="flex">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by code or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
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
                            <th className="py-2 px-4 border-b text-start">Name</th>
                            <th className="py-2 px-4 border-b text-start">Phone</th>
                            <th className="py-2 px-4 border-b text-start">Address</th>
                            <th className="py-2 px-4 border-b text-center">Status</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((list, index) => (
                                <tr key={index._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{list.name}</td>
                                    <td className="py-2 px-4 border-b">{list.phone_number}</td>
                                    <td className="py-2 px-4 border-b">{list.address}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {list.available ? (
                                            <span className="text-white font-bold bg-green-500 px-2 rounded">Active</span>
                                        ) : (
                                            <span className="text-white bg-yellow-500 font-bold px-2 rounded">Inactive</span>
                                        )}
                                    </td>

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
                                <td colSpan="5" className="text-center py-2">No restaurants found.</td>
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
        </>
    );
};

export default DeliveryList;
