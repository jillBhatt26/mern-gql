import { Outlet, Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import LoadingPage from '../pages/Loading';

const PrivateRoute = () => {
    // hooks
    const { user, isFetchingUser } = useAuthContext();

    if (isFetchingUser) return <LoadingPage />;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
