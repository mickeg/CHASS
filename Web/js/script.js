/* global $ */
weather = {};

$( document ).ready(function() {
    init();

    function init(){
        console.log('ready');
        ajaxLoad();
    }


    
    function ajaxLoad(){
        $.support.cors = true;
        $.ajax({
            url: 'http://opendata-download-metanalys.smhi.se/api/category/mesan1g/version/1/geotype/point/lon/17.9799/lat/59.3830/data.json',
            dataType: "json",
            success: function(data) {
                parseWeather(data)
                //console.log('success', data);
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