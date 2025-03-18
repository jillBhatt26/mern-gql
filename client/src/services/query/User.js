import { gql } from '@apollo/client';
import '../types';

const FETCH_ACTIVE_USER = gql`
    query FetchActiveUser {
        FetchActiveUser {
            _id
            username
            email
            todos {
                id
                name
                description
                status
            }
        }
    }
`;

export { FETCH_ACTIVE_USER };
