import { gql } from '@apollo/client';

const FETCH_ACTIVE_USER = gql`
    query FetchActiveUser {
        FetchActiveUser {
            _id
            username
            email
        }
    }
`;

export { FETCH_ACTIVE_USER };
