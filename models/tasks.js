const mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    assignto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    due: Date,
    status: String,
    description: String
});
module.exports = mongoose.model('Task', taskSchema);