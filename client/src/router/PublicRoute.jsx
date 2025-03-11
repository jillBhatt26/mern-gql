import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, Navigate } from 'react-router-dom';
import LoadingPage from '../pages/Loading';
import { FETCH_ACTIVE_USER } from '../services/query/User';

const PublicRoute = ({ redirectTo = undefined }) => {
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
            setIsFetchingUser(false);
        }
    }, [data]);

    if (isFetchingUser || loading) return <LoadingPage />;

    if (user && redirectTo) return <Navigate to={redirectTo} replace />;

    return <Outlet />;
};

export default PublicRoute;
