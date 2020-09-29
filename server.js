import { ApolloServer, AuthenticationError } from 'apollo-server'
const jwt = require('jsonwebtoken')

// Import environment variables and Mongoose Models
require('dotenv').config()
const User = require('./src/models/User')
const AcademicYear = require('./src/models/AcademicYear')

const mongoose = require('mongoose');

// Import typeDefs and resolvers
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'

// Verify client-side JWT Token
const getUser = async ( token ) => {
    if ( token ) {
        try {
            return await jwt.verify( token, process.env.SECRET )
        } catch ( err ) {
            throw new AuthenticationError('Your session has ended. Please sign in again')
        }
    }
}

export default (async function() {
    try {
        await mongoose.connect(
            process.env.MONGO_URI,
            {
                useCreateIndex: true,
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        )
        .then(() => console.log("Connected 🚀 To MongoDB Successfully"))

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            formatError: err => ({
                name: err.name,
                message: err.message.replace('Context creation failed:', '')
            }),
            context: async ({ req }) => {
                const token = req.headers['authorization']
                return {
                    User,
                    AcademicYear,
                    currentUser: await getUser( token )
                }
            }
        })

        server.listen().then(({ url }) => {
            console.log(`🚀 server running @ ${ url }`)
        })
    } catch ( err ) {
        console.error( err );
    }
})()