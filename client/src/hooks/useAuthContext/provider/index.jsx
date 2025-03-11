import { useMemo, useState } from 'react';
import AuthContext from '../context';

const AuthContextProvider = ({ children }) => {
    // states
    const [user, setUser] = useState(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);
    const [fetchUserError, setFetchUserError] = useState(null);

    const value = useMemo(() => {
        return {
            user,
            setUser,
            isFetchingUser,
            setIsFetchingUser,
            fetchUserError,
            setFetchUserError
        };
    }, [user, isFetchingUser, fetchUserError]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContextProvider;
