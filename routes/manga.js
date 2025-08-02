const express=require('express');
const router=express.Router();
const {handlegetallmangas,postnewmanga,getparticularusersmanga,deletemangahandler,addnewchapterhandler,getchaptershandler}=require('../controler/manga.js');
const upload=require('../model/fileuploader.js')

router.get('/',handlegetallmangas);
router.post('/',upload.single('coverImage'),postnewmanga);
router.post('/delete',deletemangahandler)
router.get('/foruser',getparticularusersmanga);
router.post('/addnewchapter/:id',upload.single('chapter'),addnewchapterhandler)
router.get('/getch/:id',getchaptershandler)

module.exports=router;