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

    const url="https://us20.api.mailchimp.com/3.0/lists/9eb10414d2";
    const options={
        method:"POST",
        auth:"rounak:9d4d3e45b22f52dcbaa5a587fa50bed3-us20"
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

//9d4d3e45b22f52dcbaa5a587fa50bed3-us20

//9eb10414d2
app.listen(process.env.PORT || 3000,function(){
    console.log("Server running")
})

