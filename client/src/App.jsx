import AuthContextProvider from './hooks/useAuthContext/provider';
import AppRoutes from './router/Routes';
const App = () => {
    return (
        <AuthContextProvider>
            <AppRoutes />
        </AuthContextProvider>
    );
};

export default App;
