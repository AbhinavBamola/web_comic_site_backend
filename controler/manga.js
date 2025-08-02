const express=require('express');
const path=require('path');
const fs=require('fs');
const mangamodel=require('../model/manga.js');
const { all } = require('../routes/manga.js');
const upload=require('../model/fileuploader.js')

async function handlegetallmangas(req,res) {
    const allmangas=await mangamodel.find({});
    res.json(allmangas);
}

async function postnewmanga(req,res){
    const {title,description}=req.body;
    const coverImage = req.file ? '/' + req.file.path.replace(/\\/g, '/') : '/uploads/download.jpeg'; // normalize slashes
    const createBy=req.user._id;

        const newmanga=await mangamodel.create({title,description,coverImage,createBy});
    
    res.json({success:true});
}

async function getparticularusersmanga(req,res) {
    const id=req.user._id;
    const userMangas=await mangamodel.find({createBy:id});
    res.json(userMangas);
}

async function deletemangahandler(req,res) {
    const {id}=req.body;
    const manga=await mangamodel.findById(id);

    const filepath=path.join(__dirname,"..",String(manga.coverImage)) ;

    if(!String(manga.coverImage).includes('download.jpeg')){
        fs.unlink(filepath,()=>{
            console.log("file deleted");
        });
    }
      manga.mangaChapters.forEach((chapterPath) => {
    const fullChapterPath = path.join(__dirname, "..", chapterPath);
    fs.unlink(fullChapterPath, (err) => {
      if (err) console.error(`Failed to delete chapter: ${chapterPath}`, err);
      else console.log(`Deleted chapter: ${chapterPath}`);
    });
  });
  
    await mangamodel.findByIdAndDelete(id);
    res.json({success:true})
}

async function addnewchapterhandler(req,res) {
        const chapter=req.file.path.replace(/\\/g, '/');
        console.log(chapter);
        const id=req.params.id;
       const man= await mangamodel.findByIdAndUpdate(id,{$push:{mangaChapters:chapter}},
            {new:true});
            console.log(man);
        res.json({success:
            true,chapterpath:chapter})
}

async function getchaptershandler(req,res) {
    const id=req.params.id;
    const manga=await mangamodel.findById(id);
    const  mangaChapters=manga.mangaChapters;
    res.json({mangaChapters});
}
module.exports={handlegetallmangas,postnewmanga,getparticularusersmanga,deletemangahandler,addnewchapterhandler,getchaptershandler};