const jwt=require('jsonwebtoken');
const secret="myspecialsecret"
async function providetoken(user){
    const payload={_id:user._id,
        name:user.name,
        email:user.email,
        profileImage:user.profileImage
    }

    const token= jwt.sign(payload,secret);
    return token;
}

async function verifyToken(token){
    const payload= jwt.verify(token,secret);
    return payload;
}

module.exports={providetoken,verifyToken};