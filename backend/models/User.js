const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema ({
    phone : {type: String, required: true, unique: true},
    name :{type: String}
})

module.exports = mongoose.model("Users", UserSchema);
