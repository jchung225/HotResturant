var express = require("express");
var bodyparser = require("body-parser");
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended:false }));
app.use(bodyparser.json());

// table storage
var data = {
    resrvations:[],
    waitlist:[],
};

var visitorCount=0;

app.get("/", function(req, res){
    res.sendfile(path.join(__dirname, "home.html"));
    visitorCount++;
});

app.get("/reserve", function(req, res){
    res.sendfile(path.join(__dirname, "reserve.html"));
});

app.get("/tables", function(req, res){
    res.sendfile(path.join(__dirname,"tables.html"));
});

app.get("/api/", function(req, res){
    res.json(data);
});

app.get("/api/clear", function(req, res){
    data.reservations.length = 0;
    data.waitlist.length = 0;
    res.json(data);
});

app.get("/api/visitors", function(req,res){
    res.json(visitorCount);
});
    

app.post("/api/new", function(req, res){
    var tabledata = req.body;
    console.log(tabledata);
    if (tabledata && tabledata.name) {
        tabledata.routename = tabledata.name.replace(/\s+/g,"").tolowercase();
    }
    console.log(tabledata);

    if (data.resrvations.length <5){
        data.resrvations.push(tabledata);
    } else {
        data.waitlist.push(tabledata);
    }

    res.json(tabledata);
});


app.get("/api/new", function(req,res){
    var tableId = req.params.id;

    if(tableId){
        console.log(tableId);
        for (var i=0; i < data.resrvations.length; i++) {
            if (tableId === data.resrvations[i].id){
                data.resrvations.splice(i,1);
                if (data.waitlist.length > 0) {
                    var tempTable = data.waitlist.splice(0,1)[0];
                    data.reservations.push(tempTable);
                }
                return res.json(true);
            }
        }
        for (var i =0; i < data.waitlist.length; i++) {
            if (tableId === data.waitlist[i].id) {
                data.waitlist.splice(i,1);

                return res.json(true);
            }
        }
        return res.json(false);
    }
    return res.json(false);
});

app.listen(PORT, function(){
    console.log("App listing on PORT" + PORT);
});