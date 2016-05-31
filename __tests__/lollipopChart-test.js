jest.unmock('../src/lollipopChart.js');
jest.unmock('../node_modules/d3/d3.js');

d3 = require('../node_modules/d3/d3.js');
var LollipopChart = require('../src/lollipopChart.js')('#test');
var LollipopChartWithScale = require('../src/lollipopChart.js')('#test-with-scale');
var LollipopChartWithIndividualScales = require('../src/lollipopChart.js')('#test-with-individual-scales');

var data = [
  {country: 'Afghanistan', value: 80, average: 60},
  {country: 'Bangladesh', value: 50, average: 50},
  {country: 'Bhutan', value: 5, average: 35},
  {country: 'India', value: 100, average: 55},
  {country: 'Maldives', value: 25, average: 30},
  {country: 'Nepal', value: 35, average: 40},
  {country: 'Pakistan', value: 50, average: 60},
  {country: 'Sri Lanka', value: 65, average: 50},
];

var dataIndividualScales = [
  {name: 'Afghanistan', value: 80, comparisonValue: 60, scale: d3.scale.linear().domain([40, 100])},
  {name: 'Bangladesh', value: 50, comparisonValue: 50, scale: d3.scale.linear().domain([40, 60])},
  {name: 'Bhutan', value: 5, comparisonValue: 35, scale: d3.scale.linear().domain([0, 50])},
  {name: 'India', value: 100, comparisonValue: 55, scale: d3.scale.linear().domain([40, 100])},
  {name: 'Maldives', value: 25, comparisonValue: 30, scale: d3.scale.linear().domain([0, 50])},
  {name: 'Nepal', value: 35, comparisonValue: 40, scale: d3.scale.linear().domain([35, 60])},
  {name: 'Pakistan', value: 50, comparisonValue: 60, scale: d3.scale.linear().domain([40, 100])},
  {name: 'Sri Lanka', value: 65, comparisonValue: 50, scale: d3.scale.linear().domain([40, 100])},
  ];

var HEIGHT = 200, WIDTH = 100, BAR_GAP = 5;
LollipopChart
  .width(WIDTH)
  .height(HEIGHT)
  .barGap(BAR_GAP)
  .nameAccessor(function(d) { return d.country; })
  .comparisonValueAccessor(function(d) { return d.average; })
  .data(data);

// This y scale should be equivalent to the yScale generated by the chart when no scale is specified
var yScale = d3.scale.linear()
  .domain([d3.min(data, LollipopChart.valueAccessor()), d3.max(data, LollipopChart.valueAccessor())])
  .range([0, HEIGHT - LollipopChart.chartGutter()]);

// This y scale is used to test the scale api
var yScaleGlobal = d3.scale.linear().domain([0, 100]);

// This y scale is used to test the individual scale api
var yScaleIndividual = d3.scale.linear().domain([40, 60]);

// Use the yScale api
LollipopChartWithScale.yScale(yScaleGlobal).data(data);
LollipopChartWithIndividualScales.data(dataIndividualScales);

