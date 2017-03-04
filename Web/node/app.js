var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
const csvFilePath='<path to csv file>'
const csv=require('csvtojson')

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
    var inputFile = path.resolve(__dirname + '/Fåglar_2016-08-01_csv.csv');
    var result = [];
    csv()
    .fromFile(inputFile)
    .on('json',(jsonObj)=>{
        result.push(jsonObj);
    })
    .on('done',(error)=>{
        console.log('end')
        res.send(result);
    })
});

