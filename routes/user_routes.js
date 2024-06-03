var express=require("express");
var router=express.Router();
var url=require("url");
var exe=require("../conn");
 
router.get("/",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var slides=await exe(`SELECT * FROM slider`);
    var blog=await exe(`SELECT * FROM blog`);
    var blogs=await exe(`SELECT * FROM blog`);
    var products=await exe(`SELECT * FROM product WHERE product.status = 'approved' ORDER BY product.product_id DESC;`)
    var obj={"company_info":company_info[0],"slides":slides,"blogs":blog,"products":products};
    res.render("user/home.ejs",obj);
});
// router.get("/product",async function(req,res){
//     var urldata=url.parse(req.url,true);
//     var search_key="";
//     var products=await exe(`SELECT * FROM product WHERE product.status='approved'`)
//     var company_info=await exe(`SELECT * FROM company_info`);
//     var obj={"company_info":company_info[0],"products":products};
//     res.render("user/product.ejs",obj);
// })
// router.get("/product", async function(req,res)
// {

//     var urldata = url.parse(req.url,true).query;
//     var search_key ="";
//     if(urldata.search==undefined)
//     {
//          var total_records = await exe(`SELECT COUNT(*) as ttl FROM product WHERE status = 'approved'ORDER BY product_id DESC`);
//          total_records = total_records[0].ttl;
//          per_page = 4; // Adjusted to 4 products per page
//          total_pages = Math.ceil(total_records / per_page); // Adjusted to handle rounding up
//          if(urldata.page_no==undefined)
//            page_no = 1; 
//         else
//            page_no = urldata.page_no;
//          starting_index_of_limit = (per_page*page_no)-per_page;
//          console.log(total_records);          
//          var products = await exe(`SELECT * FROM product WHERE status = 'approved' ORDER BY product_id DESC LIMIT ${starting_index_of_limit},${per_page}`);
//     }
//     else
//     {
//         search_key =urldata.search;
//         var total_records = await exe(`SELECT COUNT(*) as ttl FROM product WHERE status = 'approved' AND product_name LIKE '%${search_key}%'ORDER BY product_id DESC`);
//         total_records = total_records[0].ttl;
//         per_page = 4; // Adjusted to 4 products per page
//         total_pages = Math.ceil(total_records / per_page); // Adjusted to handle rounding up
//         if(urldata.page_no==undefined)
//            page_no = 1; 
//          else
//            page_no = urldata.page_no;
//         starting_index_of_limit = (per_page*page_no)-per_page;

//         var products = await exe(`SELECT * FROM product WHERE status = 'approved' AND product_name LIKE '%${urldata.search}%'ORDER BY product_id DESC LIMIT ${starting_index_of_limit},${per_page}`);
//     }
//     var company_info = await exe(`SELECT * FROM company_info`);
//     var obj = {"company_info":company_info[0],"products":products,"search_key":search_key," total_pages": total_pages,"page_no":page_no};
//     res.render("user/product.ejs",obj);
// });
router.get("/product", async function(req, res) {

    var urldata = url.parse(req.url, true).query;
    var search_key = "";
    var per_page = 4; // Adjusted to 4 products per page

    if (urldata.search == undefined) {
        var total_records = await exe(`SELECT COUNT(*) as ttl FROM product WHERE status = 'approved'ORDER BY product_id DESC`);
        var total_pages = Math.ceil(total_records[0].ttl / per_page); // Adjusted to handle rounding up
        var page_no = urldata.page_no || 1;
        var starting_index_of_limit = (per_page * page_no) - per_page;

        var products = await exe(`SELECT * FROM product WHERE status = 'approved' ORDER BY product_id DESC LIMIT ${starting_index_of_limit},${per_page}`);
    } else {
        search_key = urldata.search;
        var total_records = await exe(`SELECT COUNT(*) as ttl FROM product WHERE status = 'approved' AND product_name LIKE '%${search_key}%'ORDER BY product_id DESC`);
        var total_pages = Math.ceil(total_records[0].ttl / per_page); // Adjusted to handle rounding up
        var page_no = urldata.page_no || 1;
        var starting_index_of_limit = (per_page * page_no) - per_page;

        var products = await exe(`SELECT * FROM product WHERE status = 'approved' AND product_name LIKE '%${urldata.search}%'ORDER BY product_id DESC LIMIT ${starting_index_of_limit},${per_page}`);
    }

    var company_info = await exe(`SELECT * FROM company_info`);
    var obj = {
        "company_info": company_info[0],
        "products": products,
        "search_key": search_key,
        "total_pages": total_pages,
        "page_no": page_no
    };
    res.render("user/product.ejs", obj);
});


