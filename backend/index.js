
// const connectToMongoy = require('./db');
// const express = require('express');

// // Connect to MongoDB
// connectToMongo();

// const app = express()
// const port = 3000

// // Available Routes
// app.use('/api/auth',require('./routes/auth'))
// app.use('/api/notes',require('./routes/notes'))

// // app.get('/', (req, res) => {
// //   res.send('Hello World');
// // });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

const connectToMongo = require('./db');//The backend connects to a MongoDB database using the connectToMongo() function imported from ./db.
const express = require('express');
const morgan = require('morgan');
var cors = require('cors')// express cors to send req to api // middelware

connectToMongo();

const port = process.env.PORT || 3000;  

var app = express();

app.use(cors()); // Enables CORS for all routes.It allows your backend to handle requests from other origins (e.g., a React frontend running on a different port).
app.use(express.json()); // Parses incoming JSON requests., making the data available in req.body
app.use(morgan('combined')); // Logs HTTP requests.

//const port = process.env.PORT || 3000;
//app.use([path], callback/middleware)


app.use('/api/auth', require('./routes/auth')); // All routes in `auth` will be prefixed with `/api/auth`.
app.use('/api/notes', require('./routes/notes')); // All routes in `notes` will be prefixed with `/api/notes`.

app.get('/', (req, res) => {
     res.send('Hello World');
   });

   const server = app.listen(port, () => {//The server starts and listens on the specified port or defaults to 3000.
       console.log(`iNotebook backend listening at http://localhost:${port}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
          console.error(`Port ${port} is already in use. Trying a different port...`);
          server.close(() => {
              server.listen(port + 1);
          });
      } else {
          console.error('Server error:', err);
      }
  });

  /*Middleware:

CORS (Cross-Origin Resource Sharing):
The cors middleware is used to enable requests from different origins (e.g., frontend on a different domain or port).
Body Parser:
express.json() is used to parse JSON payloads from incoming requests.
Logging (Morgan):
The morgan middleware logs HTTP requests in a "combined" format, which provides detailed logs for debugging.

The app.use method in Express.js is used to register middleware functions or routes with the application.
 Middleware functions are executed during the lifecycle of a request to the server, before sending the response back to the client.
  Middleware can perform operations such as logging, parsing request data, authentication, error handling, and more.
  */