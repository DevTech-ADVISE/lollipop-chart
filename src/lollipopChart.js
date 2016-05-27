/**
 * Lollipop chart implementation.
 *
 * @class LollipopChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {LollipopChart}
 */

// d3 is an external, it won't be bundled in
var d3 = require('d3');
if(process.env.NODE_ENV !== "test") require('./lollipopChart.scss');

var LollipopChart = function (selection) {

  var chart = {};

  // settings
  var svgWidth = 450,
  svgHeight = 200,
  barGap = 15, 
  lollipopRadius = 10,
  chartGutter = lollipopRadius,
  chartData = {},
  yScale = d3.scale.linear(),
  xScale = d3.scale.linear(), 
  min, max, 
  colorScale = d3.scale.category10();

  // scale accessor will use an individual scale if given, otherwise it uses the chart scale
  var yScaleAccessor = function(d) { 
    if(d.scale) return d.scale; 

    return yScale; 
  };

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
    var svg = d3.select(selection).html('').classed('Lollipop-Chart', true).append('svg');

    //if data is passed, update the chart data
    if(arguments.length) {
      chart.data(_);
    }

    // set the size of the svg
    svg.attr("width", svgWidth);
    svg.attr("height", svgHeight);

    // append bars
    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", generateBarX)
      .attr("y", generateBarY)
      .attr("width", chart.generateBarWidth)
      .attr("height", chart.generateBarHeight)

    // append the lollipop stems
    svg.selectAll("line")
      .data(chartData)
      .enter()
      .append("line")
      .attr("x1", generateLollipopX)
      .attr("x2", generateLollipopX)
      .attr("y1", svgHeight)
      .attr("y2", generateLollipopY);

    // append lollipop circles
    svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", generateLollipopX)
      .attr("cy", generateLollipopY)
      .attr("r", lollipopRadius)
      .attr("fill", function(d) { return colorScale(nameAccessor(d)); });



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

    // Initialize scale domains, and override all y scale ranges 
    var yScaleRange = [0, svgHeight - chartGutter];

    // The default yScale domain is the min/max values of the given data
    yScale.domain([d3.min(chartData, valueAccessor), d3.max(chartData, valueAccessor)])
      .range(yScaleRange);

    // If the data has an individual scale set the range for it
    data.forEach(function(m) {
      if(m.scale) m.scale.range(yScaleRange);
    });

    // The xScale is used to position objects on the x axis
    xScale.domain([0, chartData.length])
      .range([0, svgWidth]);
    colorScale.domain(chartData.map(nameAccessor));

    // Min/max of chartData may be different from min/max of the chartData member values
    min = chartData.min;
    max = chartData.max;

    return chart;
  };

  chart.yScaleAccessor = function(_) {
    if(!arguments.length) return yScaleAccessor;
    yScaleAccessor = _;

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

  // the yScale gets calculated relative to chart data min/max by default using a linear scale
  // or set it when using the component if you need a custom scale
  chart.yScale = function(_) {
    if(!arguments.length) return yScale;
    yScale = _;

    // set the y scale accessor to use this function because the yscale is getting set
    yScaleAccessor = defaultYScaleAccessor;
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

  chart.chartGutter = function(_) {
    if(!arguments.length) return chartGutter;
    chartGutter = _;

    return chart;
  };

  function generateLollipopX(d, i) {
    var barX = generateBarX(d, i);

    return barX + chart.generateBarWidth() / 2;
  }

  function generateLollipopY(d, i) {
    return svgHeight - chart.generateLollipopHeight(d);
  }

  function generateBarX(d, i) {
    return xScale(i);
  }

  function generateBarY(d, i) {
    return svgHeight - chart.generateBarHeight(d);
  }

  chart.generateBarWidth = function() {
    return svgWidth / chartData.length - barGap; 
  }

  chart.generateBarHeight = function(d) {
    var yScale = yScaleAccessor(d);
    var comparisonValue = comparisonValueAccessor(d);

    return yScale(comparisonValue);
  };

  chart.generateLollipopHeight = function(d) {
    var yScale = yScaleAccessor(d);
    var value = valueAccessor(d);

    return yScale(value);
  };

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