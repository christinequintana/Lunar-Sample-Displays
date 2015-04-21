var mapLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		attributions: [new ol.Attribution({
			html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
			})],
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
	})
});

var points = new ol.layer.Vector({
	source: new ol.source.KML({
		url: '/data/Lunar_Samples.kml',
		projection: 'EPSG:3857',
		extractStyles: false
	}),
	style: new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 46],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			src: '/data/moon_icon.png',
			opacity: 1
		})
	})
});

var map = new ol.Map({
	target: 'map',
	layers: [mapLayer, points],
	controls: [new ol.control.Attribution()],
	interactions: ol.interaction.defaults({mouseWheelZoom:true}),
	view: new ol.View({
		center: ol.proj.transform([0, 25], 'EPSG:4326', 'EPSG:3857'),
		zoom: 1.25
	})
});

// Initialize tooltip
var info = $('#info');
info.tooltip({
	animation: false,
	trigger: 'manual'
});

var displayFeatureInfo = function(pixel) {
	info.css({
		left: pixel[0] + 'px',
		top: (pixel[1] - 15) + 'px'
	});
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	if (feature) {
		info.tooltip('hide')
			.attr('data-original-title', feature.get('name') + feature.get('description'))
			.tooltip('fixTitle')
			.tooltip('show');
	} else {
		info.tooltip('hide');
	}
};

$(map.getViewport()).on('mousemove', function(evt) {
	displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});

map.on('click', function(evt) {
	displayFeatureInfo(evt.pixel);
});
