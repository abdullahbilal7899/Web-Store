import mongoose from "mongoose";

const connectDB= async()=>{
    try {

        await mongoose.connect(`mongodb+srv://abdullah:ab1234@projects.z6hbo.mongodb.net/Ecommerce`)
        console.log("Connection Established ")

    } catch (error) {
  console.error(`ERROR: ${error.message} `)
  process.exit(1)       
    }
}

export default connectDB