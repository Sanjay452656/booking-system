const jwt = require('jsonwebtoken')

function protect(req,res,next){
    
    try {
        let token;
        if(req.headers.authorization?.startsWith("Bearer")){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return res.status(401).json({message:"Not authorized"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({message :"Invalid token"})
    }
}

module.exports = protect