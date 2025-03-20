import { gql } from '@apollo/client';
import '../types';

const CREATE_TODO = gql`
    mutation CreateTodo($createTodoInput: CreateTodoInput!) {
        CreateTodo(createTodoInput: $createTodoInput) {
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

const DELETE_TODO = gql`
    mutation DeleteTodo($id: ID!) {
        DeleteTodo(id: $id)
    }
`;

const UPDATE_TODO = gql`
    mutation UpdateTodo($updateTodoInput: UpdateTodoInput!) {
        UpdateTodo(updateTodoInput: $updateTodoInput) {
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

export { CREATE_TODO, DELETE_TODO, UPDATE_TODO };
