import { gql } from '@apollo/client';
import '../types';

const FETCH_USER_TODOS = gql`
    query FetchUserTodos {
        todos {
            description
            id
            name
            status
            user {
                _id
                email
                username
            }
        }
    }
`;

const FETCH_TODO = gql`
    query FetchTodo($id: ID!) {
        todo(id: $id) {
            description
            id
            name
            status
            user {
                _id
                email
                username
            }
        }
    }
`;

export { FETCH_TODO, FETCH_USER_TODOS };
