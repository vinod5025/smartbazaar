var express=require("express");
var exe=require("./../conn");
const { route } = require("./business_routes");
var router=express.Router();

router.get("/register",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("business/register.ejs",obj);
})
router.post("/save_business",async function(req,res){
    // var sql=`CREATE TABLE business(business_id INT PRIMARY KEY AUTO_INCREMENT,person_name VARCHAR(100),
    // contact_no VARCHAR(200), business_name VARCHAR(100), business_email VARCHAR(200),
    // business_password VARCHAR(15))`;
    // var data=await exe(sql);
    var d=req.body;
    var sql=`INSERT INTO business(person_name,contact_no , business_name , business_email ,
         business_password) VALUES('${d.person_name}','${d.contact_no}','${d.business_name}','${d.business_email}',
         '${d.business_password}')`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/business/login");
})
router.get("/login",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("business/login.ejs",obj);
})
router.post("/login_business_process",async function(req,res){
    var d=req.body;
    var sql=`SELECT * FROM business WHERE business_email='${d.business_email}' AND
     business_password='${d.business_password}'`;
     var data=await exe(sql);
     if(data.length > 0){
        //Success
        req.session['business_id']=data[0].business_id;
        res.redirect("/business/home")
        // res.send(data[0].business_id+"hello")

     }
     else{
        //Failed
        res.redirect("/business/login")
     }

})

var checkLogin=  function(req,res,next){
    if(req.session.business_id == undefined)
    res.redirect("/business/login")
  else{
    next();
}
}
router.get("/home",checkLogin,function(req,res){
       
        res.render("business/home.ejs");
    
})
router.get("/logout",checkLogin,function(req,res){
    req.session.business_id=undefined;
    res.redirect("/business/login");
})
router.get("/add_product",checkLogin,async function(req,res){
    var cat_list=await exe(`SELECT * FROM product_category`);
    var obj={"cat_list":cat_list}
    res.render("business/add_product.ejs",obj);
})
router.post("/save_product",checkLogin,async function(req,res){
    var d=req.body;
    req.body.business_id=req.session.business_id;
    var product_image1="";
    if(req.files.product_image1){
        product_image1=new Date().getTime()+req.files.product_image1.name;
        req.files.product_image1.mv("public/uploads/"+product_image1)
    }
    var product_image2="";
    if(req.files.product_image2){
        product_image2=new Date().getTime()+req.files.product_image2.name;
        req.files.product_image2.mv("public/uploads/"+product_image2)
    }
    var product_image3="";
    if(req.files.product_image3){
        product_image3=new Date().getTime()+req.files.product_image3.name;
        req.files.product_image3.mv("public/uploads/"+product_image3)
    }

    var sql=`INSERT INTO product(
        business_id ,
        product_category_id,
        product_name ,
        product_price ,
        duplicate_price ,
        product_size ,
        product_color ,
        product_exchange_in ,
        product_information ,
        product_image1 ,
        product_image2 ,
        product_image3 ,
        status ,
        verified_date) VALUES(
        '${d.business_id}',
        '${d.product_category_id}',
        '${d.product_name}',
        '${d.product_price}',
        '${d.duplicate_price}',
        '${d.product_size}',
        '${d.product_color}', 
        '${d.product_exchange_in}',
        '${d.product_information}',
        '${product_image1}',
        '${product_image2}',
        '${product_image3}',
        'pending',
        '')`;
    var data=await exe(sql); 
    //  res.send(data);
    res.redirect("/business/add_product")
})
router.get("/product_list",async function(req,res){
    var sql=`SELECT * FROM product,product_category WHERE product.product_category_id =product_category.product_category_id AND business_id='${req.session.business_id}'`;
    var products=await exe(sql);
    var obj={"products":products};
    res.render("business/product_list.ejs",obj);
})
router.get("/pending_orders",checkLogin,async function(req,res){
    var orders=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id AND business.business_id='${req.session.business_id}' AND order_status='pending'`);
    var obj={"orders":orders};
    res.render("business/pending_orders.ejs",obj);
    // res.send(""+req.session.business_id)
})
router.get("/order_detail/:order_id",async function(req,res){
    var order_info=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id AND order_tbl.order_id='${req.params.order_id}'`);
    var obj={"order_info":order_info};
    res.render("business/order_detail.ejs",obj)
})
router.get("/dispatched_orders",checkLogin,async function(req,res){
    var orders=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id AND business.business_id='${req.session.business_id}' AND order_status='dispatch'`);
    var obj={"orders":orders};
    res.render("business/dispatched_orders.ejs",obj);
})
router.get("/transfer_order_in_dispatch/:order_id",async function(req,res){
    var today=new Date().toISOString().slice(0,10);
    var sql=`UPDATE order_tbl SET order_status='dispatch', dispatch_date='${today}' WHERE order_id='${req.params.order_id}'`;
    var data=await exe(sql)
    res.redirect("/business/order_detail/"+req.params.order_id);

});
router.get("/transfer_order_in_deliver/:order_id",async function(req,res){
    var today=new Date().toISOString().slice(0,10);
    var sql=`UPDATE order_tbl SET order_status='dispatch', deliver_date='${today}' WHERE order_id='${req.params.order_id}'`;
    var data=await exe(sql)
    res.redirect("/business/order_detail/"+req.params.order_id);
    // res.send(req.params.order_id)

})
router.get("/delivered_orders",checkLogin,async function(req,res){
    var orders=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id AND business.business_id='${req.session.business_id}' 
    AND order_status ='deliver'`);
    var obj={"orders":orders};
    res.render("business/delivered_orders.ejs",obj);

})












module.exports=router; 
