import { ApolloProvider } from '@apollo/client';
import apolloClient from './config/apollo';
import AuthContextProvider from './hooks/useAuthContext/provider';
import AppRoutes from './router/Routes';

const App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthContextProvider>
                <AppRoutes />
            </AuthContextProvider>
        </ApolloProvider>
    );
};

export default App;
