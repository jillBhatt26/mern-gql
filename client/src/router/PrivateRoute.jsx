import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, Navigate } from 'react-router-dom';
import LoadingPage from '../pages/Loading';
import useAuthStore from '../stores/auth';
import { FETCH_ACTIVE_USER } from '../services/query/User';

const PrivateRoute = () => {
    const [user, setUser] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);

    // hooks
    const authUser = useAuthStore(state => state.authUser);
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const { data, loading } = useQuery(FETCH_ACTIVE_USER, {
        skip: authUser !== null
    });

    // effects
    useEffect(() => {
        setIsFetchingUser(loading);
    }, [loading]);

    useEffect(() => {
        if (data && data.FetchActiveUser) {
            setUser(data.FetchActiveUser);
        }
    }, [data]);

    useEffect(() => {
        if (user) setAuthUser(user);
    }, [user, setAuthUser]);

    if (isFetchingUser || loading) return <LoadingPage />;

    if (!isFetchingUser && !user) return <Navigate to="/login" replace />;

    if (!isFetchingUser && user) return <Outlet />;
};

export default PrivateRoute;
