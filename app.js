const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.listen(() => {
    console.log("Server starting on port 3000");
});
