const mongoose=require("mongoose")

const imgSchema = new mongoose.Schema({
   
    originalname: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    name: {
        type: String
    }
});

module.exports=mongoose.model("imageModel",imgSchema)