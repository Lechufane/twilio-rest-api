const SERVER_PORT = 3000;

// Initiating Express app
const express = require('express');
const app = express();

// For JSON parsing of body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes
const routes = require("./routes/messageRoutes");
app.use("/twilioApi", routes);



// Running the server
app.listen(SERVER_PORT, () => {
    console.log(`App listening on port ${SERVER_PORT}`)
})