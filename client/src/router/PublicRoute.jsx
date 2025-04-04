import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Outlet, Navigate } from 'react-router-dom';
import LoadingPage from '../pages/Loading';
import { FETCH_ACTIVE_USER } from '../services/query/User';
import useAuthStore from '../stores/auth';
import useLoadingStore from '../stores/loading';

const PublicRoute = ({ redirectTo = undefined }) => {
    const [user, setUser] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);

    // hooks
    const authUser = useAuthStore(state => state.authUser);
    const setAuthUser = useAuthStore(state => state.setAuthUser);
    const setIsLoading = useLoadingStore(state => state.setIsLoading);
    const { data, loading } = useQuery(FETCH_ACTIVE_USER, {
        skip: authUser !== null
    });

    // effects
    useEffect(() => {
        setIsFetchingUser(loading);
    }, [loading]);

    useEffect(() => {
        if (user) setAuthUser(user);
    }, [user, setAuthUser]);

    useEffect(() => {
        if (data && data.FetchActiveUser) {
            setUser(data.FetchActiveUser);
            setIsFetchingUser(false);
        }
    }, [data]);

    useEffect(() => {
        setIsLoading(isFetchingUser || loading);

        // eslint-disable-next-line
    }, [isFetchingUser, loading]);

    if (isFetchingUser || loading) return <LoadingPage />;

    if ((user || authUser) && redirectTo)
        return <Navigate to={redirectTo} replace />;

    return <Outlet />;
};

export default PublicRoute;
