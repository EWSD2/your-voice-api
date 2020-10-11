const mongoose = require('mongoose')

const AcademicYearSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    submissionClose: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: "closed"
    }
})

module.exports = mongoose.model('AcademicYear', AcademicYearSchema)
