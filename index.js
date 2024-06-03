var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require('dotenv');
var upload = require("express-fileupload");
var session = require("express-session");
var user_route = require("./routes/user_routes");
var admin_route = require("./routes/admin_routes");
var business_route = require("./routes/business_routes");
const path = require('path');
dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());
app.use(session({
    secret: "23456",
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public/"));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use("/", user_route);
app.use("/admin", admin_route);
app.use("/business", business_route);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
