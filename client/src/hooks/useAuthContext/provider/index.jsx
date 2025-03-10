import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from '../context';

const AuthContextProvider = ({ children }) => {
    // states
    const [user, setUser] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [fetchUserError, setFetchUserError] = useState(true);

    // callbacks
    const fetchAuthUserCB = useCallback(async () => {
        // TODO: Fetch auth details
        setUser(null);

        try {
            setIsFetchingUser(true);
        } catch (error) {
            setFetchUserError(error.message ?? 'Fetching user info failed!');
        } finally {
            setIsFetchingUser(false);
        }
    }, []);

    // effects
    useEffect(() => {
        fetchAuthUserCB();
    }, [fetchAuthUserCB]);

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
