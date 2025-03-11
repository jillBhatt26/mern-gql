import { gql } from '@apollo/client';
import '../types/User';

const LOGIN_USER = gql`
    mutation LoginUser($loginUserInput: LoginUserInputType!) {
        LoginUser(loginUserInput: $loginUserInput) {
            _id
            username
            email
        }
    }
`;

const LOGOUT_USER = gql`
    mutation LogoutUser {
        LogoutUser
    }
`;

const SIGNUP_USER = gql`
    mutation SignupUser($signupUserInput: SignupUserInputType!) {
        SignupUser(signupUserInput: $signupUserInput) {
            _id
            username
            email
        }
    }
`;

const UPDATE_USER = gql`
    mutation UpdateUser($updateUserInputs: UpdateUserInputType!) {
        UpdateUser(updateUserInput: $updateUserInputs) {
            _id
            username
            email
        }
    }
`;

const DELETE_USER = gql`
    mutation DeleteUser {
        DeleteUser
    }
`;

export { LOGIN_USER, LOGOUT_USER, SIGNUP_USER, UPDATE_USER, DELETE_USER };