router.get("/view_category",async function(req,res){
    var cat_list=await exe(`SELECT * FROM product_category`);
    var obj={"cat_list":cat_list};
    res.render("user/view_category.ejs",obj)
})
router.get("/service",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/service.ejs",obj);
})
router.get("/blog",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var blog=await exe(`SELECT * FROM blog`);
    var obj={"company_info":company_info[0],"blogs":blog};
    res.render("user/blog.ejs",obj);
})
router.get("/about",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/about.ejs",obj);
})
router.get("/contact",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/contact.ejs",obj);
})

router.get("/register",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/register.ejs",obj)
})
router.post("/save_account",async  function(req,res){
    // var company_info=await exe(`SELECT * FROM company_info`);
    // var obj={"company_info":company_info[0]};
    var d=req.body;
    var sql=`INSERT INTO user_tbl(user_name, user_mobile, user_email,user_password ) VALUES('${d.user_name}','${d.user_mobile}','${d.user_email}','${d.user_password}')`;
    var data=await exe(sql)
    // res.send(data);
    res.redirect("/login")
})
router.get("/login",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/login.ejs",obj);
})
router.post("/login_account",async function(req,res){
    var d=req.body;
    var sql=`SELECT * FROM user_tbl WHERE user_email='${d.user_email}' AND user_password='${d.user_password}'`;
    var data=await exe(sql);
    if(data.length > 0)
    {
        req.session.user_id=data[0].user_id;
        res.redirect("/profile")
    }
    else{
        res.redirect("/login");
    }
    // res.send(data);
})
function checkLogin(req,res,next){
    if(req.session.user_id == undefined)
    res.redirect("/login")
else{
    next()
    }
}
router.get("/profile",checkLogin ,async function(req,res)
{   var d=req.body;
    var user_info=await exe(`SELECT * FROM user_tbl`)
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0],"user_info":user_info};
    res.render("user/profile.ejs",obj);
    // res.send(req.session.product_id)
})
router.get("/go_to_store_location",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/go_to_store_location.ejs",obj)

})
router.get("/product_details/:id",async function(req,res){
    var product_info=await exe(`SELECT * FROM product,product_category WHERE product_category.product_category_id=product.product_category_id AND product_id='${req.params.id}'`);
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0],"product_info":product_info[0]};
    res.render("user/product_details.ejs",obj);
    // res.send(req.session.product_id)
});
router.get("/change_password",async function(req,res)
{
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    var d=req.body;
    res.render("user/change_password.ejs",obj);
})
router.post("/update_password",async function(req,res){
    var d=req.body;
    var change_pass=await exe(`UPDATE user_tbl SET user_password='${d.user_password}'`);
    res.redirect("/login");

})
router.get("/logout",async function(req,res){
    var d=req.body;
    var sql=`SELECT * FROM user_tbl WHERE user_email='${d.user_email}' AND user_password='${d.user_password}'`;
    var data=await exe(sql);
    if(data.length > 0)
    {
        req.session.user_id=data[0].user_id==undefined;
        res.redirect("/profile")
    }
    else{
        res.redirect("/login");
    }
    
})
router.get("/edit_profile",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var obj={"company_info":company_info[0]};
    res.render("user/edit_profile.ejs",obj);
})
router.get("/cart",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var carts=await exe(`SELECT * FROM cart_tbl,product WHERE cart_tbl.product_id=product.product_id 
    AND cart_tbl.user_id='${req.session.user_id}'`);
    var obj={"company_info":company_info[0],"carts":carts};
    res.render("user/cart.ejs",obj)
})
router.post("/update_profile",async function(req,res)
{   var d=req.body;
    var edit_pro=await exe(`UPDATE user_tbl SET user_name='${d.user_name}',user_mobile='${d.user_mobile}',user_email='${d.user_email}',user_password='${d.user_password}'`);
    res.redirect("/login");
})

