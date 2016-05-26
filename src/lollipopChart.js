/**
 * Lollipop chart implementation.
 *
 * @class LollipopChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {LollipopChart}
 */

// d3 is an external dependency, it does not get bundled into the build
// it's required here for browserify to be able to add line numbers for errors
var d3 = require('d3');

var LollipopChart = function (selection) {

  var chart = {};

  // settings
  var svgWidth = 250,
  svgHeight = 250,
  barGap = 5, 
  lollipopRadius = 10,
  chartData = {},
  yScale = d3.scale.linear(),
  xScale = d3.scale.linear(), 
  min, max, 
  colorScale = d3.scale.category10();

  // tell the chart how to access its data
  var valueAccessor = function(d) { return d.value; };
  var nameAccessor = function(d) { return d.name; };
  var comparisonValueAccessor = function(d) { return d.comparisonValue; };

  /**
   * Render the LollipopChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter
   * @method render
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [data]
   * @return {LollipopChart}
   */
  chart.render = function(_) {

    // initialize svg
    var svg = d3.select(selection).html('').append('svg');

    //if data is passed, update the chart data
    if(arguments.length) {
      chart.data(_);
    }

    // set the size of the svg
    svg.attr("width", svgWidth);
    svg.attr("height", svgHeight);

    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", generateBarX)
      .attr("y", generateBarY)
      .attr("width", chart.generateBarWidth)
      .attr("height", chart.generateBarHeight)
  };

  /**
   * Get/set the data for the LollipopChart instance. Data should be in the form of an object containing min, max, and a data object containing an array of objects with name, value, and comparisonValue. Ex. {min: 5, max: 30, members: [{name: 'USA', value: 17, comparisonValue: 20}, {name: 'Canada', value: 14, comparisonValue: 10}]}
   * @method data
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [data]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with no parameter]
   */
  chart.data = function(_) {
    if(!arguments.length) return chartData;
    chartData = _;

    //initialize scales
    yScale.domain([d3.min(chartData.members, valueAccessor), d3.max(chartData.members, valueAccessor)])
      .range([0, svgHeight]);
    xScale.domain([0, chartData.members.length-1])
      .range([0, svgWidth]);
    colorScale.domain(chartData.members.map(nameAccessor));

    // min/max of chartData may be different from min/max of the chartData member values
    min = chartData.min;
    max = chartData.max;

    return chart;
  };

  chart.colorScale = function(_) {
    if(!arguments.length) return colorScale;
    colorScale = _;

    return chart;
  };

  // For convenience 
  chart.colorDomain = function(_) {
    if(!arguments.length) return colorScale.domain();
    colorScale.domain(_);

    return chart;
  };

  // For convenience
  chart.colorRange = function(_) {
    if(!arguments.length) return colorScale.range();
    colorScale.range(_);

    return chart;
  };

  chart.xScale = function(_) {
    if(!arguments.length) return xScale;
    xScale = _;

    return chart;
  };

  chart.yScale = function(_) {
    if(!arguments.length) return yScale;
    yScale = _;

    return chart;
  };

  chart.barWidth = function(_) {
    return chart.generateBarWidth();
  };

  chart.barGap = function(_) {
    if(!arguments.length) return barGap;
    barGap = _;

    return chart;
  };

  chart.lollipopRadius = function(_) {
    if(!arguments.length) return lollipopRadius;
    lollipopRadius = _;

    return chart; 
  };

  function generateBarX(d, i) {
    return xScale(i);
  }

  function generateBarY(d, i) {
    return chart.generateBarHeight(d) - svgHeight;
  }

  chart.generateBarWidth = function(d) {
    return svgWidth / chartData.members.length - barGap; 
  }

  chart.generateBarHeight = function(d) {
    return yScale(d);
  };

  chart.generateLollipopHeight = function(d) {
    return adjustLollipopClipping(yScale(d));
  };

  // Check if the value would cause the lollipop to clip
  // Return the adjusted value
  function adjustLollipopClipping(value) {
    var lowExtent = clipExtentLow();
    var highExtent = clipExtentHigh();

    //value is inbetween lower extent
    if(value >= lowExtent[0] && value <= lowExtent[1]) return value + lollipopRadius;

    //value is inbetween higher extent
    if(value >= highExtent[0] && value <= highExtent[1]) return value - lollipopRadius;

    return value;
  }

  // Get the chart area where the lollipop will clip
  function clipExtentLow() {
    return [0, lollipopRadius];
  }

  function clipExtentHigh() {
    return [svgHeight - lollipopRadius, svgHeight];
  }

  chart.width = function(_) {
    if(!arguments.length) return svgWidth;
    svgWidth = _;

    return chart;
  };

  chart.height = function(_) {
    if(!arguments.length) return svgHeight;
    svgHeight = _;

    return chart;
  };

  chart.valueAccessor = function(_) {
    if(!arguments.length) return valueAccessor;
    valueAccessor = _;

    return chart;
  };

  chart.nameAccessor = function(_) {
    if(!arguments.length) return nameAccessor;
    nameAccessor = _;

    return chart;
  }

  chart.comparisonValueAccessor = function(_) {
    if(!arguments.length) return comparisonValueAccessor;
    comparisonValueAccessor = _;

    return chart; 
  };

  return chart;
}

module.exports = LollipopChart;