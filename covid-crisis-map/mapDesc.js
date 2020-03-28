// navigator.geolocation.getCurrentPosition(function(location) {
//   map.remove();
//   var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

//   var mymap = L.map('map').setView(latlng, 7)
//   // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   //   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//   // }).addTo(map);
//   L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token={accessToken}', {
//     maxZoom: 18,
//     accessToken: 'pk.eyJ1IjoiYmJyb29rMTU0IiwiYSI6ImNpcXN3dnJrdDAwMGNmd250bjhvZXpnbWsifQ.Nf9Zkfchos577IanoKMoYQ'
//   }).addTo(mymap);

// });

var template = '<form id="popup-form">\
  <table class="popup-table">\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Name:</th>\
      <td id="value-name">\
      <input id="name" type="text" /></td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Type:</th>\
      <td id="value-type">\
        <select id="typeVal"><option value="Grocery Shop">Grocery shop</option><option value="Hospital">Hospital</option><option value="Gas station">Gas station</option></select>\
      </td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Opening time:</th>\
      <td id="value-opening">\
      <input id="opening" type="time"/></td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Closing time:</th>\
      <td id="value-closing">\
      <input id="closing" type="time"/></td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Remarks:</th>\
      <td id="value-remarks">\
      <input id="remarks" type="text" /></td>\
    </tr>\
  </table>\
  <button id="button-submit" type="button">Save Changes</button>\
  <button id="button-delete" type="button">Delete marker</button>\
</form>';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDlPeuVOGwc1N6SvIhoaqdFDAzR-FHT3Rs",
  authDomain: "covid-crisis-map.firebaseapp.com",
  databaseURL: "https://covid-crisis-map.firebaseio.com",
  projectId: "covid-crisis-map",
  storageBucket: "covid-crisis-map.appspot.com",
  messagingSenderId: "834271687564",
  appId: "1:834271687564:web:e8808a2ba2f14692b39ca9",
  measurementId: "G-S0B6BSJ6LM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();

 
// Read data
var geojsonData = database.ref('geojson');
geojsonData.on("value", function(snapshot) {
 snapshot.forEach(function(childSnapshot) {
  var childData = childSnapshot.val();
  var id=childData.id;
  console.log(childData);

  L.geoJson({
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [childData.lat, childData.lng]
        },
        "properties": {
        }
      }]
    },
    {
      onEachFeature: function (feature, layer) {
    layer.bindPopup('<table class="popup-table">\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Name:</th>\
      <td id="value-name">\
      ' + childData.name + '</td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Type:</th>\
      <td id="value-type">\
        ' + childData.type + '</td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Opening time:</th>\
      <td id="value-opening">\
      ' + childData.opening + '</td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Closing time:</th>\
      <td id="value-closing">\
      ' + childData.closing + '</td>\
    </tr>\
    <tr class="popup-table-row">\
      <th class="popup-table-header">Remarks:</th>\
      <td id="value-remarks">\
      ' + childData.remarks + '</td>\
    </tr>\
  </table>');
  }
    }).addTo(map);
 });
});


function layerClickHandler (e) {
  var shelterMarkers = new L.FeatureGroup();
  var marker = e.target,
      properties = e.target.feature.properties;
  
  if (marker.hasOwnProperty('_popup')) {
    console.log('has prop');

    marker.bindPopup(template);
    marker.openPopup();
    L.DomUtil.get('value-name').textContent = marker.feature.properties.name;
    L.DomUtil.get('value-type').textContent = marker.feature.properties.type;
    L.DomUtil.get('value-remarks').textContent = marker.feature.properties.remarks;
    L.DomUtil.get('value-opening').textContent = marker.feature.properties.opening;
    L.DomUtil.get('value-closing').textContent = marker.feature.properties.closing;
    L.DomUtil.get('button-submit').style.display = "none";
    marker.unbindPopup();


    var buttonDelete = L.DomUtil.get('button-delete');
    L.DomEvent.addListener(buttonDelete, 'click', function (e) {
      confirm("Are you sure want to delete this marker?");
      marker.unbindPopup();
      map.removeLayer(marker);
    });
  }
  else
  {
    marker.bindPopup(template);
    marker.openPopup();

    var buttonSubmit = L.DomUtil.get('button-submit');
    L.DomEvent.addListener(buttonSubmit, 'click', function (e) {
      var entity_name = L.DomUtil.get('name').value;
      var entity_type = L.DomUtil.get('typeVal').value;
      var entity_remarks = L.DomUtil.get('remarks').value;
      var entity_opening = L.DomUtil.get('opening').value;
      var entity_closing = L.DomUtil.get('closing').value;

      L.DomUtil.get('value-name').textContent = entity_name;
      L.DomUtil.get('value-type').textContent = entity_type;
      L.DomUtil.get('value-remarks').textContent = entity_remarks;
      L.DomUtil.get('value-opening').textContent = entity_opening;
      L.DomUtil.get('value-closing').textContent = entity_closing;
      L.DomUtil.get('button-submit').style.display = "none";

      marker.feature.properties.name = entity_name;
      marker.feature.properties.type = entity_type;
      marker.feature.properties.remarks = entity_remarks;
      marker.feature.properties.opening = entity_opening;
      marker.feature.properties.closing = entity_closing;

      console.log(marker);

      firebase.database().ref('geojson').push({
        lat: marker.feature.geometry.coordinates[0],
        lng: marker.feature.geometry.coordinates[1],
        name: entity_name,
        type: entity_type,
        opening: entity_opening,
        closing: entity_closing,
        remarks: entity_remarks
      });


      shelterMarkers.addLayer(marker);

      map.on('zoomend', function() {
          if (map.getZoom() < 9){
                  map.removeLayer(shelterMarkers);
          }
          else {
                  map.addLayer(shelterMarkers);
              }
      });
    });

    var buttonDelete = L.DomUtil.get('button-delete');
    L.DomEvent.addListener(buttonDelete, 'click', function (e) {
      confirm("Are you sure want to delete this marker?");
      map.removeLayer(marker);
    });
  }
}


// Initialize the map and assign it to a variable for later use
var map = L.map('map', {
    // Set latitude and longitude of the map center (required)
    center: [20.5937, 78.9629],
    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
    zoom: 5
});

L.control.scale().addTo(map);

// Create a Tile Layer and add it to the map
//var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var searchControl = new L.esri.Controls.Geosearch().addTo(map);

  var results = new L.LayerGroup().addTo(map);

  searchControl.on('results', function(data){
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      // results.addLayer(L.marker(data.results[i].latlng));
    }
  });

setTimeout(function(){$('.pointer').fadeOut('slow');},3400);


map.on('click', 
  function(e){
    L.geoJson({
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [e.latlng.lng,e.latlng.lat]
        },
        "properties": {
        }
      }]
    },
    {
      onEachFeature: function (feature, layer) {
        layer.on('click', layerClickHandler);
      }
    }).addTo(map);
});
