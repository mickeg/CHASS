var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');

//const csv = require('csvtojson');
/*
const converter = csv({
            delimiter: ";"
        }, {});
        */

var proj4 = require('proj4');

var Converter = require("csvtojson").Converter;
var converter = new Converter({delimiter: ["."]}, {delimiter: ["."]});
var csvArray = [];

app.use(express.static(__dirname + '/../php/img'));
app.listen(8080);

app.get('/image', function (req, res) {
    var filepath = path.resolve(__dirname + "/../php/img/"+req.query.taxonId+"_"+req.query.image+".jpg");
    res.sendFile(filepath);
});

app.get('/imageDirectory', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const folder = path.resolve(__dirname + "/../php/img/");

    fs.readdir(folder, (err, files) => {
        res.send(files);
        /*
        files.forEach(file => {
            //console.log(file);
        });
        */
    })
});


app.get('/csv', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var inputFile = path.resolve(__dirname + '/Fåglar_2016-08-01_csv_comma.csv');
    var filen = path.resolve(__dirname + '/test.csv');
    var test = {};
    var koordinater = [];
    var converter = new Converter({});
    converter.fromFile(inputFile,function(err,result){ 
         koordinater.push({a: "ej", b:"sadas"});
        res.send(result);
       
        //console.log(result);
    });
    console.log(koordinater.length);
    for(i=0;i<koordinater.length; i++){
        console.log(i);
    }
});

function asyncFunc(result){
    csvArray.push(result);
    console.log(csvArray);
}

app.get('/convert', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var X = req.query.X;
    var Y = req.query.Y;

    var t = convertToWGS84(X, Y);
    res.send(t);
});


app.get('/testdata', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    var file = require("../js/testdata.js");
    
    
    res.send(file.Testdata);

});





function convertToWGS84(X,Y){
    proj4.defs([
    ['WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"],
    ['RT90',"+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs"]
    ]);
    
    //var source='WGS84';
    //var target='SWEREF99TM';

    var source='RT90';
    var target='WGS84';
    

    var result = proj4(source, target, [X, Y]);
    //console.log("converting...");
    return result;
}