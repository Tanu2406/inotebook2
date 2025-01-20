const express = require('express');//robust Express.js router implementation for handling authentication, user creation, and fetching notes for a note-taking app
const User = require('../models/User');
const router = express.Router();

const { body, validationResult } = require('express-validator');//Validates inputs such as name, email, and password.& is used to import specific functions from the express-validator library, which is a widely-used middleware for validating and sanitizing user inputs in Express.js applications.
const bcrypt = require('bcryptjs');//Securely hashes user passwords before storing them in the database & Uses a salt for additional security.
var jwt = require('jsonwebtoken');//Generates a JSON Web Token for authenticated users.
const fetchuser = require('../middleware/fetchuser');//fetchuser middleware is used to ensure that only authenticated users can access certain routes (e.g., fetching notes, getting user details).
const Note = require('../models/Note');

const JWT_SECRET = "Tanu8767539093";

//Fetches all notes belonging to the logged-in user.
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        console.log('Fetching notes for user:', req.user.id);
      const notes = await Note.find({ user: req.user.id });
      res.json(notes);
      console.log("Notes state:", notes);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

// Route 1 : Create a User using: POST "/api/auth/createuser". no login required
//Creates a new user with validation, password hashing, and token generation.
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 })
],async(req,res)=>{
    let success = false;
    //return if there are err
    const errors = validationResult(req);//Validate the input fields using express-validator.
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
//check weather the user with email exist already

try {
let user = await User.findOne({email: req.body.email});
if(user){
    return res.status(400).json({success,error: "Sorry a user with this email already exists"})
}

//generate salt
const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password,salt); 
//Create new user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
    });

const data = {
    user:{
        id: user.id
    }
};
if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).send("Internal Server Error: Missing JWT_SECRET");
}

  const authtoken = jwt.sign(data,JWT_SECRET);
  //console.log(jwtData);

    //res.json(user)
    success = true;
    res.json({success,authtoken});

} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
    // .then(user => res.json(user))
    // .catch(err=> {console.log(err)
    //     res.json({error: 'Please enter a unique value for email',message: err.message})
    })
//     const { name, email, password } = req.body;
//   res.send(`User ${name} with email ${email} and age ${password} is valid!`);


// Route 2 : Authenticate a User using: POST "/api/auth/login". no login required
//Authenticates a user with email and password, returning a JWT token.
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
],async(req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    const {email,password} = req.body;

    try {
         // Check if the user exists
        let user = await User.findOne({email});
    if(!user){
    return res.status(400).json({success,error: "Please try to login with correct credentials"});
    } 
    const passwordCompare = await bcrypt.compare(password,user.password);
   
    if(!passwordCompare){
       let success = false;
        return res.status(400).json({success,error: "Please try to login with correct credentials"});
    }
    const data = {
        user:{
            id: user.id
        }
    }
    
  const authtoken = jwt.sign(data,JWT_SECRET);
  success = true;
    res.json({success,authtoken});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3 : Get loggedin User details using: POST "/api/auth/getuser". login required
//Fetches details of the logged-in user using a JWT token.
router.post('/getuser', fetchuser ,async(req,res)=>{
try {
  const  userId = req.user.id;//Use the fetchuser middleware to validate the JWT token and extract the user ID.
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
});
module.exports = router


/*body:-
The body function is a middleware used to validate and sanitize the values present in the request body (req.body).
It allows you to define validation rules for specific fields in the request body, such as:
Ensuring a field exists.
Checking its length, format, or type.
Applying sanitization.

 validationResult:-
The validationResult function is used to collect the results of the validations applied to the request.
After applying validation rules, you can use this function to check if there were any validation errors.
If errors exist, you can return them to the client in the response.

validationResult(req):

Extracts validation errors from the req object.
Returns an object that includes the list of validation errors (if any).
errors.array():

Converts the validation errors into an array of error objects, making it easier to send to the client.

When a request is made to an endpoint, express-validator validation rules (e.g., body('email').isEmail()) are applied as middleware.
If any validation rule fails, express-validator stores the errors in the req object.
validationResult(req) extracts those errors.
You can check if there are any errors, and if so, return them as part of the response.*/
