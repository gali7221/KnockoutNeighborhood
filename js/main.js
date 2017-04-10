/* ViewModel - JS that defines the data and behavior of your UI*/
var tribeca = [{
        title: 'Park Ave Penthouse',
        lat: 40.7713024,
        lng: -73.9632393
    },
    {
        title: 'Chelsea Loft',
        lat: 40.7444883,
        lng: -73.9949465
    },
    {
        title: 'Union Square Open Floor Plan',
        lat: 40.7347062,
        lng: -73.9895759
    },
    {
        title: 'East Village Hip Studio',
        lat: 40.7281777,
        lng: -73.984377
    },
    {
        title: 'TriBeCa Artsy Bachelor Pad',
        lat: 40.7195264,
        lng: -74.0089934
    },
    {
        title: 'Chinatown Homey Space',
        lat: 40.7180628,
        lng: -73.9961237
    }
];

var map;

function ViewModel() {
    // strict mode will prevent the use of undeclared variables
    'use strict';

    // set this to self so you don't lose context!
    // this is likely when accessing properties from another object
    var self = this;
    // create ko.observablearray for all items in Model
    self.locations = ko.observableArray([]);

    // Initialize the Map
    self.initMap = function() {
        // create a new instance
        // specify where on the page to load the map - this will be the map div that created
        self.map = new google.maps.Map(document.getElementById('google-map'), {
            // offer a lat/lng to the center object literal
            center: {
                lat: 40.7413549,
                lng: -73.9980244
            },
            zoom: 12, // how close detail you desire. Range 1 - 21
            mapTypeControl: false // offers user toggle between different maps: satellite, terrain, etc.
        });

        self.buildLocations = function() {
            tribeca.forEach(function(t) {
                self.locations.push(new Location(t));
            });
        };
    };


}

// Constructor is responsible for creating new marker objects and placing marker objects on map
var Location = function(data) {
    var marker;
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);

    // Google Maps Marker for location
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat(), this.lng()),
        map: map,
        title: this.title()
    });

    // turn marker into an knockout observable
    this.marker = ko.observable(marker);

}

var viewModel;

function initialize() {

    viewModel = new ViewModel();

    viewModel.initMap();
    viewModel.buildLocations();
    console.log(self.locations());

    // Activate Knockout
    ko.applyBindings(viewModel);
}
