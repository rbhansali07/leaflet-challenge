// Store API query variables
//var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 4
});

// Adding tile layer to the map

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {

  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

function onEachFeature(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag  + 
      	"<br>Location: " + feature.properties.place + 
      	"<br>Time Instant: " + feature.properties.time);
    }

var magColor = "";

function eqMagColor(mag) {
	if (mag>5){
		magColor = "red";	
	}
	else if (mag>4){
		magColor = "orange";
	}
	else if (mag>3){
		magColor = "yellow";
	}
	else if (mag>2){
		magColor = "green";
	}
	else {
		magColor = "blue";
	}
	return magColor;
}

var earthquakes = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlang) {
    	return L.circleMarker(latlang, {radius: feature.properties.mag * 3,
    									stroke: false,
      									fillOpacity: 0.75,
      									color: "white",
      									fillColor: eqMagColor(feature.properties.mag)} )
    }
  });

// Grab data with d3

d3.json(baseURL, function(data) {
  earthquakes.addData(data);
});

earthquakes.addTo(myMap);

var legend = L.control({ position: "bottomright" });
      // Add min & max

legend.onAdd = function(map) {
  	var div = L.DomUtil.create("div", "info legend");
	var limits = [0, 2, 3, 4, 5];
	var labels = ["blue", "green", "yellow", "orange", "red"];
	

	//limits.forEach(function(limit, index) {
	for (var i=0; i < limits.length; i++) {

		div.innerHTML += 
			'<i style="background: ' + eqMagColor(limits[i] +1) + '"></i> '+ limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');

	}
		
	    //labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");


	//div.innerHTML += "<ul>" + labels.join("") + "</ul>";
 	return div;
};

  // Adding legend to the map
legend.addTo(myMap);





