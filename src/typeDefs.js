const { gql } = require('apollo-server')

module.exports = gql`
    enum UserRole {
        STUDENT
        ADMIN
        MANAGER
        COORDINATOR
        GUEST
        DEV
    }

    enum Faculty {
        HUMANITIES
        MATHEMATICS
        COMPSCI
        ADMIN
    }

    enum YearStatus {
        CLOSED
        OPEN
    }

    type Token {
        token: String!
    }

    type SubmissionMessage {
        _id: ID
        messageBody: String!
        messageDate: String
        messageUser: User!
    }

    type File {
        _id: ID
        filename: String!
        mimetype: String!
        path: String!
    }

    type AcademicYear {
        _id: ID
        title: String!
        startDate: String!
        endDate: String!
        submissionClose: String
        status: YearStatus
    }

    type User {
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

    type Submission {
        _id: ID
        title: String!
        submittedBy: User!
        createdDate: String!
        editDate: String
        toBePublished: Boolean
        isSubmitted: Boolean
        academicYear: AcademicYear!
        faculty: Faculty!
        article: File!
        picture: File
        messages: [SubmissionMessage]
    }

    type Query {
        getCurrentUser: User
        getUser(userId: ID!): User
        getFacultyStudents(faculty: String!): [User]
        getAcademicYears: [AcademicYear]
        getAcademicYear(yearId: ID!): AcademicYear
        getOpenAcademicYears: [AcademicYear]
        getSubmission(submissionId: ID!): Submission
        getUserSubmissions(userId: ID!): [Submission]
        getFacultySubmissions(faculty: String!): [Submission]
        getPublicationSelections: [Submission]
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
        ): User!

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

        makeSubmission(
            title: String!
            userId: ID!
            username: String!
            createdDate: String!
            yearId: ID!
            faculty: String!
            article: Upload!
            picture: Upload
        ): Submission

    }
`