describe('LollipopChart', function() {

  // All of the unit tests for data calculations go here separate from the svg rendering
  describe('chart calculations', function() {

    it('should have a height set for the chart', function() {
      expect(LollipopChart.height()).toEqual(HEIGHT);
    });

    it('should have a width set for the chart', function() {
      expect(LollipopChart.width()).toEqual(WIDTH);
    });

    it('should calculate bar height correctly for the comparisonValue of Bangladesh', function() {
      var dataObj = getObject('Bangladesh', LollipopChart.nameAccessor());
      var expectedBarHeight = yScale(LollipopChart.comparisonValueAccessor()(dataObj));
      var generatedBarHeight = LollipopChart.generateBarHeight(dataObj);

      expect(generatedBarHeight).toEqual(expectedBarHeight);
    });

    it('should calculate bar width correctly taking into account bar gaps', function() {
      var expectedBarWidth = WIDTH / data.length - BAR_GAP;
      var generatedBarWidth = LollipopChart.generateBarWidth();

      expect(generatedBarWidth).toEqual(expectedBarWidth);
    });

    it('should set the lollipop height above the bar for a value above its comparisonValue like for Afghanistan', function() {
      var heights = generatedHeights('Afghanistan', LollipopChart.nameAccessor());
      var lollipopHeight = heights.lollipopHeight;
      var barHeight = heights.barHeight;

      expect(lollipopHeight).toBeGreaterThan(barHeight);
    });

    it('should set the lollipop height below the bar for a value below its comparisonValue like for Maldives', function() {
      var heights = generatedHeights('Maldives', LollipopChart.nameAccessor());
      var lollipopHeight = heights.lollipopHeight;
      var barHeight = heights.barHeight;

      expect(lollipopHeight).toBeLessThan(barHeight);
    });

    it('should set the lollipop at the same height as the bar if the value is equal to the comparisonValue like for Bangladesh', function() {
      var heights = generatedHeights('Bangladesh', LollipopChart.nameAccessor());
      var lollipopHeight = heights.lollipopHeight;
      var barHeight = heights.barHeight;

      expect(lollipopHeight).toEqual(barHeight);
    });

    it('should set the lollipop height at the top of the chart(and not clipped) for a value that is equal to the max like India', function() {
      var generatedLollipopHeight = generatedHeights('India', LollipopChart.nameAccessor()).lollipopHeight;
      var radius = LollipopChart.lollipopRadius();
      var expectedLollipopHeight = HEIGHT - radius;

      expect(generatedLollipopHeight).toEqual(expectedLollipopHeight);
    });

    it('should set the lollipop height at the bottom of the chart(and not clipped) for a value that is equal to the min', function() {
      var generatedLollipopHeight = generatedHeights('Bhutan', LollipopChart.nameAccessor()).lollipopHeight;
      var radius = LollipopChart.lollipopRadius();
      var expectedLollipopHeight = 0;

      expect(generatedLollipopHeight).toEqual(expectedLollipopHeight);
    });

    it('should color code the lollipops', function() {
      var generatedColorScale = LollipopChart.colorScale();
      var expectedColorScale = d3.scale.category10().domain(data.map(LollipopChart.nameAccessor()));

      expect(generatedColorScale('Bhutan')).toEqual(expectedColorScale('Bhutan'));
    });

    it('should have the ability to use custom data accessors', function() {
      //Example use of the accessor
      var listOfComparisonValues = data.map(LollipopChart.comparisonValueAccessor());

      expect(listOfComparisonValues[2]).toEqual(data[2].average);
    });

    // The y scale can be set as a global scale and also individually per data
    describe('y scale api', function() {

      it('should calculate a relative scale based on input data if no scale is set by the developer', function() {
        var expectedDomain = yScale.domain();
        var generatedDomain = LollipopChart.yScale().domain();

        expect(generatedDomain[0]).toEqual(expectedDomain[0]);
        expect(generatedDomain[1]).toEqual(expectedDomain[1]);
      });

      it('should allow the developer to set a global scale', function() {
        var expectedDomain = yScaleGlobal.domain();
        var generatedDomain = LollipopChartWithScale.yScale().domain();

        expect(generatedDomain[0]).toEqual(expectedDomain[0]);
        expect(generatedDomain[1]).toEqual(expectedDomain[1]);
      });

      it('should allow the developer to set individual scales per data, like for Bangladesh', function() {
        // use the yscale accessor to get the individual scale for the data for Bangladesh in dataIndividualScales
        var expectedDomain = yScaleIndividual.domain();
        var generatedDomain = LollipopChartWithIndividualScales.yScaleAccessor()({name: 'Bangladesh', value: 50, comparisonValue: 50, scale: d3.scale.linear().domain([40, 60])}).domain();
      
        expect(generatedDomain[0]).toEqual(expectedDomain[0]);
        expect(generatedDomain[1]).toEqual(expectedDomain[1]);
      });
    });

  });
  
});

//helper functions
function getObject(memberValue, accessorFunc) {
  var memberIndex = data.map(accessorFunc).indexOf(memberValue);

  return data[memberIndex];
}

function generatedHeights(memberValue, accessorFunc) {
  var dataObj = getObject(memberValue, accessorFunc);
  var lollipopHeight = LollipopChart.generateLollipopHeight(dataObj);
  var barHeight = LollipopChart.generateBarHeight(dataObj);

  return {barHeight: barHeight, lollipopHeight: lollipopHeight};
}