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

        $("#filter").click(function(){
            $("#result").empty();
            ajaxLoadFilter();
        });

        /*
        $("#whatisthis").click(function(){
            $("#result").empty();
            console.log("what is this?");
             $("#result").append("Vad ser du? <select name='organismgrupper'><option value='fågel'>Fågel</option><option value='skalbagge'>Skalbagge</option><option value='fisk'>Fisk</option></select>");
        })
        */
    }

    function ajaxLoadDemo(){
        $.support.cors = true;
        $.ajax({
            url: 'http://127.0.0.1:8080/testdata',
            dataType: "json",
            crossDomain: true,
            success: function(data) {
                //console.log(data)
                doStuffWithDemoData(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    function ajaxLoadFilter(){
        $.support.cors = true;
        $.ajax({
            url: 'http://127.0.0.1:8080/filter',
            dataType: "html",
            crossDomain: true,
            success: function(html) {
                loadFilterView(html);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('error ' + textStatus + " " + errorThrown);
            }
        });
    }

    function loadFilterView(html) {
        $("#result").append(html);
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

            $("#result").append("<b>Parametrar</b></br>");
            
            if(textParam.colors.length > 0){
                $("#result").append("Färger: </br>");
            }

            for(i=0;i<textParam.colors.length; i++){
                $("#result").append("<div id='div1' style='display:inline;float:left; background-color:"+textParam.colors[i].hex+";width:20px'>&nbsp;</div>");
                $("#result").append(textParam.colors[i].color);
                $("#result").append("</br>");
            }
            $("#result").append("</br>");

            console.log(textParam);
            if(textParam.lengths.length > 0){
                $("#result").append("Mått: </br>");
            }

            for(i=0;i<textParam.lengths.length; i++){
                $("#result").append(textParam.lengths[i].measureAndValue);
                $("#result").append("</br>");
            }

            $("#result").append("</br>");
            
        });
    }

    /*
    Borde göra en för att bara hitta taggar som t.ex. "smal", "platt" osv...
    */

    function parseText(s){
        TextParametrar = {};
        //console.log("parse "+s);

        var colors = findColors(s);
        var lengths = findLengths(s);
        console.log("resultat",lengths);

        TextParametrar.colors = colors;
        TextParametrar.lengths = lengths;
        return TextParametrar; 

    }

    function findColors(s){
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
            if(s.indexOf(listofcolors[i].color) >= 0){
                var colorPos = s.indexOf(listofcolors[i].color);
                var colorString = s.substr(colorPos);
                var colorWord = colorString.substr(0, colorString.indexOf(' '));
                var color = listofcolors[i];
                resultcolors.push(color);
            }
        }
        return resultcolors;
    }

    function findLengths(s){
        listofmeasurements = [
            {measure: " mm ", measureText: "mm"},  //MeasureText för att inte få med "mm," t.ex.
            {measure: " cm ", measureText: "cm"}, 
            {measure: " dm ", measureText: "dm"}, 
            {measure: " m ", measureText: "m"},
            {measure: " mm, ", measureText: "mm"}, 
            {measure: " cm, ", measureText: "cm"}, 
            {measure: " dm, ", measureText: "dm"}, 
            {measure: " m, ", measureText: "m"}
            //Ta dessa i en separat funktion?
            //{measure: "millimeter"}, 
            //{measure: "centimeter"}, 
            //{measure: "decimeter"}, 
            //{measure: "meter"}
        ];
        resultmeasurements = [];
        for(i=0; i<listofmeasurements.length; i++){
            if(s.indexOf(listofmeasurements[i].measure) > 0){
                var measurePos = s.indexOf(listofmeasurements[i].measure);
                var measureString = s.substr(measurePos);
                var measureStringBefore = s.substr(measurePos-5);   //Magiskt nummer 5... backar vi 5 steg från mm "brukar" det vara t.ex. "12-20 "
                var measureWord = measureString.substr(0, measureString.indexOf(' '));
                var measureValue = measureStringBefore.replace(/[^0-9\–-]/g,''); //tar bort alla icke-numeriska tecken förutom varianter av "-".
                var measure = listofmeasurements[i];
                //resultmeasurements.push(measure);
                resultmeasurements.push({measure:measure.measureText, value: measureValue, measureAndValue: measureValue + " " +measure.measureText});
            }
        }
        console.log("resmeasu",resultmeasurements);
        return resultmeasurements;
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
            var path = 'http://127.0.0.1:8080/'+value;
            console.log(imagepath);
            $("#result").append('<a href='+path+'>'+imagepath+'</a>');
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

