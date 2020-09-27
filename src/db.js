import mongoose from 'mongoose'
require('dotenv').config({ path: '../.env' })

export default (async function connect() {
    try {
        await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
    } catch ( err ) {
        console.error( err );
    }
})()
