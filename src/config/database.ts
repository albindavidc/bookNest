import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
    try{
        const uri = "mongodb://localhost:27017/";
        await mongoose.connect(uri, {
            ...(<any>{ useNewUrlParser: true, useUnifiedTopology: true })

        });

        console.log("connected to MongoDB Compass successfully");
    }catch(error){
        console.log("Error connecting to MongoDB Compass:", error);
        process.exit(1);
    }
}
export default connectToDatabase;