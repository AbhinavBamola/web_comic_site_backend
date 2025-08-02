const express=require('express');
const path=require('path');
const cookieparser=require('cookie-parser');
const mongoose=require('mongoose');
const cors=require('cors');
const mangarouter=require("./routes/manga.js");
const mymangamodel=require('./model/manga.js');
const multer=require('multer');

const userrouter=require('./routes/user.js')
const {checkifuserisLoggedin}=require("./middleware/authorization.js");


const port=process.env.PORT||8000;
const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/manga_db')
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...'));

app.set('view engine','ejs');
app.set('views',path.resolve('./views'));




app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(checkifuserisLoggedin());//this calls the function which is wrong
app.use(checkifuserisLoggedin); //this passes the funtion to be used a s a middleware
app.use(cors({
  origin: 'http://localhost:5173',  // 👈 your frontend dev server
  credentials: true
}));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});


app.use('/uploads', express.static(path.resolve('uploads'), {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/pdf');  // or auto-detect
  }
}));


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads/');
  },
  filename:(req,file,cb)=>{
    const newname=Date.now()+Math.random()*1000000;
    cb(null, newname+file.originalname);
  }
})

const upload=multer({storage:storage});

app.get('/api/me',checkifuserisLoggedin,(req,res)=>{
    if(!req.user)res.status(401);

    res.json({...req.user});
});

// app.get('/',(req,res)=>{
//     console.log(req.user);
//     res.render("home",{
//         user:req.user,
//     })
// })
app.use('/user',userrouter);
app.use('/mangas',mangarouter);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})