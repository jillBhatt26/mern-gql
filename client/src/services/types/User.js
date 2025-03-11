import { gql } from '@apollo/client';

gql`
    input LoginUserInputType {
        usernameOrEmail: String!
        password: String!
    }
`;
