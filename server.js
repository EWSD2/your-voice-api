import { ApolloServer } from 'apollo-server'

const mongoose = require('mongoose');

require('dotenv').config()
// Import typeDefs and resolvers
import typeDefs from './src/typeDefs'
import resolvers from './src/resolvers'

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
            resolvers
        })

        server.listen().then(({ url }) => {
            console.log(`🚀 server running @ ${ url }`)
        })
    } catch ( err ) {
        console.error( err );
    }
})()