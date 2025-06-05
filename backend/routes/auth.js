const express = require('express');
const User = require('../models/User');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

const JWT_SECRET = process.env.JWT_SECRET;

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

router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 })
],async(req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

try {
let user = await User.findOne({email: req.body.email});
if(user){
    return res.status(400).json({success,error: "Sorry a user with this email already exists"})
}

const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password,salt); 
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
    
    })

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


