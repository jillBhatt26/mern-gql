import { useContext } from 'react';
import AuthContext from './context';

const useAuthContext = () => {
    const authContextValues = useContext(AuthContext);

    if (!authContextValues) {
        throw new Error('Auth context should be used inside a provider only!');
    }

    return authContextValues;
};

export default useAuthContext;
