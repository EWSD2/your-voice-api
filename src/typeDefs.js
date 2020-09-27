import { gql } from 'apollo-server'

export default gql`
    enum UserRole{
        STUDENT
        ADMIN
        MANAGER
        COORDINATOR
        GUEST
    }

    enum Faculty{
        HUMANITIES
        MATHEMATICS
        COMPSCI
        ADMIN
    }

    enum YearStatus{
        CLOSED
        OPEN
    }

    type Token{
        token: String!
    }

    type User{
        _id: ID
        firstName: String
        lastName: String
        username: String!
        email: String!
        password: String!
        avatar: String
        role: UserRole!
        faculty: Faculty!
    }

    type Query {
        hello: String!
        getCurrentUser: User
        getUserById(userId: ID!): User
        getFacultyStudents(faculty: String!): [User]
    }
    type Mutation {
        createUser(
            username: String!,
            email: String!,
            password: String!,
            role: String!,
            faculty: String!
        ): Token

        updateUser(
            userId: ID!
            firstName: String,
            lastName: String,
            faculty: String
        ): User

        signinUser(
            username: String!,
            password: String!
        ): Token
    }
`
