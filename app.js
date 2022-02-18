const express=require("express")
const bp= require("body-parser")
const request=require("request")
const https=require("https")

const app=express()
app.use(bp.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/",function(req,res){
    console.log("File running");
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    }
    const ob=JSON.stringify(data);

    const url="mailchimp-link";
    const options={
        method:"POST",
        auth:"mailchimp-token"
    }
    
    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data))

        })
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }
        else
        {
            res.sendFile(__dirname+"/failure.html")
        }
        
    })
    request.write(ob);
    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server running")
})