router.post("/add_to_cart",checkLogin, async function(req,res){
    var user_id=req.session.user_id;
    var product_id=req.body.product_id;
    var qty=req.body.quant;
    var sql= `INSERT INTO cart_tbl(user_id, product_id, qty) VALUES ('${user_id}', '${product_id}' , '${qty}')`;
    var data=await exe(sql);
    res.redirect("/cart");
  
})
router.get("/remove_cart/:id",async function(req,res){
    var data=await exe(`DELETE FROM cart_tbl WHERE cart_id='${req.params.id}'`)
    res.redirect("/cart")

});
router.get("/checkout",checkLogin,async  function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var carts=await exe(`SELECT * FROM cart_tbl,product WHERE cart_tbl.product_id=product.product_id 
    AND cart_tbl.user_id='${req.session.user_id}'`);
    var obj={"company_info":company_info[0],"carts":carts};
    res.render("user/checkout.ejs",obj);
    // res.send(req.session.user_id)

})
router.post("/update_cart_qty",async function(req,res){
    var sql=`UPDATE cart_tbl SET qty='${req.body.qty}' WHERE cart_id='${req.body.cart_id}'`
    var data=await exe(sql)
    res.send(data);
})
router.post("/process_checkout",checkLogin,async function(req,res){
    var user_carts=await exe(`SELECT SUM(qty*product_price) as total FROM cart_tbl,product WHERE cart_tbl.product_id=product.product_id 
    AND cart_tbl.user_id='${req.session.user_id}'`);
        if(user_carts[0].total > 0)
        {
        var today=new Date().toISOString().slice(0,10);
        var sql=`INSERT INTO transaction( date ,payment_type,payment_status,payment_amount , user_id )
        VALUES('${today}','${req.body.payment}','pending',
        '${user_carts[0].total}','${req.session.user_id}')`;
        var data=await exe(sql);
        var transaction_id=data.insertId;
        var carts=await exe(`SELECT * FROM cart_tbl,product WHERE cart_tbl.product_id=product.product_id 
        AND cart_tbl.user_id='${req.session.user_id}'`);
        for(var i=0;i<carts.length;i++){
            var order={
                "fname":req.body.fname,
                "lname":req.body.lname,
                "email":req.body.email,
                "mobile":req.body.mobile,
                "state":req.body.state,
                "address1":req.body.address1,
                "address2":req.body.address2,
                "postal":req.body.postal,
                "payment":req.body.payment,
                "product_id":carts[i].product_id,
                "qty":carts[i].qty,
                "product_name":carts[i].product_name,
                "product_price":carts[i].product_price,
                "total_price":carts[i].product_price*carts[i].qty,
                "transaction_id":transaction_id,
                "order_status":'pending',
                "order_date":today,
                "dispatch_date":"",
                "deliver_date":"",
                "cancel_date":"",
                "reject_date":"",
                "user_id":req.session.user_id
            }
                
        var sql=`INSERT INTO order_tbl(
            fname,
            lname,
            email,
            mobile,
            state,
            address1,
            address2,
            postal,
            payment,
            qty,
            product_name,
            product_price,
            total_price,
            product_id,
            transaction_id,
            order_status,
            order_date,
            dispatch_date,
            deliver_date,
            cancel_date,
            reject_date,
            user_id)
            VALUES (
            '${order.fname}',
            '${order.lname}',
            '${order.email}',
            '${order.mobile}',
            '${order.state}',
            '${order.address1}',
            '${order.address2}',
            '${order.postal}',
            '${order.payment}',
            '${order.qty}',
            '${order.product_name}',
            '${order.product_price}',
            '${order.total_price}',
            '${order.product_id}',
            '${order.transaction_id}',
            '${order.order_status}',
            '${order.order_date}',
            '${order.dispatch_date}',
            '${order.deliver_date}',
            '${order.cancel_date}',
            '${order.reject_date}',
            '${order.user_id}')`;
            var data=await exe(sql);
        }
        var sql=`DELETE FROM cart_tbl WHERE user_id='${req.session.user_id}'`;
        var data=await exe(sql);
        if(req.body.payment=='online'){
            var company_info=await exe(`SELECT * FROM company_info`);
            var obj={"company_info":company_info[0],"amount":user_carts[0].total,"transaction_id":transaction_id,"info":req.body};
        res.render("user/payment_page.ejs",obj)
        }
        else{
            res.redirect("/my_orders");
        }
    }
    else{
        res.send("Your Cart Is Empty...")
    }
})
    router.get("/my_orders",checkLogin,async function(req,res){
        var sql=`SELECT * FROM transaction,product,order_tbl WHERE order_tbl.transaction_id=transaction.transaction_id
        AND order_tbl.user_id='${req.session.user_id}' AND order_tbl.product_id=product.product_id`;
        var company_info=await exe(`SELECT * FROM company_info`);
        var orders=await exe(sql);
        var obj={"company_info":company_info[0],"orders":orders};
    res.render("user/my_orders.ejs",obj)
})
router.post("/save_payment/:transaction_id",async function(req,res){
    var sql=`UPDATE transaction SET payment_id='${req.body.razorpay_payment_id}',payment_status='success' WHERE transaction_id='${req.params.transaction_id}'`;
    var data=await exe(sql)
    // res.send(data)
    res.redirect("/my_orders")


})
router.get("/print_invoice/:order_id",async function(req,res){
    var company_info=await exe(`SELECT * FROM company_info`);
    var order_info=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id AND order_tbl.order_id='${req.params.order_id}'`);
    var obj={"company_info":company_info[0],"order_info":order_info};
    res.render("user/print_invoice.ejs",obj)

})
module.exports=router; 