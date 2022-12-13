const express=require("express")
const app = express();
const imgSchema = require("./models/imgSchema")
const cors=require("cors")
const path = require("path")
const mongoose=require("mongoose")
const multer = require("multer");
const fs = require("fs")
const url = "mongodb://127.0.0.1:27017/fileupload"

app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', true);
mongoose.connect(url,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("DB Connected Successed");
    }
})

const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{

cb(null , "uploads")

    },
    filename:(req,file,cb)=>{
          cb(null,file.fieldname + "_"+Date.now() + path.extname(file.originalname))  
    }
})
const fileFilter = (req, file, cb) => {
    const acceptFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (acceptFileTypes.includes(file.mimetype)) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({
    storage:Storage,
    fileFilter: fileFilter
})

app.post("/",upload.single("file"),async(req,res) => {
    const newImg = await new imgSchema({
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        name:req.body.name

    });
    await newImg.save();
    res.json("Uploaded Successfully")
});

app.get("/",async(req,res)=>{
    const images = await imgSchema.find()
    res.json(images)
})

app.post("/update/:id",upload.single('file'),async(req,res)=>{
    const removeExisitingFile = await imgSchema.findById(req.params.id)
    fs.unlink(removeExisitingFile.path,((err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("file removed ");
        }

    }));
    const updates = await imgSchema.findByIdAndUpdate(req.params.id)
    updates.originalname=req.file.originalname;
    updates.mimetype=req.file.mimetype;
    updates.filename=req.file.filename;
    updates.path = req.file.path;
    updates.size = req.file.size;
    updates.name=req.body.name;

    await updates.save();
    res.json("File Updated")
})

app.delete("/delete/:id",async(req,res)=>{
    const delExFile = await imgSchema.findById(req.params.id)
    await fs.unlink(delExFile.path,((err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("removed del file");
        }
    }));
     await imgSchema.findByIdAndDelete(req.params.id)
     return res.json('Deleted')
})

app.listen(9000,(err)=>{
    if(err){
        console.log(err);
        alert("Error Occured")
    }
    else{
        console.log("Server Started On 9000" );
    }

})