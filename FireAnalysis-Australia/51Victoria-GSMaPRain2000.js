/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = 
    /* color: #ff6c64 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[144.84399398906248, -37.18091645226004],
          [144.84399398906248, -38.13760786176182],
          [146.16235336406248, -38.13760786176182],
          [146.16235336406248, -37.18091645226004]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Import the Province of Victoria from Fusion Table
var Victoria = ee.FeatureCollection("ft:1UzSGq1cWUA5PloR9VxO7AVTu4vVXL3BHNiJKv6XB").geometry();

// Also import the metropolitan regions of Melbourne, Buxton-Narbethlong-Marysville, and the Kinglake Cities
var Melbourne = ee.FeatureCollection("ft:1IS6OpUOtWinTQd2KKzFHIyLQEOy_Mf-Pg7f7j1qz").geometry();
var BuxNarbMary = ee.FeatureCollection("ft:1hseXyjCm5NM3krhX5qJB6-Gkl0e5o84tBD1WnbeJ").geometry();
var Kinglake = ee.FeatureCollection("ft:1uTaTWzmTW02jGVsMa6AggqK6ncqY2527kJQh1t1z").geometry();

//Also import the small town regions of Labertouche, DrouinWest, and Tonimbuk which burned in the Bunyip State Park Fire
var Labertouche = ee.FeatureCollection("ft:1Wsbt3y1em75OyN2vfvQhHjbI7XTptMFQFeT069n5").geometry();
var DrouinWest = ee.FeatureCollection("ft:1g2cJ9z_o3gnFKfYxbPtF6DYgBOe-JUDoNHRhJqBQ").geometry();
var Tonimbuk = ee.FeatureCollection("ft:1tqsM6Mt1HQD5QE_VF3vyDcj7beSlX0YQzHDSa2dd").geometry();

// show the layers
Map.addLayer(Victoria, {color: "55EAEC"}, "Province of Victoria, Australia", 1, 0.4); //light blue
Map.addLayer(Melbourne, {color: "000000"}, "Melbourne, VIC, Australia", 1, 0.3); //black
Map.addLayer(BuxNarbMary, {color: "BF19DB"}, "Buxton-Narbelthong-Marysville, VIC, Australia", 1, 1); //purple
Map.addLayer(Kinglake, {color: "31994D"}, "Kinglake, VIC, Australia", 1, 1); //green
Map.addLayer(Labertouche, {color: "270BFF"}, "Labertouche, VIC, Australia", 1, 1); //royal-deep blue
Map.addLayer(DrouinWest, {color: "C18AB9"}, "Drouin West, VIC, Australia", 1, 1); //purple
Map.addLayer(Tonimbuk, {color: "ADC91F"}, "Tonimbuk, VIC, Australia", 1, 1); //darker green

//Center Map
Map.centerObject(Big_Square, 9);

var collection_a = ee.ImageCollection("JAXA/GPM_L3/GSMaP/v6/reanalysis")
  .select("hourlyPrecipRateGC")
  .filterDate("2000-03-01", "2000-06-01");

var collection_b = ee.ImageCollection("JAXA/GPM_L3/GSMaP/v6/reanalysis")
  .select("hourlyPrecipRateGC")
  .filterDate("2000-06-01", "2001-01-01");

var intermediate = ((collection_a.mean()).add((collection_b.mean())).divide(2));
var single = intermediate.multiply(8766); //8766 hours in 1 year

var band_viz = {
  min: 0, //0mm in a year (@ 0mm/hr)
  max: 1315, //1.32m total in a year @ 0.15mm/hr
  palette: ["Red", "DarkOrange", "Orange", "Yellow", "YellowGreen", "Green", "SkyBlue", "Navy"]
};

// Map.addLayer(collection_a, band_viz, "Precip Alpha", 0, 0.85);
// Map.addLayer(collection_b, band_viz, "Precip Beta", 0, 0.85);
Map.addLayer(single, band_viz, "Total Yearly Precipitation", 1, 0.85);

//True-Color Image Export
//Export Image
var vis = {
  min: 0,
  max: 1315,
  palette: ["Red", "DarkOrange", "Orange", "Yellow", "YellowGreen", "Green", "SkyBlue", "Navy"],
  bands: ["hourlyPrecipRateGC"]
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

Export.image.toDrive({
  image: single,
  description: "PrecipColored_2000_Victoria_BigSquare",
  folder: "Australia-Victoria_BlackFire2009",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
});