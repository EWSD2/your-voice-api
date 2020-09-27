const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const md5 = require('md5')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    }
})

// Generate avatar and add it to User
UserSchema.pre( 'save', function( next ) {
    this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`
    next()
})

// Hash User password
UserSchema.pre( 'save', function( next ) {
    if ( !this.isModified( 'password' ) ){
        return next()
    }

    bcrypt.genSalt(10, ( err, salt ) => {
        if ( err ) return next( err )

        bcrypt.hash( this.password, salt, ( err, hash ) => {
            if ( err ) return next( err )

            this.password = hash
            next()
        })
    })
})

module.exports = mongoose.model('User', UserSchema)
