import { ApolloServer } from 'apollo-server'

// Import typeDefs and resolvers
import typeDefs from './typeDefs'
import resolvers from './resolvers'

// Import database config
import connect from './db'

export default (async function () {
    try {
        await connect.then( () => {
            console.log("Connected 🚀 To MongoDB Successfully");
        })

        const server = new ApolloServer({
            typeDefs,
            resolvers
        })

        server.listen().then(({ url }) => {
            console.log(`🚀 server running @ ${url}`)
        })

    } catch ( err ) {
        console.error( err );
    }
})()