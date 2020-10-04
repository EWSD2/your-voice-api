const { ApolloServer, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

// Import environment variables and Mongoose Models
require('dotenv').config()
const User = require( './src/models/User' )
const AcademicYear = require( './src/models/AcademicYear' )
const File = require( './src/models/File' )
const Submission = require('./src/models/Submission')

const mongoose = require('mongoose');

// Import typeDefs and resolvers
const typeDefs = require('./src/typeDefs')
const resolvers = require('./src/resolvers')

// Verify client-side JWT Token
const getUser = async ( token ) => {
    if ( token ) {
        try {
            return await jwt.verify( token, process.env.SECRET )
        } catch ( err ) {
            throw new AuthenticationError( 'Your session has ended. Please sign in again' )
        }
    }
}

function getToken(header) {
    let token = null
    if (header) {
        token = header.slice(7)
    }

    return token
}

mongoose.connect(
    process.env.MONGO_URI,
    {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
)
.then( () => console.log( 'Connected 🚀 To MongoDB Successfully' ))

const server = new ApolloServer({
    cors: {
        origin: true,
        credentials: true
    },
    typeDefs,
    resolvers,
    formatError: err => ({
        name: err.name,
        message: err.message.replace( 'Context creation failed:', '' )
    }),
    context: async ({ req }) => {
        const token = getToken(req.headers[ 'authorization' ])
        return {
            User,
            AcademicYear,
            File,
            Submission,
            currentUser: await getUser( token )
        }
    }
})

server.listen()
.then(({ url }) => { console.log( `🚀 server running @ ${ url }` )})
.catch ( err => { console.error( err ) })

