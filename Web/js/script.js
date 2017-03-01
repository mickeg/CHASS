/* global $ */
weather = {};

$( document ).ready(function() {
    init();

    function init(){
        console.log('ready');
        ajaxLoadWeather();
        ajaxLoadImages();
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