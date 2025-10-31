import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        const conn=await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`);
        console.log("MongoDb Connected Sucessfully!")
    }
    catch(error){
        console.error(`Error connecting MongoDb:${error}`)
        process.exit(1)
    }
}

export default connectDb;