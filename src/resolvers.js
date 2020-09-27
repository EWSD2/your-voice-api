const jwt = require('jsonwebtoken')

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
        MANAGER: 'manager',
        STUDENT: 'student'
    },

    YearStatus: {
        OPEN: 'open',
        CLOSED: 'closed'
    },

    Faculty: {
        ADMIN: 'admin',
        COMPSCI: 'compsci',
        HUMANITIES: 'humanities',
        MATHEMATICS: 'math'
    },

    Query: {
        hello: () => "AND SO IT BEGINS!!!"
    },

    Mutation: {
        createUser: async ( _, { username, email, password, role, faculty }, { User } ) => {
            const user = await User.findOne({ username: username })

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
        }
    }
}
