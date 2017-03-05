/* global $ */
weather = {};

$( document ).ready(function() {
    init();

    function init(){
        initSelectors();
        console.log('ready');
        ajaxLoadWeather();
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

