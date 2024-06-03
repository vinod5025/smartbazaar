var express=require("express");
var exe=require("./../conn");
var router=express.Router();



router.get("/admin_home",checkLogin,function(req,res){
    res.render("admin/admin_home.ejs")

});
router.get("/admin_login",function(req,res){
    res.render("admin/admin_login.ejs")

});
router.get("/admin_register",function(req,res){
    res.render("admin/admin_register.ejs")

});
router.post("/save_admin",async function(req,res){
    var d=req.body;
    // var sql=`CREATE TABLE admin_login(admin_login_id INT PRIMARY KEY AUTO_INCREMENT, admin_name VARCHAR(200), admin_email TEXT , admin_password VARCHAR(100))`;
    var sql=`INSERT INTO admin_login(admin_name, admin_email ,admin_password) VALUES('${d.admin_name}','${d.admin_email}','${d.admin_password}')`;
    var data=await exe (sql)
    // res.send(data)
    res.redirect("/admin/admin_login")
})
router.post("/admin_process_login",async function(req,res){
    var d=req.body;
    var sql=`SELECT * FROM admin_login WHERE admin_email='${d.admin_email}' AND admin_password='${d.admin_password}'`;
    var data=await exe(sql);
    if(data.length > 0 ){
        // res.send()
        var id=data[0].admin_login_id;
        req.session.user_id=id;
        res.redirect("/admin")
    }
    else{
        res.send("Login Failed.")
    }
    
    // res.send(req.body)
})
router.get("/admin",checkLogin,function(req,res){
    if(req.session.admin_login_id == undefined)
    {
        res.redirect("/admin/admin_login");
    }
    // else{
    //     res.render("admin/home")
    // }
})
router.get("/",checkLogin,async function(res,res){
    var sql=`SELECT * FROM slider`;
    var sql=`SELECT * FROM blog`;
    var data=await exe(sql);
    var obj={"slides":data,"blogs":"blog"}
    res.render("admin/home.ejs",obj);
});
    function checkLogin(req,res,next){
        if(req.session.user_id == undefined)
        res.redirect("/admin/admin_login")
    else{
        next()
        }
    }
router.get("/manage_product_category",async function(req,res){
    var cat_list=await exe(`SELECT * FROM product_category`);
    var obj={"cat_list":cat_list};
    res.render("admin/manage_product_category.ejs",obj);
})
router.post("/save_product_category",async function(req,res){
    var d=req.body;   
     // CREATE TABLE product_category(product_category_id INT PRIMARY KEY AUTO_INCREMENT,category_name VARCHAR(100), category_details TEXT)
    var sql=`INSERT INTO product_category (category_name,category_details) VALUES('${d.category_name}','${d.category_details}')`;
    var data=await exe(sql);
    res.redirect("/admin/manage_product_category");

})
router.get("/edit_product_category/:id",async function(req,res){
    var cat_info= await exe(`SELECT * FROM product_category WHERE product_category_id ='${req.params.id}'`);
    var obj={"cat_info":cat_info};
    res.render("admin/edit_product_category.ejs",obj)
})
router.post("/update_product_category",async function(req,res){
    var d=req.body;
    var sql=`UPDATE product_category SET category_name='${d.category_name}',category_details='${d.category_details}' WHERE product_category_id='${d.product_category_id}'`;
    var data=await exe(sql);
    res.redirect("/admin/manage_product_category")
})
router.get("/delete_product_category/:id",async function(req,res){
    var sql=`DELETE FROM product_category WHERE product_category_id='${req.params.id}'`
    var data=await exe(sql);
    res.redirect("/admin/manage_product_category");

});
router.get("/company_info",async function(req,res){
    var data=await exe(`SELECT * FROM company_info WHERE company_info_id=1`);
    var obj={"company_info":data};
    res.render("admin/company_info.ejs",obj);
})
router.post("/update_company_information",async function(req,res){
    var d=req.body;
    if(req.files){
        var file_name=new Date().getTime()+".png";
        req.files.company_logo.mv("public/uploads/"+file_name);
        var sql2=`UPDATE company_info SET company_logo='${file_name}' WHERE company_info_id=1`;
        var data2=await exe(sql2);
    }
    var sql=`UPDATE company_info SET company_name ='${d.company_name}',
    company_details ='${d.company_details}',
    company_contact_no ='${d.company_contact_no }',
    company_contact_email ='${d.company_contact_email}', 
    company_address ='${d.company_address}', 
    company_location ='${d.company_location}', 
    company_facebook_link ='${d.company_facebook_link}', 
    company_twitter_link ='${d.company_twitter_link}', 
    company_whatsapp_link ='${d.company_whatsapp_link}', 
    company_instagram_link ='${d.company_instagram_link}', 
    company_linkedin_link ='${d.company_linkedin_link}', 
    company_telegram_link  ='${d.company_telegram_link}' WHERE company_info_id=1`;
    var data=await exe(sql);
    res.redirect("/admin/company_info");
})
router.get("/manage_slider",async function(req,res){
    var data=await exe(`SELECT * FROM slider`);
    var obj={"slider_data":data};
    res.render("admin/manage_slider.ejs",obj);
})
router.post("/save_slider",async function(req,res){
    var d=req.body;
    var file_name=new Date().getTime()+".png";
    req.files.slider_image.mv("public/uploads/"+file_name);
    var sql=`INSERT INTO slider( slider_title, slider_button_text, slider_button_url ,slider_image)
     VALUES ('${d.slider_title}','${d.slider_button_text}','${d.slider_button_url}','${file_name}')`;
    var data=await exe(sql);
    res.redirect("/admin/manage_slider");
})
router.get("/delete_slider/:id",async function(req,res){
    var sql=`DELETE FROM slider WHERE slider_id='${req.params.id}'`;
    var data=await exe(sql)
     res.redirect("/admin/manage_slider")
})
router.get("/edit_slider/:id",async function(req,res){
    var data=await exe(`SELECT * FROM slider WHERE slider_id='${req.params.id}'`)
    var obj={"edit_sli":data};
    res.render("admin/edit_slider.ejs",obj)
})
router.get("/update_slider/:id",async function(req,res){
    var data=await exe(`SELECT * FROM slider WHERE slider_id='${req.params.id}'`);
    var obj={"slider_info":data};
    res.send("/admin/manage_slider",obj);
})
router.post("/update_slider",async function(req,res){
    var d=req.body;
    if(req.files){
        var file_name=new Date().getTime()+".png";
        req.files.slider_image.mv("public/uploads/"+file_name);
        var sql=`UPDATE slider SET slider_image='${file_name}' WHERE slider_id=1`;

    }
    var sql=`UPDATE slider SET slider_title='${d.slider_title}', slider_button_text='${d.slider_button_text
    }', slider_button_url='${d.slider_button_url}' WHERE slider_id=1`;
    var data=await exe(sql)
    res.redirect("/admin/manage_slider");
 })
