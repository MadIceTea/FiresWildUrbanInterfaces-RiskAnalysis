/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var park = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Feature(
        ee.Geometry({
          "type": "GeometryCollection",
          "geometries": [
            {
              "type": "Point",
              "coordinates": [
                -99.2526,
                19.32235
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.25337405672497,
                19.322694688999743
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.25275178423351,
                19.3234438988254
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.25165744295543,
                19.323180663332156
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.25223680010265,
                19.321803732303174
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.25354571810192,
                19.321803732303174
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.24133630266613,
                19.327311386798204
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.24090714922374,
                19.326562194707222
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.23792453279918,
                19.32854653382489
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -99.23856826296276,
                19.328890753463373
              ]
            },
            {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -99.25431014276313,
                    19.323361417809828
                  ],
                  [
                    -99.25431014276313,
                    19.321113776892968
                  ],
                  [
                    -99.25126315332221,
                    19.321113776892968
                  ],
                  [
                    -99.25126315332221,
                    19.323361417809828
                  ]
                ]
              ],
              "geodesic": false,
              "evenOdd": true
            }
          ],
          "coordinates": []
        }),
        {
          "label": "park",
          "system:index": "0"
        }),
    park2 = /* color: #d63000 */ee.Feature(
        ee.Geometry.Point([-99.2526, 19.32235]),
        {
          "label": "park",
          "system:index": "0"
        }),
    park3 = /* color: #d63000 */ee.Feature(
        ee.Geometry.MultiPoint(
            [[-99.2526, 19.32235],
             [-99.25337405672497, 19.322694688999743],
             [-99.25275178423351, 19.3234438988254],
             [-99.25165744295543, 19.323180663332156],
             [-99.25223680010265, 19.321803732303174],
             [-99.25354571810192, 19.321803732303174],
             [-99.24133630266613, 19.327311386798204],
             [-99.24090714922374, 19.326562194707222],
             [-99.23792453279918, 19.32854653382489],
             [-99.23856826296276, 19.328890753463373]]),
        {
          "system:index": "0"
        });
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Load and display a Landsat 8 image's reflective bands.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_026047_20140216')
    .select(['B[1-7]']);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5});

// Define and display a FeatureCollection of three known locations.
var points = ee.FeatureCollection([
  park,
  park2,
  park3,
  // farm,
  // urban
]);
Map.addLayer(points);

// Define customization options.
var options = {
  title: 'Landsat 8 TOA spectra at three points near Mexico City',
  hAxis: {title: 'Wavelength (micrometers)'},
  vAxis: {title: 'Reflectance'},
  lineWidth: 1,
  pointSize: 4,
  series: {
    0: {color: '00FF00'}, // park
    1: {color: '0000FF'}, // farm
    2: {color: 'FF0000'}, // urban
}};

// Define a list of Landsat 8 wavelengths for X-axis labels.
var wavelengths = [0.44, 0.48, 0.56, 0.65, 0.86, 1.61, 2.2];

// Create the chart and set options.
var spectraChart = ui.Chart.image.regions(
    image, points, ee.Reducer.mean(), 30, 'label', wavelengths)
        .setChartType('ScatterChart')
        .setOptions(options);

// Display the chart.
print(spectraChart);
    