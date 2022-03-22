const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
        // Uid: String ,
        Email: String,
        Password : String,
        UserName: String,
        Country: String,
        Images:[String],
        CarManufacturer: String,
        CarModel: String,
        CarProductionYear: String,
        Likes:[String],
        Matchs:[String],
        Notinterested:[String],
}, { timestamps: true });
const Userdb = mongoose.model('user' , UserSchema  );
module.exports = Userdb;