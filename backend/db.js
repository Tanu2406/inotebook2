// const mongoose = require('mongoose');
// const mongoURI = "mongodb://localhost:27017";

// const connectToMongo = ()=> {
//     mongoose.connect(mongoURI,()=>{
//         console.log("Connected to Mongo Sucessfully");
//     });
// }
    

// module.exports = connectToMongo;

const mongoose = require('mongoose');

const connectToMongo = async () => {
    await mongoose.connect('mongodb://localhost:27017/inotebook');
    console.log("Connected to MongoDB");
};

module.exports = connectToMongo;
  

/*. mongoose:-
This is the library imported to interact with the MongoDB database.
It provides methods to connect, define schemas, models, and perform database operations.

The connectToMongo Function
This is an asynchronous function designed to connect to the MongoDB database.

mongodb://localhost:27017/inotebook:
This is the connection string.
localhost: Specifies that MongoDB is running on the local machine.
27017: Default port for MongoDB.
inotebook: The database name. If it doesn't exist, MongoDB will create it automatically when the first document is added.
await:
Ensures that the connection is established before proceeding further in the code.

module.exports = connectToMongo;
This exports the connectToMongo function so it can be imported and used in other files (e.g., your main server file index.js).

*When the server starts, connectToMongo is called, establishing a connection to the database.
*/