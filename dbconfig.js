const mongo= require('mongoose');
const dotenv= require("dotenv").config();
dbConnect= async ()=>{
    try {
         await mongo.connect(process.env.CONNECTION_STRING);
        console.log("Database connected")
    }
    catch (error) {
        console.log("Error while connecting DB "+error);
        process.exit(1);
    }
};
   
module.exports=dbConnect;