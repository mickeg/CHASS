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

    Testdata = [
    {
        TaxonID : "100155",
        NAMN: "Mindre timmerman",
        Släktskap: {
            RIKE: "Animalia - djur", 
            STAM: "Arthropoda - leddjur", 
            UNDERSTAM: "Hexapoda - insekter",
            KLASS: "Insecta - egentliga insekter", 
            UNDERKLASS: "", 
            ORDNING: "Coleoptera - skalbaggar",
            UNDERORDNING: "Polyphaga - allätarbaggar",
            ÖVERFAMILJ: "Chrysomeloidea",  
            FAMILJ: "Cerambycidae - långhorningar", 
            UNDERFAMILJ: "Lamiinae",  
            TRIBUS: "Acanthocinini",  
            SLÄKTE: "Acanthocinus",  
            ART: "Acanthocinus griseus(Fabricius, 1792) - mindre timmerman",
            SYNONYMER: "liten timmerman"
        },
        Kännetecken:{
            Wikipedia: "Mindre timmerman blir 9-12 millimeter lång, möjligen upp till 14 millimeter. Skalbaggen är långsmal, platt och gråspräcklig och har mycket långa antenner, betydligt längre än skalbaggens kropp. Särskilt långa är hanens antenner, de är minst två gånger så långa som kroppen, medan honans antenner är lite kortare, cirka en och en halv gång så långa som kroppen. De enskilda antennsegmenten är tvåfärgade, gråvita mot basen och mörka mot spetsen. Förutom längre antenner har hanen även lite längre ben än honan. Ett annat sätt att se skillnad på hane och hona är att honan vid bakkroppsspetsen har ett långt utstickande äggläggningsrör.",
            Artfakta: "En påfallande långsmal och platt skalbagge som blir 12–14 mm lång. Honan är försedd med ett långt äggläggningsrör. Antennerna är mycket långa, hos hanen blir de två gånger längre än resten av kroppen. Färgen är svart med en tät grå behåring som på täckvingarna bildar två tvärband."
        },
        Observationer: [
            {Position : {Latitude: 59.980721, Longitude: 17.250436}},
            {Position : {Latitude: 59.980637, Longitude: 17.250627}},
            {Position : {Latitude: 59.185407, Longitude: 18.269407}}
        ]
    },
    {
        TaxonID : "100146",
        NAMN: "Lövskogslöpare",
        Släktskap: {
            RIKE: "Animalia - djur", 
            STAM: "Arthropoda - leddjur", 
            UNDERSTAM: "Hexapoda - insekter",
            KLASS: "Insecta - egentliga insekter", 
            UNDERKLASS: "", 
            ORDNING: "Coleoptera - skalbaggar",
            UNDERORDNING: "Adephaga - rovskalbaggar",
            ÖVERFAMILJ: "Caraboidea",  
            FAMILJ: "Carabidae - jordlöpare", 
            UNDERFAMILJ: "Harpalinae",  
            TRIBUS: "Pterostichini",  
            SLÄKTE: "Abax",  
            ART: "Abax parallelepipedus(Piller & Mitterpacher, 1783) - lövskogslöpare",
            SYNONYMER: "Abax ater (Villers, 1789)"
        },
        Kännetecken:{
            Wikipedia: "Lövskogslöparen har svarta täckvingar och en bred, nästan fyrkantig svart halssköld. Dess kroppslängd är 18 till 22 millimeter och detta, i kombination med dess kraftiga ben och breda halssköld, ger den ett ganska robust utseende.",
            Artfakta: "En stor, 18–22 mm, enfärgat svart jordlöpare med relativt robust utseende och kraftiga ben. Täckvingarna är djupt längsfårade och halsskölden är påfallande bred och nästan kvadratisk, vilket ger djuret en parallellsidig kroppsform."
        },
        Observationer: [
            {Position : {Latitude: 57.439673, Longitude: 12.194366}}
        ]
    },

    {
        TaxonID : "102004",
        NAMN: "Ekgetingbock",
        Släktskap: {
            RIKE: "Animalia - djur", 
            STAM: "Arthropoda - leddjur", 
            UNDERSTAM: "Hexapoda - insekter",
            KLASS: "Insecta - egentliga insekter", 
            UNDERKLASS: "", 
            ORDNING: "Coleoptera - skalbaggar",
            UNDERORDNING: "Adephaga - allätarbaggar",
            ÖVERFAMILJ: "Chrysomeloidea",  
            FAMILJ: "Cerambycidae - långhorningar", 
            UNDERFAMILJ: "Cerambycinae",  
            TRIBUS: "Clytini",  
            SLÄKTE: "Xylotrechus",  
            ART: "Xylotrechus antilope(Schönherr, 1817) - ekgetingbock",
            SYNONYMER: "smal getingbock"
        },
        Kännetecken:{
            Wikipedia: "",
            Artfakta: "En svart, cylindriskt byggd art som blir 8–14 mm lång. På halsskölden och täckvingarna finns tydliga gulvita hårfläckar. På täckvingarna finns dessutom två tydliga, delvis snedställda tvärband. Färgteckningen ger arten ett utseende som liknar en geting och bör vara ett tydligt exempel på s.k. Bates mimikry. Benen och antenner är gulbruna. Benen är påfallande långa, speciellt barkbenen."
        },
        Observationer: [
            {Position : {Latitude: 56.969171, Longitude: 16.077839}},
            {Position : {Latitude: 56.934637, Longitude: 16.027558}},
            {Position : {Latitude: 57.005427, Longitude: 16.219369}}
        ]
    }

    ]

    res.send(Testdata);
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