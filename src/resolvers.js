const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { createWriteStream, mkdir } = require('fs')

/**
 * Generate a JWT that contains the username and email of the currently logged
 * in user
 */
const createToken = ( user, secret, expiresIn ) => {
    const { username, email } = user
    return jwt.sign(
        { username, email },
        secret,
        { expiresIn }
    )
}

const processUpload = async ( upload, username ) => {
    const { createReadStream, filename, mimetype } = await upload
    const stream = createReadStream()
    const file = await storeUpload({ stream, filename, mimetype }, username)

    return file
}

const storeUpload = async ( { stream, filename, mimetype }, username ) => {
    const path = `submissions/${ username }/${ filename }`
    // Write the file to the specified path
    return new Promise(( resolve, reject ) => {
        stream.pipe( createWriteStream( path ) )
        .on( 'finish', () => resolve({ path, filename, mimetype }) )
        .on( 'error', reject )
    })
}

module.exports = {
    UserRole: {
        ADMIN: 'admin',
        COORDINATOR: 'coordinator',
        DEV: 'developer',
        GUEST: 'guest',
        MANAGER: 'manager',
        STUDENT: 'student'
    },

    YearStatus: {
        CLOSED: 'closed',
        OPEN: 'open'
    },

    Faculty: {
        ADMIN: 'admin',
        COMPSCI: 'compsci',
        HUMANITIES: 'humanities',
        MATHEMATICS: 'math'
    },

    Query: {
        getCurrentUser: async ( _, args, { User, currentUser } ) => {
            if ( !currentUser ) {
                return null
            }

            const user = await User.findOne({ username: currentUser.username })

            return user
        },

        getUser: async ( _, { userId }, { User } ) => {
            const user = await User.findOne({ _id: userId })

            if ( !user ) {
                throw new Error( 'User not found' )
            }

            return user
        },

        getFacultyCoordinator: async ( _, { faculty }, { User } ) => {
            const user = await User.findOne({
                faculty,
                role: "coordinator"
            })

            return user
        },

        getFacultyStudents: async ( _, { faculty }, { User } ) => {
            const students = await User.find({ role: 'student', faculty: faculty })

            return students
        },

        getAcademicYears: async ( _, args, { AcademicYear } ) => {
            const years = await AcademicYear.find({}).sort({ startDate: 'desc' })

            return years
        },

        getAcademicYear: async ( _, { yearId }, { AcademicYear } ) => {
            const year = await AcademicYear.findOne({ _id: yearId })

            return year
        },

        getOpenAcademicYears: async ( _, args, { AcademicYear } ) => {
            const years = await AcademicYear.find({ status: 'open' })

            return years
        },

        getArticle: async ( _, { articleId }, { Article } ) => {
            const article = await Article.findOne({
                _id: articleId
            }).populate(
                'submittedBy academicYear messages.messageUser'
            )

            return article
        },

        getUserArticles: async ( _, { userId }, { Article } ) => {
            const articles = await Article.find({ submittedBy: userId })
            .populate(
                'submittedBy academicYear messages.messageUser'
            )

            return articles
        },

        getFacultyArticles: async ( _, { faculty }, { Article } ) => {
            const articles = await Article.find({ faculty })
            .populate(
                'submittedBy academicYear messages.messageUser'
            )

            return articles
        },

        getPublicationSelections: async ( _, args, { Article } ) => {
            const articles = await Article.find({
                toBePublished: true
            }).populate(
                'submittedBy academicYear messages.messageUser'
            )

            return articles
        }
    },

    Mutation: {
        createUser: async ( _, { username, email, password, role, faculty }, { User } ) => {
            const user = await User.findOne({ username })

            if ( user ) {
                throw new Error('User already exists')
            }

            const newUser = await new User({
                username,
                email,
                password,
                role,
                faculty
            }).save()

            return {
                token: createToken( newUser, process.env.SECRET, '3hr' )
            }
        },

        signinUser: async ( _, { username, password }, { User } ) => {
            const user = await User.findOne({ username })

            if ( !user ) {
                throw new Error( 'User not found.' )
            }

            const isValidPassword = await bcrypt.compare( password, user.password )

            if ( !isValidPassword ) {
                throw new Error( 'Invalid password.' )
            }

            return {
                token: createToken( user, process.env.SECRET, '3hr' )
            }
        },

        updateUser: async ( _, { userId, firstName, lastName, faculty }, { User } ) => {
            const user = await User.findOneAndUpdate(
                // Find user by _id
                { _id: userId },
                {
                    // Update the found user with the specified details
                    $set: {
                        firstName,
                        lastName,
                        faculty
                    }
                },
                {
                    // Instruct Mongoose to return the document after the update
                    new: true
                }
            )

            return user
        },

        createAcademicYear: async ( _, args, { AcademicYear } ) => {
            let year = {
                title: args.title,
                startDate: args.startDate,
                endDate: args.endDate
            }

            if ( args.submissionClose ) {
                year.submissionClose = args.submissionClose
            }

            if ( args.status ) {
                year.status = args.status
            }

            const newYear = await new AcademicYear( year ).save()

            return newYear

        },

        editAcademicYearDates: async ( _, { yearId, startDate, endDate, submissionClose }, { AcademicYear } ) => {
            const year = await AcademicYear.findOneAndUpdate(
                // Find year by yearId
                { _id: yearId },
                // Update year with new info
                {
                    $set: {
                        startDate,
                        endDate,
                        submissionClose
                    }
                },
                // Capture the updated document
                { new: true }
            )

            return year
        },

        editAcademicYearStatus: async ( _, { yearId, status }, { AcademicYear } ) => {
            const year = await AcademicYear.findOneAndUpdate(
                // Find year by yearId
                { _id: yearId },
                // Update the year status
                {
                    $set: {
                        status
                    }
                },
                // Capture the updated document
                { new: true }
            )

            return year
        },

        createArticle: async ( _, { title, userId, createdDate, yearId, faculty, article, picture }, { Article } ) => {
            let newArticle = {
                title,
                submittedBy: userId,
                createdDate,
                academicYear: yearId,
                faculty,
                article: article
            }

            if ( picture ) {
                newArticle.picture = picture
            }

            const newSubmission = await new Article(newArticle).save()

            return newSubmission
        },

        submitArticle: async (_, { articleId }, { Article }) => {
            const article = await Article.findOneAndUpdate(
                // Find Submission by submissionId
                { _id: articleId },
                // Update the Submission status
                {
                    $set: {
                        isSubmitted: true
                    }
                },
                // Capture the updated document
                { new: true }
            )

            return article
        }
    }
}
