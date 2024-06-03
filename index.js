var express=require("express");
var bodyparser=require("body-parser");
var upload=require("express-fileupload");
var session=require("express-session");
var user_route= require("./routes/user_routes");
var admin_route=require("./routes/admin_routes");
var business_route=require("./routes/business_routes");
var app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(upload());
app.use(session({
    secret:"123",
    resave:true,
    saveUninitialized:true

}));
app.use(express.static("public/"));
app.use("/admin",admin_route)
app.use("/business",business_route)
app.use("/",user_route);




app.listen(1000);

