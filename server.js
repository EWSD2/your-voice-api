import { ApolloServer } from 'apollo-server'
const jwt = require('jsonwebtoken')

// Import environment variables and Mongoose Models
require('dotenv').config()
const User = require('./src/models/User')


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
            console.error( err );
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
            context: {
                User
            }
        })

        server.listen().then(({ url }) => {
            console.log(`🚀 server running @ ${ url }`)
        })
    } catch ( err ) {
        console.error( err );
    }
})()