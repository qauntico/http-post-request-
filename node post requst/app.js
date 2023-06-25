const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})
app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address:email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
// we are converting the member list above into a json object
    const jsonData = JSON.stringify(data)
    const url = 'https://us21.api.mailchimp.com/3.0/lists/9b6533cbbb' 
    const options = {
        method: "POST",
        auth: "fabrice:8074f6dffe9a8a7a86c1cba1adb090e8-us21"
    }
//here we are making get requests to an external server using node. you can check this on google "how to make make get request to an external server using node"
    const request = https.request(url,options,function(response){
        const status = response.statusCode;
        if (status === 200){
            res.sendFile(__dirname+"/success.html")
        }else {
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data", function(data){
        // the method JSON.parse is takes the date resturn from the external server and turns it into a json data
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})
app.post("/failure", function(req,res){
    res.redirect("/")
})
app.listen(process.env.PORT || 3000)

//
//