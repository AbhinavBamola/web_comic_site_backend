
const {verifyToken}=require('../service/authorization.js');


async function checkifuserisLoggedin(req,res,next) {
        const cookie=req.cookies.token;
        if(!cookie){
            return next();
        }
        const payload=await verifyToken(cookie);
        req.user=payload;
        return next();
    
}

module.exports={checkifuserisLoggedin};