import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import AuthContext from '../context';
import { FETCH_ACTIVE_USER } from '../../../services/query/User';

const AuthContextProvider = ({ children }) => {
    // states
    const [user, setUser] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [fetchUserError, setFetchUserError] = useState(null);

    // hooks
    const { error, data, loading } = useQuery(FETCH_ACTIVE_USER);

    // effects
    useEffect(() => {
        setIsFetchingUser(loading);
    }, [loading]);

    useEffect(() => {
        if (error) {
            const errorMessage = error.toString().split(':').pop();

            setFetchUserError(errorMessage);
        }
    }, [error]);

    useEffect(() => {
        if (data && data.FetchActiveUser) {
            setUser(data.FetchActiveUser);
        }
    }, [data]);

    const value = useMemo(() => {
        return {
            user,
            isFetchingUser,
            fetchUserError
        };
    }, [user, isFetchingUser, fetchUserError]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContextProvider;
