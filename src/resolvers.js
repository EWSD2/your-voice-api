const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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

export default {
    UserRole: {
        ADMIN: 'admin',
        COORDINATOR: 'coordinator',
        DEV: 'developer',
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
        hello: () => "AND SO IT BEGINS!!!",

        getCurrentUser: async ( _, args, { User, currentUser } ) => {
            if ( !currentUser ) {
                return null
            }

            const user = await User.findOne({ username: currentUser.username })

            return user
        },

        getUserById: async ( _, { userId }, { User } ) => {
            const user = await User.findOne({ _id: userId })

            if ( !user ) {
                throw new Error( 'User not found' )
            }

            return user
        },

        getFacultyStudents: async ( _, { faculty }, { User } ) => {
            const students = User.find({ role: 'student', faculty: faculty })

            return students
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
        }
    }
}
