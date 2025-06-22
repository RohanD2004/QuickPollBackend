const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String
    },

},
    {
        timestamps: true,
    });


module.exports = mongoose.model("User", user_schema);