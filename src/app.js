const express = require("express");
const path = require("path");
const messageRoute = require("./routes/Messages");

const app = express();
const router = require("express").Router;
const publicPath = path.resolve(__dirname, "../public");




app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);

app.use("/", );

