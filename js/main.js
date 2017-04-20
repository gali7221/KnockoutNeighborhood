// Initialize the map
var map;
// initialize the infoWindows
var infoWindow;

// Set up the ViewModel
var ViewModel = function() {
    'use strict';

    var self = this;
    self.locations = ko.observableArray([]);
    // perform live update
    self.query = ko.observable('');
    // self.filterLocations = ko.observableArray([]);


    // Create the google map zoomed in on Denver
    self.initMap = function() {
        var mapCanvas = document.getElementById('google-map');
        var cenLatLng = new google.maps.LatLng(40.7413549, -73.9980244);
        var mapOptions = {
            center: cenLatLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
    };

    // Create the list of brewery locations from the model
    self.createMarkers = function() {
        tribeca.forEach(function(location) {
            self.locations.push(new Location(location));
            // bounds.extend(marker.position);
        });
    };

    // Set up event listener
    self.openInfoWindow = function() {
        self.locations().forEach(function(location) {
            google.maps.event.addListener(location.marker(), 'click', function() {
                self.populateInfoWindow(location);
            });
            // google.maps.event.addListener(location.marker(), 'closeclick', function() {
            //     infoWindow.setMarker(null);
            // });
        });
    };

    self.populateInfoWindow = function(marker) {
        infoWindow = new google.maps.InfoWindow();
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.title() + '</div><p id="#foursquare"></p>');
        self.getFourSquare(marker.lat(), marker.lng());
        infoWindow.open(map, marker.marker());


        map.panTo(new google.maps.LatLng(marker.lat(), marker.lng()));
    };

    // Search
    // Filter list
    self.filteredLocations = ko.computed(function() {
        var filter = self.query().toLowerCase();
        // console.log(filter);

        if (!filter) {
            return self.locations();
        } else {
            return ko.utils.arrayFilter(self.locations(), function(item) {
                // return item.marker().setMap(map);
                // item.marker().setVisible(false);
                // return item.title().toLowerCase().indexOf(filter) !== -1;
                // return item.marker().setMap(map);
                if (item.title().toLowerCase().indexOf(filter) !== -1) {
                    item.marker().setVisible(true);
                    item.title().toLowerCase().indexOf(filter) !== -1
                    return true;
                } else {
                    item.marker().setVisible(false);
                    return false;
                }
            });
        }
    });

    self.getFourSquare = function(location1, location2) {
        var d = new Date();
        var date = d.getFullYear().toString() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
        var clientId = 'XCPHQKTMT3N2NWZMWG2BCQ40GHHRD0LBBVZRU354ZVMEUZ25';
        var clientSecret = 'ZC53KE1SVSTOSKR2FPQXIMSGEXC3BVCZTRGBGRUGZZWXLJHE';
        var url = 'https://api.foursquare.com/v2/venues/search?ll=' + location1 + ',' + location2 + '?&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + date;

        // AJAX CALL
        var settings = {
            url: url,
            success: function(results) {
                four = results.response.venues.name;
                $('#foursquare').attr('src', four);
                // var data = {
                //
                // }
            }
            // var html = template(name);

        }
        $.ajax(settings);
    }
}
// Constructor to create Tribeca markers
var Location = function(data) {
    'use strict';

    // Set all the properties as knockout observables
    var marker;
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);


    var bounds = new google.maps.LatLngBounds();
    // Google Maps Marker for this location
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat(), this.lng()),
        map: map,
        title: this.title(),
        animation: google.maps.Animation.DROP
    });

    // Set the marker as a knockout observable
    this.marker = ko.observable(marker);
    // bounds.extend(this.marker);
};

function initialize() {

    viewModel = new ViewModel();

    viewModel.initMap();
    viewModel.createMarkers();
    viewModel.openInfoWindow();
    // viewModel.filterLocations(viewModel.locations());
    viewModel.filteredLocations();


    // Activate Knockout
    ko.applyBindings(viewModel);
}
