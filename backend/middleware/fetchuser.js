var jwt = require('jsonwebtoken');//The jsonwebtoken library is used for encoding and decoding JWTs.
const JWT_SECRET = "Tanu8767539093";//This is the secret key used to sign and verify JWTs

const fetchuser = (req,res,next)=>{
    //Get the user from jwt token and add id to req obj
    //verify user match then fetch user 
    const token = req.header('auth-token');//Extracts the JWT from the request's auth-token header.
    if(!token){
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);//Verifies the JWT using the secret key (JWT_SECRET).The jwt.verify method validates the token's signature using the JWT_SECRET. If the token is valid, it decodes the payload and assigns it to data.
        req.user = data.user;//If verification succeeds, it adds the user information (from the JWT payload) to the req.user object for downstream access by other middleware or route handlers.
        next();//If the token is valid, the function calls the next() function to proceed to the next middleware or route handler.
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"});//If the token is missing or invalid
    }
    
}

module.exports = fetchuser;//The fetchuser middleware is exported so it can be used in routes.