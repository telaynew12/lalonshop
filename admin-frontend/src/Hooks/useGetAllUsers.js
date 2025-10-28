/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../App";
import { toggleGlobalLoading } from "../components/Modal/components/GlobalLoading/GlobalLoading";

const useGetAllUsers = (search) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    let searchQuery = ''
    if (search) {
        searchQuery += `&search=${search}`;
    }

    const loadData = (skip) => {
        return new Promise((resolve, reject) => {
            resolve(fetch(`${BACKEND_URL}/api/v1/user/get-all-user?skip=${skip}${searchQuery}`, {
                headers: {
                    'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
                },
            }))
        });
    }

    const loadMore = () => {
        setLoading(true);
        loadData(users.length)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUsers([...users, ...data.users]);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        ('open')
        loadData(0)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search]);

    return [users, setUsers, loading, totalUsers, setTotalUsers, loadMore];
}

export default useGetAllUsers;