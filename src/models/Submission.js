const mongoose = require('mongoose')

const SubmissionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate: {
        type: Date
    },
    editDate: {
        type: Date,
    },
    toBePublished: {
        type: Boolean,
        default: false
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: true
    },
    article: {
        filename: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        }
    },
    picture: {
        filename: {
            type: String
        },
        mimetype: {
            type: String
        },
        path: {
            type: String
        }
    },
    faculty: {
        type: String,
        required: true
    },
    messages: [{
        messageBody: {
            type: String,
            required: true
        },
        messageDate: {
            type: Date,
            default: Date.now
        },
        messageUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})

module.exports = mongoose.model('Submission', SubmissionSchema)