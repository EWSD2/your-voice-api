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
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('AcademicYear', AcademicYearSchema)
