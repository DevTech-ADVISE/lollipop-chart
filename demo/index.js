var lollipopChart = LollipopChart('#myLollipopChart');
var data = [
    {country: 'Afghanistan', value: 80, average: 60},
    {country: 'Bangladesh', value: 50, average: 50},
    {country: 'Bhutan', value: 15, average: 15},
    {country: 'India', value: 100, average: 100},
    {country: 'Maldives', value: 25, average: 30},
    {country: 'Nepal', value: 37, average: 40},
    {country: 'Pakistan', value: 53, average: 60},
    {country: 'Sri Lanka', value: 40, average: 65},
  ];

// Chart setup
lollipopChart
  .nameAccessor(function(d) { return d.country; })
  .comparisonValueAccessor(function(d) { return d.average; })
  .yScale(d3.scale.linear().domain([0, 100]))
  
// Chart render 
lollipopChart.render(data);