import { gql } from '@apollo/client';

gql`
    type ImageType {
        _id: ID!
        cloudImageID: ID!
        filename: String!
        mimetype: String!
        encoding: String!
        cloudImageName: String!
    }

    input CreateTodoInput {
        name: String!
        description: String!
        status: EnumTodoStatus! = PENDING
    }

    enum EnumTodoStatus {
        PENDING
        PROGRESS
        COMPLETE
    }

    type Todo {
        id: ID!
        name: String!
        description: String!
        status: EnumTodoStatus
        user: TodoUserInfo!
    }

    type TodoUserInfo {
        _id: ID!
        username: String!
        email: String!
    }

    input UpdateTodoInput {
        id: ID!
        name: String
        description: String
        status: EnumTodoStatus
    }

    input LoginUserInputType {
        usernameOrEmail: String!
        password: String!
    }

    input SignupUserInputType {
        username: String!
        email: String!
        password: String!
    }

    input UpdateUserInputType {
        username: String
        email: String
        password: String
    }

    type UserInfoType {
        _id: String!
        username: String!
        email: String!
        todos: [Todo]!
    }

    type UserType {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        hello: String!
        todos: [Todo]!
        todo(id: ID!): Todo
        FetchActiveUser: UserInfoType
        FetchUserImagesQuery: [ImagesURLInfo]!
        FetchUserImage(fetchImageInput: FetchImageInput!): ImagesURLInfo
    }

    type ImagesURLInfo {
        _id: ID!
        cloudImageName: String!
        cloudImageID: ID!
        url: String!
    }

    input FetchImageInput {
        cloudImageID: ID!
        cloudImageName: String!
    }

    type Mutation {
        CreateTodo(createTodoInput: CreateTodoInput!): Todo!
        UpdateTodo(updateTodoInput: UpdateTodoInput!): Todo
        DeleteTodo(id: ID!): Boolean!
        UploadImage(image: Upload): ImageType
        DeleteImage(deleteImageInput: DeleteImageInput!): Boolean!
        LoginUser(loginUserInput: LoginUserInputType!): UserInfoType
        LogoutUser: Boolean
        SignupUser(signupUserInput: SignupUserInputType!): UserInfoType
        UpdateUser(updateUserInput: UpdateUserInputType!): UserInfoType
        DeleteUser: Boolean!
    }

    scalar Upload

    input DeleteImageInput {
        cloudImageID: ID!
        cloudImageName: String!
    }
`;
