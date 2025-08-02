const express=require('express');
const router=express.Router();
const usermodel=require('../model/user.js');
const {providetoken}=require('../service/authorization.js');
const upload=require('../model/fileuploader.js')

// router.get('/signin',(req,res)=>{
//     res.render('Login')
// })

// router.get('/signup',(req,res)=>{
//     res.render('Signup')
// })


router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const user=await usermodel.findOne({email});
    if(!await user.comparePasswords(password)){
        return res.json({error:"Wrong password"})
    }
    const token=await providetoken(user);
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,         // only false in local dev
  sameSite: "lax"        // lax works for most dev cases
});

    res.json({success:true});
    // res.redirect('/');
})

router.post('/signup',upload.single("profilephoto"),async(req,res)=>{
    const {name,email,password}=req.body;
    const identical=await usermodel.findOne({email});
    if(identical){
        return res.status(400).json({message:'Email already exists'});
    }
    const profileImage= req.file ? '/' + req.file.path.replace(/\\/g, '/') : '/uploads/OIP.jpg'; // normalize slashes
    const user=await usermodel.create({name,email,password,profileImage});
    const token=await providetoken(user);
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,         // only false in local dev
  sameSite: "lax"        // lax works for most dev cases
}
);

     res.status(201).json({ success: true }); 
})

router.post('/logout',(req,res)=>{
  res.clearCookie("token",{
    httpOnly: true,
    sameSite: 'lax',   // match with your login cookie settings
    secure: false      // set to true if using HTTPS
  });
  res.json({success:true});
})
module.exports=router;