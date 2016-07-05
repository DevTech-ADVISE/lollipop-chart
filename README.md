# lollipopChart

The lollipop chart provides a visualization of values compared to their own comparison value. The value is the lollipop and the comparison is the bar. 

Look at the [Demo](http://BI.github.io/lollipop-chart)

# Getting Started

LollipopChart is a UMD module, you can add the javascript in a scripts tag or require it using something like webpack. D3 must either be available in the global namespace or bundled in with your bundle tool. For the global namespace method download lollipopChart.js, put something like the following in your <head> and you should be good to go.

```
<script src="d3.js" charset="utf-8"></script>
<script src="lollipopChart.js" charset="utf-8"></script>
```

# Example

HTML would look something like this

```
<!DOCTYPE html>
<html lang="en-US">
	<head>
		<script src="d3.js" charset="utf-8"></script>
		<script src="lollipopChart.js" charset="utf-8"></script>
		
	</head>
	<body>
		<div id="myLollipopChart"></div>	
	</body>
	<script src="index.js"></script>
</html>
```

And the index.js here would contain something like this

```
var lollipopChart = LollipopChart('#myLollipopChart'); //you can also use the commonJs way if you're bundling everything with something like webpack
var gradesPerName = [
    {name: 'Bobby', value: 80, comparisonValue: 80},
    {name: 'Jane', value: 79, comparisonValue: 68},
    {name: 'Fred', value: 70, comparisonValue: 78},
    {name: 'Alan', value: 75, comparisonValue: 64},
    {name: 'Jeeves', value: 75, comparisonValue: 85},
    {name: 'Mary', value: 67, comparisonValue: 70},
    {name: 'Marsha', value: 60, comparisonValue: 68},
    {name: 'Andy', value: 100, comparisonValue: 100},
  ];
lollipopChartBasic
	.render(gradesPerName);
```

# API Reference
<a name="LollipopChart"></a>

## LollipopChart
**Kind**: global class  

* [LollipopChart](#LollipopChart)
    * [new LollipopChart(selection)](#new_LollipopChart_new)
    * [.render([data])](#LollipopChart+render) ⇒ <code>[LollipopChart](#LollipopChart)</code>
    * [.data([data])](#LollipopChart+data) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.tooltipContent([tooltipContentFunction(datum)])](#LollipopChart+tooltipContent) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.colorScale([scale])](#LollipopChart+colorScale) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.noDataColor([color])](#LollipopChart+noDataColor) ⇒ <code>string</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.yScale([d3 scale])](#LollipopChart+yScale) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.barGap([barGap])](#LollipopChart+barGap) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.lollipopRadius([radius])](#LollipopChart+lollipopRadius) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.width([width])](#LollipopChart+width) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.height([height])](#LollipopChart+height) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.valueAccessor([valueAccessorFunc])](#LollipopChart+valueAccessor) ⇒ <code>function</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.nameAccessor([nameAccessorFunc])](#LollipopChart+nameAccessor) ⇒ <code>function</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.comparisonValueAccessor([comparisonValueAccessorFunc])](#LollipopChart+comparisonValueAccessor) ⇒ <code>function</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
    * [.transitionDuration([transitionDuration])](#LollipopChart+transitionDuration) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>

<a name="new_LollipopChart_new"></a>

### new LollipopChart(selection)
Lollipop chart implementation.


| Param | Type | Description |
| --- | --- | --- |
| selection | <code>String</code> | any valid d3 selector. This selector is used to place the chart. |

<a name="LollipopChart+render"></a>

### lollipopChart.render([data]) ⇒ <code>[LollipopChart](#LollipopChart)</code>
Render the LollipopChart instance. Simply renders chart when called with parameter. Updates data, then renders, if called with parameter

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  

| Param | Type |
| --- | --- |
| [data] | <code>Object</code> | 

<a name="LollipopChart+data"></a>

### lollipopChart.data([data]) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the data for the LollipopChart instance. 
Data should be in the form of an array of objects with name, value, and comparisonValue. Ex. [{name: 'USA', value: 17, comparisonValue: 20}, {name: 'Canada', value: 14, comparisonValue: 10}]
Data can also specify a scale to use for only that data object like {name: 'Alberia', value: 23, comparisonValue: 44, scale: d3.scale.linear().domain([0, 50])}
For individual scales, a domain must be set for that scale.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [data] | <code>Object</code> | 

<a name="LollipopChart+tooltipContent"></a>

### lollipopChart.tooltipContent([tooltipContentFunction(datum)]) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the color tooltip content function for the LollipopChart instance. The default will return a function with content for displaying the Name, Value, and Comparison Value in a tooltip

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [tooltipContentFunction(datum)] | <code>function</code> | 

<a name="LollipopChart+colorScale"></a>

### lollipopChart.colorScale([scale]) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the color scale for the LollipopChart instance. The color scale is set by default to d3.scale.category10

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [scale] | <code>Object</code> | 

<a name="LollipopChart+noDataColor"></a>

### lollipopChart.noDataColor([color]) ⇒ <code>string</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the no-data-color for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>string</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [color] | <code>string</code> | 

<a name="LollipopChart+yScale"></a>

### lollipopChart.yScale([d3 scale]) ⇒ <code>Object</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the y-scale for the LollipopChart instance. If this is not set, the chart will calculate the scale domain as the min and max of the data values passed into the chart. 
Set this scale if you need a global scale. Note that individual scales are allowed if any data object has a scale property on it like {name: 'Bob', value: 25, comparisonValue: 45, scale: d3.scale.linear()}

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>Object</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [d3 scale] | <code>Object</code> | 

<a name="LollipopChart+barGap"></a>

### lollipopChart.barGap([barGap]) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the gap between bars for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>number</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [barGap] | <code>number</code> | 

<a name="LollipopChart+lollipopRadius"></a>

### lollipopChart.lollipopRadius([radius]) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the lollipop radius for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>number</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [radius] | <code>number</code> | 

<a name="LollipopChart+width"></a>

### lollipopChart.width([width]) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the chart width for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>number</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [width] | <code>number</code> | 

<a name="LollipopChart+height"></a>

### lollipopChart.height([height]) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the chart height for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>number</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [height] | <code>number</code> | 

<a name="LollipopChart+valueAccessor"></a>

### lollipopChart.valueAccessor([valueAccessorFunc]) ⇒ <code>function</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the value accessor for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [valueAccessorFunc] | <code>function</code> | 

<a name="LollipopChart+nameAccessor"></a>

### lollipopChart.nameAccessor([nameAccessorFunc]) ⇒ <code>function</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the name accessor for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [nameAccessorFunc] | <code>function</code> | 

<a name="LollipopChart+comparisonValueAccessor"></a>

### lollipopChart.comparisonValueAccessor([comparisonValueAccessorFunc]) ⇒ <code>function</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the comparison value accessor for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>function</code> - [Acts as getter if called with no parameter]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [comparisonValueAccessorFunc] | <code>function</code> | 

<a name="LollipopChart+transitionDuration"></a>

### lollipopChart.transitionDuration([transitionDuration]) ⇒ <code>number</code> &#124; <code>[LollipopChart](#LollipopChart)</code>
Get/set the transition duration for the LollipopChart instance.

**Kind**: instance method of <code>[LollipopChart](#LollipopChart)</code>  
**Returns**: <code>number</code> - [transitionDuration]<code>[LollipopChart](#LollipopChart)</code> - [Acts as setter if called with parameter]  

| Param | Type |
| --- | --- |
| [transitionDuration] | <code>number</code> | 

