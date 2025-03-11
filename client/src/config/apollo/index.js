import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BE_URL } from '../env';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {}
        }
    }
});

const apolloCLient = new ApolloClient({
    uri: BE_URL,
    cache,
    credentials: 'include'
});

export default apolloCLient;
