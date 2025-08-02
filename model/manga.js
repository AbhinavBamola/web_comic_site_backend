const {Schema,model}=require('mongoose');
const mangaSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    coverImage:{
        type:String,
        default:'/uploads/download.jpeg'
    },
    createBy:{
        type:Schema.Types.ObjectId,
        ref:"mangaUserModel",
    },
    mangaChapters:[{
        type:String,
    }]
},{timestamps:true});

const mangamodel=model("my_manga_model",mangaSchema);

module.exports=mangamodel;

