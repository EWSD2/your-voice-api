const mongoose = require('mongoose')

const AcademicYearSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    submissionClose: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        default: "closed"
    }
})

module.exports = mongoose.model('AcademicYear', AcademicYearSchema)
