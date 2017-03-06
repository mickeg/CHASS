/* global $ */
weather = {};

$( document ).ready(function() {
    init();

    function init(){
        initSelectors();
        console.log('ready');
/*
        var s = "Lövskogslöparen har svarta täckvingar och en bred, nästan fyrkantig svart halssköld. Dess kroppslängd är 18 till 22 millimeter och detta, i kombination med dess kraftiga ben och breda halssköld, ger den ett ganska robust utseende.";
        var s = "En påfallande långsmal och platt skalbagge som blir 12–14 mm lång. Honan är försedd med ett långt äggläggningsrör. Antennerna är mycket långa, hos hanen blir de två gånger längre än resten av kroppen. Färgen är svart med en tät grå behåring som på täckvingarna bildar två tvärband.";
        
        parseText(s);

*/
        //ajaxLoadWeather();
        //ajaxLoadImages();
        //ajaxLoadObservationsCSV();
    }

    

    function initSelectors(){
        $("#clickimages").click(function(){
            $("#result").empty();
            console.log("images");
            ajaxLoadImages();
        });

        $("#clickobservations").click(function(){
            $("#result").empty();
            console.log("observations");
            ajaxLoadObservationsCSV();
        });

        $("#clickdemo").click(function(){
            $("#result").empty();
            console.log("demo");
            ajaxLoadDemo();
        });

        $("#whatisthis").click(function(){
            $("#result").empty();
            console.log("what is this?");
             $("#result").append("Vad ser du? <select name='organismgrupper'><option value='fågel'>Fågel</option><option value='skalbagge'>Skalbagge</option><option value='fisk'>Fisk</option></select>");
        })
    }

    function ajaxLoadDemo(){
        $.support.cors = true;
        $.ajax({
            url: 'http://127.0.0.1:8080/testdata',
            dataType: "json",
            crossDomain: true,
            success: function(data) {
                console.log(data)
                doStuffWithDemoData(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    
    function doStuffWithDemoData(demodata){ 
        $.each(demodata, function( index, value ) {
            $("#result").append(demodata[index].NAMN + "</br>");
            $("#result").append(demodata[index].TaxonID + "</br>");
            $("#result").append("<img src='http://127.0.0.1:8080/"+demodata[index].TaxonID+"_1.jpg'>");
            $("#result").append("<img src='http://127.0.0.1:8080/"+demodata[index].TaxonID+"_2.jpg'>");
            $("#result").append("<img src='http://127.0.0.1:8080/"+demodata[index].TaxonID+"_3.jpg'>" + "</br>");
            $("#result").append(demodata[index].Kännetecken.Artfakta + "</br>");
            var textParam = parseText(demodata[index].Kännetecken.Artfakta);
            console.log("tp:",textParam);
            //colors:
            $("#result").append("<b>Parametrar</b></br>");
            $("#result").append("Färger: </br>");
            
            for(i=0;i<textParam.colors.length; i++){
                $("#result").append("<div id='div1' style='display:inline;float:left; background-color:"+textParam.colors[i].hex+";width:20px'>&nbsp;</div>");
                $("#result").append(textParam.colors[i].color);
                $("#result").append("</br>");
            }

            $("#result").append("</br>");
            
            //console.log(value);
        });
    }

    function parseText(s){
        TextParametrar = {};
        //console.log("parse "+s);

        var colors = findColors(s);
        console.log("resultat",colors);
        TextParametrar.colors = colors;
        return TextParametrar;

    }

    function findColors(s){
        //console.log("find colors "+s);
        listofcolors = [
            {color: "röd", hex: "#ff0000"}, 
            {color: "svart", hex: "#000"}, 
            {color: "blå", hex: "#0000ff"}, 
            {color: "grön", hex: "#00ff00"}, 
            {color: "gul", hex: "#ffff00"}, 
            {color: "vit", hex: "#fff"}, 
            {color: "grå", hex: "#cccccc"}, 
            {color: "orange", hex: "#ffa500"}, 
            {color: "brun", hex: "#964b00"}
        ];
        resultcolors = [];
        for(i=0; i<listofcolors.length; i++){
            if(s.indexOf(listofcolors[i].color) > 0){
                //console.log(i+": "+s.indexOf(listofcolors[i]));
                var colorPos = s.indexOf(listofcolors[i].color);
                var colorString = s.substr(colorPos);
                var colorWord = colorString.substr(0, colorString.indexOf(' '));
                var color = listofcolors[i];
                //console.log(colorWord +" matchar: "+color);
                resultcolors.push(color);
            }
        }
        console.log("return:", resultcolors);
        return resultcolors;
    }


    function ajaxLoadObservationsCSV(){
        $.support.cors = true;
        $.ajax({
            url: 'http://127.0.0.1:8080/csv',
            dataType: "json",
            crossDomain: true,
            success: function(data) {
                //console.log(data)
                doStuffWithObservations(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    function doStuffWithObservations(observations){
        $.each(observations, function( index, value ) {
            //var imagepath="<img src='http://127.0.0.1:8080/"+value+"'>";
            //console.log(value);
            //$("#result").append(value);
            

            $("#result").append(observations[index].Artnamn + "</br>");
            $("#result").append(observations[index].Antal +" st.</br>");
            $("#result").append("Koordinater: "+observations[index].Nordkoordinat + " Nord, ");
            $("#result").append(observations[index].Ostkoordinat+" Ost </br>");
            var wgs84 = ajaxLookupWGS84(999, 999);
            console.log(wgs84);
            //$("#result").append("WGS84: " +wgs84);
            //console.log(ajaxLookupWGS84(observations[index].Nordkoordinat, observations[index].Ostkoordinat));
            $("#result").append(observations[index]["Vetenskapligt namn"] +"</br>");
            $("#result").append(observations[index].Kommun+" Kommun");
            $("#result").append("</br></br>");
            //console.log(observations[index]);
        });
    }

    function ajaxLookupWGS84(X, Y){
        $.support.cors = true;
        $.ajax({
            url: 'http://127.0.0.1:8080/convert?X='+X+'&Y='+Y,
            dataType: "json",
            success: function(data) {
                //return data;
                console.log(data)
                //doStuffWithImages(JSON.parse(data));
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }



    function ajaxLoadImages(){
        $.support.cors = true;
        $.ajax({
            url: 'http://127.0.0.1:8080/imageDirectory',
            dataType: "html",
            success: function(data) {
                //console.log(data)
                doStuffWithImages(JSON.parse(data));
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    function doStuffWithImages(images){
        console.log( images.constructor === Array  );
        
        $.each(images, function( index, value ) {
            var imagepath="<img src='http://127.0.0.1:8080/"+value+"'>";
            console.log(imagepath);
            $("#result").append(imagepath);
        });
    }

    function ajaxLoadWeather(){
        $.support.cors = true;
        $.ajax({
            url: 'http://opendata-download-metanalys.smhi.se/api/category/mesan1g/version/1/geotype/point/lon/17.9799/lat/59.3830/data.json',
            dataType: "json",
            success: function(data) {
                parseWeather(data)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    function parseWeather(d){
        console.log(d);
        weather.Time = d.approvedTime;
        weather.LocationLatLon = d.geometry.coordinates[0];
        weather.AirTemp = d.timeSeries[0].parameters[0].values[0];
        weather.AirTempUnit = d.timeSeries[0].parameters[0].unit;

        console.log('tid: ', weather.Time);
        console.log('location: ', weather.LocationLatLon);
        console.log('temperatur: ', weather.AirTemp);
        console.log('enhet: ', weather.AirTempUnit);
    }

});

