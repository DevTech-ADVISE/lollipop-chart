(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LollipopChart = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * Lollipop chart implementation.
 *
 * @class LollipopChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {LollipopChart}
 */

// d3 is an external dependency, it does not get bundled into the build
// it's required here for browserify to be able to add line numbers for errors
var d3 = (typeof window !== "undefined" ? window['d3'] : typeof global !== "undefined" ? global['d3'] : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbG9sbGlwb3BDaGFydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIExvbGxpcG9wIGNoYXJ0IGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBjbGFzcyBMb2xsaXBvcENoYXJ0XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0aW9uIC0gYW55IHZhbGlkIGQzIHNlbGVjdG9yLiBUaGlzIHNlbGVjdG9yIGlzIHVzZWQgdG8gcGxhY2UgdGhlIGNoYXJ0LlxuICogQHJldHVybiB7TG9sbGlwb3BDaGFydH1cbiAqL1xuXG4vLyBkMyBpcyBhbiBleHRlcm5hbCBkZXBlbmRlbmN5LCBpdCBkb2VzIG5vdCBnZXQgYnVuZGxlZCBpbnRvIHRoZSBidWlsZFxuLy8gaXQncyByZXF1aXJlZCBoZXJlIGZvciBicm93c2VyaWZ5IHRvIGJlIGFibGUgdG8gYWRkIGxpbmUgbnVtYmVycyBmb3IgZXJyb3JzXG52YXIgZDMgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snZDMnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2QzJ10gOiBudWxsKTtcblxudmFyIExvbGxpcG9wQ2hhcnQgPSBmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG5cbiAgdmFyIGNoYXJ0ID0ge307XG5cbiAgLy8gc2V0dGluZ3NcbiAgdmFyIHN2Z1dpZHRoID0gMjUwLFxuICBzdmdIZWlnaHQgPSAyNTAsXG4gIGJhckdhcCA9IDUsIFxuICBsb2xsaXBvcFJhZGl1cyA9IDEwLFxuICBjaGFydERhdGEgPSB7fSxcbiAgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCksXG4gIHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpLCBcbiAgbWluLCBtYXgsIFxuICBjb2xvclNjYWxlID0gZDMuc2NhbGUuY2F0ZWdvcnkxMCgpO1xuXG4gIC8vIHRlbGwgdGhlIGNoYXJ0IGhvdyB0byBhY2Nlc3MgaXRzIGRhdGFcbiAgdmFyIHZhbHVlQWNjZXNzb3IgPSBmdW5jdGlvbihkKSB7IHJldHVybiBkLnZhbHVlOyB9O1xuICB2YXIgbmFtZUFjY2Vzc29yID0gZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5uYW1lOyB9O1xuICB2YXIgY29tcGFyaXNvblZhbHVlQWNjZXNzb3IgPSBmdW5jdGlvbihkKSB7IHJldHVybiBkLmNvbXBhcmlzb25WYWx1ZTsgfTtcblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBMb2xsaXBvcENoYXJ0IGluc3RhbmNlLiBTaW1wbHkgcmVuZGVycyBjaGFydCB3aGVuIGNhbGxlZCB3aXRoIG5vIHBhcmFtZXRlci4gVXBkYXRlcyBkYXRhLCB0aGVuIHJlbmRlcnMsIGlmIGNhbGxlZCB3aXRoIHBhcmFtZXRlclxuICAgKiBAbWV0aG9kIHJlbmRlclxuICAgKiBAbWVtYmVyb2YgTG9sbGlwb3BDaGFydFxuICAgKiBAaW5zdGFuY2VcbiAgICogQHBhcmFtICB7T2JqZWN0fSBbZGF0YV1cbiAgICogQHJldHVybiB7TG9sbGlwb3BDaGFydH1cbiAgICovXG4gIGNoYXJ0LnJlbmRlciA9IGZ1bmN0aW9uKF8pIHtcblxuICAgIC8vIGluaXRpYWxpemUgc3ZnXG4gICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChzZWxlY3Rpb24pLmh0bWwoJycpLmFwcGVuZCgnc3ZnJyk7XG5cbiAgICAvL2lmIGRhdGEgaXMgcGFzc2VkLCB1cGRhdGUgdGhlIGNoYXJ0IGRhdGFcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjaGFydC5kYXRhKF8pO1xuICAgIH1cblxuICAgIC8vIHNldCB0aGUgc2l6ZSBvZiB0aGUgc3ZnXG4gICAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCBzdmdXaWR0aCk7XG4gICAgc3ZnLmF0dHIoXCJoZWlnaHRcIiwgc3ZnSGVpZ2h0KTtcblxuICAgIHN2Zy5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAuZGF0YShjaGFydERhdGEpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInJlY3RcIilcbiAgICAgIC5hdHRyKFwieFwiLCBnZW5lcmF0ZUJhclgpXG4gICAgICAuYXR0cihcInlcIiwgZ2VuZXJhdGVCYXJZKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBjaGFydC5nZW5lcmF0ZUJhcldpZHRoKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgY2hhcnQuZ2VuZXJhdGVCYXJIZWlnaHQpXG4gIH07XG5cbiAgLyoqXG4gICAqIEdldC9zZXQgdGhlIGRhdGEgZm9yIHRoZSBMb2xsaXBvcENoYXJ0IGluc3RhbmNlLiBEYXRhIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhbiBvYmplY3QgY29udGFpbmluZyBtaW4sIG1heCwgYW5kIGEgZGF0YSBvYmplY3QgY29udGFpbmluZyBhbiBhcnJheSBvZiBvYmplY3RzIHdpdGggbmFtZSwgdmFsdWUsIGFuZCBjb21wYXJpc29uVmFsdWUuIEV4LiB7bWluOiA1LCBtYXg6IDMwLCBtZW1iZXJzOiBbe25hbWU6ICdVU0EnLCB2YWx1ZTogMTcsIGNvbXBhcmlzb25WYWx1ZTogMjB9LCB7bmFtZTogJ0NhbmFkYScsIHZhbHVlOiAxNCwgY29tcGFyaXNvblZhbHVlOiAxMH1dfVxuICAgKiBAbWV0aG9kIGRhdGFcbiAgICogQG1lbWJlcm9mIExvbGxpcG9wQ2hhcnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBwYXJhbSAge09iamVjdH0gW2RhdGFdXG4gICAqIEByZXR1cm4ge09iamVjdH0gW0FjdHMgYXMgZ2V0dGVyIGlmIGNhbGxlZCB3aXRoIG5vIHBhcmFtZXRlcl1cbiAgICogQHJldHVybiB7TG9sbGlwb3BDaGFydH0gW0FjdHMgYXMgc2V0dGVyIGlmIGNhbGxlZCB3aXRoIG5vIHBhcmFtZXRlcl1cbiAgICovXG4gIGNoYXJ0LmRhdGEgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBjaGFydERhdGE7XG4gICAgY2hhcnREYXRhID0gXztcblxuICAgIC8vaW5pdGlhbGl6ZSBzY2FsZXNcbiAgICB5U2NhbGUuZG9tYWluKFtkMy5taW4oY2hhcnREYXRhLm1lbWJlcnMsIHZhbHVlQWNjZXNzb3IpLCBkMy5tYXgoY2hhcnREYXRhLm1lbWJlcnMsIHZhbHVlQWNjZXNzb3IpXSlcbiAgICAgIC5yYW5nZShbMCwgc3ZnSGVpZ2h0XSk7XG4gICAgeFNjYWxlLmRvbWFpbihbMCwgY2hhcnREYXRhLm1lbWJlcnMubGVuZ3RoLTFdKVxuICAgICAgLnJhbmdlKFswLCBzdmdXaWR0aF0pO1xuICAgIGNvbG9yU2NhbGUuZG9tYWluKGNoYXJ0RGF0YS5tZW1iZXJzLm1hcChuYW1lQWNjZXNzb3IpKTtcblxuICAgIC8vIG1pbi9tYXggb2YgY2hhcnREYXRhIG1heSBiZSBkaWZmZXJlbnQgZnJvbSBtaW4vbWF4IG9mIHRoZSBjaGFydERhdGEgbWVtYmVyIHZhbHVlc1xuICAgIG1pbiA9IGNoYXJ0RGF0YS5taW47XG4gICAgbWF4ID0gY2hhcnREYXRhLm1heDtcblxuICAgIHJldHVybiBjaGFydDtcbiAgfTtcblxuICBjaGFydC5jb2xvclNjYWxlID0gZnVuY3Rpb24oXykge1xuICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY29sb3JTY2FsZTtcbiAgICBjb2xvclNjYWxlID0gXztcblxuICAgIHJldHVybiBjaGFydDtcbiAgfTtcblxuICAvLyBGb3IgY29udmVuaWVuY2UgXG4gIGNoYXJ0LmNvbG9yRG9tYWluID0gZnVuY3Rpb24oXykge1xuICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gY29sb3JTY2FsZS5kb21haW4oKTtcbiAgICBjb2xvclNjYWxlLmRvbWFpbihfKTtcblxuICAgIHJldHVybiBjaGFydDtcbiAgfTtcblxuICAvLyBGb3IgY29udmVuaWVuY2VcbiAgY2hhcnQuY29sb3JSYW5nZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZighYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNvbG9yU2NhbGUucmFuZ2UoKTtcbiAgICBjb2xvclNjYWxlLnJhbmdlKF8pO1xuXG4gICAgcmV0dXJuIGNoYXJ0O1xuICB9O1xuXG4gIGNoYXJ0LnhTY2FsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZighYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHhTY2FsZTtcbiAgICB4U2NhbGUgPSBfO1xuXG4gICAgcmV0dXJuIGNoYXJ0O1xuICB9O1xuXG4gIGNoYXJ0LnlTY2FsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZighYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHlTY2FsZTtcbiAgICB5U2NhbGUgPSBfO1xuXG4gICAgcmV0dXJuIGNoYXJ0O1xuICB9O1xuXG4gIGNoYXJ0LmJhcldpZHRoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBjaGFydC5nZW5lcmF0ZUJhcldpZHRoKCk7XG4gIH07XG5cbiAgY2hhcnQuYmFyR2FwID0gZnVuY3Rpb24oXykge1xuICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFyR2FwO1xuICAgIGJhckdhcCA9IF87XG5cbiAgICByZXR1cm4gY2hhcnQ7XG4gIH07XG5cbiAgY2hhcnQubG9sbGlwb3BSYWRpdXMgPSBmdW5jdGlvbihfKSB7XG4gICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBsb2xsaXBvcFJhZGl1cztcbiAgICBsb2xsaXBvcFJhZGl1cyA9IF87XG5cbiAgICByZXR1cm4gY2hhcnQ7IFxuICB9O1xuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQmFyWChkLCBpKSB7XG4gICAgcmV0dXJuIHhTY2FsZShpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQmFyWShkLCBpKSB7XG4gICAgcmV0dXJuIGNoYXJ0LmdlbmVyYXRlQmFySGVpZ2h0KGQpIC0gc3ZnSGVpZ2h0O1xuICB9XG5cbiAgY2hhcnQuZ2VuZXJhdGVCYXJXaWR0aCA9IGZ1bmN0aW9uKGQpIHtcbiAgICByZXR1cm4gc3ZnV2lkdGggLyBjaGFydERhdGEubWVtYmVycy5sZW5ndGggLSBiYXJHYXA7IFxuICB9XG5cbiAgY2hhcnQuZ2VuZXJhdGVCYXJIZWlnaHQgPSBmdW5jdGlvbihkKSB7XG4gICAgcmV0dXJuIHlTY2FsZShkKTtcbiAgfTtcblxuICBjaGFydC5nZW5lcmF0ZUxvbGxpcG9wSGVpZ2h0ID0gZnVuY3Rpb24oZCkge1xuICAgIHJldHVybiBhZGp1c3RMb2xsaXBvcENsaXBwaW5nKHlTY2FsZShkKSk7XG4gIH07XG5cbiAgLy8gQ2hlY2sgaWYgdGhlIHZhbHVlIHdvdWxkIGNhdXNlIHRoZSBsb2xsaXBvcCB0byBjbGlwXG4gIC8vIFJldHVybiB0aGUgYWRqdXN0ZWQgdmFsdWVcbiAgZnVuY3Rpb24gYWRqdXN0TG9sbGlwb3BDbGlwcGluZyh2YWx1ZSkge1xuICAgIHZhciBsb3dFeHRlbnQgPSBjbGlwRXh0ZW50TG93KCk7XG4gICAgdmFyIGhpZ2hFeHRlbnQgPSBjbGlwRXh0ZW50SGlnaCgpO1xuXG4gICAgLy92YWx1ZSBpcyBpbmJldHdlZW4gbG93ZXIgZXh0ZW50XG4gICAgaWYodmFsdWUgPj0gbG93RXh0ZW50WzBdICYmIHZhbHVlIDw9IGxvd0V4dGVudFsxXSkgcmV0dXJuIHZhbHVlICsgbG9sbGlwb3BSYWRpdXM7XG5cbiAgICAvL3ZhbHVlIGlzIGluYmV0d2VlbiBoaWdoZXIgZXh0ZW50XG4gICAgaWYodmFsdWUgPj0gaGlnaEV4dGVudFswXSAmJiB2YWx1ZSA8PSBoaWdoRXh0ZW50WzFdKSByZXR1cm4gdmFsdWUgLSBsb2xsaXBvcFJhZGl1cztcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgY2hhcnQgYXJlYSB3aGVyZSB0aGUgbG9sbGlwb3Agd2lsbCBjbGlwXG4gIGZ1bmN0aW9uIGNsaXBFeHRlbnRMb3coKSB7XG4gICAgcmV0dXJuIFswLCBsb2xsaXBvcFJhZGl1c107XG4gIH1cblxuICBmdW5jdGlvbiBjbGlwRXh0ZW50SGlnaCgpIHtcbiAgICByZXR1cm4gW3N2Z0hlaWdodCAtIGxvbGxpcG9wUmFkaXVzLCBzdmdIZWlnaHRdO1xuICB9XG5cbiAgY2hhcnQud2lkdGggPSBmdW5jdGlvbihfKSB7XG4gICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBzdmdXaWR0aDtcbiAgICBzdmdXaWR0aCA9IF87XG5cbiAgICByZXR1cm4gY2hhcnQ7XG4gIH07XG5cbiAgY2hhcnQuaGVpZ2h0ID0gZnVuY3Rpb24oXykge1xuICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gc3ZnSGVpZ2h0O1xuICAgIHN2Z0hlaWdodCA9IF87XG5cbiAgICByZXR1cm4gY2hhcnQ7XG4gIH07XG5cbiAgY2hhcnQudmFsdWVBY2Nlc3NvciA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZighYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHZhbHVlQWNjZXNzb3I7XG4gICAgdmFsdWVBY2Nlc3NvciA9IF87XG5cbiAgICByZXR1cm4gY2hhcnQ7XG4gIH07XG5cbiAgY2hhcnQubmFtZUFjY2Vzc29yID0gZnVuY3Rpb24oXykge1xuICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbmFtZUFjY2Vzc29yO1xuICAgIG5hbWVBY2Nlc3NvciA9IF87XG5cbiAgICByZXR1cm4gY2hhcnQ7XG4gIH1cblxuICBjaGFydC5jb21wYXJpc29uVmFsdWVBY2Nlc3NvciA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZighYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNvbXBhcmlzb25WYWx1ZUFjY2Vzc29yO1xuICAgIGNvbXBhcmlzb25WYWx1ZUFjY2Vzc29yID0gXztcblxuICAgIHJldHVybiBjaGFydDsgXG4gIH07XG5cbiAgcmV0dXJuIGNoYXJ0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvbGxpcG9wQ2hhcnQ7Il19
