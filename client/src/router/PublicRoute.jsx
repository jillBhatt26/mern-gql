import { Outlet, Navigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import LoadingPage from '../pages/Loading';

const PublicRoute = ({ redirectTo = undefined }) => {
    // hooks
    const { user, isFetchingUser } = useAuthContext();

    if (isFetchingUser) return <LoadingPage />;

    return user && redirectTo ? (
        <Navigate to={redirectTo} replace />
    ) : (
        <Outlet />
    );
};

export default PublicRoute;