router.get("/manage_blog",async function(req,res){
    var data=await exe(`SELECT * FROM blog`);
    var obj={"blogs":data};
    res.render("admin/manage_blog.ejs")
})
router.post("/save_blog",async function(req,res)
{  
     var d=req.body;
    if(req.files)
    var file_name=new Date().getTime()+".png";
    req.files.blog_image.mv("public/uploads/"+file_name);
    var sql=`INSERT INTO blog(blog_title ,blog_des, blog_image) VALUES('${d.blog_title}','${d.blog_des}','${file_name}')`;
    var data=await exe(sql);
    // res.send(data);
    res.redirect("/admin/manage_blog");

});
router.get("/pending_products",async function(req,res){
    var products=await exe(`SELECT * FROM product, product_category,business WHERE 
    product_category.product_category_id =product.product_category_id AND 
    business.business_id = product.business_id AND
    product.status='pending'`);
    var obj={"products":products};
    res.render("admin/pending_products.ejs",obj);
})
router.get("/approved_products",async function(req,res){
    var products=await exe(`SELECT * FROM product, product_category,business WHERE 
    product_category.product_category_id =product.product_category_id AND 
    business.business_id = product.business_id AND
    product.status='approved'`);
    var obj={"products":products};
    res.render("admin/approved_products.ejs",obj);
})

router.get("/review_product/:id",async function(req,res){
    var product_info=await exe(`SELECT * FROM product, product_category,business WHERE 
    product_category.product_category_id =product.product_category_id AND 
      business.business_id = product.business_id AND 
      product_id='${req.params.id}'`);
    var obj={"product_info":product_info}
    res.render("admin/review_product.ejs",obj)
})
router.get("/aprove_products/:id", async function(req, res) {
    var today = new Date().toISOString().slice(0, 10);
    var sql = `UPDATE product SET status='approved', verified_date='${today}' WHERE 
    product_id='${req.params.id}'`;
    var data = await exe(sql);
    res.redirect("/admin/pending_products");
})
router.get("/reject_product/:id", async function(req, res) {
    var today = new Date().toISOString().slice(0, 10);
    var sql = `UPDATE product SET status='reject', verified_date='${today}' WHERE product_id='${req.params.id}'`;
    var data = await exe(sql);
    res.redirect("/admin/pending_products");
})

router.get("/rejected_products", async function(req, res) {
    var product_info = await exe(`SELECT * FROM product, product_category,business WHERE 
    product_category.product_category_id =product.product_category_id AND 
    business.business_id = product.business_id AND
    product.status='reject'`);
    var obj = { "product_info": product_info };
    res.render("admin/review_product.ejs", obj);
});



router.get("/orders",async function(req,res){
    var orders=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id`);
    var obj={"orders":orders};
    res.render("admin/orders.ejs",obj);
})
router.get("/order_detail/:order_id",async function(req,res){
    var order_info=await exe(`SELECT * FROM transaction,product,business,order_tbl 
    WHERE order_tbl.transaction_id=transaction.transaction_id AND order_tbl.product_id=product.product_id 
    AND product.business_id=business.business_id AND order_tbl.order_id='${req.params.order_id}'`);
    var obj={"order_info":order_info};
    res.render("admin/order_detail.ejs",obj)
})
router.get("/transfer_to_business/:order_id",function(req,res){
    res.render("admin/transfer_to_business.ejs",req.params);
})
router.post("/save_to_business",async function(req,res){
    business_payment_status='transfered';
    transfer_no=req.body.transfer_no;
    var sql=`UPDATE order_tbl SET business_payment_status='${business_payment_status}',
    transfer_no='${transfer_no}' WHERE order_id='${req.body.order_id}'`;
    var data=await exe(sql);
    // res.send(data)
    res.redirect("/admin/orders")

})


module.exports=router; 



