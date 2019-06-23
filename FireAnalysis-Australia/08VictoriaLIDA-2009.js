//bands to be considered
var Landsat_8_BANDS = ["B2","B3","B4","B5","B6","B7"];
var STD_NAMES = ["blue","green","red","nir","swir1","swir2"];

//Center Map
Map.setCenter(-121.621, 39.762, 13);

//filtering against Paradise at [about] half-year resolution
var landsat_SR = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR") //load collection 1 - LANDSAT8 raws post-CampFire
	.filterBounds(Paradise)
	.filterDate("2019-01-01","2019-06-01")
	// Filter cloudy scenes.
  .filter(ee.Filter.lt("CLOUD_COVER", 35))
	.select(Landsat_8_BANDS, STD_NAMES);

print(landsat_SR); //date debug

var median = landsat_SR.median();

//Display the Composite
Map.addLayer(landsat_SR, {"bands":["red","green","blue"],min:0,max:2000}, "baselayer", 0, 1);

function addNDVI(image) {
  return image
    .addBands(image.normalizedDifference(["nir","red"]).rename("ndvi"))
  ;
}

var ndvi = addNDVI(median);

Map.addLayer(ndvi,{bands:["ndvi"],min:0,max:1}, "ndvilayer", 0, 1);

//predict bands
var predictionBands = ["blue","green","red","nir","swir1","swir2","ndvi"];

var trainingimage = ndvi.select(predictionBands);

//fusion-table of polygons drawn in Google Earth Desktop
var trainingpolygons = ee.FeatureCollection("ft:1fJTAvmqprnXrKiKjCfjevexnlQUeCV_XErp6zQIO");

var training = trainingimage.sampleRegions({
    collection: trainingpolygons,
    properties: ["class"],
    scale: 30
});

//Train the CART classifier (a regular expression, not made up) with default parameters
var trained = ee.Classifier.cart().train(training,"class", predictionBands);

//Classify image with the same bands used for training.
var CARTclassified = trainingimage.select(predictionBands).classify(trained);

//Display the result using 0=barren, 1=urban, 2=green, 3=water
Map.addLayer(CARTclassified, {min: 0, max: 3, palette: ["784800","FFF44F","228B22","97CAF9"]}, "CARTclassification", 1, 0.75);

var single = CARTclassified;

//Classification Image Export
//Visualization Settings
var vis = {
  min: 0, 
  max: 3,
  palette: ["784800","FFF44F","228B22","97CAF9"]
};

// visualize image using visOpts above
// turning it into 8-bit RGB image.
single = single.visualize(vis);

// obtain native scale of RGB bands
var scale = single.projection().nominalScale().getInfo();

// add an alpha channel as 4th band to mask no data regions
var mask = single.mask().reduce(ee.Reducer.min())
    .multiply(255).toByte();
single = single.addBands(mask);

//Landsat True-Color Image Export
Export.image.toDrive({
  image: single,
  description: "classifiedImage_postFire2009_Paradise_BigSquare",
  folder: "",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
})