const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const multerStorage = multer.diskStorage({
    destination:function(req,file,cb){
            cb(null,path.join(__dirname,'../public/images'))
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *1e9)
        cb(null,file.filename + "-" +uniqueSuffix + ".jpeg");
    }
})

const multerFilter = (req,file,cb) => {
    if(file.mimetype.startswith('image')){
            cb(null,type)
    }
    else {
        cb({
            message:"unsupport fule format"
        }, false)
    }
}

const uploadPhoto = multer({
    storage:multiStorage,
    fileFilter:multiFilter,
    limits :{fileSize:200000}
})

const productImgResize = async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path).resize(300,300).toFormat('jpeg')({quality:90}).toFile(`public/images/products${file.filename}`)
        }
    ),
    next()
)}

const blogImgResize = async(req,res,next)=>{
    if(!req.files) return next();
    await Promise.all(
        req.files.map(async(file)=>{
            await sharp(file.path).resize(300,300).toFormat('jpeg')({quality:90}).toFile(`public/images/blog${file.filename}`)
        }
    ),
    next()
)}


module.exports = {uploadPhoto,productImgResize,blogImgResize};