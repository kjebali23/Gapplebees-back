const mongoose = require('mongoose');


const connectDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.Mongo_URI , {useNewUrlParser: true})
        console.log('Connected to the DB');
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;