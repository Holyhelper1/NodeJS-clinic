const mongoose = require('mongoose');

const applicationFormSchema = mongoose.Schema({
    creation_date: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    symptom: {
        type: String,
        required: true
    }
});

const applicationForm = mongoose.model('application_form', applicationFormSchema)

module.exports = applicationForm;