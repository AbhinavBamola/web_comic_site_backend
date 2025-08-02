const{Schema,model}=require('mongoose');
const bycrpt=require('bcrypt');

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:'/uploads/OIP.jpg'
    }
    
},{timestamps:true})

userSchema.pre('save',async function(next){
    try{  if(!this.isModified('password'))return next();
        const salt=10;
        const hashed=await bycrpt.hash(this.password,salt)
        this.password=hashed;
        next();}
        catch(err){console.log(err);
            next();
        }    
})

userSchema.methods.comparePasswords=async function(givenpassword) {
    return bycrpt.compare(givenpassword,this.password);
}

const userModel=model("mangaUserModel",userSchema);
module.exports=userModel;