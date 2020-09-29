import { gql } from 'apollo-server'

export default gql`
    enum UserRole{
        STUDENT
        ADMIN
        MANAGER
        COORDINATOR
        GUEST
        DEV
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

    type File {
        id: ID!
        filename: String!
        mimetype: String!
        path: String!
    }

    type AcademicYear{
        _id: ID
        title: String!
        startDate: String!
        endDate: String!
        submissionClose: String
        status: YearStatus
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
        getAcademicYears: [AcademicYear]
        getAcademicYearById(yearId: ID!): AcademicYear
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

        createAcademicYear(
            title: String!
            startDate: String!
            endDate: String!
            submissionClose: String
            status: String
        ): AcademicYear!

        editAcademicYearDates(
            yearId: ID!
            startDate: String!
            endDate: String!
            submissionClose: String!
        ): AcademicYear!

        editAcademicYearStatus(
            yearId: ID!
            status: String!
        ): AcademicYear!

    }
`
