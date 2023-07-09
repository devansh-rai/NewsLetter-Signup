const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("Public"));            //for using static pages linked with signup.html

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    console.log(firstname + " " + lastname + " " + email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsondata = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/fbcad6a10f";
    const options = {
        method: "POST",
        auth: "devansh_rai:d69614de6a81ec4ce25089910479bc83-us17"
    };
    const request = https.request(url, options, function (response) {

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsondata);
    request.end();
});

//FAILURE ROUTE
app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {             //dynamic port or local port
    console.log("Server is live now");
})

// API Key
// d69614de6a81ec4ce25089910479bc83-us17

//LIST id
// fbcad6a10f