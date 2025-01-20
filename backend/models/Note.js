const mongoose = require('mongoose');//mongoose: A Node.js library used to connect to MongoDB and define schemas for data modeling.
const { Schema } = mongoose;//schema: set of rules that define how data should be structured.
//Schema: A Mongoose class that allows defining a blueprint or structure for MongoDB documents.

const NotesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,// is used to define a field in the schema that will store an ObjectId.
        //ObjectId as the value of the _id field.
        ref:'user'// Establishes a reference to the user model. This allows you to populate user details when querying notes.

    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
      
    },
    tag:{
        type:String,
        default:"General"
    }, 
    date:{
        type:Date,
        default:Date.now
    }
    
  });
  module.exports = mongoose.model('Notes',NotesSchema);//Creates a model called Notes based on the NotesSchema.
  //Exports the model so it can be used in other parts of the application for CRUD operations.