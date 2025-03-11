import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, Navigate } from 'react-router-dom';
import LoadingPage from '../pages/Loading';
import { FETCH_ACTIVE_USER } from '../services/query/User';

const PrivateRoute = () => {
    const [user, setUser] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);

    // hooks
    const { data, loading } = useQuery(FETCH_ACTIVE_USER);

    // effects
    useEffect(() => {
        setIsFetchingUser(loading);
    }, [loading]);

    useEffect(() => {
        if (data && data.FetchActiveUser) {
            setUser(data.FetchActiveUser);
        }
    }, [data]);

    if (isFetchingUser || loading) return <LoadingPage />;

    if (!isFetchingUser && !user) return <Navigate to="/login" replace />;

    if (!isFetchingUser && user) return <Outlet />;
};

export default PrivateRoute;
