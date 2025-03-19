import { ApolloClient, InMemoryCache } from '@apollo/client';
// NOTE: Requires @types/apollo-upload-client even in js react app
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { BE_URL } from '../env';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {}
        }
    }
});

const uploadClient = new ApolloClient({
    link: createUploadLink({
        uri: BE_URL,
        credentials: 'include'
    }),
    cache: new InMemoryCache()
});

const apolloClient = new ApolloClient({
    uri: BE_URL,
    cache,
    credentials: 'include'
});

export { uploadClient, apolloClient };
