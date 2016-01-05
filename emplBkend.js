/**
 * Created by Neema on 10/20/2015.
 */
/**
 * Created by Neema on 10/19/2015.
 */
var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser=require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/www')));
var mongojs=require('mongojs');
var db=mongojs('emplList',['employees']);//Which database and collection


app.get("/emplList",function(req,res){
    db.employees.find(function(err,docs){
        res.json(docs);
    })
});


app.post("/createEmpl",function(req,res){
    db.employees.insert(req.body,function(err,docs){
        res.json(docs._id);
    })
});
app.put("/updateManager/:id",function(req,res){
     console.log(req.body);
    db.employees.findAndModify({query:{_id:mongojs.ObjectId(req.params.id)},update:{$set:{Reports:req.body}}
          ,new:true},
        function(err,docs){
            res.json(docs);
        });
});
//{$set:{Reports:req.body.Reports}}
app.delete("/emplList/:id",function(req,res){
    db.employees.remove({_id:mongojs.ObjectId(req.params.id)},function(err,docs){
        res.json(docs);
    })
});

app.get("/emplList/:id",function(req,res){
    db.employees.findOne({_id:mongojs.ObjectId(req.params.id)},function(err,docs){
        res.json(docs);
    })
});

//,Reports:{addToSet:[req.body.Reports]}

app.put("/emplList/:id",function(req,res){
    db.employees.findAndModify({query:{_id:mongojs.ObjectId(req.params.id)},update: {$set:
        {name:req.body.name,Title:req.body.Title,Location:req.body.Location,
            Manager:req.body.Manager, Office:req.body.Office,Cell:req.body.Cell,
            SMS:req.body.SMS,Email:req.body.Email}}
            ,new:true},
        function(err,docs){
        res.json(docs);
    });
});

http.createServer(app).listen(8888, function() {
    console.log('Express App started');

});