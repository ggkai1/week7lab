const mongoose = require('mongoose');
let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    developername: {
        firstName: {
            type: String,
            required: true
        },

        lastName: String
    },
    level: {
        type: String,
        required: true,
        validate: {
            validator: function (levelValue) {
                console.log(levelValue);
                
                if (levelValue === "BEGINNER" || levelValue === "EXPERT")
                    return true;
                else
                    return false;
            },
            message: 'Level should be Beginner or Expert'
        },
        uppercase: true
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    }
});
module.exports = mongoose.model('Developer', developerSchema);