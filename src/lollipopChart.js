/**
 * Lollipop chart implementation.
 *
 * @class LollipopChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {LollipopChart}
 */

// d3 is an external, it won't be bundled in
var d3 = require('d3');
var dtip = require('d3-tip')(d3);
require('./lollipopChart.scss');
require('./tooltips.scss');

var LollipopChart = function (selection) {

  var chart = {};

  // initial settings
  var svg,
  svgWidth = 450,
  svgHeight = 200,
  barGap = 15, 
  lollipopRadius = 10,
  chartGutter = lollipopRadius,
  chartData = {},
  yScale = d3.scale.linear(),
  xScale = d3.scale.linear(), 
  useCustomScale = false,
  colorScale = d3.scale.category10(),
  transitionDuration = 750,
  noDataColor = "#ccc",
  noDataText = "N/A",
  ttOffset = [0, 0],
  ttFormatter = d3.format(",");

  // css class names
  var d3TipClass = "d3-tip-mouse",
    barClass = "comparison-bar",
    lineClass = "lollipop-line",
    circleClass = "lollipop-circle";

  var tooltipMarkupFunc = function(d) {
    var tooltipMarkup = "<label>Name: </label>" + chart.nameAccessor()(d);
    tooltipMarkup += "<br/><label>Value: </label>" + ttFormatter(chart.valueAccessor()(d));
    tooltipMarkup += "<br/><label>Comparison Value: </label>" + ttFormatter(chart.comparisonValueAccessor()(d));
    
    return tooltipMarkup;
  };

  var ttNAMarkupFunc = function(d) {
    return "Data not available";
  };

  // scale accessor will use an individual scale if given, otherwise it uses the chart scale
  var yScaleAccessor = function(d) { 
    if(d.scale) return d.scale; 

    return yScale; 
  };

  // tell the chart how to access its data
  var valueAccessorFunc = function(d) { return d.value; };
  var nameAccessorFunc = function(d) { return d.name; };
  var comparisonValueAccessorFunc = function(d) { return d.comparisonValue; };

  /**
   * Render the LollipopChart instance. Simply renders chart when called with parameter. Updates data, then renders, if called with parameter
   * @method render
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [data]
   * @return {LollipopChart}
   */
  chart.render = function(_) {

    // initialize svg and tooltip
    svg = d3.select(selection).html('').classed('Lollipop-Chart', true).append('svg');
    var ttId = d3.select(selection).attr('id') + '-tip';
    var tt = d3.tip()
      .attr("class", d3TipClass)
      .attr("id", ttId)
      .html(tooltipMarkupFunc)
      .offset(ttOffset)
      .positionAnchor("mouse");
    var ttNA = d3.tip()
      .attr("class", d3TipClass)
      .attr("id", ttId + "-na")
      .html(ttNAMarkupFunc)
      .offset(ttOffset)
      .positionAnchor("mouse");


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
      .classed(barClass, true)
      .attr("x", generateBarX)
      .attr("width", chart.generateBarWidth)
      .attr("height", chart.generateBarHeight)
      .attr("y", svgHeight)
    .transition()
      .duration(transitionDuration)
      .attr("y", generateBarY)

    // append the lollipop stems
    svg.selectAll("line")
      .data(chartData)
      .enter()
      .append("line")
      .classed(lineClass, true)
      .attr("x1", generateLollipopX)
      .attr("x2", generateLollipopX)
      .attr("y1", svgHeight)
      .attr("y2", svgHeight)
    .transition()
      .duration(transitionDuration)
      .attr("y2", chart.generateLineY2);

    // append lollipop circles
    svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .classed(circleClass, true)
      .attr("cx", generateLollipopX)
      .attr("r", chart.generateLollipopRadius)
      .attr("fill", function(d) { return chart.colorAccessor(d); })
      .attr("cy", svgHeight + lollipopRadius)
    .transition()
      .duration(transitionDuration)
      .attr("cy", chart.generateLollipopY)

    // fill in any no data lollipops with noDataText
    chartData.forEach(function(d, i) {
      if(chart.isBadDatum(d)) {
        svg.append("text")
          .datum(d)
          .classed("na-text", true)
          .attr("x", generateLollipopX(d, i))
          .attr("font-size", lollipopRadius + "px")
          .attr("text-anchor", "middle")
          .text(noDataText)
          .attr("y", svgHeight -5);
      }
    });

    // add ghost bars for tooltips
    chartData.forEach(function(d, i) {
      var ttGhostRect = svg.append("rect").datum(d);
      ttGhostRect.classed("tt-ghost-rect", true)
        .attr("x", generateBarX(d, i))
        .attr("y", 0)
        .attr("width", chart.generateBarWidth)
        .attr("height", svgHeight);
      var tooltip = tt;
      if(chart.isBadDatum(d)) tooltip = ttNA;

      ttGhostRect.call(tooltip);
      ttGhostRect.on("mouseover", ttMouseOver(d, i, tooltip))
        .on("mouseout", ttMouseOut(d, i, tooltip))
        .on("mousemove", tooltip.updatePosition);

    });

  };

  /**
   * Get/set the data for the LollipopChart instance. 
   * Data should be in the form of an array of objects with name, value, and comparisonValue. Ex. [{name: 'USA', value: 17, comparisonValue: 20}, {name: 'Canada', value: 14, comparisonValue: 10}]
   * Data can also specify a scale to use for only that data object like {name: 'Alberia', value: 23, comparisonValue: 44, scale: d3.scale.linear().domain([0, 50])}
   * For individual scales, a domain must be set for that scale. 
   * @method data
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [data]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.data = function(_) {
    if(!arguments.length) return chartData;
    chartData = _;

    // Initialize scale domains, and override all y scale ranges 
    var yScaleRange = [0, svgHeight - chartGutter];

    // The default yScale domain is the min/max values of the given data
    if(!useCustomScale) yScale.domain([d3.min(chartData, valueAccessorFunc), d3.max(chartData, valueAccessorFunc)])

    yScale.range(yScaleRange);

    // If the data has an individual scale set the range for it
    chartData.forEach(function(m) {
      if(m.scale) m.scale.range(yScaleRange);
    });

    // The xScale is used to position objects on the x axis
    // add one barGap to the range so the last bar has no gap on the right
    xScale.domain([0, chartData.length])
      .range([0, svgWidth + barGap]);
    colorScale.domain(chartData.map(nameAccessorFunc));

    return chart;
  };

    /**
   * Get/set the color tooltip markup function for the LollipopChart instance. The default will return a function with markup for displaying the Name, Value, and Comparison Value in a tooltip
   * @method tooltipMarkupFunc
   * @memberof LollipopChart
   * @instance
   * @param  {function} [tooltipMarkupFunction]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.tooltipMarkupFunc = function(_) {
    if(!arguments.length) return toolTipMarkupFunc;
    toolTipMarkupFunc = _;

    return chart;
  };

  function ttMouseOver(d, i, tooltip) {
    var that = this;
    return function() {
      svg.selectAll("rect." + barClass)
        .filter(function(barData){ return chart.nameAccessor()(barData) === chart.nameAccessor()(d); })
        .classed("active", true);
      svg.selectAll("circle." + circleClass)
        .filter(function(circleData){ return chart.nameAccessor()(circleData) === chart.nameAccessor()(d); })
        .classed("active", true);
      svg.selectAll("text")
        .filter(function(textData){ return chart.nameAccessor()(textData) === chart.nameAccessor()(d); })
        .classed("active", true);
      return tooltip.show(d, i).bind(that);
    }
  }

  function ttMouseOut(d, i, tooltip) {
    var that = this;
    return function() {
      svg.selectAll("rect." + barClass)
        .filter(function(barData){ return chart.nameAccessor()(barData) === chart.nameAccessor()(d); })
        .classed("active", false);
      svg.selectAll("circle." + circleClass)
        .filter(function(circleData){ return chart.nameAccessor()(circleData) === chart.nameAccessor()(d); })
        .classed("active", false);
      svg.selectAll("text")
        .filter(function(textData){ return chart.nameAccessor()(textData) === chart.nameAccessor()(d); })
        .classed("active", false);
      return tooltip.hide(d, i).bind(that);
    }
  }

  // This function returns a y-scale for a given data
  chart.yScaleAccessor = function(_) {
    if(!arguments.length) return yScaleAccessor;
    yScaleAccessor = _;

    return chart;
  };

  /**
   * Get/set the color scale for the LollipopChart instance. The color scale is set by default to d3.scale.category10
   * @method colorScale
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [scale]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.colorScale = function(_) {
    if(!arguments.length) return colorScale;
    colorScale = _;

    return chart;
  };

  chart.colorAccessor = function(datum) {
    if(chart.isBadDatum(datum)) return noDataColor;
    return colorScale(nameAccessorFunc(datum));
  }

  /**
   * Get/set the no-data-color for the LollipopChart instance. 
   * @method noDataColor
   * @memberof LollipopChart
   * @instance
   * @param  {string} [color]
   * @return {string} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.noDataColor = function(_) {
    if(!arguments.length) return noDataColor;
    noDataColor = _;

    return chart; 
  };

  // For internal purposes to position the bars and lollipops along the horizontal
  chart.xScale = function() {
    return xScale;
  };

  /**
   * Get/set the y-scale for the LollipopChart instance. If this is not set, the chart will calculate the scale domain as the min and max of the data values passed into the chart. 
   * Set this scale if you need a global scale. Note that individual scales are allowed if any data object has a scale property on it like {name: 'Bob', value: 25, comparisonValue: 45, scale: d3.scale.linear()}
   * @method yScale
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [d3 scale]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.yScale = function(_) {
    if(!arguments.length) return yScale;
    yScale = _;
    useCustomScale = true; // flag to let the chart know to not override the domain

    return chart;
  };

  /**
   * Get/set the gap between bars for the LollipopChart instance. 
   * @method barGap
   * @memberof LollipopChart
   * @instance
   * @param  {number} [barGap]
   * @return {number} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.barGap = function(_) {
    if(!arguments.length) return barGap;
    barGap = _;

    return chart;
  };

  /**
   * Get/set the lollipop radius for the LollipopChart instance. 
   * @method lollipopRadius
   * @memberof LollipopChart
   * @instance
   * @param  {number} [radius]
   * @return {number} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.lollipopRadius = function(_) {
    if(!arguments.length) return lollipopRadius;
    lollipopRadius = _;
    chartGutter = _;

    return chart; 
  };

  // The chart adds space at the top so the lollipop doesn't get clipped by the chart space
  chart.chartGutter = function(_) {
    if(!arguments.length) return chartGutter;
    chartGutter = _;

    return chart;
  };

  function generateLollipopX(d, i) {
    var barX = generateBarX(d, i);

    return barX + chart.generateBarWidth() / 2;
  }

  chart.generateLollipopY = function(d) {
    if(chart.isBadDatum(d)) return svgHeight + lollipopRadius;
    return svgHeight - chart.generateLollipopHeight(d);
  }

  chart.generateLineY2 = function(d) {
    if(chart.isBadDatum(d)) return svgHeight;
    else return chart.generateLollipopY(d);
  }

  function generateBarX(d, i) {
    return xScale(i);
  }

  function generateBarY(d) {
    return svgHeight - chart.generateBarHeight(d);
  }

  chart.generateBarWidth = function() {
    // add one barGap to the svg width so when the width gets calculated the last bar will have no gap on the right
    return (svgWidth + barGap) / chartData.length - barGap; 
  }

  chart.generateBarHeight = function(d) {
    if(chart.isBadDatum(d)) return 0;
    var yScale = yScaleAccessor(d);
    var comparisonValue = comparisonValueAccessorFunc(d);

    return yScale(comparisonValue);
  };

  chart.generateLollipopHeight = function(d) {
    var yScale = yScaleAccessor(d);
    var value = valueAccessorFunc(d);
    
    return yScale(value);
  };

  chart.generateLollipopRadius = function(d) {
    if(chart.isBadDatum(d)) return 0;
    return lollipopRadius;
  };

  chart.isBadDatum = function(datum) {
    var value = valueAccessorFunc(datum);
    var comparisonValue = comparisonValueAccessorFunc(datum);

    if(!Number(value) || !Number(comparisonValue)) return true;
    return false;
  };

  /**
   * Get/set the chart width for the LollipopChart instance. 
   * @method width
   * @memberof LollipopChart
   * @instance
   * @param  {number} [width]
   * @return {number} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.width = function(_) {
    if(!arguments.length) return svgWidth;
    svgWidth = _;

    return chart;
  };

  /**
   * Get/set the chart height for the LollipopChart instance. 
   * @method height
   * @memberof LollipopChart
   * @instance
   * @param  {number} [height]
   * @return {number} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.height = function(_) {
    if(!arguments.length) return svgHeight;
    svgHeight = _;

    return chart;
  };

  /**
   * Get/set the value accessor for the LollipopChart instance. 
   * @method valueAccessor
   * @memberof LollipopChart
   * @instance
   * @param  {function} [valueAccessorFunc]
   * @return {function} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.valueAccessor = function(_) {
    if(!arguments.length) return valueAccessorFunc;
    valueAccessorFunc = _;

    return chart;
  };

  /**
   * Get/set the name accessor for the LollipopChart instance. 
   * @method nameAccessor
   * @memberof LollipopChart
   * @instance
   * @param  {function} [nameAccessorFunc]
   * @return {function} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.nameAccessor = function(_) {
    if(!arguments.length) return nameAccessorFunc;
    nameAccessorFunc = _;

    return chart;
  }

  /**
   * Get/set the comparison value accessor for the LollipopChart instance. 
   * @method comparisonValueAccessor
   * @memberof LollipopChart
   * @instance
   * @param  {function} [comparisonValueAccessorFunc]
   * @return {function} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.comparisonValueAccessor = function(_) {
    if(!arguments.length) return comparisonValueAccessorFunc;
    comparisonValueAccessorFunc = _;

    return chart; 
  };

  /**
   * Get/set the transition duration for the LollipopChart instance. 
   * @method transitionDuration
   * @memberof LollipopChart
   * @instance
   * @param  {number} [transitionDuration]
   * @return {number} [transitionDuration]
   * @return {LollipopChart} [Acts as setter if called with parameter]
   */
  chart.transitionDuration = function(_) {
    if(!arguments.length) return transitionDuration;
    transitionDuration = _;

    return chart; 
  };

  return chart;
}

module.exports = LollipopChart;