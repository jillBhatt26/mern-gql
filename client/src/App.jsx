import { ApolloProvider } from '@apollo/client';
import apolloClient from './config/apollo';
import AppRoutes from './router/Routes';

const App = () => {
    return (
        <ApolloProvider client={apolloClient}>
            <AppRoutes />
        </ApolloProvider>
    );
};

export default App;
